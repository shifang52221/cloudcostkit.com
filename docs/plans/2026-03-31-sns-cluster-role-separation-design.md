# SNS Cluster Role Separation Design

## Goal

Deepen the AWS SNS guide cluster so the pricing, estimate, and optimization pages perform clearly different editorial jobs instead of reading like three versions of the same publish and delivery story.

Target pages:

- `src/pages/guides/aws-sns-pricing.astro`
- `src/pages/guides/aws-sns-estimate-deliveries.astro`
- `src/pages/guides/aws-sns-cost-optimization.astro`

## Problem

The current SNS cluster is useful, but the page roles still overlap too much:

- the pricing page already teaches delivery-estimation logic that belongs on the estimate page
- the estimate page already leans into budgeting and optimization framing that belongs on the pricing and optimization pages
- the optimization page repeats foundational delivery-driver ideas instead of staying focused on production interventions

That overlap creates a low-quality risk even when the content is factually reasonable:

- the three pages can look batch-produced because they revisit publishes, deliveries, fan-out, retries, and incident spikes with only small structural changes
- the user has to infer which page to start with instead of being routed by job
- Google can read the cluster as topic expansion without enough editorial role separation

## Recommended Approach

Separate the cluster by job, not just by keyword.

### 1. Pricing page = bill-boundary page

This page should answer:

- what belongs inside the SNS bill model
- what sits outside the SNS line item even if SNS fan-out triggers downstream work
- when publishes matter versus when deliveries, fan-out, and retries are the real budgeting issue

This page should feel like the "what exactly are we budgeting?" page.

### 2. Estimate page = delivery-measurement workflow page

This page should answer:

- how to turn publishes, matched subscribers, filter match rate, and retry factor into a defendable delivery model
- what evidence sources to use for publishes, delivery attempts, and incident windows
- how to separate baseline fan-out from alert-storm or failure-driven spikes

This page should feel like the "show me the delivery model and evidence path" page.

### 3. Optimization page = production intervention page

This page should answer:

- what to change in production once the delivery model is believable
- how to reduce fan-out, duplicates, retries, and alert storms safely
- when not to optimize yet because the topic design or delivery model is still weak

This page should feel like the "what do we change now?" page.

## Concrete Content Moves

### Pricing page

- add explicit role-setting language that says this is the bill-boundary page
- add an "inside the SNS bill vs outside the SNS bill" section
- add a "when this is not the right page" section
- reduce delivery-estimation framing where possible

### Estimate page

- add explicit "delivery measurement workflow" positioning
- add an evidence-pack section for publishes, matched fan-out, filter match rate, and retry windows
- make the handoff explicit: return to pricing if bill scope is unclear, move to optimization if the model is credible
- reduce optimization language that belongs on the optimization page

### Optimization page

- add explicit "production intervention" positioning
- add "do not optimize yet if these are still unclear" guardrails
- add a change-control loop for before and after measurement
- keep the page focused on operational actions instead of re-explaining pricing or delivery estimation

## Success Criteria

- each page states its role in the SNS cluster clearly
- the three pages no longer feel interchangeable
- cross-links become directional rather than circular
- a regression test can detect the new role-separation language
- `npm test`, `npm run check`, and `npm run build` remain green
