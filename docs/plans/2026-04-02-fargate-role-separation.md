# Fargate Role Separation Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Separate the AWS Fargate guide cluster into clear bill-boundary, production intervention, host-model comparison, and orchestration-platform comparison pages.

**Architecture:** Update the four Fargate guide pages so each page has one editorial job, then lock those roles in with a focused regression test. Keep the implementation narrow: role-setting language, directional handoffs, and a few support sections that remove overlap without rebuilding the guides.

**Tech Stack:** Astro content pages, Node test runner, npm scripts, Astro check/build.

---

### Task 1: Add the failing regression test

**Files:**
- Create: `tests/fargate-role-separation.test.mjs`
- Read: `src/pages/guides/aws-fargate-pricing.astro`
- Read: `src/pages/guides/aws-fargate-cost-optimization.astro`
- Read: `src/pages/guides/aws-fargate-vs-ec2-cost.astro`
- Read: `src/pages/guides/aws-fargate-vs-eks-cost.astro`

**Step 1: Write the failing test**

Add assertions that require:

- the pricing page to declare itself the Fargate bill-boundary page and distinguish Fargate compute from adjacent line items
- the optimization page to declare itself the production intervention page and warn against optimizing before the dominant driver is known
- the Fargate-vs-EC2 page to declare itself the host-model comparison page and route raw billing questions back to pricing
- the Fargate-vs-EKS page to declare itself the orchestration-platform comparison page and route raw billing questions back to pricing

**Step 2: Run test to verify it fails**

Run: `node --test .\tests\fargate-role-separation.test.mjs`

Expected: FAIL because the required role-separation phrases do not exist yet.

### Task 2: Make the pricing page the bill-boundary page

**Files:**
- Modify: `src/pages/guides/aws-fargate-pricing.astro`
- Test: `tests/fargate-role-separation.test.mjs`

**Step 1: Write minimal implementation**

Add:

- an opening paragraph that states this is the Fargate bill-boundary page
- a section that separates Fargate compute from adjacent cost surfaces
- directional handoffs to the optimization and comparison pages

**Step 2: Run targeted test**

Run: `node --test .\tests\fargate-role-separation.test.mjs`

Expected: Still FAIL because the other page roles are not implemented yet.

### Task 3: Make the optimization page the production intervention page

**Files:**
- Modify: `src/pages/guides/aws-fargate-cost-optimization.astro`
- Test: `tests/fargate-role-separation.test.mjs`

**Step 1: Write minimal implementation**

Add:

- an opening paragraph that states this is the production intervention page
- a warning that optimization should wait until the dominant Fargate driver is known
- a short measure-change-remeasure loop

**Step 2: Run targeted test**

Run: `node --test .\tests\fargate-role-separation.test.mjs`

Expected: Still FAIL because the two comparison roles are not implemented yet.

### Task 4: Make the Fargate-vs-EC2 page the host-model comparison page

**Files:**
- Modify: `src/pages/guides/aws-fargate-vs-ec2-cost.astro`
- Test: `tests/fargate-role-separation.test.mjs`

**Step 1: Write minimal implementation**

Add:

- an opening paragraph that states this is the host-model comparison page
- a sentence routing Fargate bill-boundary questions back to pricing
- language that keeps the page centered on idle, packing, EBS, and ops overhead

**Step 2: Run targeted test**

Run: `node --test .\tests\fargate-role-separation.test.mjs`

Expected: Still FAIL because the Fargate-vs-EKS role text is not implemented yet.

### Task 5: Make the Fargate-vs-EKS page the orchestration-platform comparison page

**Files:**
- Modify: `src/pages/guides/aws-fargate-vs-eks-cost.astro`
- Test: `tests/fargate-role-separation.test.mjs`

**Step 1: Write minimal implementation**

Add:

- an opening paragraph that states this is the orchestration-platform comparison page
- a sentence routing raw Fargate billing questions back to pricing
- language that keeps the page centered on cluster overhead, node utilization, headroom, and consolidation

**Step 2: Run targeted test**

Run: `node --test .\tests\fargate-role-separation.test.mjs`

Expected: PASS.

### Task 6: Run full project verification

**Files:**
- Test: `tests/fargate-role-separation.test.mjs`
- Verify: whole project

**Step 1: Run full tests**

Run: `npm test`

Expected: PASS with the new Fargate regression test included.

**Step 2: Run Astro check**

Run: `npm run check`

Expected: PASS with the accepted pre-existing hints only.

**Step 3: Run production build**

Run: `npm run build`

Expected: PASS.

### Task 7: Create the two commits

**Files:**
- Add: `docs/plans/2026-04-02-fargate-role-separation-design.md`
- Add: `docs/plans/2026-04-02-fargate-role-separation.md`
- Add: `tests/fargate-role-separation.test.mjs`
- Modify: `src/pages/guides/aws-fargate-pricing.astro`
- Modify: `src/pages/guides/aws-fargate-cost-optimization.astro`
- Modify: `src/pages/guides/aws-fargate-vs-ec2-cost.astro`
- Modify: `src/pages/guides/aws-fargate-vs-eks-cost.astro`

**Step 1: Commit docs**

Run:

```bash
git add docs/plans/2026-04-02-fargate-role-separation-design.md docs/plans/2026-04-02-fargate-role-separation.md
git commit -m "docs: add fargate role separation plan"
```

**Step 2: Commit feature**

Run:

```bash
git add tests/fargate-role-separation.test.mjs src/pages/guides/aws-fargate-pricing.astro src/pages/guides/aws-fargate-cost-optimization.astro src/pages/guides/aws-fargate-vs-ec2-cost.astro src/pages/guides/aws-fargate-vs-eks-cost.astro
git commit -m "feat: separate fargate guide roles"
```

**Step 3: Push and open compare view**

Run:

```bash
git push origin thin-page-triage
Start-Process "https://github.com/shifang52221/cloudcostkit.com/compare/main...thin-page-triage?expand=1"
```
