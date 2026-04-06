# Aurora Governance Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Strengthen the Aurora-related database guide family so each page owns a distinct role beneath the database parent instead of overlapping as generic Aurora explainers.

**Architecture:** Treat the Aurora bill anatomy page, the Serverless v2 capacity-shape page, and the RDS-vs-Aurora comparison page as one bounded governance batch. Add a focused regression test for role separation, then make minimal first-screen and routing changes so each page owns one narrower job under the governed database hierarchy.

**Tech Stack:** Astro guide pages, Node test runner, Markdown planning docs, verification through `node --test`, `npm run check`, and `npm run build`.

---

### Task 1: Write the failing regression test

**Files:**
- Create: `tests/aurora-governance.test.mjs`
- Read: `src/pages/guides/aws-aurora-pricing.astro`
- Read: `src/pages/guides/aws-aurora-serverless-v2-pricing.astro`
- Read: `src/pages/guides/aws-rds-vs-aurora-cost.astro`

**Step 1:** Write a test that loads the three guide files, normalizes whitespace, and asserts:

- `aws-aurora-pricing` declares itself as the Aurora bill anatomy page
- `aws-aurora-pricing` routes broader database-budget questions back to `database-costs`
- `aws-aurora-serverless-v2-pricing` declares itself as the Aurora Serverless v2 capacity-shape page
- `aws-aurora-serverless-v2-pricing` routes broader database-budget questions back to `database-costs`
- `aws-aurora-serverless-v2-pricing` routes broader Aurora bill-structure questions back to `aws-aurora-pricing`
- `aws-rds-vs-aurora-cost` declares itself as the engine-choice comparison page
- `aws-rds-vs-aurora-cost` routes broader database-budget questions back to `database-costs`
- `aws-rds-vs-aurora-cost` routes premature Aurora bill-structure questions back to `aws-aurora-pricing`

**Step 2:** Run `node --test tests/aurora-governance.test.mjs`.

Expected: FAIL because the stronger Aurora hierarchy statements do not yet exist.

### Task 2: Implement the role split

**Files:**
- Modify: `src/pages/guides/aws-aurora-pricing.astro`
- Modify: `src/pages/guides/aws-aurora-serverless-v2-pricing.astro`
- Modify: `src/pages/guides/aws-rds-vs-aurora-cost.astro`

**Step 1:** In `aws-aurora-pricing.astro`, add a first-screen role statement that frames the page as the Aurora bill anatomy page and points broader database-budget questions back to `database-costs`.

**Step 2:** In `aws-aurora-serverless-v2-pricing.astro`, add a role statement that frames the page as the Aurora Serverless v2 capacity-shape page and points broader database-budget questions back to `database-costs`.

**Step 3:** In `aws-aurora-serverless-v2-pricing.astro`, add routing language that sends broader Aurora bill-structure questions back to `aws-aurora-pricing`.

**Step 4:** In `aws-rds-vs-aurora-cost.astro`, preserve the engine-choice comparison role but add explicit routing back to `database-costs` for broader database-budget questions.

**Step 5:** In `aws-rds-vs-aurora-cost.astro`, add explicit routing back to `aws-aurora-pricing` when the comparison is premature because the Aurora bill anatomy is still unclear.

**Step 6:** Keep the batch limited to these three guides unless a direct blocker forces a scope change.

### Task 3: Run verification

**Files:**
- Tests and guides from Tasks 1-2

**Step 1:** Run `node --test tests/aurora-governance.test.mjs`.

Expected: PASS.

**Step 2:** Run `npm run check`.

Expected: `0 errors`, `0 warnings`, and only the accepted existing hints.

**Step 3:** Run `npm run build`.

Expected: success.

### Task 4: Commit

**Files:** the three guides plus the new regression test and the planning docs

**Step:** `git add docs/plans/2026-04-06-aurora-governance-design.md docs/plans/2026-04-06-aurora-governance.md tests/aurora-governance.test.mjs src/pages/guides/aws-aurora-pricing.astro src/pages/guides/aws-aurora-serverless-v2-pricing.astro src/pages/guides/aws-rds-vs-aurora-cost.astro`

`git commit -m "feat: strengthen aurora guide roles"`
