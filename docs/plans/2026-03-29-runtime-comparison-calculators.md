# Runtime Comparison Calculators Depth Cleanup Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Remove another repeated template cluster by rewriting five runtime comparison and sizing calculators around
their true decision boundaries.

**Architecture:** Keep the existing calculators, but replace the repeated editorial tails with page-specific guidance
about steady-state compute, burst behavior, capacity packing, commitments, and sizing constraints.

**Tech Stack:** Astro page content, existing calculator components, internal links

---

### Task 1: Record the runtime comparison batch

**Files:**
- Create: `docs/plans/2026-03-29-runtime-comparison-calculators-design.md`
- Create: `docs/plans/2026-03-29-runtime-comparison-calculators.md`

**Step 1: Capture the cluster**

Document the five target calculators and the repeated tail pattern that makes them feel templated.

**Step 2: Capture page intent**

Document how steady-state Fargate pricing, platform comparisons, and ECS task sizing differ in purpose.

### Task 2: Rewrite Fargate-first pages

**Files:**
- Modify: `src/pages/calculators/aws-fargate-cost-calculator.astro`
- Modify: `src/pages/calculators/aws-fargate-vs-ec2-cost-calculator.astro`

**Step 1: Remove generic repeated tails**

Delete the shared bottom sections that still read like calculator boilerplate.

**Step 2: Rebuild around real compute decisions**

Add tailored guidance about:

- steady task-hours
- idle capacity versus right-sizing
- when compute-only comparisons break down

### Task 3: Rewrite event-driven and ECS comparison pages

**Files:**
- Modify: `src/pages/calculators/aws-lambda-vs-fargate-cost-calculator.astro`
- Modify: `src/pages/calculators/aws-ecs-ec2-vs-fargate-cost-calculator.astro`

**Step 1: Preserve calculator roles**

Keep:

- Lambda vs Fargate as burst versus steady comparison
- ECS on EC2 vs ECS on Fargate as orchestration-specific compute comparison

**Step 2: Replace generic tail language**

Add tailored guidance about:

- event-driven execution versus always-on capacity
- packing, commitments, host overhead, and convenience tradeoffs

### Task 4: Rewrite ECS task sizing page

**Files:**
- Modify: `src/pages/calculators/aws-ecs-task-sizing-calculator.astro`

**Step 1: Remove mismatched generic cost language**

Delete the repeated calculator tail that currently does not match a sizing-first workflow.

**Step 2: Rebuild around sizing logic**

Add tailored guidance about:

- CPU and memory as competing constraints
- headroom and deployment overlap
- how sizing errors distort every downstream pricing estimate

### Task 5: Verify quality and stability

**Files:**
- Review: `docs/plans/2026-03-29-runtime-comparison-calculators-design.md`
- Review: `docs/plans/2026-03-29-runtime-comparison-calculators.md`
- Review: `src/pages/calculators/aws-fargate-cost-calculator.astro`
- Review: `src/pages/calculators/aws-fargate-vs-ec2-cost-calculator.astro`
- Review: `src/pages/calculators/aws-lambda-vs-fargate-cost-calculator.astro`
- Review: `src/pages/calculators/aws-ecs-ec2-vs-fargate-cost-calculator.astro`
- Review: `src/pages/calculators/aws-ecs-task-sizing-calculator.astro`

**Step 1: Run content audit**

Confirm the repeated generic headings are gone and all touched files remain ASCII-only.

**Step 2: Run project verification**

Run:

- `npm run check`
- `npm run build`

**Step 3: Commit cleanly**

Commit docs separately from implementation, then push `thin-page-triage` for merge and live verification.
