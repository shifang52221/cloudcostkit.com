# ECS Role Separation Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Separate the AWS ECS guide cluster into clear bill-boundary, resource-measurement, support total-cost checklist, and production intervention pages.

**Architecture:** Update the four ECS guide pages so each page has one editorial job, then lock those roles in with a focused regression test. Keep the implementation narrow: role-setting language, directional handoffs, and a few support sections that remove overlap without rebuilding the guides.

**Tech Stack:** Astro content pages, Node test runner, npm scripts, Astro check/build.

---

### Task 1: Add the failing regression test

**Files:**
- Create: `tests/ecs-role-separation.test.mjs`
- Read: `src/pages/guides/aws-ecs-pricing.astro`
- Read: `src/pages/guides/aws-ecs-task-sizing.astro`
- Read: `src/pages/guides/aws-ecs-cost-model-beyond-compute.astro`
- Read: `src/pages/guides/aws-ecs-autoscaling-cost-pitfalls.astro`

**Step 1: Write the failing test**

Add assertions that require:

- the pricing page to declare itself the ECS bill-boundary page and distinguish compute from surrounding infrastructure
- the task sizing page to declare itself the resource-measurement page and route bill-boundary questions back to pricing
- the beyond-compute page to declare itself the support total-cost checklist page and clarify it assumes baseline compute is already modeled
- the autoscaling page to declare itself the production intervention page and warn against tuning before the dominant ECS driver is known

**Step 2: Run test to verify it fails**

Run: `node --test .\tests\ecs-role-separation.test.mjs`

Expected: FAIL because the required role-separation phrases do not exist yet.

### Task 2: Make the pricing page the bill-boundary page

**Files:**
- Modify: `src/pages/guides/aws-ecs-pricing.astro`
- Test: `tests/ecs-role-separation.test.mjs`

**Step 1: Write minimal implementation**

Add:

- an opening paragraph that states this is the ECS bill-boundary page
- a section that separates compute, adjacent infrastructure, and launch-type-dependent lines
- directional handoffs to task sizing, beyond-compute, and autoscaling pages

**Step 2: Run targeted test**

Run: `node --test .\tests\ecs-role-separation.test.mjs`

Expected: Still FAIL because the other page roles are not implemented yet.

### Task 3: Make the task sizing page the resource-measurement page

**Files:**
- Modify: `src/pages/guides/aws-ecs-task-sizing.astro`
- Test: `tests/ecs-role-separation.test.mjs`

**Step 1: Write minimal implementation**

Add:

- an opening paragraph that states this is the resource-measurement page
- a sentence routing bill-boundary questions back to pricing
- language that keeps the page centered on measured demand and task shape instead of broad savings guidance

**Step 2: Run targeted test**

Run: `node --test .\tests\ecs-role-separation.test.mjs`

Expected: Still FAIL because the beyond-compute and autoscaling role text are not implemented yet.

### Task 4: Make the beyond-compute page the support total-cost checklist page

**Files:**
- Modify: `src/pages/guides/aws-ecs-cost-model-beyond-compute.astro`
- Test: `tests/ecs-role-separation.test.mjs`

**Step 1: Write minimal implementation**

Add:

- an opening paragraph that states this is the support total-cost checklist page
- a sentence clarifying that baseline compute should already be modeled
- language that keeps the page on line-item completeness instead of pricing-boundary or optimization language

**Step 2: Run targeted test**

Run: `node --test .\tests\ecs-role-separation.test.mjs`

Expected: Still FAIL because the autoscaling role text is not implemented yet.

### Task 5: Make the autoscaling page the production intervention page

**Files:**
- Modify: `src/pages/guides/aws-ecs-autoscaling-cost-pitfalls.astro`
- Test: `tests/ecs-role-separation.test.mjs`

**Step 1: Write minimal implementation**

Add:

- an opening paragraph that states this is the production intervention page
- a warning that autoscaling changes should wait until the dominant ECS driver is known
- a short measure-change-remeasure loop

**Step 2: Run targeted test**

Run: `node --test .\tests\ecs-role-separation.test.mjs`

Expected: PASS.

### Task 6: Run full project verification

**Files:**
- Test: `tests/ecs-role-separation.test.mjs`
- Verify: whole project

**Step 1: Run full tests**

Run: `npm test`

Expected: PASS with the new ECS regression test included.

**Step 2: Run Astro check**

Run: `npm run check`

Expected: PASS with the accepted pre-existing hints only.

**Step 3: Run production build**

Run: `npm run build`

Expected: PASS.

### Task 7: Create the two commits

**Files:**
- Add: `docs/plans/2026-04-02-ecs-role-separation-design.md`
- Add: `docs/plans/2026-04-02-ecs-role-separation.md`
- Add: `tests/ecs-role-separation.test.mjs`
- Modify: `src/pages/guides/aws-ecs-pricing.astro`
- Modify: `src/pages/guides/aws-ecs-task-sizing.astro`
- Modify: `src/pages/guides/aws-ecs-cost-model-beyond-compute.astro`
- Modify: `src/pages/guides/aws-ecs-autoscaling-cost-pitfalls.astro`

**Step 1: Commit docs**

Run:

```bash
git add docs/plans/2026-04-02-ecs-role-separation-design.md docs/plans/2026-04-02-ecs-role-separation.md
git commit -m "docs: add ecs role separation plan"
```

**Step 2: Commit feature**

Run:

```bash
git add tests/ecs-role-separation.test.mjs src/pages/guides/aws-ecs-pricing.astro src/pages/guides/aws-ecs-task-sizing.astro src/pages/guides/aws-ecs-cost-model-beyond-compute.astro src/pages/guides/aws-ecs-autoscaling-cost-pitfalls.astro
git commit -m "feat: separate ecs guide roles"
```

**Step 3: Push and open compare view**

Run:

```bash
git push origin thin-page-triage
Start-Process "https://github.com/shifang52221/cloudcostkit.com/compare/main...thin-page-triage?expand=1"
```
