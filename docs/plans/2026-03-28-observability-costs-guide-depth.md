# Observability Costs Guide Depth Cleanup Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Strengthen the observability costs guide so it becomes the site's cross-signal observability budgeting
framework instead of behaving like a light topic hub.

**Architecture:** Remove the guide-grid hub structure from `src/pages/guides/observability-costs.astro` and rewrite the
body so it clearly owns logs, metrics, traces, retention, query behavior, incident amplification, and governance before
handing users to narrower pages.

**Tech Stack:** Astro guide page, local content edits, existing internal-link structure

---

### Task 1: Simplify the guide structure

**Files:**
- Modify: `src/pages/guides/observability-costs.astro`

**Step 1: Preserve the guide's parent role**

Keep:

- observability as a parent framework page
- explicit handoff to logging and metrics deep dives
- useful calculator and guide links

**Step 2: Remove hub-template structure**

Remove:

- `GUIDES` import
- `obsGuides` list generation
- "More observability guides" grid

### Task 2: Rebuild the guide around a stronger observability workflow

**Files:**
- Modify: `src/pages/guides/observability-costs.astro`

**Step 1: Strengthen generic observability framing**

Keep and sharpen guidance about:

- logs, metrics, and traces as separate signal families
- ingestion and retention
- query, scan, search, and dashboard behavior
- incident-driven amplification
- governance and label discipline

**Step 2: Tighten validation and next-step guidance**

Present governance, validation, and next-tool handoff as stronger sections rather than hub CTAs.

### Task 3: Verify quality and build stability

**Files:**
- Review: `src/pages/guides/observability-costs.astro`
- Review: `docs/plans/2026-03-28-observability-costs-guide-depth-design.md`
- Review: `docs/plans/2026-03-28-observability-costs-guide-depth.md`

**Step 1: Run non-ASCII audit**

Run:

`rg -n "[^\x00-\x7F]" src/pages/guides/observability-costs.astro docs/plans/2026-03-28-observability-costs-guide-depth-design.md docs/plans/2026-03-28-observability-costs-guide-depth.md`

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
- Add: `docs/plans/2026-03-28-observability-costs-guide-depth-design.md`
- Add: `docs/plans/2026-03-28-observability-costs-guide-depth.md`
- Modify: `src/pages/guides/observability-costs.astro`

**Step 1: Commit docs**

```bash
git add docs/plans/2026-03-28-observability-costs-guide-depth-design.md docs/plans/2026-03-28-observability-costs-guide-depth.md
git commit -m "docs: add observability costs guide depth plan"
```

**Step 2: Commit implementation**

```bash
git add src/pages/guides/observability-costs.astro
git commit -m "fix: strengthen observability costs guide framework"
```
