# Auth Proxy Spike: OIDC Options for Vanilla K8s

> **Purpose**: Evaluate OIDC auth proxy options to replace OpenShift OAuth for xKS
> (non-OpenShift) deployments of the dashboard.
>
> **Current state**: On OpenShift, an OAuth proxy sidecar handles authentication. The
> dashboard backend receives pre-authenticated requests with `x-forwarded-access-token`
> headers. The backend has a 5-strategy fallback chain for user identity resolution.

---

## Current Auth Flow (OpenShift)

```
Browser
  │
  ├─── GET /dashboard ──────────────────────────┐
  │                                              │
  │    ┌─────────────────────────────────────┐   │
  │    │ OAuth Proxy Sidecar                 │   │
  │    │ (openshift/oauth-proxy)             │   │
  │    │                                     │   │
  │    │ 1. Check for valid session cookie   │   │
  │    │ 2. If no session → redirect to      │   │
  │    │    OpenShift OAuth server            │◄──┘
  │    │ 3. After OAuth dance → set          │
  │    │    x-forwarded-access-token header   │
  │    │ 4. Proxy to dashboard backend       │
  │    └──────────────┬──────────────────────┘
  │                   │
  │    ┌──────────────▼──────────────────────┐
  │    │ Dashboard Backend (Fastify)         │
  │    │                                     │
  │    │ getUserInfo() fallback chain:       │
  │    │ 1. x-auth-request-user header       │
  │    │ 2. OpenShift User API (/users/~)    │
  │    │ 3. SelfSubjectReview                │
  │    │ 4. JWT token parsing                │
  │    │ 5. Dev mode service account         │
  │    └─────────────────────────────────────┘
```

**Key headers the backend expects**:
- `x-forwarded-access-token` -- K8s bearer token (required)
- `x-auth-request-user` -- username from proxy (optional, Strategy 1)

**Key insight**: Strategy 2 (OpenShift User API) already has graceful fallback. Strategy 3
(SelfSubjectReview) and Strategy 4 (JWT parsing) are standard K8s and work on any cluster.
The backend code needs **minimal changes** -- the main work is infrastructure (deploying
the right proxy).

---

## Option 1: oauth2-proxy

**Repository**: https://github.com/oauth2-proxy/oauth2-proxy
**License**: MIT
**Maturity**: Widely used, CNCF-adjacent, active maintenance

### How it works

oauth2-proxy sits in front of the dashboard, authenticates users via OIDC, and passes
the authenticated token downstream.

### Configuration for xKS

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: xks-dashboard-oauth2-proxy
spec:
  template:
    spec:
      containers:
      - name: oauth2-proxy
        image: quay.io/oauth2-proxy/oauth2-proxy:latest
        args:
        - --provider=oidc
        - --oidc-issuer-url=https://accounts.google.com  # or Azure AD, Dex, etc.
        - --client-id=$(CLIENT_ID)
        - --client-secret=$(CLIENT_SECRET)
        - --cookie-secret=$(COOKIE_SECRET)
        - --upstream=http://localhost:8080  # dashboard backend
        - --pass-access-token=true         # sets x-forwarded-access-token
        - --set-xauthrequest=true          # sets x-auth-request-user
        - --email-domain=*
        - --skip-provider-button=true
```

### Pros
- **Widely adopted** -- battle-tested in production at scale
- **Supports all major providers**: Google, Azure AD, GitHub, OIDC generic, SAML
- **Sets the exact headers** the dashboard backend expects (`x-forwarded-access-token`,
  `x-auth-request-user`)
- **Minimal backend code changes** -- existing fallback chain works as-is
- **Can run as sidecar or standalone** -- flexible deployment models
- **Active community** -- regular releases, good docs

### Cons
- **Separate binary to maintain** -- image scanning, CVE tracking
- **Cookie-based sessions** -- needs cookie secret management
- **No built-in group mapping** -- group claims from OIDC tokens need custom config

### Per-Cloud Provider Configuration

| Provider | OIDC Issuer | Notes |
|----------|------------|-------|
| CoreWeave | Customer's IDP (generic OIDC) | Standard OIDC config |
| Azure (AKS) | `https://login.microsoftonline.com/{tenant}/v2.0` | Use `--provider=azure` for group claims |
| Google (GKE) | `https://accounts.google.com` | Use `--provider=google` for workspace groups |
| AWS (EKS) | Cognito or customer IDP | Standard OIDC config |

---

## Option 2: Dex

**Repository**: https://github.com/dexidp/dex
**License**: Apache 2.0
**Maturity**: CNCF Sandbox project, used by ArgoCD, Kubernetes itself

### How it works

Dex is an OIDC identity broker. It sits between the dashboard and multiple upstream
identity providers, presenting a single OIDC interface.

### Pros
- **Identity federation** -- can aggregate multiple IDPs (LDAP, SAML, GitHub, Google, Azure AD)
- **Issues its own tokens** -- consistent token format regardless of upstream provider
- **Used by Kubernetes** -- aligned with K8s ecosystem
- **Group support** -- maps upstream groups into OIDC claims

### Cons
- **More complex** -- it's an identity server, not just a proxy. Needs its own storage (etcd/SQLite/Postgres)
- **Still needs a proxy** -- Dex issues tokens but doesn't protect endpoints. You'd use Dex + oauth2-proxy together, or Dex + a custom auth middleware
- **Heavier deployment** -- separate service with its own lifecycle
- **Overkill for single-provider** -- if the customer has one IDP, Dex adds unnecessary complexity

---

## Option 3: Istio / Envoy-based Auth

**Context**: The llm-d design doc specifies Istio as the gateway for xKS deployments.

### How it works

Istio's `RequestAuthentication` + `AuthorizationPolicy` CRDs can enforce JWT validation
at the gateway level. The dashboard backend would receive pre-validated requests.

### Pros
- **Already in the stack** -- llm-d ships Istio for xKS
- **No additional component** -- auth is handled at the mesh level
- **mTLS included** -- service-to-service auth comes free
- **Policy-based** -- fine-grained authorization via Istio policies

### Cons
- **JWT only** -- no session/cookie management. Users need to obtain tokens out-of-band
- **No login UI** -- Istio validates tokens but doesn't provide a login flow
- **Dashboard-specific needs** -- the dashboard expects `x-forwarded-access-token` which
  Istio doesn't set natively (needs EnvoyFilter or custom header mapping)
- **Tight coupling** -- ties dashboard auth to the service mesh config

---

## Recommendation

### Primary: oauth2-proxy

oauth2-proxy is the strongest choice because:

1. **Drop-in replacement** -- it sets the exact headers the backend already expects
2. **Minimal code changes** -- the existing 5-strategy fallback chain works unchanged
3. **Per-provider flexibility** -- native support for Azure AD, Google, generic OIDC
4. **Battle-tested** -- widely used in the K8s ecosystem
5. **Simple deployment** -- sidecar or standalone, no extra storage needed

### Secondary: Dex (if multi-IDP federation is needed)

If customers need to federate across multiple identity providers (rare for initial MVP),
Dex + oauth2-proxy provides the identity brokering layer.

### Not recommended for MVP: Istio-only auth

Istio auth lacks login flow management and doesn't set the headers the backend expects.
It's better as a defense-in-depth layer alongside oauth2-proxy.

---

## Backend Code Changes Required

### Minimal (Strategy 2 cleanup)

The only code change needed is making the OpenShift User API call (Strategy 2) conditional:

```typescript
// backend/src/utils/userUtils.ts -- getUserInfo()
// Strategy 2: OpenShift User API -- ALREADY has graceful fallback
// On vanilla K8s, this silently fails and falls through to Strategy 3
```

The existing code already handles this with a try/catch that falls through.
**No code changes needed for MVP.**

### Optional (cleanup for xKS builds)

- Remove `OpenShiftUser` type and `getOpenshiftUser()` from xKS build (dead code)
- Make `DEV_OAUTH_PREFIX` configurable instead of hardcoded to `oauth-openshift.apps`
- Add env var for configuring the expected auth proxy type (for logging/diagnostics)

---

## Deployment Architecture

```
                    ┌─────────────────────────────────┐
                    │         Ingress / Gateway        │
                    └──────────────┬──────────────────┘
                                   │
                    ┌──────────────▼──────────────────┐
                    │        oauth2-proxy              │
                    │  (OIDC → x-forwarded-access-     │
                    │   token header)                   │
                    └──────────────┬──────────────────┘
                                   │
              ┌────────────────────┼────────────────────┐
              │                    │                     │
   ┌──────────▼────────┐ ┌────────▼──────────┐ ┌───────▼────────┐
   │ Dashboard Backend  │ │ Model Registry    │ │ Gen AI BFF     │
   │ (Fastify)          │ │ BFF (Go)          │ │ (Go)           │
   └────────────────────┘ └───────────────────┘ └────────────────┘
```

Each BFF sidecar can share the same oauth2-proxy instance (single ingress point)
or have its own (per-service auth). The existing Module Federation proxy pattern
(`/_mf/<name>`) routes through the dashboard backend, so a single auth proxy
in front of the backend protects all BFF traffic.
