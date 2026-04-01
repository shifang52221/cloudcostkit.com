# Route 53 Cluster Role Separation Design

## Goal

Deepen the AWS Route 53 guide cluster so the pricing, estimate, and optimization pages perform clearly different editorial jobs instead of reading like three versions of the same DNS query story.

Target pages:

- `src/pages/guides/aws-route-53-pricing.astro`
- `src/pages/guides/aws-route-53-estimate-dns-queries.astro`
- `src/pages/guides/aws-route-53-cost-optimization.astro`

## Problem

The current Route 53 cluster is useful, but the page roles still overlap too much:

- the pricing page already spends too much time teaching DNS query estimation workflow
- the estimate page still reads like a lighter version of the pricing page instead of a measurement guide
- the optimization page repeats explanatory cost-driver material instead of staying focused on production interventions

That overlap creates a low-quality risk even when the content is directionally correct:

- all three pages revisit TTL, retries, DNS spikes, and health checks with only mild wording differences
- the user has to infer where to start rather than being routed by job
- Google can read the cluster as topic expansion without enough editorial role separation

## Recommended Approach

Separate the cluster by job, not just by keyword.

### 1. Pricing page = bill-boundary page

This page should answer:

- what belongs inside the Route 53 bill model
- which line items are core Route 53 spend, such as hosted zones, DNS queries, and health checks
- which adjacent items should be tracked beside Route 53 rather than folded into the DNS bill, such as resolver-layer work, CDN behavior, or downstream incident costs

This page should feel like the "what exactly is part of the Route 53 bill?" page.

### 2. Estimate page = DNS measurement workflow page

This page should answer:

- how to turn authoritative query metrics, query logs, resolver evidence, TTL posture, and retry behavior into a defendable monthly query model
- how to separate baseline traffic from retry-driven, failover-driven, or NXDOMAIN-driven spikes
- how to decide whether the estimate is strong enough to move into budgeting or optimization

This page should feel like the "show me the DNS evidence and traffic model" page.

### 3. Optimization page = production intervention page

This page should answer:

- what to change once the team knows whether queries, zones, or health checks are the dominant cost driver
- how to reduce unnecessary DNS demand without breaking failover, rollout, or discovery behavior
- when not to optimize yet because the team still has not measured the real source of Route 53 spend

This page should feel like the "what should we change in production now?" page.

## Concrete Content Moves

### Pricing page

- add explicit role-setting language that says this is the Route 53 bill-boundary page
- add a section that separates core Route 53 bill items from adjacent DNS or reliability costs
- add "when this is not the right page" guidance that points traffic to estimate or optimization
- reduce step-by-step measurement workflow where possible

### Estimate page

- add explicit "DNS measurement workflow" positioning
- add an evidence-pack section for authoritative metrics, logs, resolver behavior, TTL posture, and incident windows
- add stronger language about separating baseline queries from retry storms, failover events, and NXDOMAIN bursts
- make the handoff explicit: return to pricing if bill scope is unclear, move to optimization if the traffic model is credible

### Optimization page

- add explicit "production intervention" positioning
- add a "do not optimize yet" section tied to unclear dominant cost drivers
- add a before-and-after validation loop so TTL or resolver changes are measured safely
- keep the page focused on operational actions instead of re-explaining pricing or estimation

## Success Criteria

- each page states its role in the Route 53 cluster clearly
- the three pages no longer feel interchangeable
- cross-links become directional rather than circular
- a regression test can detect the new role-separation language
- `npm test`, `npm run check`, and `npm run build` remain green
