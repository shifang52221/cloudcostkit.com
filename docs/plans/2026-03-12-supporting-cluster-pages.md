# Supporting Cluster Pages Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Strengthen existing support guides for CDN comparison, CDN per-GB pricing, AWS data transfer, and Azure egress so the site captures more long-tail search intent without broad page expansion.

**Architecture:** This pass improves the second layer of the site's content clusters. Instead of creating many new pages, we will sharpen the existing support guides so they better match long-tail search language and connect more clearly to primary guides and calculators.

**Tech Stack:** Astro 5, static `.astro` guide pages, generated guide metadata, internal-link-driven content architecture

---

### Task 1: Document the Support-Page Strategy

**Files:**
- Create: `docs/plans/2026-03-12-supporting-cluster-pages-design.md`
- Create: `docs/plans/2026-03-12-supporting-cluster-pages.md`

**Step 1: Capture the wave-3 targets**

Document the live support-page query patterns for:

- CDN comparison
- CDN per-GB pricing
- AWS data transfer / network cost
- Azure egress pricing

Expected: A design document and implementation plan that explain why this pass strengthens existing support pages instead of creating a large new page set.

**Step 2: Review for scope control**

Confirm the docs clearly prefer strengthening indexed support pages over publishing broad new content.

Expected: The docs are usable as a repeatable wave-3 playbook.

**Step 3: Commit**

```bash
git add docs/plans/2026-03-12-supporting-cluster-pages-design.md docs/plans/2026-03-12-supporting-cluster-pages.md
git commit -m "docs: add supporting cluster page plan"
```

### Task 2: Strengthen the CDN Comparison Support Guide

**Files:**
- Modify: `src/pages/guides/cdn-cost-comparison.astro`

**Step 1: Reproduce the query target**

Use the live query list and confirm the page needs stronger early coverage for:

- `cdn cost comparison`
- `cdn pricing comparison`
- provider-comparison intent such as `cloudfront cdn pricing`

Expected: A short checklist of wording and link improvements before editing.

**Step 2: Apply the minimal support-page upgrades**

- tighten title and intro around comparison language
- add clearer "guide vs calculator" framing
- strengthen provider-comparison pathways
- connect the page more explicitly to the main CDN cost guide and calculators

**Step 3: Verify integrity**

Run: `npm run check`

Expected: PASS.

**Step 4: Commit**

```bash
git add src/pages/guides/cdn-cost-comparison.astro
git commit -m "feat: strengthen cdn comparison support page"
```

### Task 3: Strengthen the CDN Per-GB Support Guide

**Files:**
- Modify: `src/pages/guides/cdn-cost-per-gigabyte.astro`

**Step 1: Reproduce the query target**

Use the live query list and confirm the page needs stronger early coverage for:

- `cdn costs per gb`
- `cdn cost per gigabyte`
- `cdn cost per gb`

Expected: A short checklist of per-GB language and supporting links before editing.

**Step 2: Apply the minimal support-page upgrades**

- tighten title and intro around per-GB search phrasing
- clarify when per-GB is a valid proxy and when it fails
- add provider and comparison pathways
- link back to the main CDN cost page and comparison page more clearly

**Step 3: Verify integrity**

Run: `npm run check`

Expected: PASS.

**Step 4: Commit**

```bash
git add src/pages/guides/cdn-cost-per-gigabyte.astro
git commit -m "feat: strengthen cdn per-gb support page"
```

### Task 4: Strengthen the AWS Data Transfer Support Guide

**Files:**
- Modify: `src/pages/guides/aws-network-costs.astro`

**Step 1: Reproduce the query target**

Use the live query list and confirm the page needs stronger early coverage for:

- `aws data transfer cost calculator`
- `aws data transfer pricing calculator`

Expected: A short note describing how to bridge data-transfer intent into the broader AWS network cost model.

**Step 2: Apply the minimal support-page upgrades**

- tighten intro and title support around AWS data transfer language
- add a section that clarifies egress vs data transfer vs network cost buckets
- add earlier calculator and transfer-path links
- strengthen pathways back to the main egress guide and network calculators

**Step 3: Verify integrity**

Run: `npm run check`

Expected: PASS.

**Step 4: Commit**

```bash
git add src/pages/guides/aws-network-costs.astro
git commit -m "feat: strengthen aws data transfer support page"
```

### Task 5: Strengthen the Azure Egress Support Guide

**Files:**
- Modify: `src/pages/guides/azure-bandwidth-egress-costs.astro`

**Step 1: Reproduce the query target**

Use the live query list and confirm the page needs stronger early coverage for:

- `azure egress cost calculator`
- `azure egress cost`
- `azure egress pricing`

Expected: A short checklist of Azure-shaped phrasing and calculator pathways before editing.

**Step 2: Apply the minimal support-page upgrades**

- tighten intro and FAQ coverage around Azure egress language
- add guide-first vs calculator-first framing
- strengthen links to the generic egress calculator and related cross-cloud guides
- make destination-boundary modeling more obvious on first read

**Step 3: Verify integrity**

Run: `npm run check`

Expected: PASS.

**Step 4: Commit**

```bash
git add src/pages/guides/azure-bandwidth-egress-costs.astro
git commit -m "feat: strengthen azure egress support page"
```

### Task 6: Final Verification

**Files:**
- Modify: all files from Tasks 1-5

**Step 1: Run the full verification suite**

Run:

- `npm run check`
- `npm run build`
- `git status --short`

Expected:

- `npm run check` passes
- `npm run build` passes
- `git status --short` shows only intended tracked changes before final commit, or a clean tree after commits

**Step 2: Review against the goal**

Confirm all of the following are true:

- the support-page strategy is documented
- CDN comparison and per-GB guides better reflect live long-tail queries
- AWS network and Azure egress guides better bridge calculator intent into the existing clusters
- the site remains technically clean

**Step 3: Final commit**

```bash
git add .
git commit -m "feat: strengthen supporting cluster pages"
```
