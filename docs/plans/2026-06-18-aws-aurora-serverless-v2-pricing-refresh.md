# AWS Aurora Serverless v2 Pricing Refresh Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Strengthen the AWS Aurora Serverless v2 pricing guide so it answers Serverless v2 pricing intent earlier and more credibly while preserving the page's Aurora Serverless v2 capacity-shape role.

**Architecture:** Keep the current baseline-versus-peak scenario workflow, but add a pricing-first opening that explains ACU-hours, minimum-capacity baseline, repeated peak windows, and adjacent storage or backup surfaces before the estimate steps begin. Surface what belongs inside the Serverless v2 compute bill versus what belongs beside it so the page behaves more like a canonical pricing guide instead of only a worksheet.

**Tech Stack:** Astro guide page, node:test, generated guide metadata, official Aurora pricing and Aurora Serverless v2 documentation.

---

### Task 1: Add failing Aurora Serverless v2 pricing-cue coverage

**Files:**
- Modify: `tests/high-opportunity-page-review.test.mjs`
- Modify: `tests/second-high-opportunity-page-review.test.mjs`

**Step 1: Write the failing test**

Add assertions that the Aurora Serverless v2 pricing page now includes:

- a sharper pricing-intent title
- a `Quick pricing read` section
- explicit ACU-hours / min-capacity / peak-window language
- storage and backup separation
- adjacent-cost separation
- updated "updated on" wording

**Step 2: Run test to verify it fails**

Run: `node --test tests/high-opportunity-page-review.test.mjs tests/second-high-opportunity-page-review.test.mjs`

Expected: FAIL because the current page does not yet include the new pricing-first snapshot or updated title wording.

### Task 2: Refresh the Aurora Serverless v2 pricing page

**Files:**
- Modify: `src/pages/guides/aws-aurora-serverless-v2-pricing.astro`

**Step 1: Write minimal implementation**

Update the page so it:

- sharpens the title and description for Aurora Serverless v2 pricing intent
- adds a `Quick pricing read` section
- explains ACU-hours, min capacity, max posture, and peak-window pressure earlier
- keeps storage, backups, and surrounding database or application costs beside the Serverless v2 compute bill when appropriate
- preserves the current baseline and peak scenario workflow, validation, and related-guide routing

**Step 2: Keep editorial boundaries intact**

Preserve the page as the Aurora Serverless v2 capacity-shape page rather than broadening it into the broader Aurora bill-anatomy page or database parent guide.

### Task 3: Regenerate metadata and verify green

**Files:**
- Modify: `src/lib/guides.generated.ts`

**Step 1: Regenerate guide metadata**

Run: `npm run generate:guides`

Expected: `src/lib/guides.generated.ts` updates to the new Aurora Serverless v2 title and description.

**Step 2: Run targeted tests to verify they pass**

Run: `node --test tests/high-opportunity-page-review.test.mjs tests/second-high-opportunity-page-review.test.mjs tests/aurora-governance.test.mjs`

Expected: PASS

**Step 3: Run full verification**

Run: `npm run check`

Expected: exit 0 with no errors.

**Step 4: Commit**

```bash
git add docs/plans/2026-06-18-aws-aurora-serverless-v2-pricing-refresh-design.md docs/plans/2026-06-18-aws-aurora-serverless-v2-pricing-refresh.md tests/high-opportunity-page-review.test.mjs tests/second-high-opportunity-page-review.test.mjs src/pages/guides/aws-aurora-serverless-v2-pricing.astro src/lib/guides.generated.ts
git commit -m "feat: sharpen aurora serverless v2 pricing guide"
```
