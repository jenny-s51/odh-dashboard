# PoC: Inference-Only Deployment Profile

> **Purpose**: Validate the "same shell, different config" approach by defining an
> inference-only deployment profile using existing `PLUGIN_PACKAGES` (build-time) and
> `federation-configmap` (runtime) mechanisms.
>
> **Status**: Proof-of-concept. The YAML files below are draft configurations, not
> production-ready manifests.

---

## How Deployment Profiles Work (existing mechanisms)

The odh-dashboard has three layers of configuration:

1. **Build-time** (`PLUGIN_PACKAGES`): Controls which extension packages are statically
   imported into the webpack bundle. Set as an env var during `npm run build`.

2. **Runtime remotes** (`federation-configmap.yaml`): Controls which Module Federation
   remotes are loaded at runtime. Each entry = a BFF sidecar service + frontend remote.

3. **Feature flags** (`OdhDashboardConfig` CR): Controls which SupportedAreas are
   enabled/disabled in the UI at runtime, independent of what code is bundled.

An inference-only profile configures all three layers to include only inference-relevant
features.

---

## Layer 1: Build-Time Plugin Packages

### Full OpenShift Build (current)

```bash
# No PLUGIN_PACKAGES set = all extension packages included
npm run build
```

### Inference-Only Build

```bash
PLUGIN_PACKAGES="@odh-dashboard/model-serving,@odh-dashboard/kserve,@odh-dashboard/llmd-serving,@odh-dashboard/observability" npm run build
```

This excludes from the bundle:
- `@odh-dashboard/model-training`
- `@odh-dashboard/feature-store`
- `@odh-dashboard/notebooks` (if it has host extensions)
- Any other non-inference extension packages

**Note**: This only controls **static extensions** registered via `./extensions` exports.
MF remotes (model-registry, gen-ai, maas) load at runtime regardless -- they're controlled
by the federation configmap.

---

## Layer 2: Runtime Federation ConfigMap

### Inference-Only Federation Config

Only includes remotes relevant to inference: model-registry (for catalog + registry),
gen-ai (for playground), and maas (for policies/subscriptions).

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: federation-config
  namespace: xks-dashboard
data:
  module-federation-config.json: |
    [
      {
        "name": "modelRegistry",
        "remoteEntry": "/remoteEntry.js",
        "authorize": true,
        "tls": true,
        "proxy": [
          {
            "path": "/model-registry/api",
            "pathRewrite": "/api"
          }
        ],
        "service": {
          "name": "xks-dashboard",
          "namespace": "xks-dashboard",
          "port": 8043
        }
      },
      {
        "name": "genAi",
        "remoteEntry": "/remoteEntry.js",
        "authorize": true,
        "tls": true,
        "proxy": [
          {
            "path": "/gen-ai/api",
            "pathRewrite": "/api"
          }
        ],
        "service": {
          "name": "xks-dashboard",
          "namespace": "xks-dashboard",
          "port": 8143
        }
      },
      {
        "name": "maas",
        "remoteEntry": "/remoteEntry.js",
        "authorize": true,
        "tls": true,
        "proxy": [
          {
            "path": "/maas/api",
            "pathRewrite": "/api"
          }
        ],
        "service": {
          "name": "xks-dashboard",
          "namespace": "xks-dashboard",
          "port": 8243
        }
      }
    ]
```

**Excluded remotes** (vs full OpenShift):
- `mlflow` -- not inference-relevant for MVP
- `evalHub` -- not inference-relevant for MVP
- `automl` -- not inference-relevant
- `autorag` -- not inference-relevant
- `perses` -- Perses proxy (observability uses this, may add later)
- `mlflowEmbedded` -- not inference-relevant

---

## Layer 3: OdhDashboardConfig Feature Flags

### Inference-Only Dashboard Config

```yaml
apiVersion: opendatahub.io/v1alpha
kind: OdhDashboardConfig
metadata:
  name: odh-dashboard-config
  namespace: xks-dashboard
spec:
  dashboardConfig:
    # --- ENABLED (inference features) ---
    disableModelServing: false
    disableKServe: false
    disableModelCatalog: false
    disableModelRegistry: false
    disableLLMd: false
    genAiStudio: true
    modelAsService: true
    maasAuthPolicies: true
    disableKueue: false
    disablePerformanceMetrics: false

    # --- DISABLED (non-inference features) ---
    disablePipelines: true
    disableProjects: true
    disableProjectScoped: true
    disableProjectSharing: true
    disableBYONImageStream: true
    disableClusterManager: true
    disableUserManagement: false           # keep for admin
    disableCustomServingRuntimes: false     # keep for serving runtime config
    disableHome: false                     # keep landing page
    disableDistributedWorkloads: true
    disableStorageClasses: true
    disableAdminConnectionTypes: true      # evaluate
    disableFineTuning: true
    disableFeatureStore: true
    disableTrustyBiasMetrics: true
    disableNIMModelServing: true           # evaluate
    disableLMEval: true
    trainingJobs: false                    # keeps this disabled (flag is enable-style)
    mlflowPipelines: false
    mcpCatalog: true                       # enable MCP catalog
```

---

## Validation Approach

### Step 1: Verify build-time slimming

```bash
# Build with inference-only plugin packages
PLUGIN_PACKAGES="@odh-dashboard/model-serving,@odh-dashboard/kserve,@odh-dashboard/llmd-serving,@odh-dashboard/observability" npm run build

# Compare bundle size
du -sh dist/
# Expected: significantly smaller than full build
```

### Step 2: Verify runtime feature gating

With the inference-only `OdhDashboardConfig`, verify:
- Left nav shows only: Home, AI Hub (Models, MCP Servers), Gen AI Studio, Settings
- Left nav does NOT show: Projects, Pipelines, Distributed Workloads
- AI Hub > Models shows Catalog, Registry, Deployments tabs
- Settings shows Policies, Subscriptions, User Management (no Cluster Settings, BYON, Storage Classes)

### Step 3: Verify federation remote loading

With the inference-only `federation-configmap`, verify:
- Model Registry remote loads (catalog, registry, MCP tabs)
- Gen AI remote loads (playground, assets, API keys)
- MaaS remote loads (policies, subscriptions)
- No attempts to load mlflow, evalHub, automl, autorag remotes

---

## Gap Analysis: What This PoC Does NOT Solve

1. **Host-resident feature code is still bundled**: Even with `PLUGIN_PACKAGES`, the host
   `frontend/src/pages/pipelines/` (141 files) and `frontend/src/pages/projects/` (274 files)
   are in the bundle. Phase 0 (migrating pages to packages) is needed to fully control this.

2. **OpenShift APIs are still called**: The host still uses `ProjectModel`, `RouteModel`, etc.
   Platform abstraction (Phase 1-2) is needed for vanilla K8s.

3. **Auth is still OpenShift OAuth**: The deployment assumes the OAuth proxy sidecar.
   Auth proxy replacement is needed for vanilla K8s.

4. **DSC gating**: Without the ODH operator's DSC resource, `requiredComponents` areas
   (K_SERVE, MODEL_REGISTRY, KUEUE) will be disabled. Platform capability detection is needed.

This PoC validates the **configuration mechanism** works. The platform abstraction work
(Phases 1-2) addresses the remaining gaps.
