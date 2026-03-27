# Guides Cluster Layout Fix Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix the fragile guide-cluster card layout on the guides hub without changing shared site-wide grid behavior.

**Architecture:** Update only `src/pages/guides/index.astro` so the `Most-searched guide clusters right now` section uses
its own responsive grid and card structure. Keep content and CTA intent intact while removing the brittle `col-4`
dependency from this section.

**Tech Stack:** Astro page template, local CSS in `.astro`, existing shared utility classes

---

### Task 1: Add a section-scoped guide cluster layout

**Files:**
- Modify: `src/pages/guides/index.astro`

**Step 1: Add dedicated wrapper classes**

Add section-specific classes around the guide cluster grid and each guide cluster card.

**Step 2: Remove dependence on narrow `col-4` cards**

Stop relying on the generic `col-4` structure for this section so card width is controlled by a local responsive grid.

**Step 3: Stabilize card internals**

Use a vertical card layout so:

- title and description stay grouped
- CTA rows remain aligned and readable

### Task 2: Add local styles only

**Files:**
- Modify: `src/pages/guides/index.astro`

**Step 1: Add a page-scoped style block**

Add local CSS for:

- `guide-cluster-grid`
- `guide-cluster-card`
- `guide-cluster-copy`
- `guide-cluster-actions`

**Step 2: Add responsive behavior**

Use auto-fit or media-query-backed rules so the section can reflow before the cards become too narrow.

### Task 3: Verify the change

**Files:**
- Review: `src/pages/guides/index.astro`
- Review: `docs/plans/2026-03-28-guides-cluster-layout-fix-design.md`
- Review: `docs/plans/2026-03-28-guides-cluster-layout-fix.md`

**Step 1: Run non-ASCII audit**

Run:

`rg -n "[^\x00-\x7F]" src/pages/guides/index.astro docs/plans/2026-03-28-guides-cluster-layout-fix-design.md docs/plans/2026-03-28-guides-cluster-layout-fix.md`

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
- Add: `docs/plans/2026-03-28-guides-cluster-layout-fix-design.md`
- Add: `docs/plans/2026-03-28-guides-cluster-layout-fix.md`
- Modify: `src/pages/guides/index.astro`

**Step 1: Commit docs**

```bash
git add docs/plans/2026-03-28-guides-cluster-layout-fix-design.md docs/plans/2026-03-28-guides-cluster-layout-fix.md
git commit -m "docs: add guides cluster layout fix plan"
```

**Step 2: Commit implementation**

```bash
git add src/pages/guides/index.astro
git commit -m "fix: improve guides cluster card layout"
```
