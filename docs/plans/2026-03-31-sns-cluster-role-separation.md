# SNS Cluster Role Separation Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Separate the AWS SNS pricing, estimate, and optimization pages into clearly different editorial jobs so the cluster reads like a deliberate workflow instead of a templated trio.

**Architecture:** Keep the change local to the three SNS guide pages plus one regression test. Strengthen role language, page-specific sections, and directional linking without changing layouts or adding new pages.

**Tech Stack:** Astro, Node test runner

---

### Task 1: Write the regression test first

**Files:**
- Create: `tests/sns-cluster-role-separation.test.mjs`

**Step 1: Write the failing test**

Add assertions for:

- pricing page role language that makes it the bill-boundary page
- estimate page role language that makes it the delivery-measurement workflow page
- optimization page role language that makes it the production intervention page

**Step 2: Run the focused test and confirm red**

Run: `node --test .\tests\sns-cluster-role-separation.test.mjs`

Expected: FAIL because the new role-separation language does not exist yet.

### Task 2: Deepen the pricing page role

**Files:**
- Modify: `src/pages/guides/aws-sns-pricing.astro`

**Step 1: Add role-setting language**

- explain that this page defines what belongs inside the SNS bill model before optimization debates begin
- explain that SNS fan-out can trigger downstream work without making those downstream system costs part of the SNS line item

**Step 2: Add stronger boundary structure**

- add an "inside the SNS bill vs outside the SNS bill" style section
- add "when this is not the right page" guidance

### Task 3: Deepen the estimate page role

**Files:**
- Modify: `src/pages/guides/aws-sns-estimate-deliveries.astro`

**Step 1: Add delivery-measurement language**

- explain that the page exists to turn publishes, matched subscribers, filter match rate, and retry factor into a defendable delivery model

**Step 2: Add stronger evidence structure**

- add an evidence-pack section
- strengthen the difference between baseline fan-out and incident or failure-driven fan-out

### Task 4: Deepen the optimization page role

**Files:**
- Modify: `src/pages/guides/aws-sns-cost-optimization.astro`

**Step 1: Add production-intervention language**

- explain that optimization starts only after the SNS delivery model is believable
- explain that the page is about changes such as topic split, filter policies, endpoint repair, dedupe, and rate limits

**Step 2: Add guardrails**

- add a "do not optimize yet" or equivalent section
- add a before and after change-control loop

### Task 5: Verify green

**Files:**
- Test: `tests/sns-cluster-role-separation.test.mjs`

**Step 1: Run focused test**

Run: `node --test .\tests\sns-cluster-role-separation.test.mjs`

Expected: PASS

**Step 2: Run full suite**

Run: `npm test`

Expected: PASS

**Step 3: Run Astro checks**

Run: `npm run check`

Expected: PASS

**Step 4: Run build**

Run: `npm run build`

Expected: PASS

### Task 6: Commit and prepare merge

**Files:**
- Modify: `src/pages/guides/aws-sns-pricing.astro`
- Modify: `src/pages/guides/aws-sns-estimate-deliveries.astro`
- Modify: `src/pages/guides/aws-sns-cost-optimization.astro`
- Create: `tests/sns-cluster-role-separation.test.mjs`

**Step 1: Commit**

```bash
git add src/pages/guides/aws-sns-pricing.astro src/pages/guides/aws-sns-estimate-deliveries.astro src/pages/guides/aws-sns-cost-optimization.astro tests/sns-cluster-role-separation.test.mjs
git commit -m "feat: separate sns guide cluster roles"
```

**Step 2: Push**

```bash
git push origin thin-page-triage
```

**Step 3: Open compare URL**

```bash
Start-Process 'https://github.com/shifang52221/cloudcostkit.com/compare/main...thin-page-triage?expand=1'
```
