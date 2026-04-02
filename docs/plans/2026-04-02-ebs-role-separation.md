# EBS Role Separation Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Separate the AWS EBS guide cluster into clear bill-boundary, performance-measurement, retained backup-storage modeling, and production intervention pages.

**Architecture:** Update the four EBS guide pages so each page has one editorial job, then lock those roles in with a focused regression test. Keep the implementation narrow: role-setting language, directional handoffs, and a few supporting sections that remove overlap without rebuilding the guides.

**Tech Stack:** Astro content pages, Node test runner, npm scripts, Astro check/build.

---

### Task 1: Add the failing regression test

**Files:**
- Create: `tests/ebs-role-separation.test.mjs`
- Read: `src/pages/guides/aws-ebs-pricing.astro`
- Read: `src/pages/guides/aws-ebs-gp3-iops-throughput.astro`
- Read: `src/pages/guides/aws-ebs-snapshot-cost.astro`
- Read: `src/pages/guides/aws-ebs-cost-optimization.astro`

**Step 1: Write the failing test**

Add assertions that require:

- the pricing page to declare itself the EBS bill-boundary page and distinguish live-volume charges from retained snapshot storage
- the gp3 page to declare itself the performance-measurement page and route bill-boundary questions back to pricing
- the snapshot page to declare itself the retained backup-storage modeling page and distinguish snapshot growth from live-volume pricing
- the optimization page to declare itself the production intervention page and warn against optimizing before the dominant driver is known

**Step 2: Run test to verify it fails**

Run: `node --test .\tests\ebs-role-separation.test.mjs`

Expected: FAIL because the required role-separation phrases do not exist yet.

### Task 2: Make the pricing page the bill-boundary page

**Files:**
- Modify: `src/pages/guides/aws-ebs-pricing.astro`
- Test: `tests/ebs-role-separation.test.mjs`

**Step 1: Write minimal implementation**

Add:

- an opening paragraph that states this is the EBS bill-boundary page
- a section that separates live volume charges from retained snapshot storage
- directional handoffs to the gp3 page, snapshot page, and optimization page

**Step 2: Run targeted test**

Run: `node --test .\tests\ebs-role-separation.test.mjs`

Expected: Still FAIL because the other page roles are not implemented yet.

### Task 3: Make the gp3 page the performance-measurement page

**Files:**
- Modify: `src/pages/guides/aws-ebs-gp3-iops-throughput.astro`
- Test: `tests/ebs-role-separation.test.mjs`

**Step 1: Write minimal implementation**

Add:

- an opening paragraph that states this is the performance-measurement page
- a sentence routing full bill-boundary questions back to pricing
- language that keeps the page centered on workload measurement instead of general EBS savings advice

**Step 2: Run targeted test**

Run: `node --test .\tests\ebs-role-separation.test.mjs`

Expected: Still FAIL because the snapshot and optimization role text are not implemented yet.

### Task 4: Make the snapshot page the retained backup-storage modeling page

**Files:**
- Modify: `src/pages/guides/aws-ebs-snapshot-cost.astro`
- Test: `tests/ebs-role-separation.test.mjs`

**Step 1: Write minimal implementation**

Add:

- an opening paragraph that states this is the retained backup-storage modeling page
- a sentence distinguishing snapshot growth from live-volume GB-month pricing
- a sentence routing production action questions to the optimization page

**Step 2: Run targeted test**

Run: `node --test .\tests\ebs-role-separation.test.mjs`

Expected: Still FAIL because the optimization role text is not implemented yet.

### Task 5: Make the optimization page the production intervention page

**Files:**
- Modify: `src/pages/guides/aws-ebs-cost-optimization.astro`
- Test: `tests/ebs-role-separation.test.mjs`

**Step 1: Write minimal implementation**

Add:

- an opening paragraph that states this is the production intervention page
- a warning that optimization should wait until the dominant EBS cost driver is known
- a short measure-change-remeasure validation loop

**Step 2: Run targeted test**

Run: `node --test .\tests\ebs-role-separation.test.mjs`

Expected: PASS.

### Task 6: Run full project verification

**Files:**
- Test: `tests/ebs-role-separation.test.mjs`
- Verify: whole project

**Step 1: Run full tests**

Run: `npm test`

Expected: PASS with the new EBS regression test included.

**Step 2: Run Astro check**

Run: `npm run check`

Expected: PASS with the accepted pre-existing hints only.

**Step 3: Run production build**

Run: `npm run build`

Expected: PASS.

### Task 7: Create the two commits

**Files:**
- Add: `docs/plans/2026-04-02-ebs-role-separation-design.md`
- Add: `docs/plans/2026-04-02-ebs-role-separation.md`
- Add: `tests/ebs-role-separation.test.mjs`
- Modify: `src/pages/guides/aws-ebs-pricing.astro`
- Modify: `src/pages/guides/aws-ebs-gp3-iops-throughput.astro`
- Modify: `src/pages/guides/aws-ebs-snapshot-cost.astro`
- Modify: `src/pages/guides/aws-ebs-cost-optimization.astro`

**Step 1: Commit docs**

Run:

```bash
git add docs/plans/2026-04-02-ebs-role-separation-design.md docs/plans/2026-04-02-ebs-role-separation.md
git commit -m "docs: add ebs role separation plan"
```

**Step 2: Commit feature**

Run:

```bash
git add tests/ebs-role-separation.test.mjs src/pages/guides/aws-ebs-pricing.astro src/pages/guides/aws-ebs-gp3-iops-throughput.astro src/pages/guides/aws-ebs-snapshot-cost.astro src/pages/guides/aws-ebs-cost-optimization.astro
git commit -m "feat: separate ebs guide roles"
```

**Step 3: Push and open compare view**

Run:

```bash
git push origin thin-page-triage
Start-Process "https://github.com/shifang52221/cloudcostkit.com/compare/main...thin-page-triage?expand=1"
```
