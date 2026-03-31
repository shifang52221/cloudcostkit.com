# KMS Cluster Role Separation Design

## Goal

Deepen the AWS KMS guide cluster so the pricing, estimate, and optimization pages perform clearly different editorial jobs instead of reading like three versions of the same request-volume story.

Target pages:

- `src/pages/guides/aws-kms-pricing.astro`
- `src/pages/guides/aws-kms-estimate-requests.astro`
- `src/pages/guides/aws-kms-cost-optimization.astro`

## Problem

The current KMS cluster is useful, but the page roles still overlap too much:

- the pricing page already teaches request-estimation logic that belongs on the estimate page
- the estimate page already leans into budgeting and optimization framing that belongs on the pricing and optimization pages
- the optimization page repeats foundational request-driver ideas instead of staying focused on production interventions

That overlap creates a low-quality risk even when the content is factually reasonable:

- the three pages can look batch-produced because they revisit request volume, top callers, CloudTrail attribution, and caching or batching with only small structural changes
- the user has to infer which page to start with instead of being routed by job
- Google can read the cluster as topic expansion without enough editorial role separation

## Recommended Approach

Separate the cluster by job, not just by keyword.

### 1. Pricing page = bill-boundary page

This page should answer:

- what belongs inside the KMS bill model
- what sits outside the KMS line item even if KMS is triggered under the hood
- when key-months matter versus when request volume is the real budgeting issue

This page should feel like the "what exactly are we budgeting?" page.

### 2. Estimate page = request-measurement workflow page

This page should answer:

- how to turn app requests, secret reads, object operations, and jobs into a defendable KMS request model
- what evidence sources to use for per-unit KMS calls
- how to separate baseline request behavior from incident or retry-heavy windows

This page should feel like the "show me the request model and evidence path" page.

### 3. Optimization page = production intervention page

This page should answer:

- what to change in production once the request model is believable
- how to reduce hot-path decrypts, data-key churn, retry amplification, and non-prod waste safely
- when not to optimize yet because the caller attribution or request model is still weak

This page should feel like the "what do we change now?" page.

## Concrete Content Moves

### Pricing page

- add explicit role-setting language that says this is the bill-boundary page
- add an "inside the KMS bill vs outside the KMS bill" section
- add a "when this is not the right page" section
- reduce request-estimation framing where possible

### Estimate page

- add explicit "request measurement workflow" positioning
- add an evidence-pack section for sources, units, ratios, and baseline versus incident windows
- make the handoff explicit: return to pricing if bill scope is unclear, move to optimization if the model is credible
- reduce optimization language that belongs on the optimization page

### Optimization page

- add explicit "production intervention" positioning
- add "do not optimize yet if these are still unclear" guardrails
- add a change-control loop for before and after measurement
- keep the page focused on operational actions instead of re-explaining pricing or request estimation

## Success Criteria

- each page states its role in the KMS cluster clearly
- the three pages no longer feel interchangeable
- cross-links become directional rather than circular
- a regression test can detect the new role-separation language
- `npm test`, `npm run check`, and `npm run build` remain green
