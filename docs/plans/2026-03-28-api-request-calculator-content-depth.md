# API Request Calculator Content Depth Cleanup Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Strengthen the API request cost calculator so it reads like the site's generic request-billing workbench
instead of a lightweight support utility page.

**Architecture:** Keep the calculator component, metadata, and related links, but rewrite the body of
`src/pages/calculators/api-request-cost-calculator.astro` so billable requests, endpoint mix, traffic amplification,
scenario planning, and validation are presented as a tighter request-pricing workflow.

**Tech Stack:** Astro calculator page, local content edits, existing internal-link structure

---

### Task 1: Simplify the calculator page structure

**Files:**
- Modify: `src/pages/calculators/api-request-cost-calculator.astro`

**Step 1: Preserve the calculator's core role**

Keep:

- generic request-cost calculator framing
- support relationship to RPS conversion
- adjacency to transfer and egress tools

**Step 2: Merge repeated support sections**

Reduce overlap between:

- billable requests
- request accounting
- worked estimate
- taxonomy
- data sources
- result interpretation
- common mistakes
- advanced inputs
- traffic scenarios
- validation
- next steps

### Task 2: Rebuild the page around a stronger request-pricing workflow

**Files:**
- Modify: `src/pages/calculators/api-request-cost-calculator.astro`

**Step 1: Strengthen the role framing**

Keep and sharpen guidance about:

- billable request definitions
- request classes and endpoint mix
- retries, preflight, polling, and callback traffic
- baseline versus surge scenarios
- transfer and egress adjacency

**Step 2: Tighten validation and handoff guidance**

Present validation, scenario planning, and next-tool routing as fewer stronger sections rather than many small blocks.

### Task 3: Verify quality and build stability

**Files:**
- Review: `src/pages/calculators/api-request-cost-calculator.astro`
- Review: `docs/plans/2026-03-28-api-request-calculator-content-depth-design.md`
- Review: `docs/plans/2026-03-28-api-request-calculator-content-depth.md`

**Step 1: Run non-ASCII audit**

Run:

`rg -n "[^\x00-\x7F]" src/pages/calculators/api-request-cost-calculator.astro docs/plans/2026-03-28-api-request-calculator-content-depth-design.md docs/plans/2026-03-28-api-request-calculator-content-depth.md`

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
- Add: `docs/plans/2026-03-28-api-request-calculator-content-depth-design.md`
- Add: `docs/plans/2026-03-28-api-request-calculator-content-depth.md`
- Modify: `src/pages/calculators/api-request-cost-calculator.astro`

**Step 1: Commit docs**

```bash
git add docs/plans/2026-03-28-api-request-calculator-content-depth-design.md docs/plans/2026-03-28-api-request-calculator-content-depth.md
git commit -m "docs: add api request calculator content depth plan"
```

**Step 2: Commit implementation**

```bash
git add src/pages/calculators/api-request-cost-calculator.astro
git commit -m "fix: strengthen api request calculator editorial structure"
```
