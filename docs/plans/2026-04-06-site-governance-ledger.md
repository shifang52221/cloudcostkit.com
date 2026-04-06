# Site Governance Ledger

## Purpose

This ledger records the current governance state of `cloudcostkit.com` after the recent merged content-governance rounds. Its job is to separate:

- what is already merged into `origin/main`
- what should move into review-only mode instead of repeated editing
- what risk remains outside main
- what rules should govern the next round of work

This document exists so future work stops depending on chat memory and starts from a stable repo-level operating record.

## Current baseline

- Ledger date: 2026-04-06
- Current main baseline reviewed against: `origin/main` at `1809efb`
- Latest merged governance PR on main: `#78 request-boundary-governance`
- Guides currently in repo: about `200`
- Calculators currently in repo: about `79`
- Main worktree status at review time: clean

## Governance rounds already merged into main

The following rounds are confirmed merged into `origin/main` and should be treated as completed governance work, not open-ended editing targets:

1. `#65 transfer-boundary-overlap`
2. `#66 parent-guides-governance`
3. `#67 serverless-parent-governance`
4. `#68 observability-governance`
5. `#69 security-governance`
6. `#70 kubernetes-governance`
7. `#71 networking-governance`
8. `#72 storage-governance`
9. `#73 messaging-request-governance`
10. `#74 database-governance`
11. `#75 compute-governance`
12. `#76 s3-governance`
13. `#77 aurora-governance`
14. `#78 request-boundary-governance`

In addition, earlier `thin-page-triage` PRs were merged in multiple rounds and should be counted as already-completed overlap reduction work, especially across EBS, Fargate, ECS, EKS, generic Kubernetes, Kubernetes comparisons, and CDN-oriented clusters.

## Completed governance areas

### 1. Parent and hub structure

These areas have already moved beyond generic hub behavior and into governed parent-page roles:

- `parent-guides`
- `serverless-parent`
- topic parent structures for database, networking, storage, security, observability, and Kubernetes

Meaning:

- parent pages now own problem framing instead of weak directory behavior
- child pages are expected to solve narrower jobs beneath those parents
- parent pages should now be reviewed for clarity, not continuously rewritten

### 2. Core cloud topic clusters

These high-risk overlap areas have already received dedicated governance rounds:

- observability
- security
- Kubernetes
- networking
- storage
- database
- compute

Meaning:

- these topics have already had role separation work
- parent pages and child pages should not be treated as blank slates anymore
- future edits in these areas should be review-led and evidence-led, not exploratory rewriting

### 3. AWS sub-clusters already governed

These narrower AWS clusters have already been split into clearer roles:

- transfer boundary
- S3 cluster
- Aurora cluster
- earlier thin-page triage clusters such as EBS, Fargate, ECS, EKS, Lambda, load balancer, NAT gateway, and related comparison pages

Meaning:

- these clusters already have strong overlap-reduction work in main
- future work here should focus on verification, depth gaps, and search-performance feedback rather than fresh role invention

### 4. Request and routing cluster

`request-boundary-governance` is now merged in `#78`, covering:

- `src/pages/guides/requests-costs.astro`
- `src/pages/guides/request-based-pricing.astro`
- `src/pages/calculators/api-request-cost-calculator.astro`
- `src/pages/calculators/rps-to-monthly-requests-calculator.astro`

Meaning:

- request boundary ownership is now separate from request-fee pricing
- the API request calculator now clearly maps API call volume into billable requests
- the RPS helper now clearly feeds the API request calculator instead of pretending to be a final pricing page

## Problems already reduced by the merged rounds

The merged governance rounds have already reduced the following site-level risks:

- weak parent-page framing
- repeated or overlapping topic ownership
- support calculators behaving like thin standalone pages
- template-like clusters where multiple pages sounded too similar
- comparison, pricing, and explainer pages competing for the same search intent
- structural signals that can make the site look mass-produced to Google or AdSense review systems

This does not mean the site is "finished." It means the main structural remediation layer has already happened and should now be protected from chaotic rework.

## Areas that should move into review-only mode

The following areas should not be treated as open rewrite targets unless new evidence shows a concrete problem:

- parent-guides
- serverless-parent
- observability
- security
- Kubernetes
- networking
- storage
- database
- compute
- S3
- Aurora
- request boundary cluster

Review-only mode means:

- verify quality, depth, links, and intent alignment
- correct specific defects
- use search data to justify further edits
- avoid "rewrite because it might be better" cycles

## Remaining repo-level risk

### 1. One remote branch still not merged

At review time, the only remote branch not merged into `origin/main` is:

- `origin/seo-growth-governance`

### 2. `seo-growth-governance` is a mixed historical branch

This branch should **not** be merged as a whole.

Unmerged commits still visible on it:

- `21b1c22 feat: separate request boundary cluster roles`
- `c1794dc docs: plan request boundary overlap batch`
- `b344164 docs: add four week quality roadmap`
- `c47ca26 docs: add four week quality roadmap`
- `b3de3a2 docs: add round execution checklist`
- `1e98c7c docs: add page priority matrix`
- `fe07f54 docs: add seo-safe growth governance plan`

Problem:

- the request-boundary code work from that branch has already been separately merged through `#78`
- the old branch still contains that same history plus planning documents
- merging the whole branch would re-introduce mixed historical content and confuse the ledger

Rule:

- never merge `seo-growth-governance` directly
- if anything on it is still useful, extract the needed document or file into a fresh branch from latest `origin/main`

### 3. Planning documents remain useful but are not deployment work by default

The remaining unmerged files on `seo-growth-governance` are primarily planning assets:

- `docs/plans/2026-04-02-four-week-quality-roadmap.md`
- `docs/plans/2026-04-02-page-priority-matrix.md`
- `docs/plans/2026-04-02-round-execution-checklist.md`
- `docs/plans/2026-04-02-seo-safe-growth-governance-design.md`
- `docs/plans/2026-04-02-seo-safe-growth-governance.md`

These should be evaluated as governance assets, not mixed into feature or page-edit merges by accident.

## Operating rules for the next phase

### Rule 1. Main stays clean

- never do broad page editing directly in the main worktree
- use isolated worktrees for every new round
- keep main as the inspection and baseline branch

### Rule 2. One round, one merge

- each round should have a bounded scope
- one PR should correspond to one coherent problem cluster
- do not batch unrelated fixes into a single merge

### Rule 3. Review before rewrite

For already-governed areas:

- check whether the issue is structural, quality-related, or performance-related
- if the issue is not concrete, do not rewrite
- prefer evidence from search data, CTR patterns, crawl behavior, or visible quality defects

### Rule 4. Treat old mixed branches as extraction sources only

- `seo-growth-governance` is now an extraction source, not a merge candidate
- salvage only the documents or file groups that still matter
- create fresh branches from latest main for any extracted work

### Rule 5. Distinguish three work types

Future work should be labeled clearly as one of:

1. governance work
2. quality/depth enhancement work
3. SEO/operations planning work

Those work types should not be mixed casually.

## Recommended next moves

### Immediate

1. Keep `main` clean and unchanged.
2. Preserve this ledger as the working source of truth.
3. Do not merge `seo-growth-governance` directly.

### Short-term

1. Review whether the remaining SEO planning docs should be extracted into a clean documentation branch.
2. Use current search data to validate whether the newly governed clusters are now receiving traffic on the correct destination pages.
3. Move already-governed clusters into review mode instead of continued broad rewriting.

### What not to do

- do not reopen already-merged governance clusters without concrete evidence
- do not use branch count as a proxy for work left
- do not let planning docs accumulate in `main` without purpose
- do not mix review, remediation, and planning work into one uncontrolled local workspace again

## Final state assessment

The site is no longer in the earliest "thin-page chaos" stage. It is now in a post-governance consolidation stage:

- the core structure has been heavily remediated
- many high-risk topic clusters now have clearer roles
- the biggest remaining risk is operational confusion, not lack of edits

That means the next phase should prioritize:

- ledger discipline
- selective extraction of remaining useful branch assets
- search-data-driven follow-up
- controlled review over repeated rewriting
