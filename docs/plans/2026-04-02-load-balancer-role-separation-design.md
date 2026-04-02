# Load Balancer Role Separation Design

## Goal

Deepen the AWS load balancer guide cluster so the pricing, estimate, and optimization pages perform clearly different editorial jobs, while the LCU/NLCU explainer becomes an explicit support page instead of a second estimate page.

Target pages:

- `src/pages/guides/aws-load-balancer-cost.astro`
- `src/pages/guides/aws-load-balancer-estimate-lcu.astro`
- `src/pages/guides/aws-load-balancer-cost-optimization.astro`
- `src/pages/guides/aws-load-balancer-lcu-explained.astro`

## Problem

The current load balancer cluster is useful, but the page roles still overlap:

- the pricing page explains too much of the measurement workflow
- the estimate page still repeats high-level billing orientation that belongs on the pricing page
- the optimization page re-explains cost drivers instead of staying focused on production interventions
- the LCU/NLCU explainer overlaps with the estimate page and can read like a second version of the same topic

That overlap creates the same low-quality risk we have been removing from other AWS clusters:

- the pages can look batch-produced because they revisit the same load balancer concepts with only moderate changes
- the user has to infer where to start instead of being routed by job
- Google can read the cluster as topical expansion without enough editorial separation

## Recommended Approach

Separate the cluster by job, then make the LCU/NLCU explainer an explicit support page.

### 1. Pricing page = bill-boundary page

This page should answer:

- what belongs inside the load balancer bill model
- what sits beside the load balancer bill, such as CDN offload, cross-AZ transfer, WAF, NAT, and downstream infrastructure costs
- when the real budgeting problem is load balancer count versus unit-hours

This page should feel like the "what exactly belongs inside the load balancer bill?" page.

### 2. Estimate page = measurement workflow page

This page should answer:

- how to turn CloudWatch metrics into a defendable units-per-hour model
- what evidence sources to use for connections, active sessions, bytes, and rule activity
- how to separate average hours from peak or incident hours

This page should feel like the "show me the measurement workflow" page.

### 3. Optimization page = production intervention page

This page should answer:

- what to change in production once the usage model is believable
- how to reduce LB-hours, unit-hours, bytes, connection churn, and retry-driven spikes safely
- when not to optimize yet because the dominant driver is still unknown

This page should feel like the "what do we change in production now?" page.

### 4. LCU/NLCU explained page = support explainer page

This page should answer:

- what capacity units represent conceptually
- why the same request rate can still produce very different unit-hours
- how the explainer supports the cluster without replacing the pricing or estimate pages

This page should feel like the "help me understand the unit model" page, not a core workflow page.

## Concrete Content Moves

### Pricing page

- add explicit role-setting language that says this is the load balancer bill-boundary page
- add an "inside the bill vs beside the bill" section
- add a directional handoff to the estimate and optimization pages
- reduce repeated measurement-workflow framing

### Estimate page

- add explicit "measurement workflow" positioning
- add clearer guidance for average, p95, and incident-hour modeling
- add a handoff back to pricing if bill scope is unclear
- reduce repeated conceptual explanation that belongs on the explainer page

### Optimization page

- add explicit "production intervention" positioning
- add a guardrail section about not optimizing before the dominant driver is known
- keep the page centered on operational changes and validation loops
- reduce repeated high-level billing explanation

### LCU/NLCU explained page

- add explicit support-page language
- explain that the page is not the bill-boundary page and not the measurement workflow page
- strengthen the directional links back to pricing and estimate
- keep the content conceptual rather than procedural

## Success Criteria

- each page states its cluster role clearly
- the pricing, estimate, and optimization pages no longer feel interchangeable
- the explainer page reads like support material, not a fourth competing guide
- cross-links become directional instead of circular
- a regression test can detect the new role-separation language
- `npm test`, `npm run check`, and `npm run build` remain green
