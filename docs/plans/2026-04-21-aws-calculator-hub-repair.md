# AWS Calculator Hub Repair Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Repair the last live SEO issue on `/calculators/aws/` by removing its bad link target and restoring a valid indexed internal entry path.

**Architecture:** Keep the AWS calculators hub indexed, route it to indexed guide destinations instead of the noindex AWS guide router, and expose it from the main calculators index so the crawl graph has a stable indexed entry point.

**Tech Stack:** Astro pages, Node test runner, existing content regression tests

---

### Task 1: Lock the expected hub behavior with tests

**Files:**
- Create: `tests/aws-calculator-hub-repair.test.mjs`

**Step 1: Write the failing test**

Add assertions that:
- `/src/pages/calculators/index.astro` links to `/calculators/aws/`
- `/src/pages/calculators/aws.astro` does not link to `/guides/aws/`
- `/src/pages/calculators/aws.astro` links to indexed guide destinations for next-step guidance

**Step 2: Run test to verify it fails**

Run: `node --test tests/aws-calculator-hub-repair.test.mjs`
Expected: FAIL because the calculators index does not yet expose the AWS provider hub and the AWS calculators hub still links to `/guides/aws/`.

### Task 2: Apply the minimal content fix

**Files:**
- Modify: `src/pages/calculators/index.astro`
- Modify: `src/pages/calculators/aws.astro`

**Step 1: Add an indexed AWS hub entry**

Add an AWS card to the provider/unit hub section on `/calculators/` with copy that clearly explains why someone should enter through the AWS provider route.

**Step 2: Replace the noindex guide-router link**

Update the related-guides section on `/calculators/aws/` so it links to indexed guide destinations that match the AWS bill-shape paths already represented on the page.

**Step 3: Keep the implementation minimal**

Do not change unrelated calculator cards, noindex policy, sitemap rules, or provider hub behavior outside these two pages.

### Task 3: Verify locally and against live audit tooling

**Files:**
- Verify: `tests/aws-calculator-hub-repair.test.mjs`
- Verify: `tests/calculator-hub-entry.test.mjs`

**Step 1: Run targeted tests**

Run: `node --test tests/aws-calculator-hub-repair.test.mjs tests/calculator-hub-entry.test.mjs`
Expected: PASS

**Step 2: Run site validation relevant to the change**

Run: `npm run audit:seo`
Expected: the prior `/calculators/aws/` bad-link issue disappears; orphan risk should also clear once the indexed entry is present.

**Step 3: Report exact verification evidence**

Capture the new audit output folder and remaining issue count before claiming the fix is complete.
