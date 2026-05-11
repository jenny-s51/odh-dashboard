# App Shell Integration Process

Roadmap for taking the app shell from blank canvas to production distribution. Each phase describes what changes, what we need from other teams, and what's still being investigated.

---

## Phase 0 — Blank Canvas (current)

**Goal:** Prove the app shell boots with zero features and establish the scope of the OpenShift SDK challenge.

**What we're doing:**
- `distributions/base/` created as a new root-level workspace (not `packages/`)
- Webpack config set up as a standalone build (cloned from `frontend/config/`, stripped of Module Federation remotes, plugin discovery, Monaco, and SDK externals)
- Shell.tsx renders PatternFly Page chrome: Masthead with product name, empty sidebar, empty content area
- BFF stub server returns hardcoded user via `/api/status`
- ThemeContext (light/dark toggle) and ErrorBoundary copied and simplified from frontend
- No Redux, no OpenShift SDK, no Module Federation remotes, no feature code

**Parallel track — SDK coupling audit:**
- Catalog every `@openshift/dynamic-plugin-sdk` and `@openshift/dynamic-plugin-sdk-utils` usage in `packages/model-serving/`
- Categorize: API calls, type dependencies, SDK-managed state
- Output determines feasibility of direct extraction vs. Platform Provider abstraction scope

**Still in discovery phase:**
- Real authentication (stub user only)
- Plugin/feature loading
- Backend integration (stub only)
- Build profiles
- Deployment/operator manifests

**Validation:**
```
cd distributions/base && npm run start:dev
```
- Browser opens to a PF shell with empty sidebar and "No features loaded"
- Header shows product name + theme toggle + "dev-user"
- No console errors

---

## Phase 1 — First Feature Integration (model serving)

**Goal:** Register model serving as the first route in the shell and validate the extension system.

**What changes:**
- Define the extension point contract (route, nav item, required context)
- Register model serving as a static build-time import (no dynamic MF at this stage)
- Wire up the minimal context providers model serving needs (likely: AppContext, AreaContext, or a subset)
- Validate that model deployment flow works end-to-end in the shell

**What we need from other teams:**
- Serving team guidance on which model serving entry points to integrate first
- Agreement on what subset of the model serving package can run without the full dashboard context

**Integration friction to document:**
- Which SDK imports block compilation?
- Which context providers are required vs. optional?
- What backend endpoints does model serving call, and do they exist in the BFF?

**Open questions:**
- Should the nav hierarchy mirror RHOAI exactly (AI hub > Models > Deployments tab)? The POC currently mirrors it, but the inference UI may want a flatter or differently organized nav since it's a smaller surface area with fewer features. Needs team input.
- If model serving is the only feature shipping in 3.5, what should the Home page render? Does it make sense to have a separate Home, or should the shell land directly on the Models/Deployments view? Needs team input.

**Success criteria:**
- Model deployment list view renders in the shell
- At least one create/edit flow works
- Integration friction log published

---

## Phase 2 — Main BFF Integration

**Goal:** Replace the stub server with the main Go BFF.

**What changes:**
- Remove `server/stub.js`
- Point webpack dev proxy at the main BFF
- BFF acts as pass-through proxy with the same interface as Fastify — serving team endpoint calls don't change
- `/api/status` returns real user info from the BFF

**What we need:**
- Pewter/Guilherme: main BFF available with at least `/api/status` and k8s passthrough
- Monarch/Lucas: BFF onboarded to the repo and operator

**What this phase clarifies:**
- Real user detection
- K8s API passthrough
- Backend proxy routing for model serving endpoints

**Success criteria:**
- `npm run start:dev` boots the shell against the real BFF (no stub)
- User info comes from the cluster, not a hardcoded stub
- Model serving endpoints proxy correctly

---

## Phase 3 — Auth Integration

**Goal:** Real authentication flow in the shell.

**What changes:**
- Integrate with Kuadrant (platform team's auth solution)
- Azure as first cloud target
- Token passthrough via BFF
- Login/logout flow
- Session expiry handling

**What we need from other teams:**
- Platform team: Kuadrant spike completed, auth API available
- Agreement on token format and header conventions

**What this phase clarifies:**
- The stub user is replaced with a real auth flow
- Session management
- RBAC / access review

**Success criteria:**
- User can log in and see their real identity in the header
- Unauthorized users see an appropriate error
- Session expiry is handled gracefully

---

## Phase 4 — Build Profiles & Distribution Config

**Goal:** Support multiple product SKUs from a single codebase.

**What changes:**
- Build profiles determine which features ship (RHOAI, RH AI, XKS)
- Feature flags via AreaFlagsProvider (product-level config, not feature toggles)
- Dedicated distribution config (not the ODH dashboard config CRD)
- Manifest/operator support for the new distribution

**What we need from other teams:**
- Product: which features ship in which SKU
- Operator team: manifest support for the new distribution deployment

**Success criteria:**
- `npm run build -- --profile=rhai` produces a build with only RH AI features
- Different profiles produce meaningfully different bundles
- Config is minimal and specific to the distribution

---

## Phase 5 — Convergence (3.6)

**Goal:** Converge the app shell back onto the main dashboard architecture.

**What changes:**
- Shared shell between RHOAI and RH AI distributions
- Frontend code migrated out of `frontend/` into the distribution model
- Extension point system shared between distributions
- Single codebase, different distributions, same architecture

**Key constraints:**
- Must not break existing RHOAI dashboard during migration
- Serving team and other feature teams must be able to develop against either distribution
- Convergence must be incremental, not a big-bang switch

**Success criteria:**
- Both RHOAI and RH AI boot from distribution configs
- Feature teams can target a distribution without forking code
- `frontend/` is either deprecated or serves as a distribution itself
