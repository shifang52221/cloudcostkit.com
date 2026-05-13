# Fifth Page Quality Batch Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace generic caution language with page-specific validation guidance on three already-visible support pages without weakening their existing roles.

**Architecture:** Add regression coverage for more specific closing language, then make small copy adjustments to the selected pages while preserving their role-separation wording and routing behavior.

**Tech Stack:** Astro guide pages, Node test runner

---

### Task 1: Lock the de-templated caution language with tests

**Files:**
- Create: `tests/fifth-page-quality-batch.test.mjs`

**Step 1: Write the failing test**

Add assertions that the selected pages:
- no longer rely on generic `Educational use only` style closing language
- use more page-specific validation wording
- preserve current page roles

**Step 2: Run test to verify it fails**

Run: `node --test tests/fifth-page-quality-batch.test.mjs`
Expected: FAIL because the current pages still end with generic caution copy.

### Task 2: Apply the minimal page-specific caution improvements

**Files:**
- Modify: `src/pages/guides/cdn-costs.astro`
- Modify: `src/pages/guides/kubernetes-cost-calculator.astro`
- Modify: `src/pages/guides/s3-replication-cost.astro`

**Step 1: Replace generic closing language**

Use wording that matches the actual modeling risk on each page.

**Step 2: Keep routing and role intact**

Do not change each page's page-cluster responsibility.

### Task 3: Verify the batch

**Files:**
- Verify: `tests/fifth-page-quality-batch.test.mjs`
- Verify: relevant existing CDN, Kubernetes, and storage-role tests

**Step 1: Run targeted tests**

Run the new batch test with the role-separation tests that cover these pages.

**Step 2: Run broader checks**

Run:
- `npm test`
- `npm run check`
- `npm run build`

**Step 3: Report exact evidence**

Only claim the batch is ready after the new quality test and broader verification pass.
