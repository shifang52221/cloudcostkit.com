# EC2 Calculator Content Depth Cleanup Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Reduce template-like section repetition on the EC2 calculator page and replace it with a tighter, stronger
EC2 planning workflow.

**Architecture:** Keep the page metadata, calculator component, and core internal-link strategy, but rewrite the support
copy in `src/pages/calculators/ec2-cost-calculator.astro` so overlapping validation, mistake, and scenario sections are
merged into fewer, more authoritative blocks.

**Tech Stack:** Astro page template, existing calculator component, local content edits

---

### Task 1: Simplify the EC2 page structure

**Files:**
- Modify: `src/pages/calculators/ec2-cost-calculator.astro`

**Step 1: Preserve the core calculator flow**

Keep:

- metadata
- calculator component
- related internal link intent

**Step 2: Merge repeated support sections**

Reduce overlap between:

- "Fast answer"
- "Result interpretation"
- "Common mistakes"
- "Accuracy checklist"
- "Failure patterns"
- "EC2 estimate reconciliation order"

**Step 3: Keep only the strongest section-level CTAs**

Retain useful next-step links without repeating generic navigation blocks.

### Task 2: Rebuild the page around a stronger EC2 estimation workflow

**Files:**
- Modify: `src/pages/calculators/ec2-cost-calculator.astro`

**Step 1: Strengthen the input and blended-rate guidance**

Keep the most useful guidance about:

- average instance-hours
- blended $/hour selection
- environment schedules
- non-compute line items

**Step 2: Improve scenario and reconciliation guidance**

Keep scenario planning and finance-alignment guidance, but present it as one tighter workflow instead of several small
sections.

### Task 3: Verify quality and build stability

**Files:**
- Review: `src/pages/calculators/ec2-cost-calculator.astro`
- Review: `docs/plans/2026-03-28-ec2-calculator-content-depth-design.md`
- Review: `docs/plans/2026-03-28-ec2-calculator-content-depth.md`

**Step 1: Run non-ASCII audit**

Run:

`rg -n "[^\x00-\x7F]" src/pages/calculators/ec2-cost-calculator.astro docs/plans/2026-03-28-ec2-calculator-content-depth-design.md docs/plans/2026-03-28-ec2-calculator-content-depth.md`

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
- Add: `docs/plans/2026-03-28-ec2-calculator-content-depth-design.md`
- Add: `docs/plans/2026-03-28-ec2-calculator-content-depth.md`
- Modify: `src/pages/calculators/ec2-cost-calculator.astro`

**Step 1: Commit docs**

```bash
git add docs/plans/2026-03-28-ec2-calculator-content-depth-design.md docs/plans/2026-03-28-ec2-calculator-content-depth.md
git commit -m "docs: add ec2 calculator content depth plan"
```

**Step 2: Commit implementation**

```bash
git add src/pages/calculators/ec2-cost-calculator.astro
git commit -m "fix: strengthen ec2 calculator editorial structure"
```
