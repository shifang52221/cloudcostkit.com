# SSM Parameter Store Cluster Role Separation Design

## Goal

Deepen the AWS SSM Parameter Store guide cluster so the pricing, estimate, and optimization pages perform clearly different editorial jobs instead of reading like three versions of the same request-volume story.

Target pages:

- `src/pages/guides/aws-ssm-parameter-store-pricing.astro`
- `src/pages/guides/aws-ssm-parameter-store-estimate-api-calls.astro`
- `src/pages/guides/aws-ssm-parameter-store-cost-optimization.astro`

## Problem

The current Parameter Store cluster is useful, but the page roles still overlap too much:

- the pricing page already teaches detailed request-estimation workflow and optimization logic
- the estimate page still reads like a lighter version of the pricing page instead of a measurement guide
- the optimization page repeats request-driver explanation instead of staying focused on production intervention

That overlap creates a low-quality risk even when the content is directionally correct:

- all three pages revisit GetParameter volume, deploy churn, per-request lookups, TTL refreshes, and retries with only mild wording changes
- the user has to infer where to start instead of being routed by job
- Google can read the cluster as topic expansion without enough editorial role separation

## Recommended Approach

Separate the cluster by job, not just by keyword.

### 1. Pricing page = bill-boundary page

This page should answer:

- what belongs inside the Parameter Store bill
- which line items are core Parameter Store spend, such as advanced parameter-month charges and API requests
- which adjacent items should be tracked beside Parameter Store rather than folded into it, such as app polling behavior, deploy churn, or Secrets Manager-style secret handling

This page should feel like the "what exactly is part of the Parameter Store bill?" page.

### 2. Estimate page = API-call measurement workflow page

This page should answer:

- how to turn CloudTrail evidence, startup counts, refresh TTL, polling loops, batch-read behavior, and retry patterns into a defendable monthly API-call model
- how to separate baseline calls from deploy-driven, refresh-driven, or incident-driven spikes
- how to decide whether the estimate is strong enough to move into budgeting or optimization

This page should feel like the "show me the API-call evidence and model" page.

### 3. Optimization page = production intervention page

This page should answer:

- what to change once the team knows whether advanced parameter inventory or API requests are the dominant driver
- how to reduce request volume safely without breaking config freshness, deploy reloads, or recovery behavior
- when not to optimize yet because the team still has not measured the real source of cost

This page should feel like the "what should we change in production now?" page.

## Concrete Content Moves

### Pricing page

- add explicit role-setting language that says this is the Parameter Store bill-boundary page
- add a section that separates core Parameter Store bill items from adjacent polling, deploy, or secret-management costs
- add "when this is not the right page" guidance that points traffic to estimate or optimization
- reduce step-by-step request-model math where possible

### Estimate page

- add explicit "API-call measurement workflow" positioning
- add an evidence-pack section for CloudTrail, startup counts, refresh TTL, batch-read behavior, polling, and retries
- add stronger language about separating baseline calls from deploy waves, churn spikes, and retry storms
- make the handoff explicit: return to pricing if bill scope is unclear, move to optimization if the request model is credible

### Optimization page

- add explicit "production intervention" positioning
- add a "do not optimize yet" section tied to unclear dominant drivers
- add a before-and-after validation loop so caching and refresh changes are measured safely
- keep the page focused on operational actions instead of re-explaining pricing or estimation

## Success Criteria

- each page states its role in the Parameter Store cluster clearly
- the three pages no longer feel interchangeable
- cross-links become directional rather than circular
- a regression test can detect the new role-separation language
- `npm test`, `npm run check`, and `npm run build` remain green
