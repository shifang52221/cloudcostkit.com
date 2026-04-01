# CloudTrail Cluster Role Separation Design

## Goal

Deepen the AWS CloudTrail guide cluster so the pricing, estimate, and optimization pages perform clearly different editorial jobs instead of reading like three versions of the same audit-log cost story.

Target pages:

- `src/pages/guides/aws-cloudtrail-pricing.astro`
- `src/pages/guides/aws-cloudtrail-estimate-events.astro`
- `src/pages/guides/aws-cloudtrail-cost-optimization.astro`

## Problem

The current CloudTrail cluster is directionally useful, but the three pages still overlap too much:

- the pricing page teaches scope setting, rough estimation workflow, and downstream optimization concerns
- the estimate page explains event counting methods but does not establish itself strongly enough as the measurement workflow page
- the optimization page still re-explains measurement and event drivers instead of staying focused on production interventions

That overlap creates low-quality risk:

- all three pages revisit event volume, management vs data events, retries, and downstream log costs with only moderate wording changes
- the user still has to infer which page answers "what belongs in the bill", "how do I measure it", and "what do I change now"
- Google can read the trio as keyword expansion without enough editorial separation

## Recommended Approach

Separate the cluster by job, not just by topic.

### 1. Pricing page = bill-boundary page

This page should answer:

- what belongs inside the CloudTrail bill
- which CloudTrail-native line items matter, such as management events, data events, and insights
- which adjacent downstream costs should be tracked beside CloudTrail rather than blended into it, such as S3 retention, Athena scans, SIEM ingestion, and copied pipelines

This page should feel like the "what exactly is part of the CloudTrail bill?" page.

### 2. Estimate page = event measurement workflow page

This page should answer:

- how to turn CloudTrail Lake, S3 logs, Athena-style counting, eventCategory splits, eventSource analysis, and busy-week evidence into a defendable monthly event model
- how to separate baseline weeks from deploy spikes, automation churn, and incident retries
- when the event estimate is credible enough to use in pricing or optimization

This page should feel like the "show me how to measure and defend the event model" page.

### 3. Optimization page = production intervention page

This page should answer:

- what to change once the team knows whether the dominant cost driver is data event scope, management-event churn, or downstream storage and query waste
- how to tighten selectors, quiet noisy automation, and reduce downstream retention and scan waste without weakening required audit coverage
- when not to optimize yet because the team still lacks a reliable cost-driver split

This page should feel like the "what should we change in production now?" page.

## Concrete Content Moves

### Pricing page

- add explicit role-setting language that says this page defines what belongs inside the CloudTrail bill before teams argue about selectors or query reduction
- add a section that separates CloudTrail-native charges from downstream storage, scan, and SIEM costs that should be tracked beside the bill
- add "when this is not the right page" guidance that routes to estimate or optimization
- reduce embedded workflow language where possible

### Estimate page

- add explicit "event measurement workflow" positioning
- add an evidence-pack section for CloudTrail Lake, S3 logs, eventCategory splits, eventSource hotspots, deploy weeks, and incident windows
- strengthen baseline vs busy-week framing
- make the handoff explicit: go back to pricing if bill scope is unclear, move to optimization if the event model is stable

### Optimization page

- add explicit "production intervention" positioning
- add a "do not optimize yet" section tied to unclear dominant drivers
- keep the page centered on selector discipline, automation churn control, and downstream waste reduction
- add a change-control loop so teams validate savings without weakening audit obligations

## Success Criteria

- each page states its job in the CloudTrail cluster clearly
- the three pages no longer feel interchangeable
- cross-links become directional rather than circular
- a regression test can detect the new role-separation language
- `npm test`, `npm run check`, and `npm run build` remain green
