# Thin Page Batch 2C Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Keep the load balancing guide as a stronger standalone decision page while demoting the generic backups-and-snapshots guide into a noindex internal-support page.

**Architecture:** Remove hub-template structures from both pages. Deepen `load-balancing-costs` into a cross-provider diagnosis guide, then rewrite `backups-and-snapshots-costs` into a support page with clearer scope and mark it `noindex,follow`, excluding it from the XML sitemap and reducing high-signal promotion.

**Tech Stack:** Astro, Markdown docs, TypeScript config, lightweight Node verification script

---

### Task 1: Deepen `load-balancing-costs`

**Files:**
- Modify: `src/pages/guides/load-balancing-costs.astro`
- Review: `src/pages/guides/networking-costs.astro`
- Review: `src/pages/guides/compute-costs.astro`

**Step 1: Remove hub-like structure**

Delete the page-level `GUIDES` import, filtered guide list, and "More load balancing guides" grid.

**Step 2: Add distinct decision value**

Make the page clearly own:

- baseline LB hours
- request and traffic-processed drivers
- cross-zone patterns
- WAF, logging, TLS, and connection behavior
- how to tell whether LB spend or adjacent spend is the true problem

**Step 3: Clarify handoff**

Make the page explicit about when to stay on the cross-provider guide and when to move to provider-specific pricing.

### Task 2: Rewrite and demote `backups-and-snapshots-costs`

**Files:**
- Modify: `src/pages/guides/backups-and-snapshots-costs.astro`
- Modify: `astro.config.mjs`

**Step 1: Remove hub-like structure**

Delete the page-level `GUIDES` import, filtered guide list, and "More backup guides" grid.

**Step 2: Tighten scope**

Keep the page useful by focusing on:

- retention ladders
- churn and backup GB-month growth
- restore testing and DR copies
- operational versus compliance retention

**Step 3: Demote the page**

Apply `robots="noindex,follow"` and remove `/guides/backups-and-snapshots-costs/` from XML sitemap generation.

### Task 3: Align internal promotion with the new roles

**Files:**
- Modify: `src/pages/calculators/storage.astro`
- Modify: `src/pages/guides/compute-costs.astro`

**Step 1: Reduce broad promotion of the noindex page**

Update the storage calculators entry page so it no longer promotes `backups-and-snapshots-costs` as a top hero destination.

**Step 2: Refine load-balancing labeling**

Adjust parent-page wording so the kept page is described as a deeper cost diagnosis guide, not as a generic hub.

### Task 4: Add a Batch 2C verification script

**Files:**
- Create: `scripts/verify-thin-page-batch2c.mjs`

**Step 1: Verify structural cleanup**

Check that:

- `load-balancing-costs.astro` no longer imports `GUIDES`
- `backups-and-snapshots-costs.astro` no longer imports `GUIDES`
- neither page contains the old page-level "More ... guides" grid

**Step 2: Verify demotion signals**

Check that:

- `backups-and-snapshots-costs.astro` emits `robots="noindex,follow"`
- `astro.config.mjs` excludes `/guides/backups-and-snapshots-costs/`

**Step 3: Verify role cues**

Check that:

- `load-balancing-costs` contains stronger diagnosis-language
- `storage.astro` no longer promotes the noindex page as a top hero CTA

### Task 5: Verify the batch

**Files:**
- Review: touched files

**Step 1: Run non-ASCII audit on touched files**

Run:

`rg -n "[^\x00-\x7F]" astro.config.mjs src/pages/guides/load-balancing-costs.astro src/pages/guides/backups-and-snapshots-costs.astro src/pages/calculators/storage.astro src/pages/guides/compute-costs.astro scripts/verify-thin-page-batch2c.mjs docs/plans/2026-03-27-thin-page-batch-2c-design.md docs/plans/2026-03-27-thin-page-batch-2c.md`

Expected: no matches.

**Step 2: Run batch verification**

Run:

`node scripts/verify-thin-page-batch2c.mjs`

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
- Add: `docs/plans/2026-03-27-thin-page-batch-2c-design.md`
- Add: `docs/plans/2026-03-27-thin-page-batch-2c.md`
- Add: `scripts/verify-thin-page-batch2c.mjs`
- Modify: implementation files from Tasks 1-3

**Step 1: Commit batch 2C**

```bash
git add docs/plans/2026-03-27-thin-page-batch-2c-design.md docs/plans/2026-03-27-thin-page-batch-2c.md scripts/verify-thin-page-batch2c.mjs astro.config.mjs src/pages/guides/load-balancing-costs.astro src/pages/guides/backups-and-snapshots-costs.astro src/pages/calculators/storage.astro src/pages/guides/compute-costs.astro
git commit -m "feat: tighten theme guide roles"
```
