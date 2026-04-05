# Compute Governance Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Strengthen the compute guide family so the parent page owns runtime-model governance and the EC2,
serverless, and Kubernetes pages each own a narrower role without overlap.

**Architecture:** Treat the compute parent and three specialist guides as one governance batch. Add a focused
regression test for role separation, then make minimal first-screen and routing changes so the hierarchy is explicit:
parent compute model first, then VM estimation, serverless architecture, or Kubernetes system budgeting.

**Tech Stack:** Astro guide pages, Node test runner, Markdown planning docs, verification through `node --test`,
`npm run check`, and `npm run build`.

---

### Task 1: Write the failing regression test

**Files:**
- Create: `tests/compute-parent-governance.test.mjs`
- Read: `src/pages/guides/compute-costs.astro`
- Read: `src/pages/guides/aws-ec2-cost-estimation.astro`
- Read: `src/pages/guides/serverless-costs.astro`
- Read: `src/pages/guides/kubernetes-costs.astro`

**Step 1:** Write a test that loads the four guide files, normalizes whitespace, and asserts:

- `compute-costs` declares itself as the compute runtime budgeting parent page
- `compute-costs` routes readers into VM estimation, serverless architecture, and Kubernetes system budgeting only
  after the workload shape is clear
- `aws-ec2-cost-estimation` declares itself as the VM and instance-fleet estimation page
- `aws-ec2-cost-estimation` routes broader runtime-model questions back to `compute-costs`
- `serverless-costs` declares itself as the cross-provider serverless architecture budgeting parent page inside the
  broader compute hierarchy and routes broader runtime-model questions back to `compute-costs`
- `kubernetes-costs` declares itself as the Kubernetes system budgeting parent page inside the broader compute
  hierarchy and routes broader runtime-model questions back to `compute-costs`

**Step 2:** Run `node --test tests/compute-parent-governance.test.mjs`.

Expected: FAIL because the new hierarchy statements do not yet exist.

### Task 2: Implement the role split

**Files:**
- Modify: `src/pages/guides/compute-costs.astro`
- Modify: `src/pages/guides/aws-ec2-cost-estimation.astro`
- Modify: `src/pages/guides/serverless-costs.astro`
- Modify: `src/pages/guides/kubernetes-costs.astro`

**Step 1:** In `compute-costs.astro`, strengthen the first-screen language so it explicitly frames the page as the
compute runtime budgeting parent page.

**Step 2:** In `compute-costs.astro`, tighten routing language so it clearly sends readers into VM estimation,
serverless architecture budgeting, or Kubernetes system budgeting only after the workload shape is clear.

**Step 3:** In `aws-ec2-cost-estimation.astro`, add a role statement that frames the page as the VM and
instance-fleet estimation page and points broader runtime-model questions back to `compute-costs`.

**Step 4:** In `serverless-costs.astro`, keep the existing serverless parent role but add explicit routing back to
`compute-costs` when the broader runtime-model choice is still unclear.

**Step 5:** In `kubernetes-costs.astro`, keep the existing Kubernetes parent role but add explicit routing back to
`compute-costs` when the broader runtime-model choice is still unclear.

**Step 6:** Keep the batch limited to these four guides unless a direct blocker forces a scope change.

### Task 3: Run verification

**Files:**
- Tests and guides from Tasks 1-2

**Step 1:** Run `node --test tests/compute-parent-governance.test.mjs`.

Expected: PASS.

**Step 2:** Run `npm run check`.

Expected: `0 errors`, `0 warnings`, and only the accepted existing hints.

**Step 3:** Run `npm run build`.

Expected: success.

### Task 4: Commit

**Files:** the four guides plus the new regression test and the planning docs

**Step:** `git add docs/plans/2026-04-04-compute-governance-design.md docs/plans/2026-04-04-compute-governance.md tests/compute-parent-governance.test.mjs src/pages/guides/compute-costs.astro src/pages/guides/aws-ec2-cost-estimation.astro src/pages/guides/serverless-costs.astro src/pages/guides/kubernetes-costs.astro`

`git commit -m "feat: strengthen compute guide roles"`
