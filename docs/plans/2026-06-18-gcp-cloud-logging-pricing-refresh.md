# GCP Cloud Logging Pricing Refresh Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Strengthen the GCP Cloud Logging pricing guide so it answers Cloud Logging pricing intent earlier and more credibly while preserving the page's Cloud Logging-specific bill-shape role.

**Architecture:** Keep the current estimation workflow, but add a pricing-first opening that explains the Cloud Logging bill structure before the workflow sections begin. Surface ingestion, retention, query or scan behavior, log-bucket context, and adjacent-cost separation early so the page behaves like a canonical GCP pricing page rather than a generic logging explainer.

**Tech Stack:** Astro guide page, node:test, generated guide metadata, official Google Cloud Logging pricing documentation.

---

### Task 1: Add failing Cloud Logging pricing-cue coverage

**Files:**
- Modify: `tests/high-opportunity-page-review.test.mjs`
- Modify: `tests/thirteenth-ctr-rescue-batch.test.mjs`

**Step 1: Write the failing test**

Add assertions that the Cloud Logging pricing page now includes:

- a sharper pricing-intent title
- a `Quick pricing read` section
- explicit ingestion / retention / query-or-scan separation
- GCP-specific adjacent-cost separation
- updated "updated on" wording

**Step 2: Run test to verify it fails**

Run: `node --test tests/high-opportunity-page-review.test.mjs tests/thirteenth-ctr-rescue-batch.test.mjs`

Expected: FAIL because the current page does not yet surface the pricing-first snapshot or revised SERP wording.

### Task 2: Refresh the Cloud Logging pricing page

**Files:**
- Modify: `src/pages/guides/gcp-cloud-logging-pricing.astro`

**Step 1: Write minimal implementation**

Update the page so it:

- upgrades the title and description for pricing-intent clarity
- adds a pricing-first opening with `Quick pricing read`
- explains Cloud Logging-native cost surfaces earlier
- separates Cloud Logging charges from BigQuery, Pub/Sub, SIEM, object storage, and broader observability costs
- keeps the existing estimation, retention, scan, pitfalls, validation, and tool handoff structure

**Step 2: Keep editorial boundaries intact**

Preserve the page as the Cloud Logging pricing page rather than broadening it into the observability parent guide or a generic retention explainer.

### Task 3: Regenerate metadata and verify green

**Files:**
- Modify: `src/lib/guides.generated.ts`

**Step 1: Regenerate guide metadata**

Run: `npm run generate:guides`

Expected: `src/lib/guides.generated.ts` updates to the new Cloud Logging title and description.

**Step 2: Run targeted tests to verify they pass**

Run: `node --test tests/high-opportunity-page-review.test.mjs tests/thirteenth-ctr-rescue-batch.test.mjs`

Expected: PASS

**Step 3: Run full verification**

Run: `npm run check`

Expected: exit 0 with no errors.

**Step 4: Commit**

```bash
git add docs/plans/2026-06-18-gcp-cloud-logging-pricing-refresh-design.md docs/plans/2026-06-18-gcp-cloud-logging-pricing-refresh.md tests/high-opportunity-page-review.test.mjs tests/thirteenth-ctr-rescue-batch.test.mjs src/pages/guides/gcp-cloud-logging-pricing.astro src/lib/guides.generated.ts
git commit -m "feat: sharpen cloud logging pricing guide"
```
