# Thin Page Deploy Checklist Design

## Why this exists

The `thin-page-triage` worktree is currently the cleanest deploy candidate for the site's search-quality cleanup.

The problem is not implementation readiness. The problem is deployment safety:

- the main repo worktree is heavily dirty and should not be used as the merge target right now
- the actual deployment configuration appears to live outside the repo in Cloudflare Pages settings
- the success condition is not just "build passed" but "the live sitemap and robots state actually changed"

That means the team needs a deployment execution document that is specific to this rollout.

## Options considered

### Option 1: Keep everything in `README.md`

Pros:

- lowest documentation overhead

Cons:

- mixes permanent project setup with one rollout's execution checklist
- harder to scan during release
- does not make the thin-page-specific acceptance criteria explicit

### Option 2: Add a dedicated operations checklist for the thin-page rollout

Pros:

- gives the release operator one focused document
- can reference the exact branch, verification commands, and live acceptance criteria
- keeps deployment actions separate from general project docs

Cons:

- adds one more operational document

### Option 3: Do not write anything and rely on terminal notes

Pros:

- fastest in the moment

Cons:

- fragile and easy to lose
- hard to hand off or repeat
- weak for deployment review or rollback analysis

## Recommended approach

Choose Option 2.

Create a dedicated deployment checklist in `docs/operations/` that treats `thin-page-triage` as the release candidate
and makes the post-deploy acceptance criteria explicit.

## Final design

### Document location

Create:

- `docs/operations/thin-page-deploy-checklist.md`

### Checklist sections

The document should be short and operational, not narrative-heavy. It should have four sections:

1. **Pre-deploy checks**
2. **Cloudflare Pages settings to confirm**
3. **Post-deploy verification commands**
4. **How to interpret the result**

### Pre-deploy checks

This section should state:

- deploy from `thin-page-triage`, not from the dirty local `main` worktree
- confirm the branch is clean
- confirm recent local verification already passed:
  - `npm run check`
  - `npm run build`

### Cloudflare Pages settings

This section should capture the known repo-backed deployment expectations:

- build command: `npm run build`
- output directory: `dist`
- Cloudflare adapter / Pages deployment model
- required environment variable baseline:
  - `PUBLIC_SITE_URL`
  - `PUBLIC_CONTACT_EMAIL`
- ad review-safe default posture:
  - `PUBLIC_ENABLE_ADS=false`

Because the exact Pages project settings are external to the repo, the checklist should tell the operator to confirm the
production branch or selected deployment source matches the intended release branch.

### Post-deploy verification

This section should tell the operator to run both commands:

- `npm run verify:live`
- `npm run verify:live:post-deploy`

It should also explain what the second command is specifically guarding:

- the 12 removed thin pages are gone from the live sitemap
- those URLs return `noindex,follow`
- representative retained pages remain indexable

### Result interpretation

This section should translate output into operator decisions:

- if `verify:live` fails, trust/ad-safety parity is not ready
- if `verify:live:post-deploy` fails because removed pages remain in sitemap or are still `index,follow`, then the thin
  page rollout is not fully live yet
- if both commands pass, the site is materially closer to a cleaner index surface and safer AdSense resubmission posture

### Baseline note

The document should capture the current known live baseline as of March 27, 2026:

- live sitemap count observed: `285`
- the 12 thin-page URLs were still present live before deployment

That note matters because it gives the operator a concrete before/after expectation.

## Success standard

This design is successful when a release operator can use one document to:

- avoid deploying from the wrong worktree
- verify the right Cloudflare Pages knobs
- run the correct post-deploy checks
- know how to interpret success versus partial rollout failure
