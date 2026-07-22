# Replication and Cross-Region Role Separation Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Separate storage copy, S3 replication, replication measurement, replication calculators, cross-region transfer, and archive transition pages so each page owns one clear user job.

**Architecture:** Keep storage parent pages as routers and avoid deleting useful pages. Sharpen each overlapping page into a distinct role: copy-storage parent, AWS S3 replication bill-boundary, S3 replication workflow, write-volume measurement, known-input bill-conversion calculators, cross-region transfer line calculator, and archive-transition workflow.

**Tech Stack:** Astro pages, React calculator components, generated guide metadata, node:test, npm scripts.

---

### Task 1: Add failing role-separation tests

**Files:**
- Create: `tests/replication-cross-region-role-separation.test.mjs`

**Step 1: Write the failing test**

Add assertions for unique role language on:
- `src/pages/guides/copy-storage-pricing.astro`
- `src/pages/guides/aws-s3-replication-pricing.astro`
- `src/pages/guides/s3-replication-cost.astro`
- `src/pages/guides/estimate-replication-gb-per-month-from-writes.astro`
- `src/pages/calculators/s3-replication-cost-calculator.astro`
- `src/pages/calculators/storage-replication-cost-calculator.astro`
- `src/pages/calculators/cross-region-transfer-cost-calculator.astro`
- `src/pages/guides/s3-to-glacier-transfer-cost.astro`

**Step 2: Run test to verify it fails**

Run: `node --test tests/replication-cross-region-role-separation.test.mjs`
Expected: FAIL because the new role-specific language is not present yet.

### Task 2: Apply minimal page copy changes

**Files:**
- Modify: `src/pages/guides/copy-storage-pricing.astro`
- Modify: `src/pages/guides/aws-s3-replication-pricing.astro`
- Modify: `src/pages/guides/s3-replication-cost.astro`
- Modify: `src/pages/guides/estimate-replication-gb-per-month-from-writes.astro`
- Modify: `src/pages/calculators/s3-replication-cost-calculator.astro`
- Modify: `src/pages/calculators/storage-replication-cost-calculator.astro`
- Modify: `src/pages/calculators/cross-region-transfer-cost-calculator.astro`
- Modify: `src/pages/guides/s3-to-glacier-transfer-cost.astro`

**Step 1: Write minimal implementation**

Add concise role framing and routing language. Do not change calculator math, routes, or page structure beyond small explanatory sections.

**Step 2: Run focused tests**

Run:
`node --test tests/replication-cross-region-role-separation.test.mjs`
`node --test tests/storage-parent-governance.test.mjs`
`node --test tests/s3-governance.test.mjs`
`node --test tests/s3-glacier-cluster-role-separation.test.mjs`

Expected: all pass.

### Task 3: Full verification, commit, push, and live check

**Files:**
- Include generated metadata if `npm run check` updates `src/lib/guides.generated.ts`.

**Step 1: Run full verification**

Run:
`npm test`
`npm run check`
`npm run build`

**Step 2: Commit and push**

Run:
`git add <changed files>`
`git commit -m "feat: separate replication and cross-region page roles"`
`git push`

**Step 3: Verify live**

Check affected URLs for unique new phrases after deployment settles.
