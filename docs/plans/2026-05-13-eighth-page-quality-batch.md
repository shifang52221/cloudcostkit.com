# Eighth Page Quality Batch Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Strengthen live-volume, paid-performance, and retained-snapshot separation across three EBS pages without changing their current cluster roles.

**Architecture:** Add regression coverage for clearer EBS-specific sign-off language first, then make small copy changes to the selected pages while preserving the established bill-boundary and snapshot-modeling responsibilities.

**Tech Stack:** Astro guide pages, Astro calculator pages, Node test runner

---

### Task 1: Lock the EBS quality targets with tests

**Files:**
- Create: `tests/eighth-page-quality-batch.test.mjs`

**Step 1: Write the failing test**

Add assertions that the selected pages:
- use page-specific EBS validation language
- reinforce the separation between live-volume, performance, and snapshot models
- do not drift away from the existing EBS cluster role boundaries

**Step 2: Run test to verify it fails**

Run: `node --test tests/eighth-page-quality-batch.test.mjs`
Expected: FAIL because the sharper EBS-specific sign-off wording does not yet exist.

### Task 2: Apply minimal EBS copy improvements

**Files:**
- Modify: `src/pages/calculators/aws-ebs-cost-calculator.astro`
- Modify: `src/pages/calculators/aws-ebs-snapshot-cost-calculator.astro`
- Modify: `src/pages/guides/aws-ebs-pricing.astro`

**Step 1: Add page-specific sign-off language**

Use wording that matches the exact modeling risk on each page:
- EBS calculator should stay focused on live volume plus paid performance
- snapshot calculator should stay focused on changed-block growth and retention
- EBS pricing guide should remind readers not to collapse all three surfaces into one total

**Step 2: Preserve routing and page ownership**

Do not weaken the existing bill-boundary, performance-measurement, snapshot-modeling, or optimization responsibilities already protected by tests.

### Task 3: Verify the batch

**Files:**
- Verify: `tests/eighth-page-quality-batch.test.mjs`
- Verify: relevant existing EBS role-separation tests

**Step 1: Run targeted tests**

Run the new batch test plus existing EBS tests.

**Step 2: Run broader checks**

Run:
- `npm test`
- `npm run check`
- `npm run build`

**Step 3: Report exact evidence**

Only claim the batch is ready after the new quality test and broader verification pass.
