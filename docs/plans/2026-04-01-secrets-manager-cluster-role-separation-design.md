# Secrets Manager Cluster Role Separation Design

## Goal

Deepen the AWS Secrets Manager guide cluster so the pricing, estimate, and optimization pages perform clearly different editorial jobs instead of reading like three versions of the same API-call story.

Target pages:

- `src/pages/guides/aws-secrets-manager-pricing.astro`
- `src/pages/guides/aws-secrets-manager-estimate-api-calls.astro`
- `src/pages/guides/aws-secrets-manager-cost-optimization.astro`

## Problem

The current Secrets Manager cluster is useful, but the page roles still overlap too much:

- the pricing page already teaches API-call estimation workflow in detail
- the estimate page still reads like a lighter version of the pricing page instead of a measurement guide
- the optimization page repeats the same request-driver explanation instead of staying focused on production intervention

That overlap creates a low-quality risk even when the content is factually fine:

- all three pages keep revisiting GetSecretValue volume, pod churn, cold starts, and retry loops with only mild wording changes
- the user has to infer where to start instead of being routed by job
- Google can read the cluster as topic expansion without enough editorial role separation

## Recommended Approach

Separate the cluster by job, not just by keyword.

### 1. Pricing page = bill-boundary page

This page should answer:

- what belongs inside the Secrets Manager bill
- which line items are core Secrets Manager spend, such as secret-months and API requests
- which adjacent items should be tracked beside Secrets Manager rather than folded into it, such as rotation helpers, downstream Lambda, database reconnect storms, or application incidents

This page should feel like the "what exactly is part of the Secrets Manager bill?" page.

### 2. Estimate page = API-call measurement workflow page

This page should answer:

- how to turn CloudTrail evidence, workload starts, cache refresh patterns, hot-path fetches, and retry behavior into a defendable monthly API-call model
- how to separate baseline calls from deploy-driven, cold-start-driven, or incident-driven spikes
- how to decide whether the estimate is strong enough to move into budgeting or optimization

This page should feel like the "show me the API-call evidence and model" page.

### 3. Optimization page = production intervention page

This page should answer:

- what to change once the team knows whether secret-months or API requests are the dominant driver
- how to reduce request volume safely without breaking rotation, refresh, or failure handling
- when not to optimize yet because the team still has not measured the real source of cost

This page should feel like the "what should we change in production now?" page.

## Concrete Content Moves

### Pricing page

- add explicit role-setting language that says this is the Secrets Manager bill-boundary page
- add a section that separates core Secrets Manager bill items from adjacent secret-delivery or rotation costs
- add "when this is not the right page" guidance that points traffic to estimate or optimization
- reduce step-by-step API-call modeling where possible

### Estimate page

- add explicit "API-call measurement workflow" positioning
- add an evidence-pack section for CloudTrail, process starts, cache refreshes, hot-path fetches, and retries
- add stronger language about separating baseline calls from deploy storms, cold starts, and retry loops
- make the handoff explicit: return to pricing if bill scope is unclear, move to optimization if the traffic model is credible

### Optimization page

- add explicit "production intervention" positioning
- add a "do not optimize yet" section tied to unclear dominant drivers
- add a before-and-after validation loop so caching and refresh changes are measured safely
- keep the page focused on operational actions instead of re-explaining pricing or estimation

## Success Criteria

- each page states its role in the Secrets Manager cluster clearly
- the three pages no longer feel interchangeable
- cross-links become directional rather than circular
- a regression test can detect the new role-separation language
- `npm test`, `npm run check`, and `npm run build` remain green
