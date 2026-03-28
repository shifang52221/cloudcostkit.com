# Homepage Guide Signal Fix Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Remove homepage promotion of demoted guide hubs and replace those entries with stronger indexable guide pages.

**Architecture:** Update only `src/pages/index.astro` so the homepage guide card section points to specific indexed guide
pages instead of the `noindex,follow` Azure and GCP guide hubs. Keep the section size unchanged while improving signal
coherence and editorial specificity.

**Tech Stack:** Astro page template, existing homepage card layout, local content edits

---

### Task 1: Replace conflicting homepage guide targets

**Files:**
- Modify: `src/pages/index.astro`

**Step 1: Find demoted homepage guide cards**

Locate the two homepage guide cards that link to:

- `/guides/azure/`
- `/guides/gcp/`

**Step 2: Swap in stronger indexed guide pages**

Replace those cards with specific guide URLs that are already part of the site's higher-value guide set.

**Step 3: Rewrite the card copy**

Ensure each replacement card:

- explains a real pricing workflow
- sounds specific rather than directory-like
- matches the surrounding homepage editorial tone

### Task 2: Verify signal coherence

**Files:**
- Review: `src/pages/index.astro`
- Review: `src/pages/guides/azure.astro`
- Review: `src/pages/guides/gcp.astro`

**Step 1: Confirm the old targets are demoted**

Review the Azure and GCP provider-hub pages and confirm they remain `robots="noindex,follow"`.

**Step 2: Confirm the homepage no longer links to them**

Run:

`rg -n "guides/azure|guides/gcp" src/pages/index.astro`

Expected: no matches.

### Task 3: Run project verification

**Files:**
- Review: `src/pages/index.astro`
- Review: `docs/plans/2026-03-28-homepage-guide-signal-fix-design.md`
- Review: `docs/plans/2026-03-28-homepage-guide-signal-fix.md`

**Step 1: Run non-ASCII audit**

Run:

`rg -n "[^\x00-\x7F]" src/pages/index.astro docs/plans/2026-03-28-homepage-guide-signal-fix-design.md docs/plans/2026-03-28-homepage-guide-signal-fix.md`

Expected: no matches.

**Step 2: Run project checks**

Run:

`npm run check`

Expected: pass with no new errors.

Run:

`npm run build`

Expected: successful production build.

### Task 4: Commit the rollout

**Files:**
- Add: `docs/plans/2026-03-28-homepage-guide-signal-fix-design.md`
- Add: `docs/plans/2026-03-28-homepage-guide-signal-fix.md`
- Modify: `src/pages/index.astro`

**Step 1: Commit docs**

```bash
git add docs/plans/2026-03-28-homepage-guide-signal-fix-design.md docs/plans/2026-03-28-homepage-guide-signal-fix.md
git commit -m "docs: add homepage guide signal fix plan"
```

**Step 2: Commit implementation**

```bash
git add src/pages/index.astro
git commit -m "fix: improve homepage guide signal coherence"
```
