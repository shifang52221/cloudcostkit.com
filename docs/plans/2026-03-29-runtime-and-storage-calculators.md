# Runtime And Storage Calculators Depth Cleanup Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Remove another major template cluster from the calculator library by rewriting four high-visibility runtime
and storage calculators around their real billing failure modes.

**Architecture:** Keep the existing calculator components and `CalculatorLayout`, but replace the generic editorial tails
on the Lambda, ECR, EBS, and load balancer calculators with page-specific guidance about measurement, drift, and bill
reconciliation.

**Tech Stack:** Astro page content, existing calculator components, internal links

---

### Task 1: Add planning docs for the third cleanup batch

**Files:**
- Create: `docs/plans/2026-03-29-runtime-and-storage-calculators-design.md`
- Create: `docs/plans/2026-03-29-runtime-and-storage-calculators.md`

**Step 1: Record the remaining cluster**

Document that these infrastructure calculators still share a repeated editorial tail despite modeling different billing
shapes.

**Step 2: Lock the scope**

Document the four target files:

- `src/pages/calculators/aws-lambda-cost-calculator.astro`
- `src/pages/calculators/aws-ecr-cost-calculator.astro`
- `src/pages/calculators/aws-ebs-cost-calculator.astro`
- `src/pages/calculators/aws-load-balancer-cost-calculator.astro`

### Task 2: Rewrite Lambda and ECR calculator tails

**Files:**
- Modify: `src/pages/calculators/aws-lambda-cost-calculator.astro`
- Modify: `src/pages/calculators/aws-ecr-cost-calculator.astro`

**Step 1: Remove shared generic sections**

Remove the repeated input, mistake, and validation sections.

**Step 2: Rebuild around runtime and image-registry workflows**

Add tailored guidance about:

- Lambda duration, memory, retries, and log adjacency
- ECR retention, pull bursts, storage growth, and cache behavior

### Task 3: Rewrite EBS and load balancer calculator tails

**Files:**
- Modify: `src/pages/calculators/aws-ebs-cost-calculator.astro`
- Modify: `src/pages/calculators/aws-load-balancer-cost-calculator.astro`

**Step 1: Preserve useful related links**

Keep the links that help users move into deeper guides or adjacent calculators.

**Step 2: Rebuild around provisioned-infrastructure cost logic**

Add tailored guidance about:

- EBS storage versus performance provisioning
- load balancer fixed hourly footprint versus capacity-unit usage

### Task 4: Verify quality and build stability

**Files:**
- Review: `docs/plans/2026-03-29-runtime-and-storage-calculators-design.md`
- Review: `docs/plans/2026-03-29-runtime-and-storage-calculators.md`
- Review: `src/pages/calculators/aws-lambda-cost-calculator.astro`
- Review: `src/pages/calculators/aws-ecr-cost-calculator.astro`
- Review: `src/pages/calculators/aws-ebs-cost-calculator.astro`
- Review: `src/pages/calculators/aws-load-balancer-cost-calculator.astro`

**Step 1: Run non-ASCII audit**

Run:

`rg -n "[^\x00-\x7F]" src/pages/calculators/aws-lambda-cost-calculator.astro src/pages/calculators/aws-ecr-cost-calculator.astro src/pages/calculators/aws-ebs-cost-calculator.astro src/pages/calculators/aws-load-balancer-cost-calculator.astro docs/plans/2026-03-29-runtime-and-storage-calculators-design.md docs/plans/2026-03-29-runtime-and-storage-calculators.md`

Expected: no matches.

**Step 2: Run project verification**

Run:

`npm run check`

Expected: pass with no new errors.

Run:

`npm run build`

Expected: successful production build.

### Task 5: Commit the batch

**Files:**
- Add: `docs/plans/2026-03-29-runtime-and-storage-calculators-design.md`
- Add: `docs/plans/2026-03-29-runtime-and-storage-calculators.md`
- Modify: `src/pages/calculators/aws-lambda-cost-calculator.astro`
- Modify: `src/pages/calculators/aws-ecr-cost-calculator.astro`
- Modify: `src/pages/calculators/aws-ebs-cost-calculator.astro`
- Modify: `src/pages/calculators/aws-load-balancer-cost-calculator.astro`

**Step 1: Commit docs**

```bash
git add docs/plans/2026-03-29-runtime-and-storage-calculators-design.md docs/plans/2026-03-29-runtime-and-storage-calculators.md
git commit -m "docs: add runtime and storage calculator plan"
```

**Step 2: Commit implementation**

```bash
git add src/pages/calculators/aws-lambda-cost-calculator.astro src/pages/calculators/aws-ecr-cost-calculator.astro src/pages/calculators/aws-ebs-cost-calculator.astro src/pages/calculators/aws-load-balancer-cost-calculator.astro
git commit -m "fix: de-template runtime and storage calculators"
```
