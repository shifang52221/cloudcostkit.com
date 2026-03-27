# Thin Page Batch 1 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Reduce low-quality-site risk quickly by noindexing the two thinnest provider hub guides and the five narrowest helper estimator calculators, while keeping them usable inside the site.

**Architecture:** Extend guide and calculator layouts to accept an optional robots directive, apply `noindex,follow` only to the seven selected pages, and exclude those same routes from XML sitemap generation so indexing signals stay consistent.

**Tech Stack:** Astro, TypeScript config, Markdown docs

---

### Task 1: Add layout support for selective noindex

**Files:**
- Modify: `src/layouts/GuideLayout.astro`
- Modify: `src/layouts/CalculatorLayout.astro`

**Step 1: Add optional robots prop to guide layout**

Allow guide pages to pass an optional robots directive through to `BaseLayout`.

**Step 2: Add optional robots prop to calculator layout**

Allow calculator pages to pass an optional robots directive through to `BaseLayout`.

**Step 3: Verify no behavior change for pages that do not set robots**

Only pages that explicitly pass the prop should change.

### Task 2: Apply noindex to the first seven pages

**Files:**
- Modify: `src/pages/guides/gcp.astro`
- Modify: `src/pages/guides/azure.astro`
- Modify: `src/pages/calculators/aws-api-gateway-request-estimator.astro`
- Modify: `src/pages/calculators/aws-kms-request-estimator.astro`
- Modify: `src/pages/calculators/aws-sns-delivery-estimator.astro`
- Modify: `src/pages/calculators/aws-sqs-request-estimator.astro`
- Modify: `src/pages/calculators/aws-waf-request-estimator.astro`

**Step 1: Mark guide hubs as noindex**

Apply `robots="noindex,follow"` to:

- GCP guides hub
- Azure guides hub

**Step 2: Mark helper estimator calculators as noindex**

Apply `robots="noindex,follow"` to the five request/delivery estimator calculator pages.

**Step 3: Keep the pages otherwise intact**

Do not change core page content or routing behavior in this batch.

### Task 3: Remove noindex pages from sitemap output

**Files:**
- Modify: `astro.config.mjs`

**Step 1: Add batch-1 exclusion paths**

Update sitemap filtering so the seven noindex routes are omitted from XML sitemap output.

**Step 2: Keep existing sitemap exclusions intact**

Do not regress the current exclusions for 404, privacy, terms, or cookie notice pages.

### Task 4: Verify the batch

**Files:**
- Review: touched files

**Step 1: Run non-ASCII audit on touched files**

Run:

`rg -n "[^\x00-\x7F]" src/layouts/GuideLayout.astro src/layouts/CalculatorLayout.astro src/pages/guides/gcp.astro src/pages/guides/azure.astro src/pages/calculators/aws-api-gateway-request-estimator.astro src/pages/calculators/aws-kms-request-estimator.astro src/pages/calculators/aws-sns-delivery-estimator.astro src/pages/calculators/aws-sqs-request-estimator.astro src/pages/calculators/aws-waf-request-estimator.astro astro.config.mjs docs/plans/2026-03-27-thin-page-batch-1-design.md docs/plans/2026-03-27-thin-page-batch-1.md`

Expected: no matches.

**Step 2: Run project verification**

Run:

`npm run check`

Expected: pass with no new errors.

Run:

`npm run build`

Expected: successful production build.

### Task 5: Commit the batch

**Files:**
- Add: `docs/plans/2026-03-27-thin-page-batch-1-design.md`
- Add: `docs/plans/2026-03-27-thin-page-batch-1.md`
- Add: implementation file changes from Tasks 1-3

**Step 1: Commit batch docs and implementation**

```bash
git add docs/plans/2026-03-27-thin-page-batch-1-design.md docs/plans/2026-03-27-thin-page-batch-1.md astro.config.mjs src/layouts/GuideLayout.astro src/layouts/CalculatorLayout.astro src/pages/guides/gcp.astro src/pages/guides/azure.astro src/pages/calculators/aws-api-gateway-request-estimator.astro src/pages/calculators/aws-kms-request-estimator.astro src/pages/calculators/aws-sns-delivery-estimator.astro src/pages/calculators/aws-sqs-request-estimator.astro src/pages/calculators/aws-waf-request-estimator.astro
git commit -m "feat: noindex thin hubs and helper estimators"
```
