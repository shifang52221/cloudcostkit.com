# Ninth Page Quality Batch Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Strengthen page-specific validation and workflow boundaries across two load balancer calculators and one ECS beyond-compute checklist page without changing their existing cluster roles.

**Architecture:** Add regression coverage for sharper page-specific sign-off wording first, then make small copy updates while preserving the established load balancer and ECS role-separation rules.

**Tech Stack:** Astro calculator pages, Astro guide pages, Node test runner

---

### Task 1: Lock the batch targets with tests

**Files:**
- Create: `tests/ninth-page-quality-batch.test.mjs`

**Step 1: Write the failing test**

Add assertions that the selected pages:
- use more specific validation language
- reinforce their exact workflow role
- do not drift away from the existing load balancer and ECS support-page boundaries

**Step 2: Run test to verify it fails**

Run: `node --test tests/ninth-page-quality-batch.test.mjs`
Expected: FAIL because the sharper sign-off wording does not yet exist.

### Task 2: Apply minimal copy improvements

**Files:**
- Modify: `src/pages/calculators/aws-load-balancer-cost-calculator.astro`
- Modify: `src/pages/calculators/aws-load-balancer-lcu-calculator.astro`
- Modify: `src/pages/guides/aws-ecs-cost-model-beyond-compute.astro`

**Step 1: Add page-specific sign-off language**

Use wording that matches the actual risk on each page:
- main load balancer calculator should stay focused on fixed plus usage cost
- LCU/NLCU calculator should stay focused on dominant driver estimation, not final pricing
- ECS beyond-compute should stay focused on missing line items after compute is already credible

**Step 2: Preserve role boundaries**

Do not weaken:
- load balancer cost vs LCU estimate vs explainer page separation
- ECS bill-boundary vs beyond-compute vs production intervention separation

### Task 3: Verify the batch

**Files:**
- Verify: `tests/ninth-page-quality-batch.test.mjs`
- Verify: relevant existing load balancer and ECS role-separation tests

**Step 1: Run targeted tests**

Run the new batch test plus the existing load balancer and ECS tests.

**Step 2: Run broader checks**

Run:
- `npm test`
- `npm run check`
- `npm run build`

**Step 3: Report exact evidence**

Only claim the batch is ready after the new quality test and broader verification pass.
