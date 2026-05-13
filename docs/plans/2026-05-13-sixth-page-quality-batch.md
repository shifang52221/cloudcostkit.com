# Sixth Page Quality Batch Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Improve first-screen decision framing and page-specific validation guidance on four high-impression compute and network pages without changing their existing ownership boundaries.

**Architecture:** Add regression coverage for sharper page-specific framing first, then make small copy changes to the selected pages while preserving their routing behavior, internal links, and role-separation language.

**Tech Stack:** Astro guide pages, Astro calculator pages, Node test runner

---

### Task 1: Lock the quality targets with tests

**Files:**
- Create: `tests/sixth-page-quality-batch.test.mjs`

**Step 1: Write the failing test**

Add assertions that the selected pages:
- use more specific decision and sign-off language
- avoid drifting back toward generic comparison or calculator framing
- preserve the intended compute and egress ownership boundaries

**Step 2: Run test to verify it fails**

Run: `node --test tests/sixth-page-quality-batch.test.mjs`
Expected: FAIL because the current pages do not yet contain the sharper decision framing.

### Task 2: Apply minimal copy improvements

**Files:**
- Modify: `src/pages/calculators/ec2-cost-calculator.astro`
- Modify: `src/pages/calculators/data-egress-cost-calculator.astro`
- Modify: `src/pages/guides/egress-costs.astro`
- Modify: `src/pages/guides/aws-ecs-ec2-vs-fargate-cost.astro`

**Step 1: Strengthen the opening or summary language**

Add page-specific framing that tells the reader what this page is for before they sink time into the wrong workflow.

**Step 2: Add page-specific validation guidance**

Use language that matches the actual modeling risk on each page:
- compute-only EC2 baseline vs full stack cost
- one transfer boundary per egress estimate
- transfer-path diagnosis before accepting one AWS egress rate
- utilization and non-compute line items in ECS on EC2 vs Fargate decisions

**Step 3: Keep routing and ownership intact**

Do not weaken:
- transfer boundary governance
- egress guide ownership
- compute comparison role separation

### Task 3: Verify the batch

**Files:**
- Verify: `tests/sixth-page-quality-batch.test.mjs`
- Verify: relevant existing egress and compute tests

**Step 1: Run targeted tests**

Run the new batch test plus existing tests that cover egress guide ownership and nearby comparison pages.

**Step 2: Run broader checks**

Run:
- `npm test`
- `npm run check`
- `npm run build`

**Step 3: Report exact evidence**

Only claim the batch is ready after the new quality test and broader verification pass.
