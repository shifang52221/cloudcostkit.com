# CloudWatch Alarms Cluster Role Separation Design

## Goal

Deepen the AWS CloudWatch alarms guide cluster so the pricing, estimate, and optimization pages perform clearly different editorial jobs instead of reading like three versions of the same alarm-count story.

Target pages:

- `src/pages/guides/aws-cloudwatch-alarms-pricing.astro`
- `src/pages/guides/aws-cloudwatch-alarms-estimate-alarm-count.astro`
- `src/pages/guides/aws-cloudwatch-alarms-cost-optimization.astro`

## Problem

The current CloudWatch alarms cluster is useful, but the page roles still overlap too much:

- the pricing page already teaches counting workflow and optimization direction instead of staying on bill boundaries
- the estimate page is the closest to the right job, but it still needs stronger role-setting language and a clearer handoff
- the optimization page re-explains counting drivers and inventory work instead of staying focused on production intervention

That overlap creates low-quality risk:

- all three pages revisit alarm-months, ephemeral environments, per-resource alarm growth, and duplicate packs with only moderate wording changes
- users still have to infer which page answers "what belongs in the bill", "how do I measure it", and "what do I change now"
- Google can read the trio as topic expansion without enough editorial separation

## Recommended Approach

Separate the cluster by job, not just by keyword.

### 1. Pricing page = bill-boundary page

This page should answer:

- what belongs inside the CloudWatch alarms bill
- which CloudWatch-native line items matter, such as standard alarm-months, high-resolution alarm-months, and composite alarm-months
- which adjacent costs should be tracked beside CloudWatch alarms rather than blended into it, such as SNS delivery, SMS/email, extra metrics, and dashboards

This page should feel like the "what exactly is part of the alarms bill?" page.

### 2. Estimate page = alarm-inventory measurement workflow page

This page should answer:

- how to turn CloudWatch inventory, IaC definitions, monitoring templates, ephemeral environments, and scaling multipliers into a defendable monthly alarm-month model
- how to separate stable baseline alarms from busy-month or PR-environment alarm growth
- when the count model is credible enough to hand off to pricing or optimization

This page should feel like the "show me how to count and defend the alarm-month model" page.

### 3. Optimization page = production intervention page

This page should answer:

- what to change once the team knows whether the dominant driver is stale alarm inventory, per-resource duplication, high-resolution overuse, or non-prod sprawl
- how to remove low-value alarms, reduce duplication, right-size resolution, and preserve operational coverage
- when not to optimize yet because the team still lacks a reliable alarm inventory split

This page should feel like the "what should we change in production now?" page.

## Concrete Content Moves

### Pricing page

- add explicit role-setting language that says this page defines what belongs inside the alarms bill before teams debate deletion or consolidation
- add a section that separates CloudWatch-native alarm charges from adjacent notification, metrics, and dashboard costs
- add "when this is not the right page" guidance that routes to estimate or optimization
- reduce embedded workflow and optimization language where possible

### Estimate page

- add explicit "alarm-inventory measurement workflow" positioning
- add an evidence-pack section for CloudWatch inventory, IaC, template expansion rules, ephemeral environments, and scaling multipliers
- strengthen baseline vs busy-month framing
- make the handoff explicit: return to pricing if bill scope is unclear, move to optimization if the inventory model is stable

### Optimization page

- add explicit "production intervention" positioning
- add a "do not optimize yet" section tied to unclear dominant drivers
- keep the page centered on alarm hygiene, duplication reduction, resolution discipline, and safe incident coverage
- add a change-control loop so teams validate savings without weakening on-call protection

## Success Criteria

- each page states its job in the alarms cluster clearly
- the three pages no longer feel interchangeable
- cross-links become directional rather than circular
- a regression test can detect the new role-separation language
- `npm test`, `npm run check`, and `npm run build` remain green
