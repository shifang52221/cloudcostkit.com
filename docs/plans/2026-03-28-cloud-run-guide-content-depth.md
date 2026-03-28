# Cloud Run Guide Content Depth Cleanup Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Reduce template-style repetition in the Cloud Run pricing guide and replace it with a tighter Cloud Run cost
planning workflow.

**Architecture:** Keep the guide metadata, FAQ, and core internal links, but rewrite the body of
`src/pages/guides/gcp-cloud-run-pricing.astro` so repeated estimate, pitfalls, and validation sections are merged into
fewer stronger guide blocks.

**Tech Stack:** Astro guide page, local content edits, existing internal-link structure

---

### Task 1: Simplify the guide structure

**Files:**
- Modify: `src/pages/guides/gcp-cloud-run-pricing.astro`

**Step 1: Preserve the guide's core topic coverage**

Keep:

- requests
- duration and concurrency
- egress
- logs

**Step 2: Merge repeated support sections**

Reduce overlap between:

- short answer
- quick cost model
- worked estimate template
- common pitfalls
- validation
- failure patterns
- related tools

### Task 2: Rebuild the guide around a stronger planning workflow

**Files:**
- Modify: `src/pages/guides/gcp-cloud-run-pricing.astro`

**Step 1: Strengthen the driver-first framing**

Keep and sharpen guidance about:

- requests
- CPU/memory time
- transfer
- logging
- peak behavior

**Step 2: Tighten scenario, tuning, and validation guidance**

Present concurrency decisions, failure modes, and estimate validation as fewer stronger sections rather than many small
ones.

### Task 3: Verify quality and build stability

**Files:**
- Review: `src/pages/guides/gcp-cloud-run-pricing.astro`
- Review: `docs/plans/2026-03-28-cloud-run-guide-content-depth-design.md`
- Review: `docs/plans/2026-03-28-cloud-run-guide-content-depth.md`

**Step 1: Run non-ASCII audit**

Run:

`rg -n "[^\x00-\x7F]" src/pages/guides/gcp-cloud-run-pricing.astro docs/plans/2026-03-28-cloud-run-guide-content-depth-design.md docs/plans/2026-03-28-cloud-run-guide-content-depth.md`

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
- Add: `docs/plans/2026-03-28-cloud-run-guide-content-depth-design.md`
- Add: `docs/plans/2026-03-28-cloud-run-guide-content-depth.md`
- Modify: `src/pages/guides/gcp-cloud-run-pricing.astro`

**Step 1: Commit docs**

```bash
git add docs/plans/2026-03-28-cloud-run-guide-content-depth-design.md docs/plans/2026-03-28-cloud-run-guide-content-depth.md
git commit -m "docs: add cloud run guide content depth plan"
```

**Step 2: Commit implementation**

```bash
git add src/pages/guides/gcp-cloud-run-pricing.astro
git commit -m "fix: strengthen cloud run guide editorial structure"
```
