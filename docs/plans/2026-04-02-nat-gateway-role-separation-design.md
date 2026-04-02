# NAT Gateway Role Separation Design

## Goal

Deepen the AWS NAT Gateway guide cluster so the pricing, estimate, and optimization pages perform clearly different editorial jobs instead of overlapping around the same cost story.

Target pages:

- `src/pages/guides/aws-nat-gateway-cost.astro`
- `src/pages/guides/aws-nat-gateway-estimate-gb-processed.astro`
- `src/pages/guides/aws-nat-gateway-cost-optimization.astro`

## Scope Decision

This round covers only the three core NAT Gateway pages. The comparison page `aws-nat-gateway-vs-vpc-endpoints-cost.astro`
stays out of scope for now so this round remains small, safe, and easy to verify.

## Problem

The current NAT Gateway cluster is useful, but the page roles still overlap:

- the pricing page already mixes bill boundaries, measurement workflow, and optimization setup
- the estimate page already repeats some budget framing that belongs on the pricing page
- the optimization page still re-explains the core cost model instead of staying centered on production interventions

That overlap creates the same quality risk we have been removing elsewhere:

- the three pages can look batch-produced because they keep circling back to the same gateway-hours, processed GB, retries, and endpoints story
- the reader has to infer where to start
- search engines can read the cluster as topic expansion without enough editorial separation

## Recommended Approach

Separate the cluster by job.

### 1. Pricing page = bill-boundary page

This page should answer:

- what belongs inside the NAT Gateway bill model
- what sits beside NAT Gateway as adjacent cost, such as cross-AZ transfer, internet egress, and private-connectivity alternatives
- when the real budgeting issue is gateway-hours versus processed GB

This page should feel like the "what exactly belongs inside the NAT Gateway bill?" page.

### 2. Estimate page = processed-GB measurement workflow page

This page should answer:

- how to turn NAT metrics, VPC Flow Logs, throughput charts, and traffic-source estimates into a defendable processed-GB model
- how to separate average periods from incident periods
- how to identify the top traffic sources behind processed GB

This page should feel like the "show me the measurement workflow" page.

### 3. Optimization page = production intervention page

This page should answer:

- what to change in production once the gateway-hours and processed-GB model is believable
- how to reduce NAT traffic safely through private paths, download control, retry control, and non-prod cleanup
- when not to optimize yet because the dominant NAT driver is still unclear

This page should feel like the "what do we change now?" page.

## Concrete Content Moves

### Pricing page

- add explicit role-setting language that says this is the NAT Gateway bill-boundary page
- add an "inside the bill vs beside the bill" section
- add directional handoffs to estimate and optimization
- reduce repeated measurement-workflow framing

### Estimate page

- add explicit "processed-GB measurement workflow" positioning
- add stronger evidence-pack guidance for metrics, flow logs, throughput charts, and traffic-source sanity checks
- add a handoff back to pricing if bill scope is unclear
- reduce repeated optimization framing

### Optimization page

- add explicit "production intervention" positioning
- add a warning not to optimize before the dominant NAT driver is known
- add a simple measure-change-remeasure loop
- keep the page focused on operational actions instead of restating the whole cost model

## Success Criteria

- each page states its role in the NAT Gateway cluster clearly
- the pricing, estimate, and optimization pages no longer feel interchangeable
- cross-links become directional instead of circular
- a regression test can detect the new role-separation language
- `npm test`, `npm run check`, and `npm run build` remain green
