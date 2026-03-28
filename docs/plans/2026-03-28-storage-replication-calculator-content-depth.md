# Storage Replication Calculator Content Depth Cleanup Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Reduce template-style section repetition on the storage replication calculator page and replace it with a
clearer replication-planning workflow.

**Architecture:** Keep the existing calculator component and metadata, but rewrite the support copy in
`src/pages/calculators/storage-replication-cost-calculator.astro` so repeated interpretation, validation, and mistake
sections are merged into fewer stronger blocks.

**Tech Stack:** Astro page template, existing calculator component, local content edits

---

### Task 1: Simplify the page structure

**Files:**
- Modify: `src/pages/calculators/storage-replication-cost-calculator.astro`

**Step 1: Preserve the calculator and core internal-link intent**

Keep:

- page metadata
- calculator component
- useful related links

**Step 2: Merge repeated support sections**

Reduce overlap between:

- result interpretation
- common mistakes
- validate after changes
- replication intent matrix
- billing boundary checklist
- common failure patterns

### Task 2: Rebuild the page around a stronger replication workflow

**Files:**
- Modify: `src/pages/calculators/storage-replication-cost-calculator.astro`

**Step 1: Strengthen changed-GB and mode guidance**

Keep and sharpen guidance about:

- changed GB vs total stored GB
- SRR vs CRR
- ongoing replication vs one-time backfill
- replica storage and request-fee boundaries

**Step 2: Tighten scenario and validation guidance**

Present scenario planning, validation, and failure patterns as fewer, stronger sections.

### Task 3: Verify quality and build stability

**Files:**
- Review: `src/pages/calculators/storage-replication-cost-calculator.astro`
- Review: `docs/plans/2026-03-28-storage-replication-calculator-content-depth-design.md`
- Review: `docs/plans/2026-03-28-storage-replication-calculator-content-depth.md`

**Step 1: Run non-ASCII audit**

Run:

`rg -n "[^\x00-\x7F]" src/pages/calculators/storage-replication-cost-calculator.astro docs/plans/2026-03-28-storage-replication-calculator-content-depth-design.md docs/plans/2026-03-28-storage-replication-calculator-content-depth.md`

Expected: no matches.

**Step 2: Run project verification**

Run:

`npm run check`

Expected: pass with no new errors.

Run:

`npm run build`

Expected: successful production build.

### Task 4: Commit the cleanup

**Files:**
- Add: `docs/plans/2026-03-28-storage-replication-calculator-content-depth-design.md`
- Add: `docs/plans/2026-03-28-storage-replication-calculator-content-depth.md`
- Modify: `src/pages/calculators/storage-replication-cost-calculator.astro`

**Step 1: Commit docs**

```bash
git add docs/plans/2026-03-28-storage-replication-calculator-content-depth-design.md docs/plans/2026-03-28-storage-replication-calculator-content-depth.md
git commit -m "docs: add storage replication calculator content depth plan"
```

**Step 2: Commit implementation**

```bash
git add src/pages/calculators/storage-replication-cost-calculator.astro
git commit -m "fix: strengthen storage replication calculator editorial structure"
```
