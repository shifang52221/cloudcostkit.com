# Specialized Calculator Cluster Depth Cleanup Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Remove another template-heavy pocket of calculators by rewriting four specialized pages around their true
billing mechanics: access-log byte density, max-driver capacity units, changed-data replication, and generic instance-
hour math.

**Architecture:** Keep the current widgets and route structure, but replace repeated editorial tails with compact,
specific guidance about how each specialized bill is actually formed.

**Tech Stack:** Astro page content, existing calculator components, internal links

---

### Task 1: Record the specialized calculator batch

**Files:**
- Create: `docs/plans/2026-03-30-specialized-calculators-cluster-design.md`
- Create: `docs/plans/2026-03-30-specialized-calculators-cluster.md`

**Step 1: Capture the target cluster**

Document the four target calculators and the repeated-tail problem still present in them.

**Step 2: Capture each billing mechanic**

Document how access-log cost, LCU/NLCU cost, replication cost, and generic instance-hour math differ so the rewrites do
not collapse into one template again.

### Task 2: Rewrite the logging and capacity-unit pages

**Files:**
- Modify: `src/pages/calculators/aws-api-gateway-access-log-cost-calculator.astro`
- Modify: `src/pages/calculators/aws-load-balancer-lcu-calculator.astro`

**Step 1: Remove repeated template sections**

Delete the generic inputs / interpretation / mistakes / validation structure where it still appears.

**Step 2: Rebuild around page-specific mechanics**

Add tailored guidance about:

- bytes per log line, ingestion, and retention policy
- max-driver LCU/NLCU billing and dominant metrics

### Task 3: Rewrite the replication and compute support pages

**Files:**
- Modify: `src/pages/calculators/s3-replication-cost-calculator.astro`
- Modify: `src/pages/calculators/compute-instance-cost-calculator.astro`

**Step 1: Preserve support-page role where needed**

Keep:

- replication as a changed-data fee estimator
- generic compute as a cross-check tool

**Step 2: Replace generic support prose**

Add tailored guidance about:

- changed-data paths, replication coverage, and migration spikes
- average instance count, billable hours, and blended effective hourly rates

### Task 4: Verify quality and stability

**Files:**
- Review: `docs/plans/2026-03-30-specialized-calculators-cluster-design.md`
- Review: `docs/plans/2026-03-30-specialized-calculators-cluster.md`
- Review: `src/pages/calculators/aws-api-gateway-access-log-cost-calculator.astro`
- Review: `src/pages/calculators/aws-load-balancer-lcu-calculator.astro`
- Review: `src/pages/calculators/s3-replication-cost-calculator.astro`
- Review: `src/pages/calculators/compute-instance-cost-calculator.astro`

**Step 1: Run content audit**

Confirm the repeated generic headings are gone and all touched files remain ASCII-only.

**Step 2: Run project verification**

Run:

- `npm run check`
- `npm run build`

**Step 3: Commit cleanly**

Commit docs separately from implementation, then push `thin-page-triage` for merge and live verification.
