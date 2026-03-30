# Calculator Hub Entry Strengthening Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Strengthen the main calculator hub so Azure, GCP, and Units calculator hubs are explicit parts of the site's
public estimation workflow.

**Architecture:** Keep the existing hub pages and add one small routing section to `src/pages/calculators/index.astro`.
Use a minimal Node test that proves the main hub advertises those three routes directly, then rerun the SEO audit to
confirm the structural issue is reduced.

**Tech Stack:** Astro page content, Node built-in test runner, existing SEO audit script

---

### Task 1: Record the hub-entry strategy and add the failing regression test

**Files:**
- Create: `docs/plans/2026-03-30-calculator-hub-entry-strengthening-design.md`
- Create: `docs/plans/2026-03-30-calculator-hub-entry-strengthening.md`
- Create: `tests/calculator-hub-entry.test.mjs`

**Step 1: Write the failing test**

Create a Node built-in test that reads `src/pages/calculators/index.astro` and expects direct links to:

- `/calculators/azure/`
- `/calculators/gcp/`
- `/calculators/units/`

The test should also expect visible labels that explain these are hub paths rather than one-off tools.

**Step 2: Run test to verify it fails**

Run: `node --test tests/calculator-hub-entry.test.mjs`
Expected: FAIL because the current calculator hub does not expose all three routes.

### Task 2: Make the main calculator hub explicitly route to the three target hubs

**Files:**
- Modify: `src/pages/calculators/index.astro`

**Step 1: Add a provider and unit-routing section**

Add a compact section that introduces:

- Azure calculators
- GCP calculators
- Units & conversions

Each entry should explain the role of the hub and link directly to the route.

**Step 2: Keep the fix structural, not expansive**

Do not redesign the page or add a large new content block. This is an internal-routing improvement, not another broad
rewrite.

### Task 3: Verify green and confirm the audit outcome

**Files:**
- Review: `src/pages/calculators/index.astro`
- Review: `tests/calculator-hub-entry.test.mjs`
- Review: `docs/plans/2026-03-30-calculator-hub-entry-strengthening-design.md`
- Review: `docs/plans/2026-03-30-calculator-hub-entry-strengthening.md`

**Step 1: Run the regression test**

Run: `npm test -- tests/calculator-hub-entry.test.mjs`
Expected: PASS

**Step 2: Run full project verification**

Run:

- `npm test`
- `npm run check`
- `npm run build`
- `npm run audit:seo`

**Step 3: Confirm the structural signal improved**

Check the newest `seo-audit/out/.../summary.md` and `issues.csv` output to confirm the calculator hub issue count is
reduced or reclassified.

**Step 4: Commit cleanly**

Commit docs separately from implementation, push `thin-page-triage`, open the compare URL, then verify `origin/main`
and live HTML after merge.
