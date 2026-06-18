# GCP Cloud SQL Pricing Refresh Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Strengthen the GCP Cloud SQL pricing guide so it answers Cloud SQL pricing intent earlier and more credibly while preserving the page's Cloud SQL-specific bill-shape role.

**Architecture:** Keep the current estimation workflow, but add a pricing-first opening that explains Cloud SQL-native billing structure before the step-by-step estimate sections begin. Surface compute shape, HA and replicas, storage, backups, and network-sensitive access early so the page behaves more like a canonical GCP pricing guide and less like a generic worksheet opener.

**Tech Stack:** Astro guide page, node:test, generated guide metadata, official Cloud SQL pricing documentation.

---

### Task 1: Add failing Cloud SQL pricing-cue coverage

**Files:**
- Modify: `tests/high-opportunity-page-review.test.mjs`
- Modify: `tests/second-high-opportunity-page-review.test.mjs`

**Step 1: Write the failing test**

Add assertions that the Cloud SQL pricing page now includes:

- a sharper pricing-intent title
- a `Quick pricing read` section
- explicit compute / HA / storage / backup / network separation
- Cloud SQL-adjacent cost separation
- updated "updated on" wording

**Step 2: Run test to verify it fails**

Run: `node --test tests/high-opportunity-page-review.test.mjs tests/second-high-opportunity-page-review.test.mjs`

Expected: FAIL because the current page does not yet include the new pricing-first snapshot or updated title wording.

### Task 2: Refresh the Cloud SQL pricing page

**Files:**
- Modify: `src/pages/guides/gcp-cloud-sql-pricing.astro`

**Step 1: Write minimal implementation**

Update the page so it:

- sharpens the title and description for Cloud SQL pricing intent
- adds a `Quick pricing read` section
- explains instance shape, HA, replicas, storage, backups, and network-sensitive access earlier
- keeps exports, adjacent analytics, application retries, and surrounding services beside the Cloud SQL bill
- preserves the current estimate workflow, validation, and related-guide routing

**Step 2: Keep editorial boundaries intact**

Preserve the page as a Cloud SQL pricing page rather than broadening it into a database parent guide or a backup-retention specialist page.

### Task 3: Regenerate metadata and verify green

**Files:**
- Modify: `src/lib/guides.generated.ts`

**Step 1: Regenerate guide metadata**

Run: `npm run generate:guides`

Expected: `src/lib/guides.generated.ts` updates to the new Cloud SQL title and description.

**Step 2: Run targeted tests to verify they pass**

Run: `node --test tests/high-opportunity-page-review.test.mjs tests/second-high-opportunity-page-review.test.mjs`

Expected: PASS

**Step 3: Run full verification**

Run: `npm run check`

Expected: exit 0 with no errors.

**Step 4: Commit**

```bash
git add docs/plans/2026-06-18-gcp-cloud-sql-pricing-refresh-design.md docs/plans/2026-06-18-gcp-cloud-sql-pricing-refresh.md tests/high-opportunity-page-review.test.mjs tests/second-high-opportunity-page-review.test.mjs src/pages/guides/gcp-cloud-sql-pricing.astro src/lib/guides.generated.ts
git commit -m "feat: sharpen cloud sql pricing guide"
```
