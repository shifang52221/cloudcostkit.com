# Event Hubs Guide Content Depth Cleanup Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Reduce template-style repetition in the Azure Event Hubs pricing guide and rebuild it as a tighter Event Hubs
cost-planning workflow.

**Architecture:** Keep the guide metadata, FAQs, and core internal links, but rewrite the body of
`src/pages/guides/azure-event-hubs-pricing.astro` so ingestion, retention, replay behavior, burst traffic, and
downstream amplification are presented as a few stronger sections instead of many overlapping support blocks.

**Tech Stack:** Astro guide page, local content edits, existing internal-link structure

---

### Task 1: Simplify the guide structure

**Files:**
- Modify: `src/pages/guides/azure-event-hubs-pricing.astro`

**Step 1: Preserve the guide's core topic coverage**

Keep:

- ingestion volume
- retention
- consumer groups and replays
- burst windows
- downstream and egress adjacency

**Step 2: Merge repeated support sections**

Reduce overlap between:

- short answer
- estimate inputs
- quick model
- define stream scope
- worked estimate template
- common pitfalls
- validation
- related tools

### Task 2: Rebuild the guide around a stronger Event Hubs workflow

**Files:**
- Modify: `src/pages/guides/azure-event-hubs-pricing.astro`

**Step 1: Strengthen the byte-first framing**

Keep and sharpen guidance about:

- bytes per event
- burst versus baseline ingestion
- retention windows
- consumer replay behavior
- downstream cost amplification

**Step 2: Tighten failure and validation guidance**

Present replay risk, lag, retention, and downstream cost checks as fewer stronger sections rather than many small
template blocks.

### Task 3: Verify quality and build stability

**Files:**
- Review: `src/pages/guides/azure-event-hubs-pricing.astro`
- Review: `docs/plans/2026-03-28-event-hubs-guide-content-depth-design.md`
- Review: `docs/plans/2026-03-28-event-hubs-guide-content-depth.md`

**Step 1: Run non-ASCII audit**

Run:

`rg -n "[^\x00-\x7F]" src/pages/guides/azure-event-hubs-pricing.astro docs/plans/2026-03-28-event-hubs-guide-content-depth-design.md docs/plans/2026-03-28-event-hubs-guide-content-depth.md`

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
- Add: `docs/plans/2026-03-28-event-hubs-guide-content-depth-design.md`
- Add: `docs/plans/2026-03-28-event-hubs-guide-content-depth.md`
- Modify: `src/pages/guides/azure-event-hubs-pricing.astro`

**Step 1: Commit docs**

```bash
git add docs/plans/2026-03-28-event-hubs-guide-content-depth-design.md docs/plans/2026-03-28-event-hubs-guide-content-depth.md
git commit -m "docs: add event hubs guide content depth plan"
```

**Step 2: Commit implementation**

```bash
git add src/pages/guides/azure-event-hubs-pricing.astro
git commit -m "fix: strengthen event hubs guide editorial structure"
```
