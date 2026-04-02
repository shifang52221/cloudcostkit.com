# Kubernetes Comparison Role Separation Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Separate the Kubernetes comparison axis into a navigation hub, an AWS orchestration-platform comparison page, and a cross-cloud managed Kubernetes comparison page.

**Architecture:** Update the three guide pages so each page has one editorial job, then lock those roles in with a focused regression test. Keep the implementation narrow: role-setting language, directional handoffs, and a few structural sections that reduce overlap without rewriting the guides from scratch.

**Tech Stack:** Astro content pages, Node test runner, npm scripts, Astro check/build.

---

### Task 1: Add the failing regression test

**Files:**
- Create: `tests/kubernetes-comparison-role-separation.test.mjs`
- Read: `src/pages/guides/kubernetes-costs.astro`
- Read: `src/pages/guides/aws-ecs-vs-eks-cost.astro`
- Read: `src/pages/guides/eks-vs-gke-vs-aks-cost.astro`

**Step 1: Write the failing test**

Add assertions that require:

- `kubernetes-costs` to declare itself the Kubernetes navigation hub and route users to provider-specific or comparison pages
- `aws-ecs-vs-eks-cost` to declare itself the AWS orchestration-platform comparison page and route raw billing-scope questions back to ECS or EKS pricing
- `eks-vs-gke-vs-aks-cost` to declare itself the cross-cloud managed Kubernetes comparison page and clarify that provider-specific scope questions belong on provider pages

**Step 2: Run test to verify it fails**

Run: `node --test .\tests\kubernetes-comparison-role-separation.test.mjs`

Expected: FAIL because the required role-separation phrases do not exist yet.

### Task 2: Make `kubernetes-costs` the navigation hub

**Files:**
- Modify: `src/pages/guides/kubernetes-costs.astro`
- Test: `tests/kubernetes-comparison-role-separation.test.mjs`

**Step 1: Write minimal implementation**

Add:

- an opening paragraph that states this is the Kubernetes navigation hub
- a short routing section for generic budgeting, AWS orchestration choice, and cross-cloud comparison
- language that keeps the page as a directional hub instead of a final comparison page

**Step 2: Run targeted test**

Run: `node --test .\tests\kubernetes-comparison-role-separation.test.mjs`

Expected: Still FAIL because the comparison page roles are not implemented yet.

### Task 3: Make `aws-ecs-vs-eks-cost` the AWS orchestration-platform comparison page

**Files:**
- Modify: `src/pages/guides/aws-ecs-vs-eks-cost.astro`
- Test: `tests/kubernetes-comparison-role-separation.test.mjs`

**Step 1: Write minimal implementation**

Add:

- an opening paragraph that states this is the AWS orchestration-platform comparison page
- a sentence clarifying that raw bill-boundary questions still belong on ECS pricing or EKS pricing
- language that keeps the page centered on normalized platform choice rather than generic Kubernetes budgeting

**Step 2: Run targeted test**

Run: `node --test .\tests\kubernetes-comparison-role-separation.test.mjs`

Expected: Still FAIL because the cross-cloud comparison role text is not implemented yet.

### Task 4: Make `eks-vs-gke-vs-aks-cost` the cross-cloud managed Kubernetes comparison page

**Files:**
- Modify: `src/pages/guides/eks-vs-gke-vs-aks-cost.astro`
- Test: `tests/kubernetes-comparison-role-separation.test.mjs`

**Step 1: Write minimal implementation**

Add:

- an opening paragraph that states this is the cross-cloud managed Kubernetes comparison page
- a sentence clarifying that provider-specific bill-scope questions belong on provider pricing pages
- language that keeps the page centered on normalized multi-cloud comparison rather than the generic Kubernetes hub

**Step 2: Run targeted test**

Run: `node --test .\tests\kubernetes-comparison-role-separation.test.mjs`

Expected: PASS.

### Task 5: Run full project verification

**Files:**
- Test: `tests/kubernetes-comparison-role-separation.test.mjs`
- Verify: whole project

**Step 1: Run full tests**

Run: `npm test`

Expected: PASS with the new Kubernetes comparison regression test included.

**Step 2: Run Astro check**

Run: `npm run check`

Expected: PASS with the accepted pre-existing hints only.

**Step 3: Run production build**

Run: `npm run build`

Expected: PASS.

### Task 6: Create the two commits

**Files:**
- Add: `docs/plans/2026-04-02-kubernetes-comparison-role-separation-design.md`
- Add: `docs/plans/2026-04-02-kubernetes-comparison-role-separation.md`
- Add: `tests/kubernetes-comparison-role-separation.test.mjs`
- Modify: `src/pages/guides/kubernetes-costs.astro`
- Modify: `src/pages/guides/aws-ecs-vs-eks-cost.astro`
- Modify: `src/pages/guides/eks-vs-gke-vs-aks-cost.astro`

**Step 1: Commit docs**

Run:

```bash
git add docs/plans/2026-04-02-kubernetes-comparison-role-separation-design.md docs/plans/2026-04-02-kubernetes-comparison-role-separation.md
git commit -m "docs: add kubernetes comparison role separation plan"
```

**Step 2: Commit feature**

Run:

```bash
git add tests/kubernetes-comparison-role-separation.test.mjs src/pages/guides/kubernetes-costs.astro src/pages/guides/aws-ecs-vs-eks-cost.astro src/pages/guides/eks-vs-gke-vs-aks-cost.astro
git commit -m "feat: separate kubernetes comparison guide roles"
```

**Step 3: Push and open compare view**

Run:

```bash
git push origin thin-page-triage
Start-Process "https://github.com/shifang52221/cloudcostkit.com/compare/main...thin-page-triage?expand=1"
```
