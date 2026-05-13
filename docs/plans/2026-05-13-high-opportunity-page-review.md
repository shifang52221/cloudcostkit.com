# High-Opportunity Page Review Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Improve the first-screen clarity and search-entry usefulness of four near-page-one pricing guides without weakening their role separation.

**Architecture:** Add regression coverage for stronger opening framing, then make small copy improvements to the page openings and descriptions while preserving existing role boundaries and related-link structure.

**Tech Stack:** Astro guide pages, Node test runner

---

### Task 1: Lock the stronger entry framing with tests

**Files:**
- Create: `tests/high-opportunity-page-review.test.mjs`

**Step 1: Write the failing test**

Add assertions that the selected pages:
- open with clearer decision framing
- call out the main budget mistake or risk earlier
- keep role separation language intact

**Step 2: Run test to verify it fails**

Run: `node --test tests/high-opportunity-page-review.test.mjs`
Expected: FAIL because the current openings are good but not yet optimized around the stronger entry framing.

### Task 2: Apply the minimal first-screen improvements

**Files:**
- Modify: `src/pages/guides/azure-container-registry-pricing.astro`
- Modify: `src/pages/guides/azure-event-hubs-pricing.astro`
- Modify: `src/pages/guides/gcp-cloud-run-pricing.astro`
- Modify: `src/pages/guides/aws-secrets-manager-pricing.astro`

**Step 1: Strengthen first-screen promise**

Make the first paragraph explain the decision the page is meant to unblock, not just the topic it covers.

**Step 2: Surface the main budgeting trap earlier**

Move the most common estimation failure pattern closer to the top when it improves clarity.

**Step 3: Preserve page role**

Do not blur boundary pages into estimate pages, parent pages, or optimization pages.

### Task 3: Verify the batch

**Files:**
- Verify: `tests/high-opportunity-page-review.test.mjs`
- Verify: existing related-link and role-separation tests

**Step 1: Run targeted tests**

Run the new batch test together with the most relevant existing role-separation tests.

**Step 2: Run broader checks**

Run:
- `npm test`
- `npm run check`

**Step 3: Report exact evidence**

Only claim the batch is ready after the page-review tests and broader verification pass.
