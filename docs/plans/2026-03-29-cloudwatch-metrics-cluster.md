# CloudWatch and Metrics Calculator Cluster Depth Cleanup Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Remove another repeated template cluster by rewriting four CloudWatch and metrics-related calculators around
their actual product-specific cost drivers.

**Architecture:** Keep the current calculator widgets, but replace the repeated editorial tails with product-specific
guidance about log groups, custom metrics, active series, dashboards, polling, and alarm inventory.

**Tech Stack:** Astro page content, existing calculator components, internal links

---

### Task 1: Record the CloudWatch and metrics batch

**Files:**
- Create: `docs/plans/2026-03-29-cloudwatch-metrics-cluster-design.md`
- Create: `docs/plans/2026-03-29-cloudwatch-metrics-cluster.md`

**Step 1: Capture the cluster**

Document the four target calculators and the repeated tail pattern still present.

**Step 2: Capture page-specific roles**

Document how CloudWatch logs, CloudWatch metrics, generic timeseries cost, and CloudWatch alarms differ in purpose.

### Task 2: Rewrite CloudWatch log and metrics pages

**Files:**
- Modify: `src/pages/calculators/cloudwatch-log-cost-calculator.astro`
- Modify: `src/pages/calculators/cloudwatch-metrics-cost-calculator.astro`

**Step 1: Remove repeated tail sections**

Delete the generic inputs / interpretation / mistakes / validation structure.

**Step 2: Rebuild around AWS-specific monitoring behavior**

Add tailored guidance about:

- log groups, retention drift, and Insights cadence
- custom metrics, dashboards, alarms, and API polling

### Task 3: Rewrite generic timeseries and CloudWatch alarms pages

**Files:**
- Modify: `src/pages/calculators/metrics-timeseries-cost-calculator.astro`
- Modify: `src/pages/calculators/aws-cloudwatch-alarms-cost-calculator.astro`

**Step 1: Preserve calculator roles**

Keep:

- timeseries page as the generic active-series and label-cardinality estimator
- alarms page as the alarm-inventory cost estimator

**Step 2: Replace generic tail language**

Add tailored guidance about:

- active-series growth and cardinality churn
- alarm sprawl, high-resolution inventory, and ownership cleanup

### Task 4: Verify quality and stability

**Files:**
- Review: `docs/plans/2026-03-29-cloudwatch-metrics-cluster-design.md`
- Review: `docs/plans/2026-03-29-cloudwatch-metrics-cluster.md`
- Review: `src/pages/calculators/cloudwatch-log-cost-calculator.astro`
- Review: `src/pages/calculators/cloudwatch-metrics-cost-calculator.astro`
- Review: `src/pages/calculators/metrics-timeseries-cost-calculator.astro`
- Review: `src/pages/calculators/aws-cloudwatch-alarms-cost-calculator.astro`

**Step 1: Run content audit**

Confirm the repeated generic headings are gone and all touched files remain ASCII-only.

**Step 2: Run project verification**

Run:

- `npm run check`
- `npm run build`

**Step 3: Commit cleanly**

Commit docs separately from implementation, then push `thin-page-triage` for merge and live verification.
