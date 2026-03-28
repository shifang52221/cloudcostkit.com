# CDN Calculator Content Depth Cleanup Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Reduce template-like repetition on the CDN calculator page and replace it with a tighter, more editorially
intentional estimation workflow.

**Architecture:** Keep the existing calculator components, SEO metadata, and related-link structure, but rewrite the
supporting content in `src/pages/calculators/cdn-cost-calculator.astro` so duplicated sections are merged into fewer,
stronger blocks.

**Tech Stack:** Astro page template, existing calculator components, local content edits

---

### Task 1: Identify and remove repeated support sections

**Files:**
- Modify: `src/pages/calculators/cdn-cost-calculator.astro`

**Step 1: Keep the calculator flow intact**

Preserve:

- the page metadata
- bandwidth calculator section
- request calculator section

**Step 2: Merge repeated framing content**

Collapse overlapping sections such as:

- "Use this calculator when..."
- "Fast answer"
- "Short answer"

into one stronger opening support section.

**Step 3: Remove duplicated utility sections**

Replace repeated or overlapping blocks such as:

- "Common pitfalls"
- "Common mistakes"
- "Next actions"
- "Next steps"

with fewer clearer sections.

### Task 2: Rebuild the support copy into a stronger workflow

**Files:**
- Modify: `src/pages/calculators/cdn-cost-calculator.astro`

**Step 1: Add stronger intermediate sections**

Keep content focused on:

- what to measure
- what most teams miss
- how to compare providers cleanly
- how to validate the estimate after the first pass

**Step 2: Preserve useful internal links**

Retain only the internal links that strengthen the workflow without flooding the page with repeated CTA clusters.

### Task 3: Verify quality and build stability

**Files:**
- Review: `src/pages/calculators/cdn-cost-calculator.astro`
- Review: `docs/plans/2026-03-28-cdn-calculator-content-depth-design.md`
- Review: `docs/plans/2026-03-28-cdn-calculator-content-depth.md`

**Step 1: Run non-ASCII audit**

Run:

`rg -n "[^\x00-\x7F]" src/pages/calculators/cdn-cost-calculator.astro docs/plans/2026-03-28-cdn-calculator-content-depth-design.md docs/plans/2026-03-28-cdn-calculator-content-depth.md`

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
- Add: `docs/plans/2026-03-28-cdn-calculator-content-depth-design.md`
- Add: `docs/plans/2026-03-28-cdn-calculator-content-depth.md`
- Modify: `src/pages/calculators/cdn-cost-calculator.astro`

**Step 1: Commit docs**

```bash
git add docs/plans/2026-03-28-cdn-calculator-content-depth-design.md docs/plans/2026-03-28-cdn-calculator-content-depth.md
git commit -m "docs: add cdn calculator content depth plan"
```

**Step 2: Commit implementation**

```bash
git add src/pages/calculators/cdn-cost-calculator.astro
git commit -m "fix: strengthen cdn calculator editorial structure"
```
