# Aurora Governance Design

## Problem

The database parent layer is already governed, but the Aurora cluster still behaves like a partially-governed extension of the older RDS family instead of a clean specialist set.

Current shape:

- `src/pages/guides/aws-aurora-pricing.astro` is useful, but it still reads like a general Aurora checklist instead of a clearly bounded Aurora bill anatomy page beneath the broader database parent
- `src/pages/guides/aws-aurora-serverless-v2-pricing.astro` explains ACU-hours well, but it does not yet clearly identify itself as the Aurora Serverless v2 capacity-shape page inside the broader Aurora decision tree
- `src/pages/guides/aws-rds-vs-aurora-cost.astro` already behaves like an engine comparison page, but it should be tightened so readers can tell when to stay in comparison mode versus when they still need Aurora bill anatomy or broader database budgeting first

This creates two quality risks:

- Aurora-related pages can still overlap around generic phrases like "Aurora pricing" and "RDS vs Aurora cost" instead of presenting a clear parent-plus-specialist hierarchy
- the governed `database-costs` parent loses clarity if Aurora-specific pages do not consistently route broader database-budget questions back upward

## Approved Direction

Use a database-parent-plus-Aurora-specialist split:

- `aws-aurora-pricing` becomes the Aurora bill anatomy page
- `aws-aurora-serverless-v2-pricing` becomes the Aurora Serverless v2 capacity-shape page
- `aws-rds-vs-aurora-cost` remains the engine-choice comparison page, but explicitly inside the Aurora/database hierarchy

The database parent should keep owning the broad database budgeting question:

- how compute, retention, backups, replicas, and network fit together in one stateful service budget
- when the next step is RDS bill boundaries, Aurora bill anatomy, Aurora serverless capacity shape, or engine comparison
- why readers should start from the broader database budget map before drilling into one Aurora billing path

The Aurora specialist pages should each own one narrower question:

- `aws-aurora-pricing`: what belongs inside the broad Aurora bill anatomy
- `aws-aurora-serverless-v2-pricing`: how ACU-hours, baseline, and peak capacity shape the Serverless v2 bill
- `aws-rds-vs-aurora-cost`: how to compare engine choices after workload assumptions are normalized

## Role Split

### `aws-aurora-pricing`

This page should explicitly identify itself as the Aurora bill anatomy page.

Its job is to:

- frame Aurora cost as compute, storage, backups, and workload-driven usage surfaces
- stay narrower than the database parent while remaining broader than the Serverless v2 specialist page
- route broader database-budget questions back to `database-costs`

### `aws-aurora-serverless-v2-pricing`

This page should explicitly identify itself as the Aurora Serverless v2 capacity-shape page.

Its job is to:

- focus on ACU-hours, baseline versus peak capacity, and the shape of serverless usage over time
- avoid reteaching the whole Aurora bill anatomy or the full database system budget
- route broader database-budget questions back to `database-costs`
- route broader Aurora bill-structure questions back to `aws-aurora-pricing`

### `aws-rds-vs-aurora-cost`

This page should keep its role as the engine-choice comparison page.

Its job is to:

- focus on normalized workload comparison between engine options
- avoid becoming a second generic Aurora pricing explainer or database parent page
- route broader database-budget questions back to `database-costs`
- route Aurora bill-structure questions back to `aws-aurora-pricing` when comparison is still premature

## Content Strategy

This round should apply the same governance pattern across all three pages:

1. strengthen the first-screen role statement so the page job is obvious immediately
2. add explicit routing back to `database-costs` when the broader database budget shape is still unclear
3. clarify that Serverless v2 is a narrower capacity-shape workflow beneath Aurora bill anatomy, not another generic Aurora pricing page
4. keep the comparison page in comparison mode instead of reteaching the whole Aurora bill anatomy

The goal is not more copy. The goal is cleaner hierarchy, less topic cannibalization, and stronger editorial distinctness.

## Regression Guard

Add a targeted regression test that verifies:

- `aws-aurora-pricing` declares itself as the Aurora bill anatomy page
- `aws-aurora-pricing` routes broader database-budget questions back to `database-costs`
- `aws-aurora-serverless-v2-pricing` declares itself as the Aurora Serverless v2 capacity-shape page
- `aws-aurora-serverless-v2-pricing` routes broader database-budget questions back to `database-costs`
- `aws-aurora-serverless-v2-pricing` routes broader Aurora bill-structure questions back to `aws-aurora-pricing`
- `aws-rds-vs-aurora-cost` still declares itself as the engine-choice comparison page
- `aws-rds-vs-aurora-cost` routes broader database-budget questions back to `database-costs`
- `aws-rds-vs-aurora-cost` routes premature Aurora bill-structure questions back to `aws-aurora-pricing`

The test should protect role separation rather than exact paragraph wording.

## Scope

Keep this round limited to:

- `src/pages/guides/aws-aurora-pricing.astro`
- `src/pages/guides/aws-aurora-serverless-v2-pricing.astro`
- `src/pages/guides/aws-rds-vs-aurora-cost.astro`
- `tests/aurora-governance.test.mjs`

Do not expand this round into backup-estimate pages, RDS bill-boundary pages, or networking transfer pages unless a direct blocker appears.

## Success Standard

This round is successful when:

- Aurora-related pages each own a distinct role under the governed database parent
- readers can tell when to stay in database budgeting, Aurora bill anatomy, Serverless v2 capacity modeling, or engine comparison mode
- the new regression test passes
- `npm run check` and `npm run build` still pass with only the accepted existing hints
