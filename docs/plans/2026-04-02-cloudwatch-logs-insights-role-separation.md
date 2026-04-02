# CloudWatch Logs Insights Role Separation Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Separate the CloudWatch Logs Insights guide cluster into clear bill-boundary, scanned-GB measurement workflow, and production intervention pages.

**Architecture:** Update the three core Logs Insights guide pages so each page has one editorial job, then lock those roles in with a focused regression test. Keep the implementation minimal: add role-setting language, directional handoffs, and supporting sections needed to remove overlap.

**Tech Stack:** Astro content pages, Node test runner, npm scripts, Astro check/build.

---

### Task 1: Add the failing regression test

**Files:**
- Create: `tests/cloudwatch-logs-insights-role-separation.test.mjs`
- Read: `src/pages/guides/aws-cloudwatch-logs-insights-pricing.astro`
- Read: `src/pages/guides/aws-cloudwatch-logs-insights-estimate-scanned-gb.astro`
- Read: `src/pages/guides/aws-cloudwatch-logs-insights-cost-optimization.astro`

**Step 1: Write the failing test**

Add assertions that require:

- the pricing page to declare itself the Logs Insights bill-boundary page
- the estimate page to declare itself the scanned-GB measurement workflow page and route unclear bill-scope questions back to pricing
- the optimization page to declare itself the production intervention page and warn against optimizing before the dominant scan driver is known

**Step 2: Run test to verify it fails**

Run: `node --test .\tests\cloudwatch-logs-insights-role-separation.test.mjs`

Expected: FAIL because the required role-separation phrases do not exist yet.

### Task 2: Make the pricing page the bill-boundary page

**Files:**
- Modify: `src/pages/guides/aws-cloudwatch-logs-insights-pricing.astro`
- Test: `tests/cloudwatch-logs-insights-role-separation.test.mjs`

**Step 1: Write minimal implementation**

Add:

- an opening paragraph that states this is the Logs Insights bill-boundary page
- a section that distinguishes bill-internal items from adjacent log-cost surfaces
- a directional handoff to estimate and optimization

**Step 2: Run targeted test**

Run: `node --test .\tests\cloudwatch-logs-insights-role-separation.test.mjs`

Expected: Still FAIL because the estimate and optimization roles are not implemented yet.

### Task 3: Make the estimate page the scanned-GB measurement workflow page

**Files:**
- Modify: `src/pages/guides/aws-cloudwatch-logs-insights-estimate-scanned-gb.astro`
- Test: `tests/cloudwatch-logs-insights-role-separation.test.mjs`

**Step 1: Write minimal implementation**

Add:

- an opening paragraph that states this is the scanned-GB measurement workflow page
- a sentence routing bill-scope questions back to pricing
- an evidence-pack section for log volume, time windows, query frequency, and incident multipliers

**Step 2: Run targeted test**

Run: `node --test .\tests\cloudwatch-logs-insights-role-separation.test.mjs`

Expected: Still FAIL because the optimization role text is not implemented yet.

### Task 4: Make the optimization page the production intervention page

**Files:**
- Modify: `src/pages/guides/aws-cloudwatch-logs-insights-cost-optimization.astro`
- Test: `tests/cloudwatch-logs-insights-role-separation.test.mjs`

**Step 1: Write minimal implementation**

Add:

- an opening paragraph that states this is the production intervention page
- a warning that optimization should wait until the dominant scan driver is known
- a short measure-change-remeasure validation loop

**Step 2: Run targeted test**

Run: `node --test .\tests\cloudwatch-logs-insights-role-separation.test.mjs`

Expected: PASS.

### Task 5: Run full project verification

**Files:**
- Test: `tests/cloudwatch-logs-insights-role-separation.test.mjs`
- Verify: whole project

**Step 1: Run full tests**

Run: `npm test`

Expected: PASS with the new Logs Insights regression test included.

**Step 2: Run Astro check**

Run: `npm run check`

Expected: PASS with the accepted pre-existing hints only.

**Step 3: Run production build**

Run: `npm run build`

Expected: PASS.

### Task 6: Create the two commits

**Files:**
- Add: `docs/plans/2026-04-02-cloudwatch-logs-insights-role-separation-design.md`
- Add: `docs/plans/2026-04-02-cloudwatch-logs-insights-role-separation.md`
- Add: `tests/cloudwatch-logs-insights-role-separation.test.mjs`
- Modify: `src/pages/guides/aws-cloudwatch-logs-insights-pricing.astro`
- Modify: `src/pages/guides/aws-cloudwatch-logs-insights-estimate-scanned-gb.astro`
- Modify: `src/pages/guides/aws-cloudwatch-logs-insights-cost-optimization.astro`

**Step 1: Commit docs**

Run:

```bash
git add docs/plans/2026-04-02-cloudwatch-logs-insights-role-separation-design.md docs/plans/2026-04-02-cloudwatch-logs-insights-role-separation.md
git commit -m "docs: add logs insights role separation plan"
```

**Step 2: Commit feature**

Run:

```bash
git add tests/cloudwatch-logs-insights-role-separation.test.mjs src/pages/guides/aws-cloudwatch-logs-insights-pricing.astro src/pages/guides/aws-cloudwatch-logs-insights-estimate-scanned-gb.astro src/pages/guides/aws-cloudwatch-logs-insights-cost-optimization.astro
git commit -m "feat: separate logs insights guide roles"
```

**Step 3: Push and open compare view**

Run:

```bash
git push origin thin-page-triage
Start-Process "https://github.com/shifang52221/cloudcostkit.com/compare/main...thin-page-triage?expand=1"
```
