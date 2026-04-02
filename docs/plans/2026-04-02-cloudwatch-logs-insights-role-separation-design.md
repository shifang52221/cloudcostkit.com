# CloudWatch Logs Insights Role Separation Design

## Goal

Deepen the CloudWatch Logs Insights guide cluster so the pricing, estimate, and optimization pages perform clearly different editorial jobs instead of repeating the same scan-cost story.

Target pages:

- `src/pages/guides/aws-cloudwatch-logs-insights-pricing.astro`
- `src/pages/guides/aws-cloudwatch-logs-insights-estimate-scanned-gb.astro`
- `src/pages/guides/aws-cloudwatch-logs-insights-cost-optimization.astro`

## Scope Decision

This round covers only the three CloudWatch Logs Insights pages. The broader `aws-cloudwatch-logs-pricing.astro` page
stays out of scope so the round remains small, safe, and easy to verify.

## Problem

The current Logs Insights cluster is useful, but the page roles still overlap:

- the pricing page already mixes bill framing, scan estimation workflow, and optimization hints
- the estimate page still repeats broad pricing orientation that belongs on the pricing page
- the optimization page re-explains scan cost basics instead of staying centered on operational interventions

That overlap creates the same low-quality risk we have been removing elsewhere:

- the pages can look batch-produced because they keep circling back to scanned GB, time range, dashboards, and incident scans with only moderate changes
- the reader has to infer where to start
- search engines can read the cluster as topic expansion without enough editorial separation

## Recommended Approach

Separate the cluster by job.

### 1. Pricing page = bill-boundary page

This page should answer:

- what Logs Insights is actually charging for
- what belongs inside the Logs Insights bill versus in adjacent logging costs
- when the real budgeting issue is routine scanning versus incident-driven scanning

This page should feel like the "what exactly belongs inside the Logs Insights bill?" page.

### 2. Estimate page = scanned-GB measurement workflow page

This page should answer:

- how to turn log volume, time range, query frequency, and incident behavior into a defendable scanned-GB model
- how to separate routine usage from incident usage
- how to identify the hidden query-frequency drivers behind scan spend

This page should feel like the "show me the measurement workflow" page.

### 3. Optimization page = production intervention page

This page should answer:

- what to change once the scan model is believable
- how to reduce scanned GB through query shape, dashboard control, log-group scope, and incident playbook discipline
- when not to optimize yet because the dominant scan pattern is still unclear

This page should feel like the "what do we change now?" page.

## Concrete Content Moves

### Pricing page

- add explicit role-setting language that says this is the Logs Insights bill-boundary page
- add an "inside the bill vs beside the bill" section
- add directional handoffs to estimate and optimization
- reduce repeated workflow framing

### Estimate page

- add explicit "scanned-GB measurement workflow" positioning
- add stronger evidence-pack guidance for log volume, time windows, dashboards, ad-hoc queries, and incident multipliers
- add a handoff back to pricing if bill scope is unclear
- reduce repeated optimization framing

### Optimization page

- add explicit "production intervention" positioning
- add a warning not to optimize before the dominant scan driver is known
- add a simple measure-change-remeasure loop
- keep the page focused on operational actions instead of restating the whole cost model

## Success Criteria

- each page states its role in the Logs Insights cluster clearly
- the pricing, estimate, and optimization pages no longer feel interchangeable
- cross-links become directional instead of circular
- a regression test can detect the new role-separation language
- `npm test`, `npm run check`, and `npm run build` remain green
