# OpenShift Coupling Map: What Moves to platform-openshift

> **Purpose**: Exhaustive map of every OpenShift-specific API touchpoint in odh-dashboard
> that would need to move into `packages/platform-openshift/` (or be abstracted behind
> `platform-core` interfaces).
>
> **Source**: Repository-wide search of odh-dashboard at branch `RHOAIENG-57879`, cross-referenced
> with the [GitLab architecture analysis](https://gitlab.cee.redhat.com/astonebe/rhoai-architecture-observations/-/blob/main/rhoai/inference-ui/openshift-dependency-analysis.md).

---

## Summary

| Dependency Category | Files Affected | Tier | Inference-UI Relevant? |
|---------------------|:-:|------|:---:|
| S1: Projects API (`project.openshift.io`) | 28 | Tier 1 (blocker) | Yes |
| S2: DSC/DSCI component gating | ~35 | Tier 1 (blocker) | Yes |
| S3: OdhDashboardConfig CRD | 0 code changes | Tier 1 (deploy CRD) | Yes |
| S4: Auth CRD + admin detection | ~10 | Tier 1 (blocker) | Yes |
| S5: User identity (User API) | ~4 | Tier 3 (already handled) | No |
| S6: `openshift.io/*` annotations | 128 | Tier 3 (convention) | Yes |
| S7: Namespace filtering | ~5 | Tier 3 (negligible) | No |
| F1: Routes API (`route.openshift.io`) | 8 | Tier 2 (per-feature) | Yes |
| F2: Templates API (`template.openshift.io`) | 13 | Tier 2 (per-feature) | Yes |
| F3: Groups API (`user.openshift.io`) | 21 | Tier 2 (per-feature) | Partial |
| F4: Thanos / openshift-monitoring | 18 | Tier 2 (per-feature) | Yes |
| F5: `config.openshift.io` CRDs | 9 | Tier 2 (per-feature) | Yes |
| F6: OLM Subscriptions | ~5 | Tier 2 (per-feature) | Partial |
| F7: Console CRDs | 22 | Tier 3 (low risk) | No |
| F8: Build/ImageStream APIs | 11 | Tier 3 (not in scope) | No |

---

## S1: OpenShift Projects API (`project.openshift.io`)

**Model definition**: `frontend/src/api/models/openShift.ts` (lines 24-36)
- `ProjectModel` -- `project.openshift.io/v1/Project`
- `ProjectRequestModel` -- `project.openshift.io/v1/ProjectRequest`

**Frontend files** (11):
- `frontend/src/api/k8s/projects.ts` -- `useProjects()`, `getProjects()`, `createProject()`, `updateProject()`, `deleteProject()`
- `frontend/src/api/k8s/__tests__/projects.spec.ts`
- `frontend/src/concepts/projects/accessChecks.tsx`
- `frontend/src/concepts/analyticsTracking/useTrackUser.ts`
- `frontend/src/pages/home/projects/ProjectsSection.tsx`
- `frontend/src/pages/projects/screens/projects/ProjectView.tsx`
- `frontend/src/__mocks__/mockProjectK8sResource.ts`
- `frontend/src/__mocks__/mockPodK8sResource.ts`
- `frontend/src/__mocks__/mockPipelinePodK8sResource.ts`
- `frontend/src/__mocks__/mockSelfSubjectRulesReview.ts`

**Backend files** (1):
- `backend/src/routes/api/namespaces/namespaceUtils.ts` -- SSAR check uses `project.openshift.io`

**Package BFF files** (7):
- `packages/gen-ai/bff/internal/integrations/kubernetes/token_k8s_client.go`
- `packages/autorag/bff/internal/integrations/kubernetes/internal_k8s_client.go`
- `packages/autorag/bff/internal/integrations/kubernetes/token_k8s_client.go`
- `packages/automl/bff/internal/integrations/kubernetes/internal_k8s_client.go`
- `packages/automl/bff/internal/integrations/kubernetes/token_k8s_client.go`
- `packages/eval-hub/bff/internal/integrations/kubernetes/token_k8s_client.go`
- `packages/model-registry/upstream/bff/internal/redhat/handlers/model_transfer_jobs.go`

**Porting action**: Replace `ProjectModel` with `NamespaceModel` via `PlatformProvider.namespaces.namespaceModel`. Replace `ProjectRequest` creation with `Namespace` creation. Update SSAR resource attributes. Update BFF fallback paths.

---

## F1: OpenShift Routes API (`route.openshift.io`)

**Model definition**: `frontend/src/api/models/openShift.ts` (lines 38-43)

**Frontend files** (3):
- `frontend/src/api/models/openShift.ts` -- `RouteModel` definition
- `frontend/src/__mocks__/mockRouteK8sResource.ts`
- `frontend/src/__mocks__/mockSecretK8sResource.ts` (references route annotations)

**Backend files** (2):
- `backend/src/utils/componentUtils.ts` -- URL extraction from Route resources
- `backend/src/utils/notebookUtils.ts` -- Route list/fetch operations

**Manifest files** (3):
- `manifests/core-bases/base/routes.yaml`
- `manifests/core-bases/base/cluster-role.yaml`
- `manifests/core-bases/base/role.yaml`

**Porting action**: Abstract behind `PlatformProvider.routing`. OpenShift reads Routes; vanilla K8s reads Ingress/Gateway API resources.

---

## F2: OpenShift Templates API (`template.openshift.io`)

**Model definition**: `frontend/src/api/models/openShift.ts` (lines 59-64)

**Frontend files** (5):
- `frontend/src/api/models/openShift.ts`
- `frontend/src/api/k8s/templates.ts`
- `frontend/src/utilities/__tests__/setServingRuntimeTemplate.spec.ts`
- `frontend/src/utilities/__tests__/addTypesToK8sListedResources.spec.ts`
- `frontend/src/__mocks__/mockServingRuntimeTemplateK8sResource.ts`

**Backend files** (2):
- `backend/src/routes/api/templates/index.ts`
- `backend/src/routes/api/modelRegistries/modelRegistryUtils.ts`

**Package files** (2):
- `packages/model-serving/src/concepts/servingRuntimeTemplates/useServingRuntimeTemplates.ts`
- `packages/model-registry/upstream/bff/internal/redhat/repositories/model_registry_settings_repository.go`

**Porting action**: Abstract behind `PlatformProvider.templates`. On vanilla K8s, store serving runtime configs in ConfigMaps with label selectors.

---

## F3: OpenShift Groups API (`user.openshift.io`)

**Frontend files** (6):
- `frontend/src/api/models/openShift.ts` -- `GroupModel`, `UserModel`
- `frontend/src/api/k8s/groups.ts`
- `frontend/src/concepts/modelRegistry/apiHooks/useModelRegistryServices.ts`
- `frontend/src/__mocks__/mockGroup.ts`
- `frontend/src/__mocks__/mockSelfSubjectRulesReview.ts`
- `frontend/src/app/navigation/__tests__/NavSection.spec.tsx`

**Backend files** (2):
- `backend/src/utils/userUtils.ts` -- user identity resolution chain
- `backend/src/utils/groupsUtils.ts` -- `getGroup()` with graceful fallback

**Package BFF files** (7):
- `packages/maas/bff/internal/constants/gvr.go` -- `GroupGvr`
- `packages/maas/bff/internal/models/groups.go`
- `packages/eval-hub/bff/internal/models/groups.go`
- `packages/automl/bff/internal/models/groups.go`
- `packages/autorag/bff/internal/models/groups.go`
- `packages/model-registry/upstream/bff/internal/models/groups.go`
- `packages/maas/bff/internal/api/subscription_handlers_test.go`

**Porting action**: Abstract behind `PlatformProvider.identity.listGroups()`. Backend already handles absence gracefully. On vanilla K8s, groups return empty or use RBAC-based alternative.

---

## F4: Thanos / openshift-monitoring

**Backend files** (5):
- `backend/src/utils/constants.ts` -- `THANOS_INSTANCE_NAME`, `THANOS_NAMESPACE`, `THANOS_RBAC_PORT`
- `backend/src/utils/directCallUtils.ts`
- `backend/src/utils/prometheusUtils.ts`
- `backend/src/routes/api/prometheus/index.ts`
- `backend/docs/overview.md`

**Package files** (7):
- `packages/observability/src/api/usePersesDashboards.ts`
- `packages/observability/src/utils/dashboardUtils.ts`
- `packages/observability/src/utils/__tests__/dashboardUtils.spec.ts`
- `packages/observability/setup/prometheus-data-source.yaml` -- hardcoded Thanos URL
- `packages/observability/docs/overview.md`
- `packages/observability/mock-data/import-mock-data.sh`
- `packages/observability/mock-data/README.md`

**Porting action**: Abstract behind `PlatformProvider.monitoring`. Replace hardcoded Thanos constants with configurable endpoint. Platform-openshift provides Thanos defaults; platform-kubernetes reads from env vars or config.

---

## F5: `config.openshift.io` CRDs

**Backend files** (1):
- `backend/src/plugins/kube.ts` -- reads `clusterversions.config.openshift.io` at startup

**Package files** (4 code, 3 docs):
- `packages/observability/src/api/models.ts` -- `ClusterVersionModel`, `InfrastructureModel`
- `packages/gen-ai/bff/internal/integrations/kubernetes/token_k8s_client.go` -- `ingresses.config.openshift.io`
- `packages/maas/bff/internal/helpers/k8s.go` -- `ingresses.config.openshift.io`
- `packages/maas/Makefile`, `README.md`, `CONTRIBUTING.md` (docs references)

**Porting action**: Abstract behind `PlatformProvider.info`. Provide cluster version, domain, provider via env vars or ConfigMap on vanilla K8s. Backend already handles absence with fallback to 'Unknown'.

---

## S6: `openshift.io/display-name` and `openshift.io/description` Annotations

**Total files**: 128 across frontend (56), backend (1), packages (68), manifests (3)

**Key definition points**:
- `frontend/src/k8sTypes.ts:60-63` -- `DisplayNameAnnotations` type
- `frontend/src/types.ts` -- `MetadataAnnotation` enum

**Porting action**: Abstract behind `PlatformProvider.annotations`. Feature code reads `platform.annotations.displayName` instead of hardcoding `'openshift.io/display-name'`. Most code already uses utility functions like `getDisplayNameFromK8sResource()` which can be updated in one place.

---

## F7: Console CRDs (`console.openshift.io`)

**Files**: 22 (mostly manifests)

**Code files** (3):
- `backend/src/utils/resourceUtils.ts` -- ConsoleLink + QuickStart watchers
- `frontend/src/__mocks__/mockQuickStarts.ts`
- `frontend/src/__mocks__/mockSelfSubjectRulesReview.ts`

**Porting action**: Make watchers conditional on CRD existence. Return empty arrays if CRDs don't exist. Low priority for inference UI.

---

## F8: Build / ImageStream APIs (`build.openshift.io`, `image.openshift.io`)

**Files**: 11

**Relevant only for**: Notebooks/BYON. **Not in inference UI scope.**

---

## Migration Plan: What Moves Where

### Into `packages/platform-openshift/`

| Current Location | What | Why |
|-----------------|------|-----|
| `frontend/src/api/models/openShift.ts` | All 9 OpenShift model definitions | Core platform models |
| `frontend/src/api/k8s/projects.ts` | Project CRUD operations | Namespace abstraction |
| `frontend/src/api/k8s/routes.ts` | Route CRUD operations | Routing abstraction |
| `frontend/src/api/k8s/templates.ts` | Template CRUD operations | Template abstraction |
| `frontend/src/api/k8s/groups.ts` | Group operations | Identity abstraction |
| `backend/src/utils/constants.ts` (Thanos section) | Monitoring constants | Monitoring abstraction |
| `backend/src/utils/groupsUtils.ts` | Group utilities | Identity abstraction |
| DSC/DSCI gating logic from `concepts/areas/` | Component detection | Capability abstraction |

### Into `packages/platform-core/` (interfaces only)

| Interface | Replaces |
|-----------|----------|
| `PlatformProvider` | Direct usage of OpenShift models |
| `NamespaceOperations` | `ProjectModel` / `ProjectRequestModel` usage |
| `RoutingOperations` | `RouteModel` usage |
| `IdentityOperations` | `UserModel` / `GroupModel` usage |
| `MonitoringOperations` | Hardcoded Thanos constants |
| `PlatformCapabilities` | DSC status checks |
| `TemplateOperations` | `TemplateModel` usage |
| `AnnotationConventions` | Hardcoded `openshift.io/*` annotations |

### Stays in host (cross-cutting K8s)

| Item | Reason |
|------|--------|
| `@openshift/dynamic-plugin-sdk[-utils]` | Not OpenShift-specific (generic K8s client) |
| Core K8s models (Pod, Secret, ConfigMap, etc.) | Standard K8s APIs |
| KServe/ServingRuntime models | CNCF standard, works on any K8s |
| SSAR/SelfSubjectReview utilities | Standard K8s authorization |
| K8s proxy (`backend/src/routes/api/k8s/`) | Generic pass-through |
