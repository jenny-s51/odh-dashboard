# Monarch Team Discussion: App Shell & Platform Abstraction

> **Purpose**: Discussion points for alignment with the Monarch team before proceeding with
> the app shell / platform abstraction work for xKS (non-OpenShift) deployments.
>
> **Context**: Red Hat needs an "Inference UI" that runs on vanilla Kubernetes (CoreWeave, AKS,
> EKS, GKE). The recommended approach keeps everything in the odh-dashboard monorepo with new
> `platform-*` packages. The Monarch team's `mod-arch-library` is the foundational infrastructure
> every federated package depends on.
>
> **Related**: [RHOAIENG-27201](https://redhat.atlassian.net/browse/RHOAIENG-27201),
> [RHAISTRAT-1172](https://redhat.atlassian.net/browse/RHAISTRAT-1172),
> [GitLab architecture analysis](https://gitlab.cee.redhat.com/astonebe/rhoai-architecture-observations/-/tree/main/rhoai/inference-ui)

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

## Discussion Point 1: Where should `platform-core` live?

The proposed `platform-core` package defines a `PlatformProvider` interface for namespace ops,
routing, identity, monitoring, and capability detection. Two options:

**Option A**: `platform-core` is a new package in **odh-dashboard**, consumed alongside
`mod-arch-core`. They coexist -- mod-arch handles deployment mode / namespace state,
platform-core handles platform-specific implementations.

**Option B**: `platform-core` concepts get folded **into `mod-arch-core`** as a new axis of
`ModularArchConfig`. The `ModularArchContextProvider` gains awareness of which platform it's
running on and provides platform-specific implementations.

**Questions for Monarch**:
- Does the team see platform abstraction (OpenShift vs vanilla K8s) as within mod-arch scope?
- Would folding it into mod-arch-core create unwanted coupling to odh-dashboard concerns?
- Is there value in mod-arch-core being platform-agnostic (usable by projects beyond odh-dashboard)?

---

## Discussion Point 2: ModularArchContextProvider and platform detection

`ModularArchContextProvider` takes `config: ModularArchConfig` with deployment mode
(standalone / federated / kubeflow). Platform detection (OpenShift vs vanilla K8s vs CoreWeave)
is a new dimension.

**Questions for Monarch**:
- Should platform detection happen BEFORE `ModularArchContextProvider` (shell responsibility)
  with the result passed via config?
- Or should `ModularArchContextProvider` handle it internally based on new config fields?
- The provider already does Kubeflow script loading and namespace management -- is platform
  awareness a natural extension of `DeploymentMode`, or a separate concern?

**Concrete scenario**: On CoreWeave, the provider needs to:
- Skip Kubeflow script loading
- Use standard `v1/Namespace` API instead of `project.openshift.io`
- Not assume OpenShift User/Group APIs exist

---

## Discussion Point 3: Impact on mod-arch-kubeflow and theming

`mod-arch-kubeflow` provides MUI-to-PatternFly token mapping and `ThemeProvider`.

**Questions for Monarch**:
- Will xKS deployments use PatternFly v6 only (no MUI)? Or is Kubeflow-on-xKS possible?
- If xKS is PF-only, does `mod-arch-kubeflow` get loaded at all?
- Should `ThemeProvider` support a "no theme override" mode for pure-PF deployments?
- Does `pf-tokens-SSOT.json` / MUI theme mapping need changes for non-Kubeflow variants?

---

## Discussion Point 4: mod-arch-shared usage in platform packages

The proposed `platform-openshift` and `platform-kubernetes` packages are primarily
logic/API packages. If they ever need UI (platform-specific settings, cloud auth flows),
should they consume `mod-arch-shared` components?

**Questions for Monarch**:
- Are there constraints on what can depend on `mod-arch-shared`?
- Should platform packages be strictly logic-only?
- If a platform package needs a UI component (e.g., Azure AD login page), should that live
  in the platform package or in a separate feature package that depends on the platform?

---

## Discussion Point 5: mod-arch-starter as xKS seed

`mod-arch-starter` is a complete app shell template (BFF + React + webpack + Module Federation).
The xKS dashboard is conceptually the same thing but configured for inference features.

**Questions for Monarch**:
- Could `mod-arch-starter` (or a variant) seed the xKS app shell instead of thinning
  `frontend/`?
- The installer supports "flavors" (kubeflow, default) -- could "xks" or "inference" be a
  new flavor?
- **Trade-off**: Using mod-arch-starter means xKS is a separate app (multi-repo territory).
  Thinning `frontend/` keeps it as one app with deployment profiles (monorepo approach).
  Which does Monarch prefer given mod-arch's design philosophy?

---

## Discussion Point 6: Namespace management on vanilla K8s

`mod-arch-core` provides `useNamespaces`, `useQueryParamNamespaces`, `useNamespaceSelector`.
These work through `ModularArchContextProvider`.

**Questions for Monarch**:
- Does `useNamespacesWithConfig` call K8s APIs directly or go through the BFF?
- On vanilla K8s, namespace listing uses `v1/Namespace`. Does mod-arch-core need changes?
- Several BFFs (gen-ai, autorag, automl, eval-hub) have a `project.openshift.io` fallback
  in `token_k8s_client.go`. This pattern suggests namespace resolution happens at the BFF
  level -- can mod-arch-core rely on this abstraction?

---

## Discussion Point 7: Versioning and release coordination

Different odh-dashboard packages pin different mod-arch versions today (e.g., model-registry
at ~1.12.0, gen-ai at ^1.2.0). Platform packages would add another consumer.

**Questions for Monarch**:
- Should platform packages be part of the mod-arch-library release cycle?
- Or should they be odh-dashboard-internal packages that consume mod-arch as a dependency?
- How should version alignment be enforced? (workspace `overrides`? shared version variable?)

---

## Discussion Point 8: Extension point changes for platform awareness

`packages/plugin-core/` defines extension points. Platform abstraction may need new types:

- `app.platform/provider` -- platform package registers as the active platform
- `app.platform/capability` -- declaring platform-specific capabilities
- Platform-aware `SupportedArea` entries with `platformRequirements` field

**Questions for Monarch**:
- Does the Monarch team own `plugin-core` extension point design?
- Would they want to review/approve new extension point types?
- Is there an extension point pattern that already supports this (e.g., `app.status-provider`
  for hardware profiles)?

---

## Proposed Next Steps (pending Monarch alignment)

1. Align on Discussion Points 1-2 (where platform-core lives, how it integrates with
   ModularArchContextProvider) -- this is the critical architectural decision
2. Draft `PlatformProvider` interface for joint review
3. Phase 0: thin the host by migrating feature pages to packages (no Monarch impact)
4. Phase 1: create platform-core + platform-openshift (Monarch review on interfaces)
5. Phase 2: create platform-kubernetes for first xKS deployment
