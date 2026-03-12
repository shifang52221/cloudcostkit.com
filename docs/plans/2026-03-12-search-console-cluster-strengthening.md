# Search Console Cluster Strengthening Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Strengthen the CDN, egress, and EC2 search clusters by improving existing high-signal pages and tightening internal links between related guides and calculators.

**Architecture:** This pass builds on live Search Console demand rather than broad expansion. We will improve the strongest existing guide and calculator paths for each cluster, then add supporting hub-page links so users and crawlers can move through each topic more naturally.

**Tech Stack:** Astro 5, React 18, TypeScript, static `.astro` content pages, generated guide/tool metadata

---

### Task 1: Document the Second-Wave Cluster Strategy

**Files:**
- Create: `docs/plans/2026-03-12-search-console-cluster-strengthening-design.md`
- Create: `docs/plans/2026-03-12-search-console-cluster-strengthening.md`

**Step 1: Capture the live cluster targets**

Document the observed Search Console queries for:

- CDN pricing and comparison
- AWS egress pricing and calculator intent
- EC2 calculator and EC2 vs Fargate comparison intent

Expected: A short design document and a concrete implementation plan tied to the current demand clusters.

**Step 2: Review for scope control**

Confirm the design favors improving existing pages and internal links before publishing net-new pages.

Expected: The docs clearly explain why the current pass is cluster strengthening, not broad expansion.

**Step 3: Commit**

```bash
git add docs/plans/2026-03-12-search-console-cluster-strengthening-design.md docs/plans/2026-03-12-search-console-cluster-strengthening.md
git commit -m "docs: add second-wave search cluster plan"
```

### Task 2: Strengthen the CDN Guide Cluster

**Files:**
- Modify: `src/pages/guides/cdn-costs.astro`

**Step 1: Reproduce the query target**

Use the current query list and confirm the guide needs earlier coverage for:

- `cdn cost`
- `cdn pricing`
- `cdn cost comparison`
- `cdn cost calculator`
- `cdn cost per gigabyte`

Expected: A short checklist of wording and pathway updates before editing.

**Step 2: Apply the minimal cluster upgrades**

- tighten the intro around CDN pricing and comparison language
- add a short section on when to use the guide vs the calculator
- add clearer provider-comparison and per-GB framing
- strengthen internal links to related CDN comparison and calculator pages

**Step 3: Verify integrity**

Run: `npm run check`

Expected: PASS.

**Step 4: Commit**

```bash
git add src/pages/guides/cdn-costs.astro
git commit -m "feat: strengthen cdn pricing guide cluster"
```

### Task 3: Strengthen the Egress Guide Cluster

**Files:**
- Modify: `src/pages/guides/egress-costs.astro`

**Step 1: Reproduce the query target**

Use the current query list and confirm the guide needs stronger first-screen language for:

- `aws egress cost calculator`
- `aws egress cost`
- `aws egress pricing`
- `aws egress charges`

Expected: A short checklist of AWS-first phrasing to add without losing cross-cloud scope.

**Step 2: Apply the minimal cluster upgrades**

- tighten title and intro around AWS egress wording
- add a section that explains AWS egress pricing categories in plain language
- add clearer transitions to the egress calculator and provider-specific egress guides
- expand the validation workflow around transfer boundaries

**Step 3: Verify integrity**

Run: `npm run check`

Expected: PASS.

**Step 4: Commit**

```bash
git add src/pages/guides/egress-costs.astro
git commit -m "feat: strengthen egress guide cluster"
```

### Task 4: Strengthen the EC2 and Fargate Comparison Path

**Files:**
- Modify: `src/pages/guides/aws-ec2-cost-estimation.astro`
- Modify: `src/pages/calculators/aws-fargate-vs-ec2-cost-calculator.astro`

**Step 1: Reproduce the query target**

Use the current query list and confirm the cluster needs better support for:

- `ec2 calculator`
- `ec2 cost calculator`
- `ec2 pricing calculator`
- `ec2 vs fargate pricing`
- `fargate vs ec2`

Expected: A short note describing how the guide and comparison calculator should divide intent.

**Step 2: Apply the minimal cluster upgrades**

- add clearer calculator-intent wording to the EC2 guide
- clarify when users should use EC2-only vs Fargate-vs-EC2 comparison workflows
- strengthen non-compute caveats and next-step links
- tighten the comparison calculator intro and supporting copy around pricing-comparison intent

**Step 3: Verify integrity**

Run: `npm run check`

Expected: PASS.

**Step 4: Commit**

```bash
git add src/pages/guides/aws-ec2-cost-estimation.astro src/pages/calculators/aws-fargate-vs-ec2-cost-calculator.astro
git commit -m "feat: strengthen ec2 comparison path"
```

### Task 5: Add Stronger Cluster Pathways on Hub Pages

**Files:**
- Modify: `src/pages/calculators/index.astro`
- Modify: `src/pages/guides/index.astro`

**Step 1: Define the cluster cards**

Add one compact section to each hub page that helps users start from:

- CDN pricing/comparison
- EC2 pricing/comparison
- Egress cost/boundaries

Expected: A short implementation checklist before editing.

**Step 2: Apply the minimal hub upgrades**

- add a more explicit cluster navigation section
- link each cluster to both a guide and a calculator when possible
- keep the section early enough to matter on mobile

**Step 3: Verify integrity**

Run:

- `npm run check`
- `npm run build`

Expected: Both commands PASS.

**Step 4: Commit**

```bash
git add src/pages/calculators/index.astro src/pages/guides/index.astro
git commit -m "feat: strengthen growth cluster pathways on hubs"
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

- the docs explain the second-wave cluster strategy
- CDN and egress guide pages use live query wording more clearly
- EC2 and Fargate comparison pages form a tighter path
- hub pages expose the three priority clusters earlier

**Step 3: Final commit**

```bash
git add .
git commit -m "feat: execute second-wave search cluster improvements"
```
