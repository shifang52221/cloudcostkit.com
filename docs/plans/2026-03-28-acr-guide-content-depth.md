# ACR Guide Content Depth Cleanup Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Reduce template-style repetition in the Azure Container Registry pricing guide and turn it into a tighter ACR
cost-planning workflow.

**Architecture:** Keep the guide metadata, FAQs, and core internal links, but rewrite the body of
`src/pages/guides/azure-container-registry-pricing.astro` so storage, pull behavior, cross-region effects, tier
decisions, and validation are presented as a few stronger sections rather than many overlapping fragments.

**Tech Stack:** Astro guide page, local content edits, existing internal-link structure

---

### Task 1: Simplify the guide structure

**Files:**
- Modify: `src/pages/guides/azure-container-registry-pricing.astro`

**Step 1: Preserve the guide's core topic coverage**

Keep:

- storage
- pull volume
- egress
- cross-region and geo-replication
- tier comparison

**Step 2: Merge repeated support sections**

Reduce overlap between:

- short answer
- define scope
- calculator inputs
- worked estimate template
- common pitfalls
- validation
- tier decision framework
- failure patterns
- related tools

### Task 2: Rebuild the guide around a stronger ACR planning workflow

**Files:**
- Modify: `src/pages/guides/azure-container-registry-pricing.astro`

**Step 1: Strengthen the driver-first framing**

Keep and sharpen guidance about:

- stored GB and retention
- CI and cluster pull storms
- billed transfer paths
- regional topology
- upgrade triggers

**Step 2: Tighten tier and validation guidance**

Present tier changes, operational failure modes, and estimate validation as fewer stronger sections rather than many
small sections.

### Task 3: Verify quality and build stability

**Files:**
- Review: `src/pages/guides/azure-container-registry-pricing.astro`
- Review: `docs/plans/2026-03-28-acr-guide-content-depth-design.md`
- Review: `docs/plans/2026-03-28-acr-guide-content-depth.md`

**Step 1: Run non-ASCII audit**

Run:

`rg -n "[^\x00-\x7F]" src/pages/guides/azure-container-registry-pricing.astro docs/plans/2026-03-28-acr-guide-content-depth-design.md docs/plans/2026-03-28-acr-guide-content-depth.md`

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
- Add: `docs/plans/2026-03-28-acr-guide-content-depth-design.md`
- Add: `docs/plans/2026-03-28-acr-guide-content-depth.md`
- Modify: `src/pages/guides/azure-container-registry-pricing.astro`

**Step 1: Commit docs**

```bash
git add docs/plans/2026-03-28-acr-guide-content-depth-design.md docs/plans/2026-03-28-acr-guide-content-depth.md
git commit -m "docs: add acr guide content depth plan"
```

**Step 2: Commit implementation**

```bash
git add src/pages/guides/azure-container-registry-pricing.astro
git commit -m "fix: strengthen acr guide editorial structure"
```
