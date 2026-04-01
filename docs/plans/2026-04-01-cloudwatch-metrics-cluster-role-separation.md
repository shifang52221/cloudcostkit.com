# CloudWatch Metrics Cluster Role Separation Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Separate the AWS CloudWatch metrics pricing, estimate, and optimization pages into clearly different editorial jobs so the cluster reads like a deliberate workflow instead of a templated trio.

**Architecture:** Keep the change local to the three metrics guide pages and one regression test. Strengthen role language, page-specific sections, and directional linking without changing layouts or adding new routes.

**Tech Stack:** Astro, Node test runner

---

### Task 1: Write the regression test first

**Files:**
- Create: `tests/cloudwatch-metrics-cluster-role-separation.test.mjs`

**Step 1: Write the failing test**

Add assertions for:

- pricing page role language that makes it the bill-boundary page
- estimate page role language that makes it the time-series measurement workflow page
- optimization page role language that makes it the production intervention page

**Step 2: Run the focused test and confirm red**

Run: `node --test .\tests\cloudwatch-metrics-cluster-role-separation.test.mjs`

Expected: FAIL because the new role-separation language does not exist yet.

### Task 2: Deepen the pricing page role

**Files:**
- Modify: `src/pages/guides/aws-cloudwatch-metrics-pricing.astro`

**Step 1: Add role-setting language**

- explain that this page defines what belongs inside the metrics bill before teams debate cardinality cleanup or polling reduction
- explain that custom metrics, high-resolution metrics, API requests, and dashboards are the core line items while alarms and external observability systems should be tracked beside the metrics bill rather than blended into it

**Step 2: Add stronger boundary structure**

- add an "inside the metrics bill vs beside the metrics bill" style section
- add "when this is not the right page" guidance

### Task 3: Deepen the estimate page role

**Files:**
- Modify: `src/pages/guides/aws-cloudwatch-metrics-estimate-custom-metrics.astro`

**Step 1: Add measurement-workflow language**

- explain that the page exists to turn CloudWatch inventory, instrumentation config, exporters, dimension combinations, and growth multipliers into a defendable active time-series model

**Step 2: Add stronger evidence structure**

- add an evidence-pack section
- strengthen the difference between baseline series and growth-window series expansion

### Task 4: Deepen the optimization page role

**Files:**
- Modify: `src/pages/guides/aws-cloudwatch-metrics-cost-optimization.astro`

**Step 1: Add production-intervention language**

- explain that optimization starts only after the team knows whether high-cardinality dimensions, duplicate exporters, high-resolution overuse, or metrics API polling is the real cost driver
- explain that the page is about cardinality control, exporter dedupe, resolution policy, and observability preservation

**Step 2: Add guardrails**

- add a "do not optimize yet" or equivalent section
- add a before-and-after change-control loop

### Task 5: Verify green

**Files:**
- Test: `tests/cloudwatch-metrics-cluster-role-separation.test.mjs`

**Step 1: Run focused test**

Run: `node --test .\tests\cloudwatch-metrics-cluster-role-separation.test.mjs`

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
- Modify: `src/pages/guides/aws-cloudwatch-metrics-pricing.astro`
- Modify: `src/pages/guides/aws-cloudwatch-metrics-estimate-custom-metrics.astro`
- Modify: `src/pages/guides/aws-cloudwatch-metrics-cost-optimization.astro`
- Create: `tests/cloudwatch-metrics-cluster-role-separation.test.mjs`

**Step 1: Commit**

```bash
git add src/pages/guides/aws-cloudwatch-metrics-pricing.astro src/pages/guides/aws-cloudwatch-metrics-estimate-custom-metrics.astro src/pages/guides/aws-cloudwatch-metrics-cost-optimization.astro tests/cloudwatch-metrics-cluster-role-separation.test.mjs
git commit -m "feat: separate cloudwatch metrics guide cluster roles"
```

**Step 2: Push**

```bash
git push origin thin-page-triage
```

**Step 3: Open compare URL**

```bash
Start-Process 'https://github.com/shifang52221/cloudcostkit.com/compare/main...thin-page-triage?expand=1'
```
