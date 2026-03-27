# Thin Page Batch 3 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Noindex the weakest generic helper calculators and narrow the role of the more defensible support calculators so the calculator library looks more curated and less matrix-like.

**Architecture:** Move `compute-instance-cost-calculator` and `rps-to-monthly-requests-calculator` into support-only indexed status by applying `noindex,follow` and removing them from the sitemap. Keep `api-response-size-transfer-calculator` and `cdn-origin-egress-calculator` indexable, but rewrite their page framing and reduce their promotion from hub pages so stronger primary calculators own top-level intent.

**Tech Stack:** Astro, Markdown docs, TypeScript config, lightweight Node verification script

---

### Task 1: Demote the two weakest helper calculators

**Files:**
- Modify: `src/pages/calculators/compute-instance-cost-calculator.astro`
- Modify: `src/pages/calculators/rps-to-monthly-requests-calculator.astro`
- Modify: `astro.config.mjs`

**Step 1: Apply support-only indexing**

Add `robots="noindex,follow"` to the two calculator pages.

**Step 2: Align sitemap**

Exclude:

- `/calculators/compute-instance-cost-calculator/`
- `/calculators/rps-to-monthly-requests-calculator/`

from XML sitemap generation.

**Step 3: Clarify support role**

Adjust intro or surrounding copy so both pages read as support tools inside stronger workflows, not as broad primary destinations.

### Task 2: Narrow the two retained helper calculators

**Files:**
- Modify: `src/pages/calculators/api-response-size-transfer-calculator.astro`
- Modify: `src/pages/calculators/cdn-origin-egress-calculator.astro`

**Step 1: Rewrite page framing**

Make their role explicit:

- `api-response-size-transfer` is a transfer-estimation helper inside egress/API/CDN workflows
- `cdn-origin-egress` is an origin-side support tool inside CDN/cache-hit workflows

**Step 2: Reduce "primary tool" feel**

Adjust related links and CTA wording so these pages feel specialized rather than broad top-level destinations.

### Task 3: Reduce high-signal promotion from hub pages

**Files:**
- Modify: `src/pages/calculators/index.astro`
- Modify: `src/pages/methodology.astro`
- Modify: `src/pages/calculators/azure.astro`
- Modify: `src/pages/calculators/gcp.astro`

**Step 1: Remove hero or featured promotion of noindex helpers**

Replace prominent `RPS to monthly requests` and `Compute instance cost` CTAs/cards with stronger primary tools or guides.

**Step 2: Re-label retained helpers**

Where `api-response-size-transfer` still appears in major hub pages, describe it as a support estimator rather than a primary calculator.

### Task 4: Add a Batch 3 verification script

**Files:**
- Create: `scripts/verify-thin-page-batch3.mjs`

**Step 1: Verify noindex and sitemap**

Check that:

- `compute-instance-cost-calculator.astro` emits `robots="noindex,follow"`
- `rps-to-monthly-requests-calculator.astro` emits `robots="noindex,follow"`
- `astro.config.mjs` excludes both routes

**Step 2: Verify retained-tool role narrowing**

Check that:

- `api-response-size-transfer-calculator` contains support-tool framing
- `cdn-origin-egress-calculator` contains support-tool framing

**Step 3: Verify hub-page corrections**

Check that major hub pages no longer feature the two noindex helpers as prominent CTAs.

### Task 5: Verify the batch

**Files:**
- Review: touched files

**Step 1: Run non-ASCII audit on touched files**

Run:

`rg -n "[^\x00-\x7F]" astro.config.mjs src/pages/calculators/compute-instance-cost-calculator.astro src/pages/calculators/rps-to-monthly-requests-calculator.astro src/pages/calculators/api-response-size-transfer-calculator.astro src/pages/calculators/cdn-origin-egress-calculator.astro src/pages/calculators/index.astro src/pages/methodology.astro src/pages/calculators/azure.astro src/pages/calculators/gcp.astro scripts/verify-thin-page-batch3.mjs docs/plans/2026-03-27-thin-page-batch-3-design.md docs/plans/2026-03-27-thin-page-batch-3.md`

Expected: no matches.

**Step 2: Run batch verification**

Run:

`node scripts/verify-thin-page-batch3.mjs`

Expected: pass.

**Step 3: Run project verification**

Run:

`npm run check`

Expected: pass with no new errors.

Run:

`npm run build`

Expected: successful production build.

### Task 6: Commit the batch

**Files:**
- Add: `docs/plans/2026-03-27-thin-page-batch-3-design.md`
- Add: `docs/plans/2026-03-27-thin-page-batch-3.md`
- Add: `scripts/verify-thin-page-batch3.mjs`
- Modify: implementation files from Tasks 1-3

**Step 1: Commit batch 3**

```bash
git add docs/plans/2026-03-27-thin-page-batch-3-design.md docs/plans/2026-03-27-thin-page-batch-3.md scripts/verify-thin-page-batch3.mjs astro.config.mjs src/pages/calculators/compute-instance-cost-calculator.astro src/pages/calculators/rps-to-monthly-requests-calculator.astro src/pages/calculators/api-response-size-transfer-calculator.astro src/pages/calculators/cdn-origin-egress-calculator.astro src/pages/calculators/index.astro src/pages/methodology.astro src/pages/calculators/azure.astro src/pages/calculators/gcp.astro
git commit -m "feat: tighten helper calculator roles"
```
