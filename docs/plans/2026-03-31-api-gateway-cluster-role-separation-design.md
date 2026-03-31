# API Gateway Cluster Role Separation Design

## Goal

Deepen the AWS API Gateway guide cluster so the pricing, estimate, and optimization pages perform clearly different editorial jobs, while the access-logs page becomes an explicit support page instead of a repeated side topic inside the main trio.

Target pages:

- `src/pages/guides/aws-api-gateway-pricing.astro`
- `src/pages/guides/aws-api-gateway-estimate-requests.astro`
- `src/pages/guides/aws-api-gateway-cost-optimization.astro`
- `src/pages/guides/aws-api-gateway-access-logs-cost.astro`

## Problem

The current API Gateway cluster is useful, but the page roles still overlap too much:

- the pricing page already teaches request-estimation workflow that belongs on the estimate page
- the estimate page already leans into budget framing and transfer explanation that belongs on the pricing page
- the optimization page repeats pricing-driver explanation instead of staying focused on production interventions
- the access-logs page exists, but the main trio still keeps partially retelling the same logging-cost story

That overlap creates a low-quality risk even when the content is factually reasonable:

- the three main pages can look batch-produced because they revisit requests, retries, transfer, and logs with only small structural changes
- the user has to infer where to start instead of being routed by job
- Google can read the cluster as topic expansion without enough editorial role separation

## Recommended Approach

Separate the cluster by job, then make access logs an explicit support page.

### 1. Pricing page = bill-boundary page

This page should answer:

- what belongs inside the API Gateway bill model
- what sits beside API Gateway as adjacent cost, such as transfer, logging, WAF, CDN, Lambda, or downstream system spend
- when request volume is the main budgeting issue versus when transfer or support line items deserve separate treatment

This page should feel like the "what exactly are we budgeting in API Gateway?" page.

### 2. Estimate page = request-measurement workflow page

This page should answer:

- how to turn metrics, logs, RPS, automated traffic, and retries into a defendable requests-per-month model
- what evidence sources to use for baseline traffic, non-user traffic, and incident spikes
- how to separate normal request demand from retry-driven or health-check-driven inflation

This page should feel like the "show me the request model and evidence path" page.

### 3. Optimization page = production intervention page

This page should answer:

- what to change in production once the request and transfer model is believable
- how to reduce request count, transferred bytes, and retry-driven spikes safely
- when not to optimize yet because the traffic model or dominant cost driver is still unclear

This page should feel like the "what do we change now?" page.

### 4. Access logs page = support cost page

This page should answer:

- how access logs become a separate logging-cost layer
- when API Gateway logging should be treated as its own cost surface instead of being blended into the API request model
- how the logs page supports the cluster without competing with the main pricing, estimate, and optimization pages

This page should feel like the "logging sidecar cost" page.

## Concrete Content Moves

### Pricing page

- add explicit role-setting language that says this is the API Gateway bill-boundary page
- add an "inside the API Gateway bill vs outside the API Gateway bill" section
- add a "when this is not the right page" section
- reduce request-measurement workflow framing where possible

### Estimate page

- add explicit "request measurement workflow" positioning
- add an evidence-pack section for metrics, logs, RPS, retries, and automated traffic
- make the handoff explicit: return to pricing if bill scope is unclear, move to optimization if the request model is credible
- reduce budgeting and optimization language that belongs on the other two pages

### Optimization page

- add explicit "production intervention" positioning
- add "do not optimize yet if these are still unclear" guardrails
- add a change-control loop for safe before and after measurement
- keep the page focused on operational actions instead of re-explaining pricing or request estimation

### Access logs page

- add explicit support-page language that says this is the logging-cost branch of the cluster
- explain when to treat logs as a separate CloudWatch or logging bill surface rather than as API Gateway core pricing
- add stronger handoff language back to pricing, estimate, and optimization so the logs page feels like a support page, not a fourth overlapping version of the same topic

## Success Criteria

- each main page states its role in the API Gateway cluster clearly
- the three main pages no longer feel interchangeable
- the access-logs page becomes a support page instead of a repeated half-topic inside the trio
- cross-links become directional rather than circular
- a regression test can detect the new role-separation language
- `npm test`, `npm run check`, and `npm run build` remain green
