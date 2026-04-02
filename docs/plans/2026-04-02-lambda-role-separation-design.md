# Lambda Role Separation Design

## Goal

Deepen the AWS Lambda guide cluster so the pricing, concurrency-and-cold-starts, and optimization pages perform clearly different editorial jobs instead of overlapping around the same serverless cost story.

Target pages:

- `src/pages/guides/aws-lambda-pricing.astro`
- `src/pages/guides/aws-lambda-concurrency-and-cold-starts.astro`
- `src/pages/guides/aws-lambda-cost-optimization.astro`

## Problem

The current Lambda cluster is useful, but the page roles still overlap:

- the pricing page already drifts into operational modeling and optimization hints
- the concurrency-and-cold-starts page can read like a second pricing page because it revisits cost framing without a strong role declaration
- the optimization page still re-explains the main billing model instead of staying centered on production interventions

That overlap creates the same low-quality risk we have been removing elsewhere:

- the three pages can look batch-produced because they revisit requests, duration, memory, retries, and provisioned concurrency with only moderate changes
- the user has to infer where to start
- search engines can read the cluster as topic expansion without enough editorial separation

## Recommended Approach

Separate the cluster by job, but do it in the shape this topic naturally wants rather than forcing a generic pricing/estimate/optimization trio.

### 1. Pricing page = bill-boundary page

This page should answer:

- what belongs inside the Lambda bill model
- what sits beside Lambda as adjacent cost, such as logs, networking, and downstream services
- when requests, GB-seconds, or provisioned concurrency deserve separate budget attention

This page should feel like the "what exactly belongs inside the Lambda bill?" page.

### 2. Concurrency and cold starts page = capacity-and-latency measurement page

This page should answer:

- how concurrency shape, cold starts, and provisioned concurrency change duration and baseline cost
- what to measure before deciding provisioned concurrency is worth it
- how to think about latency-sensitive paths versus background jobs

This page should feel like the "show me the capacity and latency trade-off model" page.

### 3. Optimization page = production intervention page

This page should answer:

- what to change once the dominant Lambda cost driver is believable
- how to reduce GB-seconds, retries, logging overhead, and unnecessary baseline concurrency cost safely
- when not to optimize yet because the real driver is still unclear

This page should feel like the "what do we change in production now?" page.

## Concrete Content Moves

### Pricing page

- add explicit role-setting language that says this is the Lambda bill-boundary page
- add an "inside the bill vs beside the bill" section
- add directional handoffs to the capacity-and-latency page and the optimization page
- reduce repeated operational workflow framing

### Concurrency and cold starts page

- add explicit "capacity-and-latency measurement page" positioning
- explain that the page is not the bill-boundary page and not the production intervention page
- strengthen the handoff to pricing if bill scope is unclear
- keep the page centered on measurement and trade-off logic rather than optimization checklists

### Optimization page

- add explicit "production intervention" positioning
- add a warning not to optimize before the dominant Lambda cost driver is known
- add a simple measure-change-remeasure loop
- keep the page focused on operational actions instead of restating the whole Lambda bill model

## Success Criteria

- each page states its role in the Lambda cluster clearly
- the pricing, concurrency-and-cold-starts, and optimization pages no longer feel interchangeable
- cross-links become directional instead of circular
- a regression test can detect the new role-separation language
- `npm test`, `npm run check`, and `npm run build` remain green
