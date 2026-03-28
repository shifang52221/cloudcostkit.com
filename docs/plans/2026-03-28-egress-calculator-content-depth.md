# Egress Calculator Content Depth Cleanup Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Reduce template-style repetition on the data egress calculator page and replace it with a tighter transfer
boundary and validation workflow.

**Architecture:** Keep the existing calculator component and metadata, but rewrite the support copy in
`src/pages/calculators/data-egress-cost-calculator.astro` so the page has fewer, stronger sections with less repeated
validation and mistake framing.

**Tech Stack:** Astro page template, existing calculator component, local content edits

---

### Task 1: Simplify the page structure

**Files:**
- Modify: `src/pages/calculators/data-egress-cost-calculator.astro`

**Step 1: Preserve the calculator and core internal-link intent**

Keep:

- page metadata
- main calculator component
- useful related links

**Step 2: Merge repeated support sections**

Reduce overlap between:

- "Fast answer"
- "Tips"
- "Result interpretation"
- "Common mistakes"
- "Validate after changes"
- "Sanity checks before sign-off"

### Task 2: Rebuild the page around a stronger egress workflow

**Files:**
- Modify: `src/pages/calculators/data-egress-cost-calculator.astro`

**Step 1: Strengthen transfer-boundary guidance**

Keep and sharpen guidance about:

- internet vs cross-region vs cross-AZ vs origin-to-CDN
- rate selection by path
- input sources and path mapping

**Step 2: Tighten scenario and optimization guidance**

Present scenario planning, validation, and dominant-path actions as fewer stronger blocks instead of many small
sections.

### Task 3: Verify quality and build stability

**Files:**
- Review: `src/pages/calculators/data-egress-cost-calculator.astro`
- Review: `docs/plans/2026-03-28-egress-calculator-content-depth-design.md`
- Review: `docs/plans/2026-03-28-egress-calculator-content-depth.md`

**Step 1: Run non-ASCII audit**

Run:

`rg -n "[^\x00-\x7F]" src/pages/calculators/data-egress-cost-calculator.astro docs/plans/2026-03-28-egress-calculator-content-depth-design.md docs/plans/2026-03-28-egress-calculator-content-depth.md`

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
- Add: `docs/plans/2026-03-28-egress-calculator-content-depth-design.md`
- Add: `docs/plans/2026-03-28-egress-calculator-content-depth.md`
- Modify: `src/pages/calculators/data-egress-cost-calculator.astro`

**Step 1: Commit docs**

```bash
git add docs/plans/2026-03-28-egress-calculator-content-depth-design.md docs/plans/2026-03-28-egress-calculator-content-depth.md
git commit -m "docs: add egress calculator content depth plan"
```

**Step 2: Commit implementation**

```bash
git add src/pages/calculators/data-egress-cost-calculator.astro
git commit -m "fix: strengthen egress calculator editorial structure"
```
