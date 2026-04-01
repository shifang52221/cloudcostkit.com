# CloudWatch Alarms Cluster Role Separation Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Separate the AWS CloudWatch alarms pricing, estimate, and optimization pages into clearly different editorial jobs so the cluster reads like a deliberate workflow instead of a templated trio.

**Architecture:** Keep the change local to the three alarms guide pages and one regression test. Strengthen role language, page-specific sections, and directional linking without changing layouts or adding new routes.

**Tech Stack:** Astro, Node test runner

---

### Task 1: Write the regression test first

**Files:**
- Create: `tests/cloudwatch-alarms-cluster-role-separation.test.mjs`

**Step 1: Write the failing test**

Add assertions for:

- pricing page role language that makes it the bill-boundary page
- estimate page role language that makes it the alarm-inventory measurement workflow page
- optimization page role language that makes it the production intervention page

**Step 2: Run the focused test and confirm red**

Run: `node --test .\tests\cloudwatch-alarms-cluster-role-separation.test.mjs`

Expected: FAIL because the new role-separation language does not exist yet.

### Task 2: Deepen the pricing page role

**Files:**
- Modify: `src/pages/guides/aws-cloudwatch-alarms-pricing.astro`

**Step 1: Add role-setting language**

- explain that this page defines what belongs inside the alarms bill before teams debate alarm deletion or consolidation
- explain that standard, high-resolution, and composite alarm-months are the core line items while SNS delivery, dashboards, and extra metrics should be tracked beside the alarm bill rather than blended into it

**Step 2: Add stronger boundary structure**

- add an "inside the alarms bill vs beside the alarms bill" style section
- add "when this is not the right page" guidance

### Task 3: Deepen the estimate page role

**Files:**
- Modify: `src/pages/guides/aws-cloudwatch-alarms-estimate-alarm-count.astro`

**Step 1: Add measurement-workflow language**

- explain that the page exists to turn CloudWatch inventory, IaC counts, template expansion rules, ephemeral environments, and scaling multipliers into a defendable monthly alarm-month model

**Step 2: Add stronger evidence structure**

- add an evidence-pack section
- strengthen the difference between baseline alarm inventory and busy-month or PR-environment growth

### Task 4: Deepen the optimization page role

**Files:**
- Modify: `src/pages/guides/aws-cloudwatch-alarms-cost-optimization.astro`

**Step 1: Add production-intervention language**

- explain that optimization starts only after the team knows whether stale inventory, per-resource duplication, high-resolution overuse, or non-prod sprawl is the real cost driver
- explain that the page is about alarm hygiene, duplication reduction, resolution policy, and preserving incident coverage

**Step 2: Add guardrails**

- add a "do not optimize yet" or equivalent section
- add a before-and-after change-control loop

### Task 5: Verify green

**Files:**
- Test: `tests/cloudwatch-alarms-cluster-role-separation.test.mjs`

**Step 1: Run focused test**

Run: `node --test .\tests\cloudwatch-alarms-cluster-role-separation.test.mjs`

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
- Modify: `src/pages/guides/aws-cloudwatch-alarms-pricing.astro`
- Modify: `src/pages/guides/aws-cloudwatch-alarms-estimate-alarm-count.astro`
- Modify: `src/pages/guides/aws-cloudwatch-alarms-cost-optimization.astro`
- Create: `tests/cloudwatch-alarms-cluster-role-separation.test.mjs`

**Step 1: Commit**

```bash
git add src/pages/guides/aws-cloudwatch-alarms-pricing.astro src/pages/guides/aws-cloudwatch-alarms-estimate-alarm-count.astro src/pages/guides/aws-cloudwatch-alarms-cost-optimization.astro tests/cloudwatch-alarms-cluster-role-separation.test.mjs
git commit -m "feat: separate cloudwatch alarms guide cluster roles"
```

**Step 2: Push**

```bash
git push origin thin-page-triage
```

**Step 3: Open compare URL**

```bash
Start-Process 'https://github.com/shifang52221/cloudcostkit.com/compare/main...thin-page-triage?expand=1'
```
