# CloudWatch Metrics Cluster Role Separation Design

## Goal

Deepen the AWS CloudWatch metrics guide cluster so the pricing, estimate, and optimization pages perform clearly different editorial jobs instead of reading like three versions of the same custom-metric sprawl story.

Target pages:

- `src/pages/guides/aws-cloudwatch-metrics-pricing.astro`
- `src/pages/guides/aws-cloudwatch-metrics-estimate-custom-metrics.astro`
- `src/pages/guides/aws-cloudwatch-metrics-cost-optimization.astro`

## Problem

The current CloudWatch metrics cluster is useful, but the page roles still overlap too much:

- the pricing page already teaches a full modeling workflow and optimization direction instead of staying on bill boundaries
- the custom-metrics estimate page is useful, but it still needs stronger role-setting language and a clearer handoff
- the optimization page re-explains metric drivers and counting logic instead of staying focused on production intervention

That overlap creates low-quality risk:

- all three pages revisit time series, cardinality, API polling, and dashboard duplication with only moderate wording changes
- users still have to infer which page answers "what belongs in the bill", "how do I measure it", and "what do I change now"
- Google can read the trio as topic expansion without enough editorial separation

## Recommended Approach

Separate the cluster by job, not just by keyword.

### 1. Pricing page = bill-boundary page

This page should answer:

- what belongs inside the CloudWatch metrics bill
- which CloudWatch-native line items matter, such as custom metrics, high-resolution metrics, metrics API requests, and dashboards
- which adjacent costs should be tracked beside CloudWatch metrics rather than blended into it, such as alarms built on the metrics, external polling tools, and extra observability systems

This page should feel like the "what exactly is part of the metrics bill?" page.

### 2. Estimate page = time-series measurement workflow page

This page should answer:

- how to turn CloudWatch inventory, instrumentation config, exporter behavior, dimension combinations, and growth multipliers into a defendable active time-series model
- how to separate stable baseline series from busy-month or growth-driven series expansion
- when the count model is credible enough to hand off to pricing or optimization

This page should feel like the "show me how to count and defend active time series" page.

### 3. Optimization page = production intervention page

This page should answer:

- what to change once the team knows whether the dominant driver is high-cardinality dimensions, duplicated exporters, high-resolution overuse, or metrics API polling
- how to reduce metric sprawl without weakening incident detection
- when not to optimize yet because the team still lacks a reliable driver split

This page should feel like the "what should we change in production now?" page.

## Concrete Content Moves

### Pricing page

- add explicit role-setting language that says this page defines what belongs inside the metrics bill before teams debate cardinality cleanup or polling reduction
- add a section that separates CloudWatch-native metric charges from adjacent alarm, dashboard, and external polling costs
- add "when this is not the right page" guidance that routes to estimate or optimization
- reduce embedded workflow and optimization language where possible

### Estimate page

- add explicit "time-series measurement workflow" positioning
- add an evidence-pack section for CloudWatch inventory, instrumentation config, exporters, dimensions, and growth multipliers
- strengthen baseline vs growth-window framing
- make the handoff explicit: return to pricing if bill scope is unclear, move to optimization if the series model is stable

### Optimization page

- add explicit "production intervention" positioning
- add a "do not optimize yet" section tied to unclear dominant drivers
- keep the page centered on cardinality control, exporter dedupe, resolution policy, and polling discipline
- add a change-control loop so teams validate savings without weakening operational visibility

## Success Criteria

- each page states its job in the metrics cluster clearly
- the three pages no longer feel interchangeable
- cross-links become directional rather than circular
- a regression test can detect the new role-separation language
- `npm test`, `npm run check`, and `npm run build` remain green
