# Fourth Page Quality Batch Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Improve snippet quality and first-screen clarity on four already-visible calculator/support pages without weakening their existing roles.

**Architecture:** Add regression coverage for sharper calculator/support framing, then make small description and opening-copy improvements to the selected pages while preserving current structure and related-link behavior.

**Tech Stack:** Astro pages, Node test runner

---

### Task 1: Lock the stronger framing with tests

**Files:**
- Create: `tests/fourth-page-quality-batch.test.mjs`

**Step 1: Write the failing test**

Add assertions that the selected pages:
- state their main bill-shape split earlier
- keep richer description language
- preserve the current page role

**Step 2: Run test to verify it fails**

Run: `node --test tests/fourth-page-quality-batch.test.mjs`
Expected: FAIL because the current pages are useful but still not explicit enough about the first modeling decision.

### Task 2: Apply the minimal opening and description improvements

**Files:**
- Modify: `src/pages/calculators/object-storage-cost-calculator.astro`
- Modify: `src/pages/calculators/log-cost-calculator.astro`
- Modify: `src/pages/calculators/storage-replication-cost-calculator.astro`
- Modify: `src/pages/guides/aws-s3-glacier-pricing.astro`

**Step 1: Strengthen search-summary promise**

Improve `const description` so it names the core cost split more explicitly and avoids generic calculator phrasing.

**Step 2: Strengthen first-screen promise**

State what kind of bill the page helps the reader separate before expanding into the workflow.

**Step 3: Preserve page role**

Do not blur calculators into broad guides or the Glacier pricing guide into estimate/optimization pages.

### Task 3: Verify the batch

**Files:**
- Verify: `tests/fourth-page-quality-batch.test.mjs`
- Verify: relevant existing description and cluster-role tests

**Step 1: Run targeted tests**

Run the new batch test with the relevant calculator description and Glacier role-separation tests.

**Step 2: Run broader checks**

Run:
- `npm test`
- `npm run check`
- `npm run build`

**Step 3: Report exact evidence**

Only claim the batch is ready after the new page-quality test and broader verification pass.
