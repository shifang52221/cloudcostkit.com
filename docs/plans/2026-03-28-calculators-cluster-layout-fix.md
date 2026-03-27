# Calculators Cluster Layout Fix Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix the broken `Search-led cluster paths` layout on the calculators hub without changing shared site-wide grid
behavior.

**Architecture:** Keep the content intact and make a section-scoped layout correction inside
`src/pages/calculators/index.astro`. Replace the generic three-column card setup with a dedicated responsive grid and
card-level flex layout so descriptions and CTA rows stay readable at real production widths.

**Tech Stack:** Astro page template, local CSS in `.astro`, existing shared utility classes

---

### Task 1: Add a section-scoped cluster layout

**Files:**
- Modify: `src/pages/calculators/index.astro`

**Step 1: Add dedicated wrapper classes**

Add section-specific classes around the `Search-led cluster paths` card grid and each cluster card.

**Step 2: Remove dependence on narrow `col-4` cards**

Stop relying on the generic `col-4` layout for this section so card width is controlled by a dedicated responsive grid.

**Step 3: Stabilize card internals**

Use a vertical card layout so:

- title and description stay grouped
- CTA buttons sit at the bottom with consistent spacing

**Step 4: Improve CTA wrapping**

Allow the CTA row to wrap cleanly and avoid the compressed button layout seen on production.

### Task 2: Add local styles only

**Files:**
- Modify: `src/pages/calculators/index.astro`

**Step 1: Add a page-scoped style block**

Add local CSS for:

- `cluster-grid`
- `cluster-card`
- `cluster-copy`
- `cluster-actions`

**Step 2: Add responsive behavior**

Use auto-fit or media-query-backed rules so the section can render as:

- three cards on wide screens
- two cards or one wider card per row on narrower widths
- one card per row on mobile

### Task 3: Verify the change

**Files:**
- Review: `src/pages/calculators/index.astro`
- Review: `docs/plans/2026-03-28-calculators-cluster-layout-fix-design.md`
- Review: `docs/plans/2026-03-28-calculators-cluster-layout-fix.md`

**Step 1: Run non-ASCII audit**

Run:

`rg -n "[^\x00-\x7F]" src/pages/calculators/index.astro docs/plans/2026-03-28-calculators-cluster-layout-fix-design.md docs/plans/2026-03-28-calculators-cluster-layout-fix.md`

Expected: no matches.

**Step 2: Run project checks**

Run:

`npm run check`

Expected: pass with no new errors.

Run:

`npm run build`

Expected: successful production build.

### Task 4: Commit the fix

**Files:**
- Add: `docs/plans/2026-03-28-calculators-cluster-layout-fix-design.md`
- Add: `docs/plans/2026-03-28-calculators-cluster-layout-fix.md`
- Modify: `src/pages/calculators/index.astro`

**Step 1: Commit docs**

```bash
git add docs/plans/2026-03-28-calculators-cluster-layout-fix-design.md docs/plans/2026-03-28-calculators-cluster-layout-fix.md
git commit -m "docs: add calculators cluster layout fix plan"
```

**Step 2: Commit implementation**

```bash
git add src/pages/calculators/index.astro
git commit -m "fix: improve calculators cluster card layout"
```
