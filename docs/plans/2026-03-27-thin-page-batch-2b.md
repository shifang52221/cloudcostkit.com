# Thin Page Batch 2B Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Strengthen two generic theme guides so they stop behaving like template hubs and instead earn their indexable role as specialized deep-dive pages.

**Architecture:** Keep `metrics-costs` and `serverless-costs` indexable, but narrow each page's job. Replace hub-like guide grids with stronger editorial sections, clarify each page's relationship to its parent cluster, and make a few high-confidence internal-link adjustments so the site structure stays coherent.

**Tech Stack:** Astro, Markdown docs, lightweight Node verification script

---

### Task 1: Rebuild `metrics-costs` as a specialized deep dive

**Files:**
- Modify: `src/pages/guides/metrics-costs.astro`
- Review: `src/pages/guides/observability-costs.astro`
- Review: `src/pages/calculators/logging.astro`

**Step 1: Remove hub-like structure**

Delete the page-level `GUIDES` import, the filtered guide list, and the "More metrics guides" grid.

**Step 2: Add real topic ownership**

Make the page clearly own:

- how time series are created
- why labels and environments multiply cost
- how resolution, retention, dashboards, and alerts change spend
- how to run a metrics review that cuts cost without losing critical visibility

**Step 3: Clarify page role**

Frame the page as the metrics-specific deep dive underneath `observability-costs`, not as a mini observability index.

### Task 2: Rebuild `serverless-costs` as a workload-model page

**Files:**
- Modify: `src/pages/guides/serverless-costs.astro`
- Review: `src/pages/guides/compute-costs.astro`

**Step 1: Remove hub-like structure**

Delete the page-level `GUIDES` import, the filtered guide list, and the "More serverless guides" grid.

**Step 2: Add full cost-model coverage**

Make the page clearly own:

- invocations, duration, and resource allocation
- retries, queue fan-out, and downstream request amplification
- logs, metrics, egress, storage, and managed-service adjacency
- provider handoff guidance for Lambda, Functions, Cloud Run, and related destinations

**Step 3: Clarify page role**

Frame the page as the cross-provider architecture guide underneath `compute-costs`, not as a generic serverless hub.

### Task 3: Add high-confidence internal-link and role cues

**Files:**
- Modify: `src/pages/guides/observability-costs.astro`
- Modify: `src/pages/guides/compute-costs.astro`
- Modify: `src/pages/calculators/logging.astro`

**Step 1: Tighten parent-child language**

Update wording so:

- `observability-costs` treats `metrics-costs` as the metrics deep dive
- `compute-costs` treats `serverless-costs` as the specialized architecture branch

**Step 2: Avoid broad-hub promotion**

Where practical, stop presenting the target pages as generic hubs and instead describe them with narrower, clearer labels.

### Task 4: Add a Batch 2B verification script

**Files:**
- Create: `scripts/verify-thin-page-batch2b.mjs`

**Step 1: Verify structural cleanup**

Check that:

- `metrics-costs.astro` no longer imports `GUIDES`
- `serverless-costs.astro` no longer imports `GUIDES`
- neither file contains the page-level "More ... guides" section

**Step 2: Verify role cues**

Check that the pages and key parent/entry pages contain the expected stronger language or links.

### Task 5: Verify the batch

**Files:**
- Review: touched files

**Step 1: Run non-ASCII audit on touched files**

Run:

`rg -n "[^\x00-\x7F]" src/pages/guides/metrics-costs.astro src/pages/guides/serverless-costs.astro src/pages/guides/observability-costs.astro src/pages/guides/compute-costs.astro src/pages/calculators/logging.astro scripts/verify-thin-page-batch2b.mjs docs/plans/2026-03-27-thin-page-batch-2b-design.md docs/plans/2026-03-27-thin-page-batch-2b.md`

Expected: no matches.

**Step 2: Run batch verification**

Run:

`node scripts/verify-thin-page-batch2b.mjs`

Expected: pass.

**Step 3: Run project verification**

Run:

`npm run check`

Expected: pass with no new errors.

Run:

`npm run build`

Expected: successful production build.

### Task 6: Commit the batch

**Files:**
- Add: `docs/plans/2026-03-27-thin-page-batch-2b-design.md`
- Add: `docs/plans/2026-03-27-thin-page-batch-2b.md`
- Add: `scripts/verify-thin-page-batch2b.mjs`
- Modify: implementation files from Tasks 1-3

**Step 1: Commit batch 2B**

```bash
git add docs/plans/2026-03-27-thin-page-batch-2b-design.md docs/plans/2026-03-27-thin-page-batch-2b.md scripts/verify-thin-page-batch2b.mjs src/pages/guides/metrics-costs.astro src/pages/guides/serverless-costs.astro src/pages/guides/observability-costs.astro src/pages/guides/compute-costs.astro src/pages/calculators/logging.astro
git commit -m "feat: deepen generic theme guides"
```
