# Load Balancer Role Separation Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Separate the AWS load balancer guide cluster into clear bill-boundary, measurement workflow, production intervention, and support explainer pages.

**Architecture:** Update four guide pages so each one has a single editorial job, then lock those jobs in with a focused regression test. Keep the implementation minimal: only add role-setting copy, directional handoffs, and supporting sections needed to make the pages non-overlapping.

**Tech Stack:** Astro content pages, Node test runner, npm scripts, Astro check/build.

---

### Task 1: Add the failing regression test

**Files:**
- Create: `tests/load-balancer-role-separation.test.mjs`
- Read: `src/pages/guides/aws-load-balancer-cost.astro`
- Read: `src/pages/guides/aws-load-balancer-estimate-lcu.astro`
- Read: `src/pages/guides/aws-load-balancer-cost-optimization.astro`
- Read: `src/pages/guides/aws-load-balancer-lcu-explained.astro`

**Step 1: Write the failing test**

Add assertions that require:

- the pricing page to declare itself the load balancer bill-boundary page
- the estimate page to declare itself the measurement workflow page and route unclear bill-scope questions back to pricing
- the optimization page to declare itself the production intervention page and warn against optimizing before the dominant driver is known
- the explainer page to declare itself the support explainer page and route workflow questions back to pricing or estimate

**Step 2: Run test to verify it fails**

Run: `node --test .\tests\load-balancer-role-separation.test.mjs`

Expected: FAIL because the required role-separation phrases do not exist yet.

**Step 3: Commit**

Do not commit yet. Continue once the red state is confirmed.

### Task 2: Make the pricing page the bill-boundary page

**Files:**
- Modify: `src/pages/guides/aws-load-balancer-cost.astro`
- Test: `tests/load-balancer-role-separation.test.mjs`

**Step 1: Write minimal implementation**

Add:

- an opening paragraph that states this is the bill-boundary page
- a section that distinguishes bill-internal items from adjacent cost surfaces
- a directional handoff to estimate and optimization

**Step 2: Run targeted test**

Run: `node --test .\tests\load-balancer-role-separation.test.mjs`

Expected: Still FAIL because the other page roles are not implemented yet.

### Task 3: Make the estimate page the measurement workflow page

**Files:**
- Modify: `src/pages/guides/aws-load-balancer-estimate-lcu.astro`
- Test: `tests/load-balancer-role-separation.test.mjs`

**Step 1: Write minimal implementation**

Add:

- an opening paragraph that states this is the measurement workflow page
- a sentence routing bill-scope questions back to pricing
- a section that clarifies average, p95, and incident-hour evidence gathering

**Step 2: Run targeted test**

Run: `node --test .\tests\load-balancer-role-separation.test.mjs`

Expected: Still FAIL because optimization and explainer role text are not implemented yet.

### Task 4: Make the optimization page the production intervention page

**Files:**
- Modify: `src/pages/guides/aws-load-balancer-cost-optimization.astro`
- Test: `tests/load-balancer-role-separation.test.mjs`

**Step 1: Write minimal implementation**

Add:

- an opening paragraph that states this is the production intervention page
- a warning that optimization should wait until the dominant cost driver is known
- a short before/after validation loop

**Step 2: Run targeted test**

Run: `node --test .\tests\load-balancer-role-separation.test.mjs`

Expected: Still FAIL because the explainer support-page role is not implemented yet.

### Task 5: Make the explainer page the support explainer page

**Files:**
- Modify: `src/pages/guides/aws-load-balancer-lcu-explained.astro`
- Test: `tests/load-balancer-role-separation.test.mjs`

**Step 1: Write minimal implementation**

Add:

- an opening paragraph that states this is the support explainer page
- a sentence that says it is not the bill-boundary page and not the measurement workflow page
- directional links back to pricing and estimate

**Step 2: Run targeted test**

Run: `node --test .\tests\load-balancer-role-separation.test.mjs`

Expected: PASS.

### Task 6: Run full project verification

**Files:**
- Test: `tests/load-balancer-role-separation.test.mjs`
- Verify: whole project

**Step 1: Run full tests**

Run: `npm test`

Expected: PASS with the new load balancer regression test included.

**Step 2: Run Astro check**

Run: `npm run check`

Expected: PASS with the accepted pre-existing hints only.

**Step 3: Run production build**

Run: `npm run build`

Expected: PASS.

### Task 7: Create the two commits

**Files:**
- Add: `docs/plans/2026-04-02-load-balancer-role-separation-design.md`
- Add: `docs/plans/2026-04-02-load-balancer-role-separation.md`
- Add: `tests/load-balancer-role-separation.test.mjs`
- Modify: `src/pages/guides/aws-load-balancer-cost.astro`
- Modify: `src/pages/guides/aws-load-balancer-estimate-lcu.astro`
- Modify: `src/pages/guides/aws-load-balancer-cost-optimization.astro`
- Modify: `src/pages/guides/aws-load-balancer-lcu-explained.astro`

**Step 1: Commit docs**

Run:

```bash
git add docs/plans/2026-04-02-load-balancer-role-separation-design.md docs/plans/2026-04-02-load-balancer-role-separation.md
git commit -m "docs: add load balancer role separation plan"
```

**Step 2: Commit feature**

Run:

```bash
git add tests/load-balancer-role-separation.test.mjs src/pages/guides/aws-load-balancer-cost.astro src/pages/guides/aws-load-balancer-estimate-lcu.astro src/pages/guides/aws-load-balancer-cost-optimization.astro src/pages/guides/aws-load-balancer-lcu-explained.astro
git commit -m "feat: separate load balancer guide roles"
```

**Step 3: Push and open compare view**

Run:

```bash
git push origin thin-page-triage
Start-Process "https://github.com/shifang52221/cloudcostkit.com/compare/main...thin-page-triage?expand=1"
```
