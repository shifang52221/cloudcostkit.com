# GCP Cloud Run Pricing Guide Refresh Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Strengthen the GCP Cloud Run pricing guide so it answers current Cloud Run pricing intent earlier and more credibly while preserving the page's Cloud Run service-behavior and pricing-decision role.

**Architecture:** Keep the page centered on Cloud Run service behavior, but add a pricing-first opening that clarifies what Google Cloud actually bills on Cloud Run today: request-based billing versus instance-based billing, CPU and memory charges, concurrency implications, Cloud Run jobs, and adjacent costs such as Artifact Registry, build, networking, and logs. Preserve the distinction between Cloud Run-native charges and neighboring platform costs so the page stays a trustworthy decision page rather than drifting into a generic serverless article.

**Tech Stack:** Astro guide page, node:test, generated guide metadata, official Google Cloud Run pricing documentation.

---

### Task 1: Add failing Cloud Run pricing-cue coverage

**Files:**
- Modify: `tests/high-opportunity-page-review.test.mjs`
- Modify: `tests/thirteenth-ctr-rescue-batch.test.mjs`

**Step 1: Write the failing test**

Add assertions that the Cloud Run pricing page includes a first-screen pricing snapshot covering current pricing shape: request-based vs instance-based billing, vCPU and memory, concurrency impact, Cloud Run jobs, and adjacent-cost separation.

**Step 2: Run test to verify it fails**

Run: `node --test tests/high-opportunity-page-review.test.mjs tests/thirteenth-ctr-rescue-batch.test.mjs`

Expected: FAIL because the current page does not yet surface the new pricing-first snapshot and updated wording.

### Task 2: Refresh the Cloud Run pricing guide

**Files:**
- Modify: `src/pages/guides/gcp-cloud-run-pricing.astro`

**Step 1: Write minimal implementation**

Update title, description, last-updated date, first-screen copy, and the main content so the page:
- explicitly distinguishes request-based and instance-based Cloud Run billing
- explains that vCPU, memory, and request charges are the core Cloud Run-native surfaces
- keeps concurrency as an economic operating choice
- separates Cloud Run services from jobs and GPU-style workloads
- separates Cloud Run-native costs from Artifact Registry, Cloud Build, outbound networking, and logging

**Step 2: Keep role separation intact**

Preserve the existing role statement that this is the Cloud Run service behavior and pricing decision page, and do not let the page drift into generic serverless-parent scope.

### Task 3: Regenerate metadata and verify green

**Files:**
- Modify: `src/lib/guides.generated.ts`

**Step 1: Regenerate guide metadata**

Run: `npm run generate:guides`

Expected: `src/lib/guides.generated.ts` updates to the new Cloud Run title/description.

**Step 2: Run targeted tests to verify they pass**

Run: `node --test tests/high-opportunity-page-review.test.mjs tests/thirteenth-ctr-rescue-batch.test.mjs tests/serverless-parent-role-separation.test.mjs`

Expected: PASS

**Step 3: Run full verification**

Run: `npm run check`

Expected: exit 0 with no errors.

**Step 4: Commit**

```bash
git add docs/plans/2026-06-18-gcp-cloud-run-pricing-refresh.md tests/high-opportunity-page-review.test.mjs tests/thirteenth-ctr-rescue-batch.test.mjs src/pages/guides/gcp-cloud-run-pricing.astro src/lib/guides.generated.ts
git commit -m "feat: sharpen cloud run pricing guide"
```
