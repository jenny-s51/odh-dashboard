# Phase 0 Audit: Host-Resident Feature Pages

> **Purpose**: Identify all feature code still living in `frontend/src/pages/` and
> `frontend/src/concepts/` that should be migrated into `packages/` to enable the
> "minimal deployable" app shell.
>
> **Why this matters**: Today, `PLUGIN_PACKAGES` controls which extension packages are
> statically imported, and `federation-configmap` controls which MF remotes load at
> runtime. But pages defined in `frontend/src/pages/` are always in the host bundle
> regardless of these controls. An "inference-only" build still ships pipelines, workbenches,
> BYON, and distributed workloads code.

---

## Host Pages Audit

### Feature Pages (should migrate to packages)

| Directory | Files | SupportedArea | Target Package | Priority | Notes |
|-----------|------:|---------------|----------------|----------|-------|
| `pages/pipelines/` | 141 | `DS_PIPELINES` | `packages/pipelines/` (new) | HIGH | Largest ungoverned feature. No existing package. |
| `pages/projects/` | 274 | `DS_PROJECTS_VIEW`, `DS_PROJECT_SCOPED` | `packages/projects/` (new) | HIGH | Largest host surface. Extensions from model-serving/notebooks add tabs but bulk is host. |
| `pages/modelServing/` | 170 | `MODEL_SERVING` | `packages/model-serving/` (exists) | HIGH | Hybrid: packages/model-serving adds wizard + global routes, but 170 files of legacy UI remain in host (metrics, custom runtimes, modals). |
| `**pages**/notebookController/` | 41 | `WORKBENCHES` | `packages/notebooks/` (exists) | MEDIUM | ODH notebook controller admin/UX. Different from upstream Workspaces MF app. |
| `pages/hardwareProfiles/` | 50 | (admin, uses `accessReview`) | `packages/hardware-profiles/` (new) or stays in host | MEDIUM | Integrates with model-serving extension points. Admin-only. |
| `pages/connectionTypes/` | 42 | `ADMIN_CONNECTION_TYPES` | `packages/connection-types/` (new) or stays in host | MEDIUM | Admin feature, cross-cutting (used by many features). |
| `pages/BYONImages/` | 23 | `BYON` | `packages/notebooks/` (exists) | MEDIUM | Admin workbench images. Not inference-relevant. |
| `pages/distributedWorkloads/` | 22 | `DISTRIBUTED_WORKLOADS` | `packages/distributed-workloads/` (new) | MEDIUM | Kueue metrics. No existing package. |
| `pages/modelRegistrySettings/` | 18 | `MODEL_REGISTRY` (admin) | `packages/model-registry/` (exists) | LOW | Admin MR settings. Distinct from federated MR app. |
| `pages/storageClasses/` | 17 | `STORAGE_CLASSES` | `packages/storage-classes/` (new) or stays in host | LOW | Admin-only. |
| `pages/clusterSettings/` | 8 | `CLUSTER_SETTINGS` | stays in host (shell admin) | LOW | Dashboard config admin. Arguably shell-level. |
| `pages/learningCenter/` | 13 | (none) | stays in host | LOW | Docs/learning resources. |
| `pages/groupSettings/` | 1 | `USER_MANAGEMENT` | stays in host (shell admin) | LOW | Single file. |
| `pages/home/` | 11 | `HOME` | stays in host (landing page) | LOW | Dashboard landing. |
| `pages/enabledApplications/` | 1 | `HOME` | stays in host | LOW | |
| `pages/exploreApplication/` | 5 | (none) | stays in host | LOW | |

### Shell Pages (stay in host)

| Directory / File | Files | Reason |
|------------------|------:|--------|
| `pages/ApplicationsPage.tsx` | 1 | Layout component |
| `pages/NotFound.tsx` | 1 | 404 page |
| `pages/UnauthorizedError.tsx` | 1 | Auth error |
| `pages/UnknownError.tsx` | 1 | Generic error |
| `pages/dependencies/` | 1 | Dependency-missing gate |
| `pages/external/` | 6 | External redirects |

---

## Host Concepts Audit (`frontend/src/concepts/`)

### Feature-Specific Concepts (candidates for migration with their pages)

| Directory | Corresponding Feature | Target Package |
|-----------|----------------------|----------------|
| `concepts/pipelines/` | Pipelines | `packages/pipelines/` |
| `concepts/projects/` | Projects | `packages/projects/` |
| `concepts/modelServing/` | Model Serving | `packages/model-serving/` |
| `concepts/modelServingKServe/` | KServe Serving | `packages/kserve/` |
| `concepts/notebooks/` | Notebooks | `packages/notebooks/` |
| `concepts/modelRegistry/` | Model Registry | `packages/model-registry/` |
| `concepts/modelRegistrySettings/` | MR Settings | `packages/model-registry/` |
| `concepts/modelCatalog/` | Model Catalog | `packages/model-registry/` |
| `concepts/distributedWorkloads/` | Distributed Workloads | `packages/distributed-workloads/` |
| `concepts/connectionTypes/` | Connection Types | `packages/connection-types/` or host |
| `concepts/hardwareProfiles/` | Hardware Profiles | `packages/hardware-profiles/` or host |
| `concepts/kueue/` | Kueue | `packages/distributed-workloads/` |
| `concepts/mlflow/` | MLflow | `packages/mlflow/` |
| `concepts/trustyai/` | TrustyAI | stays (metrics) |
| `concepts/topology/` | Topology | stays (cross-cutting) |
| `concepts/metrics/` | Metrics | stays (cross-cutting) |
| `concepts/integrations/` | Integrations | stays (cross-cutting) |

### Cross-Cutting Concepts (stay in host)

| Directory | Reason |
|-----------|--------|
| `concepts/areas/` | Feature gating system (shell infrastructure) |
| `concepts/k8s/` | K8s utilities (shell infrastructure) |
| `concepts/permissions/` | RBAC utilities (shell infrastructure) |
| `concepts/roleBinding/` | RBAC (shell infrastructure) |
| `concepts/userConfigs/` | User config (shell infrastructure) |
| `concepts/userSSAR/` | Access review (shell infrastructure) |
| `concepts/notificationWatcher/` | Notifications (shell infrastructure) |
| `concepts/proxy/` | API proxy (shell infrastructure) |
| `concepts/design/` | Design system utilities (shell infrastructure) |
| `concepts/dashboard/` | Dashboard utilities (shell infrastructure) |
| `concepts/docResources/` | Documentation resources (shell infrastructure) |
| `concepts/analyticsTracking/` | Analytics (shell infrastructure) |
| `concepts/secrets/` | Secrets utilities (cross-cutting) |

---

## Recommended Migration Order

### Wave 1: Inference-blocking (must complete for minimal xKS build)

1. **`pages/modelServing/`** (170 files) -- merge remaining host code into `packages/model-serving/`
   - This is the most impactful because model serving is core to the inference UI
   - `packages/model-serving/` already exists with wizard + global routes; host has legacy metrics, custom runtimes, modals
   - Also move `concepts/modelServing/`, `concepts/modelServingKServe/`

2. **`pages/pipelines/`** (141 files) -- create `packages/pipelines/`
   - Not inference-relevant, but currently the 2nd largest host surface
   - Extraction means a `PLUGIN_PACKAGES` build without pipelines actually excludes pipeline code
   - Also move `concepts/pipelines/`

### Wave 2: Clean separation

3. **`pages/projects/`** (274 files) -- create `packages/projects/`
   - Largest surface but complex: spawner, permissions, storage
   - Also move `concepts/projects/`
   - On xKS, projects page may not exist (namespace management is simpler)

4. **`pages/notebookController/`** (41 files) -- merge into `packages/notebooks/`
5. **`pages/BYONImages/`** (23 files) -- merge into `packages/notebooks/`
6. **`pages/distributedWorkloads/`** (22 files) -- create `packages/distributed-workloads/`

### Wave 3: Admin pages (evaluate case-by-case)

7. **`pages/hardwareProfiles/`** (50 files) -- new package or stays in host
8. **`pages/connectionTypes/`** (42 files) -- new package or stays in host
9. **`pages/modelRegistrySettings/`** (18 files) -- merge into `packages/model-registry/`
10. **`pages/storageClasses/`** (17 files) -- new package or stays in host

### Stay in host (shell infrastructure)

- `clusterSettings/`, `groupSettings/`, `home/`, `learningCenter/`, `enabledApplications/`,
  `exploreApplication/`, error pages, external redirects, dependencies

---

## File Count Summary

| Category | Files | % of host pages |
|----------|------:|:---:|
| Feature pages (should migrate) | ~812 | 91% |
| Shell pages (stay) | ~16 | 2% |
| Admin pages (evaluate) | ~60 | 7% |
| **Total `frontend/src/pages/`** | ~888 | 100% |

After Phase 0, the host `frontend/src/pages/` would shrink from ~888 files to ~76 files
(shell + admin that stays), with the `PLUGIN_PACKAGES` build-time mechanism controlling
which feature code is included in any given build artifact.
