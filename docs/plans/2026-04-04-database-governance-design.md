# Database Governance Design

## Problem

The database guide family has solid component pages, but the hierarchy is still not explicit enough at the parent layer.

Current shape:

- `src/pages/guides/database-costs.astro` is useful, but it still reads like a broad overview rather than a firm database system budgeting parent page
- `src/pages/guides/aws-rds-pricing.astro` already behaves like a bill-boundary page, but it does not yet clearly route broader database-budget questions back to the database parent
- `src/pages/guides/aws-rds-backups-and-snapshots.astro` is a useful backup workflow page, but it does not yet clearly identify itself as a backup-retention workflow page inside a larger database budget hierarchy
- `src/pages/guides/aws-rds-vs-aurora-cost.astro` is a useful comparison page, but it does not yet clearly identify itself as the engine-choice comparison page inside the broader database budget map

This creates two quality risks:

- the parent-child hierarchy is still softer than the stronger governed clusters we already finished
- several database pages can still look like nearby variations on “RDS cost” instead of distinct editorial jobs

## Approved Direction

Use a parent-plus-specialist split:

- `database-costs` becomes the database system budgeting parent page
- `aws-rds-pricing` becomes the AWS RDS bill-boundary page
- `aws-rds-backups-and-snapshots` becomes the backup-retention workflow page
- `aws-rds-vs-aurora-cost` becomes the engine-choice comparison page

The parent should own the broad database budgeting question:

- how compute, storage growth, backups, retention, replication, and network fit together in one stateful service budget
- when the next step is provider bill boundaries, backup workflow, or engine comparison
- why database cost is not just “storage growth plus one instance”

The specialist pages should each own one narrower question:

- `aws-rds-pricing`: what belongs inside the RDS bill versus beside it
- `aws-rds-backups-and-snapshots`: how retention, churn, snapshots, and backup footprint should be measured and managed
- `aws-rds-vs-aurora-cost`: how to compare engine choices under the same workload assumptions

## Role Split

### `database-costs`

This page should explicitly identify itself as the database system budgeting parent page.

Its job is to:

- frame databases as always-on stateful systems with compute, retention, backups, replication, and network surfaces
- route readers into RDS bill-boundary, backup workflow, or engine comparison pages only after the broader database budget shape is clear
- stay broader than any one provider or engine decision

### `aws-rds-pricing`

This page should explicitly identify itself as the AWS RDS bill-boundary page.

Its job is to:

- explain what belongs inside the RDS bill and what should be tracked beside it
- stay narrower than the database parent and avoid reteaching the whole database operating budget
- route broader database-budget questions back to `database-costs`

### `aws-rds-backups-and-snapshots`

This page should explicitly identify itself as the backup-retention workflow page.

Its job is to:

- focus on retention, churn, manual snapshots, copied snapshots, and backup footprint behavior
- avoid becoming a second generic RDS pricing page
- route broader database-budget questions back to `database-costs`

### `aws-rds-vs-aurora-cost`

This page should explicitly identify itself as the engine-choice comparison page.

Its job is to:

- focus on workload normalization across compute, storage, retention, and peak scenarios
- avoid becoming a generic RDS pricing explainer or a backup workflow page
- route broader database-budget questions back to `database-costs`

## Content Strategy

This round should apply the same governance pattern across all four pages:

1. add or tighten the first-screen role statement
2. strengthen routing language about when the page is the correct entry point
3. reinforce the biggest budgeting mistake for that page's role
4. reduce overlap by keeping the parent system-wide and the child pages boundary-specific

The goal is not more words. The goal is clearer hierarchy, less topic cannibalization, and stronger originality.

## Regression Guard

Add a targeted regression test that verifies:

- `database-costs` declares itself as the database system budgeting parent page
- `aws-rds-pricing` declares itself as the AWS RDS bill-boundary page
- `aws-rds-backups-and-snapshots` declares itself as the backup-retention workflow page
- `aws-rds-vs-aurora-cost` declares itself as the engine-choice comparison page
- each specialist page routes broader database-budget questions back to `database-costs`

The test should protect role separation rather than exact paragraph wording.

## Scope

Keep this round limited to:

- `src/pages/guides/database-costs.astro`
- `src/pages/guides/aws-rds-pricing.astro`
- `src/pages/guides/aws-rds-backups-and-snapshots.astro`
- `src/pages/guides/aws-rds-vs-aurora-cost.astro`
- `tests/database-parent-governance.test.mjs`

Do not expand this batch into Aurora pricing, backup-storage estimate pages, or optimization pages unless a direct blocker appears.

## Success Standard

This round is successful when:

- `database-costs` clearly owns the database system-budgeting parent role
- each child page owns a distinct specialist role
- readers can tell when to stay on the parent versus when to move into a narrower RDS page
- the regression test passes
- `npm run check` and `npm run build` still pass with only the accepted existing hints
