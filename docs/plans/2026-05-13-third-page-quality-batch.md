# Third Page Quality Batch Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Improve first-screen clarity and reduce template feel on four already-visible guide pages without weakening their existing role separation.

**Architecture:** Add regression coverage for sharper opening framing, then make small copy improvements to the selected pages and verify the relevant role-separation tests still pass.

**Tech Stack:** Astro guide pages, Node test runner

---

### Task 1: Lock the stronger entry framing with tests

**Files:**
- Create: `tests/third-page-quality-batch.test.mjs`

**Step 1: Write the failing test**

Add assertions that the selected pages:
- state their key decision or bill-shape split earlier
- feel more diagnostic from the first screen
- preserve their current page roles

**Step 2: Run test to verify it fails**

Run: `node --test tests/third-page-quality-batch.test.mjs`
Expected: FAIL because the current pages are valid but not yet sharp enough about the first budgeting decision.

### Task 2: Apply the minimal opening and description improvements

**Files:**
- Modify: `src/pages/guides/origin-egress-vs-cdn-bandwidth.astro`
- Modify: `src/pages/guides/aws-cloudfront-invalidation-pricing.astro`
- Modify: `src/pages/guides/log-costs.astro`
- Modify: `src/pages/guides/aws-route-53-pricing.astro`

**Step 1: Sharpen the opening promise**

State what the page helps the reader decide before expanding into explanation.

**Step 2: Surface the main split earlier**

Bring the decisive budget distinction closer to the top when it improves CTR and first-screen usefulness.

**Step 3: Preserve page role**

Do not blur concept pages into full bill-boundary pages, bill-boundary pages into optimization pages, or specialist pages into parent pages.

### Task 3: Verify the batch

**Files:**
- Verify: `tests/third-page-quality-batch.test.mjs`
- Verify: relevant existing role-separation tests

**Step 1: Run targeted tests**

Run the new batch test with the existing CDN, observability, and Route 53 role tests.

**Step 2: Run broader checks**

Run:
- `npm test`
- `npm run check`
- `npm run build`

**Step 3: Report exact evidence**

Only claim the batch is ready after the new page-quality test and broader verification pass.
