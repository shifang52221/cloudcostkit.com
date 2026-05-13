# Second High-Opportunity Page Review Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Improve the first-screen clarity and search-entry usefulness of four additional near-page-one pricing guides without weakening their existing role separation.

**Architecture:** Add regression coverage for sharper opening framing, then make small copy improvements to the openings and meta descriptions of the selected pages while preserving existing page boundaries and cross-links.

**Tech Stack:** Astro guide pages, Node test runner

---

### Task 1: Lock the stronger entry framing with tests

**Files:**
- Create: `tests/second-high-opportunity-page-review.test.mjs`

**Step 1: Write the failing test**

Add assertions that the selected pages:
- open with clearer bill-shape decision framing
- surface the main budgeting split earlier
- preserve their existing role language

**Step 2: Run test to verify it fails**

Run: `node --test tests/second-high-opportunity-page-review.test.mjs`
Expected: FAIL because the current openings explain the topic well but do not yet state the main bill-shape question clearly enough.

### Task 2: Apply the minimal first-screen improvements

**Files:**
- Modify: `src/pages/guides/gcp-cloud-sql-pricing.astro`
- Modify: `src/pages/guides/gcp-cloud-logging-pricing.astro`
- Modify: `src/pages/guides/gcp-cloud-cdn-pricing.astro`
- Modify: `src/pages/guides/aws-aurora-serverless-v2-pricing.astro`

**Step 1: Strengthen first-screen promise**

Make the first paragraph or opening support text explain the decision the page helps unblock, not only the topic it covers.

**Step 2: Surface the main budgeting split earlier**

Move the most important cost-shape distinction closer to the top when it improves clarity.

**Step 3: Preserve page role**

Do not blur Cloud SQL into a general database parent page, Cloud Logging into a broad observability parent page, Cloud CDN into a generic CDN comparison page, or Aurora Serverless v2 into the broader Aurora bill-anatomy page.

### Task 3: Verify the batch

**Files:**
- Verify: `tests/second-high-opportunity-page-review.test.mjs`
- Verify: relevant existing boundary and related-link tests

**Step 1: Run targeted tests**

Run the new batch test together with the most relevant existing role-separation tests.

**Step 2: Run broader checks**

Run:
- `npm test`
- `npm run check`
- `npm run build`

**Step 3: Report exact evidence**

Only claim the batch is ready after the new page-review tests and broader verification pass.
