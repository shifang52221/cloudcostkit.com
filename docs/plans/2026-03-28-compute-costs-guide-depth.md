# Compute Costs Guide Depth Cleanup Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Strengthen the compute costs guide so it becomes the site's cross-workload compute budgeting framework instead
of behaving like a light compute-topic hub.

**Architecture:** Remove the guide-grid hub structure from `src/pages/guides/compute-costs.astro` and rewrite the body
so it clearly owns generic compute billing shapes, utilization, adjacent spend, commitment logic, and validation before
handing users to narrower workload pages.

**Tech Stack:** Astro guide page, local content edits, existing internal-link structure

---

### Task 1: Simplify the guide structure

**Files:**
- Modify: `src/pages/guides/compute-costs.astro`

**Step 1: Preserve the guide's parent role**

Keep:

- compute as a parent framework page
- explicit handoff to serverless, Kubernetes, networking, and logs
- useful calculator and guide links

**Step 2: Remove hub-template structure**

Remove:

- `GUIDES` import
- `computeGuides` list generation
- "More compute guides" grid

### Task 2: Rebuild the guide around a stronger compute workflow

**Files:**
- Modify: `src/pages/guides/compute-costs.astro`

**Step 1: Strengthen generic compute framing**

Keep and sharpen guidance about:

- instance-hours and resource-hours
- baseline capacity versus peak headroom
- utilization and idle waste
- containers and serverless as workload variants
- adjacent networking, load-balancer, and observability spend

**Step 2: Tighten validation and next-step guidance**

Present commitment logic, validation, and next-tool handoff as stronger sections rather than as hub CTAs.

### Task 3: Verify quality and build stability

**Files:**
- Review: `src/pages/guides/compute-costs.astro`
- Review: `docs/plans/2026-03-28-compute-costs-guide-depth-design.md`
- Review: `docs/plans/2026-03-28-compute-costs-guide-depth.md`

**Step 1: Run non-ASCII audit**

Run:

`rg -n "[^\x00-\x7F]" src/pages/guides/compute-costs.astro docs/plans/2026-03-28-compute-costs-guide-depth-design.md docs/plans/2026-03-28-compute-costs-guide-depth.md`

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
- Add: `docs/plans/2026-03-28-compute-costs-guide-depth-design.md`
- Add: `docs/plans/2026-03-28-compute-costs-guide-depth.md`
- Modify: `src/pages/guides/compute-costs.astro`

**Step 1: Commit docs**

```bash
git add docs/plans/2026-03-28-compute-costs-guide-depth-design.md docs/plans/2026-03-28-compute-costs-guide-depth.md
git commit -m "docs: add compute costs guide depth plan"
```

**Step 2: Commit implementation**

```bash
git add src/pages/guides/compute-costs.astro
git commit -m "fix: strengthen compute costs guide framework"
```
