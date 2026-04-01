# RDS Cluster Role Separation Design

## Goal

Deepen the AWS RDS guide cluster so the pricing, backup-estimate, and optimization pages perform clearly different editorial jobs instead of reading like three versions of the same compute-plus-backups story.

Target pages:

- `src/pages/guides/aws-rds-pricing.astro`
- `src/pages/guides/aws-rds-backup-storage-gb-month-estimate.astro`
- `src/pages/guides/aws-rds-cost-optimization.astro`

## Problem

The current RDS cluster is useful, but the page roles still overlap too much:

- the pricing page already teaches backup workflow and optimization direction instead of staying on bill ownership
- the backup estimate page explains churn and retention well, but it still needs stronger role-setting language and a clearer handoff
- the optimization page re-explains line items and budget structure instead of staying focused on production intervention

That overlap creates low-quality risk:

- all three pages revisit compute, storage, backups, and I/O with only moderate wording changes
- users still have to infer which page answers "what belongs inside the RDS bill", "how do I measure backup storage", and "what should I change in production"
- Google can read the trio as topic expansion without enough editorial separation

## Recommended Approach

Separate the cluster by job, not by RDS terminology.

### 1. Pricing page = bill-boundary page

This page should answer:

- what belongs inside the RDS bill itself
- which cost buckets are RDS-native, such as instance-hours, DB storage, backup storage, I/O-priced storage exposure, Multi-AZ and replica capacity
- which adjacent costs should be tracked beside the RDS bill rather than blended into it, such as application-side retries, downstream ETL, monitoring overhead, and non-RDS transfer paths

This page should feel like the "what exactly is part of the RDS bill?" page.

### 2. Estimate page = backup-storage measurement workflow page

This page should answer:

- how to turn churn, retention, manual snapshot behavior, copy policies, and long-term retention windows into a defendable backup GB-month model
- how to separate steady-state backup exposure from migration or incident windows
- when the backup model is good enough to hand off to pricing or optimization

This page should feel like the "show me how to count and defend backup GB-month" page.

### 3. Optimization page = production intervention page

This page should answer:

- what to change once the team knows whether compute headroom, storage growth, backup retention, or I/O-heavy query patterns are the real RDS cost driver
- how to reduce RDS cost without breaking reliability, restore capability, or workload fit
- when not to optimize yet because the team still lacks a reliable driver split

This page should feel like the "what should we change in production now?" page.

## Concrete Content Moves

### Pricing page

- add explicit role-setting language that says this page defines what belongs inside the RDS bill before teams debate right-sizing, retention changes, or storage tuning
- add a section that separates RDS-native costs from adjacent monitoring, transfer, and application-side costs
- add "when this is not the right page" guidance that routes to estimate or optimization
- reduce embedded backup-workflow and optimization language where possible

### Estimate page

- add explicit "backup-storage measurement workflow" positioning
- add an evidence-pack section for churn, retention, snapshot behavior, snapshot copies, and long-term retention windows
- strengthen steady-state vs spike-window framing
- make the handoff explicit: return to pricing if bill scope is unclear, move to optimization if the backup model is stable

### Optimization page

- add explicit "production intervention" positioning
- add a "do not optimize yet" section tied to unclear dominant drivers
- organize interventions by right-sizing, storage-growth control, backup-policy tuning, and I/O cleanup
- add a change-control loop that protects restore readiness and performance SLOs

## Test Strategy

Create one focused regression test file:

- `tests/rds-cluster-role-separation.test.mjs`

The test should assert:

- pricing page language makes it the bill-boundary page
- estimate page language makes it the backup-storage measurement workflow page
- optimization page language makes it the production intervention page

This keeps the editorial separation durable after future edits.
