# Logging Calculator Cluster Depth Cleanup Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Remove another repeated template cluster by rewriting five logging-related calculators around their true cost
drivers and operational boundaries.

**Architecture:** Keep the current calculator widgets, but replace the repeated editorial tails with log-specific
guidance about ingestion, retention, storage policy, and search behavior.

**Tech Stack:** Astro page content, existing calculator components, internal links

---

### Task 1: Record the logging cluster batch

**Files:**
- Create: `docs/plans/2026-03-29-logging-cluster-calculators-design.md`
- Create: `docs/plans/2026-03-29-logging-cluster-calculators.md`

**Step 1: Capture the cluster**

Document the five target logging calculators and the repeated tail pattern still present.

**Step 2: Capture page-specific roles**

Document how combined log cost, ingestion, storage, search/scan, and CloudWatch Insights differ in purpose.

### Task 2: Rewrite core logging cost pages

**Files:**
- Modify: `src/pages/calculators/log-cost-calculator.astro`
- Modify: `src/pages/calculators/log-ingestion-cost-calculator.astro`

**Step 1: Remove repeated tail sections**

Delete the generic inputs / interpretation / mistakes / validation pattern.

**Step 2: Rebuild around the true cost chain**

Add tailored guidance about:

- log-cost chain from ingestion to retention to search
- source-level noise and bytes-per-event growth

### Task 3: Rewrite storage and search pages

**Files:**
- Modify: `src/pages/calculators/log-storage-cost-calculator.astro`
- Modify: `src/pages/calculators/log-search-scan-cost-calculator.astro`

**Step 1: Preserve calculator roles**

Keep:

- storage as hot/cold retention policy modeling
- search/scan as query-driven scan modeling

**Step 2: Replace generic tail language**

Add tailored guidance about:

- policy design, archive fraction, and retrieval for storage
- dashboards, refresh cadence, and incident queries for scans

### Task 4: Rewrite CloudWatch Logs Insights page

**Files:**
- Modify: `src/pages/calculators/cloudwatch-logs-insights-cost-calculator.astro`

**Step 1: Remove generic boilerplate**

Delete the repeated tail sections and generalized checklist content.

**Step 2: Rebuild around CloudWatch-specific scan behavior**

Add tailored guidance about:

- query window size
- dashboard cadence
- incident query expansion
- separation from ingestion and retention economics

### Task 5: Verify quality and stability

**Files:**
- Review: `docs/plans/2026-03-29-logging-cluster-calculators-design.md`
- Review: `docs/plans/2026-03-29-logging-cluster-calculators.md`
- Review: `src/pages/calculators/log-cost-calculator.astro`
- Review: `src/pages/calculators/log-ingestion-cost-calculator.astro`
- Review: `src/pages/calculators/log-storage-cost-calculator.astro`
- Review: `src/pages/calculators/log-search-scan-cost-calculator.astro`
- Review: `src/pages/calculators/cloudwatch-logs-insights-cost-calculator.astro`

**Step 1: Run content audit**

Confirm the repeated generic headings are gone and all touched files remain ASCII-only.

**Step 2: Run project verification**

Run:

- `npm run check`
- `npm run build`

**Step 3: Commit cleanly**

Commit docs separately from implementation, then push `thin-page-triage` for merge and live verification.
