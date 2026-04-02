# EKS Role Separation Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Separate the AWS EKS guide cluster into clear bill-boundary, capacity-measurement, and fixed platform-overhead pages.

**Architecture:** Update the three EKS guide pages so each page has one editorial job, then lock those roles in with a focused regression test. Keep the implementation narrow: role-setting language, directional handoffs, and a few support sections that reduce overlap without rewriting the guides from scratch.

**Tech Stack:** Astro content pages, Node test runner, npm scripts, Astro check/build.

---

### Task 1: Add the failing regression test

**Files:**
- Create: `tests/eks-role-separation.test.mjs`
- Read: `src/pages/guides/aws-eks-pricing.astro`
- Read: `src/pages/guides/aws-eks-node-sizing.astro`
- Read: `src/pages/guides/aws-eks-control-plane-cost.astro`

**Step 1: Write the failing test**

Add assertions that require:

- the pricing page to declare itself the EKS bill-boundary page and distinguish node-driven, fixed platform, and adjacent infrastructure lines
- the node sizing page to declare itself the capacity-measurement page and route bill-scope questions back to pricing
- the control plane page to declare itself the fixed platform-overhead page and route complete budget questions back to pricing

**Step 2: Run test to verify it fails**

Run: `node --test .\tests\eks-role-separation.test.mjs`

Expected: FAIL because the required role-separation phrases do not exist yet.

### Task 2: Make the pricing page the bill-boundary page

**Files:**
- Modify: `src/pages/guides/aws-eks-pricing.astro`
- Test: `tests/eks-role-separation.test.mjs`

**Step 1: Write minimal implementation**

Add:

- an opening paragraph that states this is the EKS bill-boundary page
- a short section that separates node-driven, fixed platform, and adjacent infrastructure or observability lines
- directional handoffs to node sizing and control plane pages

**Step 2: Run targeted test**

Run: `node --test .\tests\eks-role-separation.test.mjs`

Expected: Still FAIL because the other page roles are not implemented yet.

### Task 3: Make the node sizing page the capacity-measurement page

**Files:**
- Modify: `src/pages/guides/aws-eks-node-sizing.astro`
- Test: `tests/eks-role-separation.test.mjs`

**Step 1: Write minimal implementation**

Add:

- an opening paragraph that states this is the capacity-measurement page
- a sentence routing full bill-scope questions back to pricing
- language that keeps the page centered on requests, allocatable capacity, and headroom instead of the full budget

**Step 2: Run targeted test**

Run: `node --test .\tests\eks-role-separation.test.mjs`

Expected: Still FAIL because the control plane role text is not implemented yet.

### Task 4: Make the control plane page the fixed platform-overhead page

**Files:**
- Modify: `src/pages/guides/aws-eks-control-plane-cost.astro`
- Test: `tests/eks-role-separation.test.mjs`

**Step 1: Write minimal implementation**

Add:

- an opening paragraph that states this is the fixed platform-overhead page
- a sentence clarifying that full EKS budget questions still belong on the pricing page
- language that keeps the page centered on cluster count and sprawl, not full-node or traffic modeling

**Step 2: Run targeted test**

Run: `node --test .\tests\eks-role-separation.test.mjs`

Expected: PASS.

### Task 5: Run full project verification

**Files:**
- Test: `tests/eks-role-separation.test.mjs`
- Verify: whole project

**Step 1: Run full tests**

Run: `npm test`

Expected: PASS with the new EKS regression test included.

**Step 2: Run Astro check**

Run: `npm run check`

Expected: PASS with the accepted pre-existing hints only.

**Step 3: Run production build**

Run: `npm run build`

Expected: PASS.

### Task 6: Create the two commits

**Files:**
- Add: `docs/plans/2026-04-02-eks-role-separation-design.md`
- Add: `docs/plans/2026-04-02-eks-role-separation.md`
- Add: `tests/eks-role-separation.test.mjs`
- Modify: `src/pages/guides/aws-eks-pricing.astro`
- Modify: `src/pages/guides/aws-eks-node-sizing.astro`
- Modify: `src/pages/guides/aws-eks-control-plane-cost.astro`

**Step 1: Commit docs**

Run:

```bash
git add docs/plans/2026-04-02-eks-role-separation-design.md docs/plans/2026-04-02-eks-role-separation.md
git commit -m "docs: add eks role separation plan"
```

**Step 2: Commit feature**

Run:

```bash
git add tests/eks-role-separation.test.mjs src/pages/guides/aws-eks-pricing.astro src/pages/guides/aws-eks-node-sizing.astro src/pages/guides/aws-eks-control-plane-cost.astro
git commit -m "feat: separate eks guide roles"
```

**Step 3: Push and open compare view**

Run:

```bash
git push origin thin-page-triage
Start-Process "https://github.com/shifang52221/cloudcostkit.com/compare/main...thin-page-triage?expand=1"
```
