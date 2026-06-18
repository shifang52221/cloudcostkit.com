# GCP Cloud CDN Pricing Refresh Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Strengthen the GCP Cloud CDN pricing guide so it answers Cloud CDN pricing intent earlier and more credibly while preserving the page's Cloud CDN-specific bill-shape role.

**Architecture:** Keep the current estimate workflow, but add a pricing-first opening that explains Cloud CDN-native billing structure before the bandwidth, requests, and cache-fill sections begin. Surface edge bandwidth, requests, cache-fill pressure, and adjacent origin-transfer ownership early so the page behaves more like a canonical GCP pricing guide and less like a generic cost worksheet.

**Tech Stack:** Astro guide page, node:test, generated guide metadata, official Cloud CDN pricing documentation.

---

### Task 1: Add failing Cloud CDN pricing-cue coverage

**Files:**
- Modify: `tests/high-opportunity-page-review.test.mjs`
- Modify: `tests/second-high-opportunity-page-review.test.mjs`

**Step 1: Write the failing test**

Add assertions that the Cloud CDN pricing page now includes:

- a sharper pricing-intent title
- a `Quick pricing read` section
- explicit edge bandwidth / requests / cache-fill separation
- hit-rate or purge-aware language
- adjacent origin or transfer separation
- updated "updated on" wording

**Step 2: Run test to verify it fails**

Run: `node --test tests/high-opportunity-page-review.test.mjs tests/second-high-opportunity-page-review.test.mjs`

Expected: FAIL because the current page does not yet include the new pricing-first snapshot or updated title wording.

### Task 2: Refresh the Cloud CDN pricing page

**Files:**
- Modify: `src/pages/guides/gcp-cloud-cdn-pricing.astro`

**Step 1: Write minimal implementation**

Update the page so it:

- sharpens the title and description for Cloud CDN pricing intent
- adds a `Quick pricing read` section
- explains edge bandwidth, request fees, and cache-fill pressure earlier
- keeps origin egress and transfer ownership beside the Cloud CDN bill when they belong to the origin path
- preserves the current estimate workflow, validation, and related-tool routing

**Step 2: Keep editorial boundaries intact**

Preserve the page as a Cloud CDN pricing page rather than broadening it into a generic CDN parent guide or pure origin-egress explainer.

### Task 3: Regenerate metadata and verify green

**Files:**
- Modify: `src/lib/guides.generated.ts`

**Step 1: Regenerate guide metadata**

Run: `npm run generate:guides`

Expected: `src/lib/guides.generated.ts` updates to the new Cloud CDN title and description.

**Step 2: Run targeted tests to verify they pass**

Run: `node --test tests/high-opportunity-page-review.test.mjs tests/second-high-opportunity-page-review.test.mjs`

Expected: PASS

**Step 3: Run full verification**

Run: `npm run check`

Expected: exit 0 with no errors.

**Step 4: Commit**

```bash
git add docs/plans/2026-06-18-gcp-cloud-cdn-pricing-refresh-design.md docs/plans/2026-06-18-gcp-cloud-cdn-pricing-refresh.md tests/high-opportunity-page-review.test.mjs tests/second-high-opportunity-page-review.test.mjs src/pages/guides/gcp-cloud-cdn-pricing.astro src/lib/guides.generated.ts
git commit -m "feat: sharpen cloud cdn pricing guide"
```
