# Storage Cluster Calculators Depth Cleanup Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Remove the next large calculator template cluster by rewriting five storage-related calculators around their
true billing boundaries and operational failure modes.

**Architecture:** Keep the existing calculator components and multi-tool sections, but replace the remaining generic
editorial tails on the storage calculator cluster with page-specific guidance about storage, requests, retrieval,
replication, and transfer.

**Tech Stack:** Astro page content, existing calculator components, internal links

---

### Task 1: Add planning docs for the storage cluster batch

**Files:**
- Create: `docs/plans/2026-03-29-storage-cluster-calculators-design.md`
- Create: `docs/plans/2026-03-29-storage-cluster-calculators.md`

**Step 1: Record the cluster**

Document the five target storage calculators and the repeated tail pattern still present in the cluster.

**Step 2: Lock the page scope**

Document the target files:

- `src/pages/calculators/s3-cost-calculator.astro`
- `src/pages/calculators/object-storage-cost-calculator.astro`
- `src/pages/calculators/storage-pricing-calculator.astro`
- `src/pages/calculators/aws-s3-glacier-cost-calculator.astro`
- `src/pages/calculators/storage-replication-cost-calculator.astro`

### Task 2: Rewrite S3 and object-storage calculator tails

**Files:**
- Modify: `src/pages/calculators/s3-cost-calculator.astro`
- Modify: `src/pages/calculators/object-storage-cost-calculator.astro`

**Step 1: Remove generic repeated sections**

Remove the shared bottom-of-page sections that still read like template carryover.

**Step 2: Rebuild around object-storage cost behavior**

Add tailored guidance about:

- storage versus requests versus egress versus replication
- small-object and churn patterns
- when access behavior changes the dominant line item

### Task 3: Rewrite storage-pricing and Glacier calculator tails

**Files:**
- Modify: `src/pages/calculators/storage-pricing-calculator.astro`
- Modify: `src/pages/calculators/aws-s3-glacier-cost-calculator.astro`

**Step 1: Preserve the current calculator purpose**

Keep each page's current role:

- `storage-pricing-calculator` as the generic broad pricing page
- `aws-s3-glacier-cost-calculator` as the archive-specific page

**Step 2: Replace generic tail language with page-specific cost logic**

Add tailored guidance about:

- blended generic storage pricing and when it breaks down
- archival retrieval shocks, request-heavy restores, and archive-specific boundary errors

### Task 4: Tighten the replication calculator tail

**Files:**
- Modify: `src/pages/calculators/storage-replication-cost-calculator.astro`

**Step 1: Keep the stronger existing structure**

Preserve the page's better existing content about changed GB and replication modes.

**Step 2: Remove leftover template residue**

Replace the remaining generic validation bullets with replication-specific reconciliation and next-step guidance.

### Task 5: Verify quality and build stability

**Files:**
- Review: `docs/plans/2026-03-29-storage-cluster-calculators-design.md`
- Review: `docs/plans/2026-03-29-storage-cluster-calculators.md`
- Review: `src/pages/calculators/s3-cost-calculator.astro`
- Review: `src/pages/calculators/object-storage-cost-calculator.astro`
- Review: `src/pages/calculators/storage-pricing-calculator.astro`
- Review: `src/pages/calculators/aws-s3-glacier-cost-calculator.astro`
- Review: `src/pages/calculators/storage-replication-cost-calculator.astro`

**Step 1: Run non-ASCII audit**

Run:

`rg -n "[^\x00-\x7F]" src/pages/calculators/s3-cost-calculator.astro src/pages/calculators/object-storage-cost-calculator.astro src/pages/calculators/storage-pricing-calculator.astro src/pages/calculators/aws-s3-glacier-cost-calculator.astro src/pages/calculators/storage-replication-cost-calculator.astro docs/plans/2026-03-29-storage-cluster-calculators-design.md docs/plans/2026-03-29-storage-cluster-calculators.md`

Expected: no matches.

**Step 2: Run project verification**

Run:

`npm run check`

Expected: pass with no new errors.

Run:

`npm run build`

Expected: successful production build.

### Task 6: Commit the batch

**Files:**
- Add: `docs/plans/2026-03-29-storage-cluster-calculators-design.md`
- Add: `docs/plans/2026-03-29-storage-cluster-calculators.md`
- Modify: `src/pages/calculators/s3-cost-calculator.astro`
- Modify: `src/pages/calculators/object-storage-cost-calculator.astro`
- Modify: `src/pages/calculators/storage-pricing-calculator.astro`
- Modify: `src/pages/calculators/aws-s3-glacier-cost-calculator.astro`
- Modify: `src/pages/calculators/storage-replication-cost-calculator.astro`

**Step 1: Commit docs**

```bash
git add docs/plans/2026-03-29-storage-cluster-calculators-design.md docs/plans/2026-03-29-storage-cluster-calculators.md
git commit -m "docs: add storage cluster calculator plan"
```

**Step 2: Commit implementation**

```bash
git add src/pages/calculators/s3-cost-calculator.astro src/pages/calculators/object-storage-cost-calculator.astro src/pages/calculators/storage-pricing-calculator.astro src/pages/calculators/aws-s3-glacier-cost-calculator.astro src/pages/calculators/storage-replication-cost-calculator.astro
git commit -m "fix: de-template storage cluster calculators"
```
