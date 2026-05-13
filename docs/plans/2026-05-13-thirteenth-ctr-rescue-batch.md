# Thirteenth CTR Rescue Batch Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Improve SERP intent capture and first-screen click confidence on three high-impression pricing guides without changing their URLs, structure, or page roles.

**Architecture:** Add regression coverage for sharper title, meta description, and opening promise language first, then make small copy updates that better match real search intent while preserving the existing guide roles and cluster boundaries.

**Tech Stack:** Astro guide pages, Node test runner

---

### Task 1: Lock the CTR rescue targets with tests

**Files:**
- Create: `tests/thirteenth-ctr-rescue-batch.test.mjs`

**Step 1: Write the failing test**

Add assertions that the selected pages:
- use sharper and more search-intent-aligned title/description/opening wording
- promise a clearer pricing decision or bill-shape explanation in the first screen
- avoid generic provider-pricing phrasing

**Step 2: Run test to verify it fails**

Run: `node --test tests/thirteenth-ctr-rescue-batch.test.mjs`
Expected: FAIL because the sharper CTR-oriented wording does not yet exist.

### Task 2: Apply minimal CTR-focused copy improvements

**Files:**
- Modify: `src/pages/guides/azure-container-registry-pricing.astro`
- Modify: `src/pages/guides/azure-event-hubs-pricing.astro`
- Modify: `src/pages/guides/gcp-cloud-run-pricing.astro`

**Step 1: Improve title, description, and opening promise**

Use wording that better matches the real search:
- ACR page should clearly promise registry storage + image pull / geo / tier cost understanding
- Event Hubs page should clearly promise throughput / ingress / retention / replay cost understanding
- Cloud Run page should clearly promise request / CPU / memory / scale-pattern cost understanding

**Step 2: Preserve page roles**

Do not turn the pages into:
- general cloud overviews
- optimization pages
- calculator pages

### Task 3: Verify the batch

**Files:**
- Verify: `tests/thirteenth-ctr-rescue-batch.test.mjs`
- Verify: any relevant existing tests that cover page roles or high-opportunity snippets

**Step 1: Run targeted tests**

Run the new batch test plus any obviously relevant existing tests.

**Step 2: Run broader checks**

Run:
- `npm test`
- `npm run check`
- `npm run build`

**Step 3: Report exact evidence**

Only claim the batch is ready after the new quality test, targeted verification, full suite, check, and build all pass.
