# VPC Endpoints Cluster Role Separation Design

## Goal

Deepen the AWS VPC endpoints guide cluster so the pricing, estimate, and optimization pages perform clearly different editorial jobs instead of reading like three versions of the same endpoint-hours and GB story.

Target pages:

- `src/pages/guides/aws-vpc-endpoints-pricing.astro`
- `src/pages/guides/aws-vpc-endpoints-estimate-hours-and-gb.astro`
- `src/pages/guides/aws-vpc-endpoints-cost-optimization.astro`

## Problem

The current VPC endpoints cluster is useful, but the page roles still overlap too much:

- the pricing page already teaches some hours and GB scenario work that belongs on the estimate page
- the estimate page already leans into break-even and decision framing that belongs on the pricing page
- the optimization page repeats foundational endpoint-hours, GB, and transfer-model ideas instead of staying focused on production interventions

That overlap creates a low-quality risk even when the content is factually reasonable:

- the three pages can look batch-produced because they revisit endpoint-hours, GB processed, NAT comparison, and transfer path issues with only small changes in order
- the user has to infer which page to start with instead of being routed by job
- Google can read the cluster as topic expansion without enough editorial role separation

## Recommended Approach

Separate the cluster by job, not just by keyword.

### 1. Pricing page = bill-boundary page

This page should answer:

- what belongs inside the endpoint bill model
- what sits outside the endpoint line item but still affects the total architecture cost
- when interface endpoint hours are the main budget issue versus when routing or transfer path changes dominate

This page should feel like the "what exactly are we budgeting?" page.

### 2. Estimate page = input-measurement workflow page

This page should answer:

- how to turn endpoint inventory, AZ coverage, active hours, and GB processed into a defendable input model
- what evidence sources to use for always-on and ephemeral environments
- how to separate steady-state traffic from migration spikes, image pulls, or one-time bursts

This page should feel like the "show me the input model and evidence path" page.

### 3. Optimization page = production intervention page

This page should answer:

- what to change in production once the hours and GB model is believable
- how to reduce endpoint count, AZ multiplier, and path waste safely
- when not to optimize yet because the inventory, locality, or traffic model is still weak

This page should feel like the "what do we change now?" page.

## Concrete Content Moves

### Pricing page

- add explicit role-setting language that says this is the bill-boundary page
- add an "inside the endpoint bill vs outside the endpoint bill" section
- add a "when this is not the right page" section
- reduce estimate-style measurement framing where possible

### Estimate page

- add explicit "input measurement workflow" positioning
- add an evidence-pack section for endpoint inventory, AZ coverage, hours, and GB sources
- make the handoff explicit: return to pricing if bill scope is unclear, move to optimization if the model is credible
- reduce break-even framing that belongs on the pricing page

### Optimization page

- add explicit "production intervention" positioning
- add "do not optimize yet if these are still unclear" guardrails
- add a change-control loop for before/after measurement
- keep the page focused on operational actions instead of re-explaining pricing or input estimation

## Success Criteria

- each page states its role in the VPC endpoints cluster clearly
- the three pages no longer feel interchangeable
- cross-links become directional rather than circular
- a regression test can detect the new role-separation language
- `npm test`, `npm run check`, and `npm run build` remain green
