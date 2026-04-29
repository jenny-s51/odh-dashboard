# Monarch Team Alignment: App Shell & Platform Abstraction

> **Goal**: Share the proposed architecture for xKS (non-OpenShift) deployments and get
> Monarch's sign-off before building.
>
> **Background**: Red Hat needs an Inference UI that runs on vanilla Kubernetes (CoreWeave,
> AKS, EKS, GKE). We did a deep architecture analysis
> ([GitLab repo](https://gitlab.cee.redhat.com/astonebe/rhoai-architecture-observations/-/tree/main/rhoai/inference-ui),
> [RHOAIENG-27201](https://redhat.atlassian.net/browse/RHOAIENG-27201),
> [RHAISTRAT-1172](https://redhat.atlassian.net/browse/RHAISTRAT-1172)) and audited how
> mod-arch-library fits in. Here's our proposed plan.

---

## Key Observation: mod-arch Is Already Opinionated

mod-arch-core already has product-specific behavior baked in. These are not bugs — they're
the natural result of mod-arch being the library that knows how to run a modular React app
across Red Hat's deployment targets:

| Behavior | Location | What it does |
|----------|----------|--------------|
| Kubeflow script loading | `mod-arch-core/utilities/utils.ts:34-47` | `DeploymentMode.Kubeflow` triggers loading `/dashboard_lib.bundle.js` and initializes `window.centraldashboard` |
| Namespace short-circuit | `mod-arch-core/hooks/useNamespaces.ts:25-27` | Returns `[]` in Kubeflow mode (unless `mandatoryNamespace` is set, which overrides all modes) |
| Hardcoded logout path | `mod-arch-core/utilities/appUtils.ts:1-3` | `logout()` always calls `fetch('/oauth/sign_out')` — not configurable |
| OAuth error special-case | `mod-arch-core/hooks/useSettings.tsx:47` | Catches `'Error getting Oauth Info for user'` and triggers a refresh cycle |
| Kubeflow session key | `mod-arch-core/hooks/useTimeBasedRefresh.ts:8` | Uses `kf.dashboard.last.auto.refresh` as a session storage key |
| Shared → Kubeflow coupling | `mod-arch-shared/package.json:54` | `mod-arch-shared` has a peer dependency on `mod-arch-kubeflow` |
| Installer defaults to RHOAI | `mod-arch-installer/flavors/default/` | References `@odh-dashboard/internal` and uses `alt="RHOAI"` branding |
| OpenShift annotations in types | `mod-arch-starter/frontend/src/app/types.ts:3-6` | `DisplayNameAnnotations` type hardcodes `openshift.io/display-name` and `openshift.io/description` |

**Adding xKS / vanilla K8s awareness is the same kind of thing mod-arch already does.**

---

## Two Providers, Two Jobs

### What we have today: `ModularArchContextProvider`

`ModularArchContextProvider` is the React context that every federated package wraps its
UI with. It handles **app shell concerns**: deployment mode (standalone / federated /
kubeflow), namespace state, BFF API prefix, and Kubeflow script loading.

```
ModularArchContextProvider (mod-arch-core)
├── "Am I standalone, federated, or kubeflow?"
├── "What namespaces can I see?"
├── "Is the Kubeflow script loaded?"
└── "What's my BFF URL prefix?"
```

### What's missing: platform awareness

When a feature like model-serving needs to list namespaces, find an external URL for a
service, check who the user is, or query metrics — it reaches past the provider and
directly calls OpenShift APIs. There's nothing in between.

```
Feature (e.g., model-serving)
    │
    ├── uses ModularArchContextProvider  ✅  for deployment mode, namespace state
    │
    └── directly calls OpenShift APIs    ❌  for everything else
        ├── project.openshift.io          → list namespaces
        ├── route.openshift.io            → find external URLs
        ├── user.openshift.io             → resolve user identity
        ├── openshift-monitoring/thanos   → query metrics
        └── DSC status                    → detect available components
```

On vanilla Kubernetes, **none of those APIs exist**.

### What we need: `PlatformProvider`

A second provider — owned by odh-dashboard, not mod-arch — that sits alongside
`ModularArchContextProvider` and handles **platform concerns**:

```
ModularArchContextProvider (mod-arch-core)        PlatformProvider (odh-dashboard)
├── deployment mode                               ├── "How do I list namespaces?"
├── namespace state                               ├── "How do I find external URLs?"
├── BFF URL prefix                                ├── "Who is the current user?"
└── Kubeflow script loading                       ├── "Where is Prometheus?"
                                                  ├── "What components are available?"
                                                  └── "What annotation key = display name?"
```

`ModularArchContextProvider` stays exactly as it is. `PlatformProvider` is new. Features
call `PlatformProvider` instead of calling OpenShift APIs directly.

### Why this needs new packages (not just a new file)

The platform provider has **two implementations** — one for OpenShift, one for vanilla K8s.
They can't live in the same package because:

- An OpenShift deployment shouldn't ship vanilla K8s code (and vice versa)
- The implementations have different dependencies (`project.openshift.io` models vs
  `v1/Namespace` models)
- Teams working on vanilla K8s support shouldn't have to touch OpenShift code

So we need three packages:

```
packages/platform-core/         ← interfaces only (what CAN you do?)
packages/platform-openshift/    ← OpenShift implementation (HOW on OpenShift)
packages/platform-kubernetes/   ← vanilla K8s implementation (HOW on K8s)
```

The app shell picks which implementation to load at startup based on where it's deployed.
Feature code imports only from `platform-core` and never knows which platform is underneath.

---

## Proposed Plan: Split the Responsibility

### mod-arch gets lightweight platform awareness

A small, scoped change to mod-arch-library — not a rewrite:

| Change | Scope | Details |
|--------|-------|---------|
| **New `platform` config field** | `ModularArchConfig` in `mod-arch-core/types/common.ts` | Add `platform: 'openshift' \| 'kubernetes' \| 'kubeflow'` — separate from `deploymentMode` because platform and deployment shape are orthogonal (you can run Federated on OpenShift OR vanilla K8s) |
| **Configurable logout path** | `mod-arch-core/utilities/appUtils.ts` | Make `logout()` accept a path or read it from config instead of hardcoding `/oauth/sign_out` |
| **Platform-aware Kubeflow gating** | `mod-arch-core/utilities/utils.ts` | Gate script loading on `platform` field in addition to `DeploymentMode`, as a defensive check |

**What is NOT a mod-arch change**: Theme selection. `ThemeProvider` already accepts a `theme`
prop independently of `DeploymentMode` (the starter app reads `STYLE_THEME` as a separate env
var — see `mod-arch-starter/frontend/src/app/utilities/const.ts:4`). Choosing "PF-only on xKS,
PF+MUI on Kubeflow" is a **consumer responsibility** — the app shell picks which theme to pass
based on platform. This keeps the mod-arch ask smaller.

### odh-dashboard keeps feature-level platform abstractions

New packages in the monorepo for things mod-arch has no business knowing about:

| Package | Responsibility |
|---------|---------------|
| `packages/platform-core/` | Interface definitions: `PlatformProvider` with `NamespaceOperations`, `RoutingOperations`, `IdentityOperations`, `MonitoringOperations`, `PlatformCapabilities` (see [interface draft](app-shell-platform-provider-interface.ts)) |
| `packages/platform-openshift/` | OpenShift Routes, `project.openshift.io` namespace ops, DSC component gating, Thanos monitoring, Templates, User/Group APIs |
| `packages/platform-kubernetes/` | `v1/Namespace`, Ingress/Gateway API, CRD-based capability detection, configurable Prometheus endpoint, OIDC identity |

**The boundary**: mod-arch owns _"how does the app shell behave on this platform"_ (config,
auth path, script loading). odh-dashboard owns _"how do dashboard features adapt to this
platform"_ (namespace models, routing abstractions, monitoring endpoints, capability detection).

---

## Today's `ModularArchConfig` (for reference)

```typescript
// mod-arch-core/types/common.ts
export type ModularArchConfig = {
  deploymentMode: DeploymentMode;   // 'standalone' | 'federated' | 'kubeflow'
  URL_PREFIX: string;
  BFF_API_VERSION: string;
  mandatoryNamespace?: string;      // overrides namespace listing in ALL modes
};
```

After the proposed change:

```typescript
export type ModularArchConfig = {
  deploymentMode: DeploymentMode;   // 'standalone' | 'federated' | 'kubeflow'
  platform: Platform;               // 'openshift' | 'kubernetes' | 'kubeflow'  ← NEW
  URL_PREFIX: string;
  BFF_API_VERSION: string;
  mandatoryNamespace?: string;
  logoutPath?: string;              // defaults to '/oauth/sign_out' for backwards compat  ← NEW
};
```

---

## Current Integration Surface

Every federated package in odh-dashboard wraps its UI with `ModularArchContextProvider`:

| Package | mod-arch-core | mod-arch-shared | mod-arch-kubeflow |
|---------|:---:|:---:|:---:|
| model-registry | ~1.12.0 | ~1.12.0 | ~1.12.0 |
| notebooks | ^1.10.2 | ^1.10.2 | ^1.10.2 |
| gen-ai | ^1.2.0 | ^1.2.0 | -- |
| autorag | ^1.2.2 | ^1.5.0 | -- |
| automl | ^1.2.2 | ^1.5.0 | -- |
| eval-hub | ^1.2.2 | -- | -- |
| maas | ^1.2.0 | -- | -- |
| mlflow | ^1.2.2 | -- | -- |

---

## Discussion Questions

### 1. Does this boundary feel right?

mod-arch gets a config field + configurable auth path. odh-dashboard gets the feature-level
platform packages (`platform-core`, `platform-openshift`, `platform-kubernetes`).

### 2. `platform` field vs expanding `DeploymentMode`?

We believe platform and deployment mode are orthogonal:

| | OpenShift | Vanilla K8s | Kubeflow |
|---|:---:|:---:|:---:|
| **Standalone** | Today | xKS target | Today |
| **Federated** | Today | xKS target | Today |
| **Kubeflow** | n/a | n/a | Today |

Should `platform` be a separate config field (our recommendation), or does the team see
it as an extension of `DeploymentMode`?

### 3. What's the right scope for the mod-arch change?

We're proposing exactly three things:

1. One new config field (`platform`)
2. Configurable logout path (`logoutPath`, defaulting to `/oauth/sign_out`)
3. Platform-aware Kubeflow script gating (defensive — script loading already checks
   `DeploymentMode.Kubeflow`, this adds a `platform` guard)

Is that too much? Too little? Are there other hardcoded behaviors we should make
configurable at the same time? (e.g., the `kf.dashboard.*` session key, the OAuth
error string in useSettings)

### 4. xKS in the monorepo?

xKS shares feature packages with odh-dashboard (model-serving, model-registry, gen-ai,
observability), so it needs to stay in the odh-dashboard monorepo as a deployment profile
rather than a separate app. Does the team agree?

### 5. Anything on the mod-arch roadmap that affects this?

Upcoming changes or plans we should be aware of? (e.g., changes to `ModularArchConfig`,
`ModularArchContextProvider`, or namespace management)

---

## What Can Start Immediately (No Monarch Impact)

**Phase 0 — thinning the odh-dashboard host app** (see [Phase 0 audit](app-shell-phase0-host-audit.md)):

- Move ~812 feature pages out of `frontend/src/pages/` into their own packages
- Pure code reorganization — no behavior change, no mod-arch impact
- Unblocks `PLUGIN_PACKAGES` to actually control what ships in each build
- After Phase 0, host shrinks from ~888 files to ~76 files (shell + admin)

---

## Additional Notes for Discussion

### `mandatoryNamespace` as an xKS mechanism

`mandatoryNamespace` on `ModularArchConfig` already overrides namespace listing in all
deployment modes — when set, `useNamespaces` returns only that single namespace regardless
of whether the mode is Standalone, Federated, or Kubeflow. For xKS single-namespace
deployments (e.g., a dedicated inference namespace), this existing mechanism may be
sufficient without any namespace-related mod-arch changes.

### Theming is already decoupled

`ThemeProvider` in `mod-arch-kubeflow` accepts a `theme` prop (`Theme.Patternfly` or
`Theme.MUI`) that is **independent of `DeploymentMode`**. The starter app reads
`STYLE_THEME` as a separate env var. This means "PF-only on xKS" is achieved by simply
not passing `Theme.MUI` — no mod-arch library change needed.

### OpenShift coupling audit

We mapped every OpenShift-specific API touchpoint in odh-dashboard
(see [coupling map](app-shell-openshift-coupling-map.md)):

| Category | Files | Tier |
|----------|:---:|------|
| Projects API (`project.openshift.io`) | 28 | Tier 1 — blocker for xKS |
| DSC/DSCI component gating | ~35 | Tier 1 — blocker for xKS |
| Auth CRD + admin detection | ~10 | Tier 1 — blocker for xKS |
| Routes API (`route.openshift.io`) | 8 | Tier 2 — per-feature |
| Templates API (`template.openshift.io`) | 13 | Tier 2 — per-feature |
| Groups API (`user.openshift.io`) | 21 | Tier 2 — per-feature |
| Thanos / openshift-monitoring | 18 | Tier 2 — per-feature |
| `openshift.io/*` annotations | 128 | Tier 3 — convention |

All of this lives in **odh-dashboard**, not mod-arch. The platform packages absorb it.

### Auth proxy recommendation

For xKS, we recommend **oauth2-proxy** as a drop-in replacement for the OpenShift OAuth
proxy sidecar (see [auth proxy spike](app-shell-auth-proxy-spike.md)). It sets the exact
headers (`x-forwarded-access-token`, `x-auth-request-user`) the dashboard backend already
expects. **No backend code changes needed for MVP.**

---

## Proposed Outcome

1. **Agreement** on the mod-arch / odh-dashboard boundary for platform abstraction
2. **Decision** on `platform` config field design (separate field vs expanding `DeploymentMode`)
3. **Green light** to proceed with Phase 0 (host thinning) and the mod-arch config changes

---
