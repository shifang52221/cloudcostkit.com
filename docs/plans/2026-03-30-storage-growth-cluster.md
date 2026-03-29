# Storage and Growth Calculator Cluster Depth Cleanup Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Remove the next storage-heavy template cluster by rewriting four indexable calculators around their real
growth, retention, backup, and incremental-storage boundaries.

**Architecture:** Keep the current calculator widgets and route structure, but replace repeated editorial tails with
page-specific guidance about managed database bills, growth curves, snapshot churn, and retained log policy.

**Tech Stack:** Astro page content, existing calculator components, internal links

---

### Task 1: Record the storage-growth batch

**Files:**
- Create: `docs/plans/2026-03-30-storage-growth-cluster-design.md`
- Create: `docs/plans/2026-03-30-storage-growth-cluster.md`

**Step 1: Capture the target cluster**

Document the four target calculators and the repeated-tail problem still present in them.

**Step 2: Capture each billing boundary**

Document how RDS, database growth, EBS snapshots, and retained log storage differ so the rewrites do not collapse back
into one storage template.

### Task 2: Rewrite the database-oriented pages

**Files:**
- Modify: `src/pages/calculators/aws-rds-cost-calculator.astro`
- Modify: `src/pages/calculators/database-storage-growth-cost-calculator.astro`

**Step 1: Remove repeated template sections**

Delete the generic inputs / interpretation / mistakes / validation structure where it still appears.

**Step 2: Rebuild around database growth boundaries**

Add tailored guidance about:

- RDS as compute plus primary storage plus backups plus I/O
- storage growth as a forecasting problem built on average GB and horizon assumptions

### Task 3: Rewrite the snapshot and retained-log pages

**Files:**
- Modify: `src/pages/calculators/aws-ebs-snapshot-cost-calculator.astro`
- Modify: `src/pages/calculators/log-retention-storage-cost-calculator.astro`

**Step 1: Preserve page roles**

Keep:

- EBS snapshots as an incremental changed-data estimator
- retained logs as a storage-policy estimator

**Step 2: Replace generic storage prose**

Add tailored guidance about:

- churn, retention, and one-off snapshot spikes
- per-source log retention, hot-window discipline, and cold-storage thinking

### Task 4: Verify quality and stability

**Files:**
- Review: `docs/plans/2026-03-30-storage-growth-cluster-design.md`
- Review: `docs/plans/2026-03-30-storage-growth-cluster.md`
- Review: `src/pages/calculators/aws-rds-cost-calculator.astro`
- Review: `src/pages/calculators/database-storage-growth-cost-calculator.astro`
- Review: `src/pages/calculators/aws-ebs-snapshot-cost-calculator.astro`
- Review: `src/pages/calculators/log-retention-storage-cost-calculator.astro`

**Step 1: Run content audit**

Confirm the repeated generic headings are gone and all touched files remain ASCII-only.

**Step 2: Run project verification**

Run:

- `npm run check`
- `npm run build`

**Step 3: Commit cleanly**

Commit docs separately from implementation, then push `thin-page-triage` for merge and live verification.
