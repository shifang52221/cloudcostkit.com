# S3 Governance Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Strengthen the newer AWS S3 guide family so each page owns a distinct role beneath the storage parent instead
of behaving like another generic S3 explainer.

**Architecture:** Treat the four `aws-s3-*` guides as one bounded governance batch. Add a focused regression test for
role separation, then make minimal first-screen and routing changes so each page owns one narrower S3 question:
pricing anatomy, storage-class choice, request-cost boundary, or replication copy-path economics.

**Tech Stack:** Astro guide pages, Node test runner, Markdown planning docs, verification through `node --test`,
`npm run check`, and `npm run build`.

---

### Task 1: Write the failing regression test

**Files:**
- Create: `tests/s3-governance.test.mjs`
- Read: `src/pages/guides/aws-s3-pricing.astro`
- Read: `src/pages/guides/aws-s3-storage-classes.astro`
- Read: `src/pages/guides/aws-s3-request-costs.astro`
- Read: `src/pages/guides/aws-s3-replication-pricing.astro`

**Step 1:** Write a test that loads the four guide files, normalizes whitespace, and asserts:

- `aws-s3-pricing` declares itself as the S3 pricing anatomy page
- `aws-s3-storage-classes` declares itself as the storage-class decision page
- `aws-s3-request-costs` declares itself as the request-cost boundary page
- `aws-s3-replication-pricing` declares itself as the storage copy-path economics page
- all four pages route broader storage-budget questions back to `storage-costs`

**Step 2:** Run `node --test tests/s3-governance.test.mjs`.

Expected: FAIL because the stronger hierarchy statements do not yet exist.

### Task 2: Implement the role split

**Files:**
- Modify: `src/pages/guides/aws-s3-pricing.astro`
- Modify: `src/pages/guides/aws-s3-storage-classes.astro`
- Modify: `src/pages/guides/aws-s3-request-costs.astro`
- Modify: `src/pages/guides/aws-s3-replication-pricing.astro`

**Step 1:** In `aws-s3-pricing.astro`, add a first-screen role statement that frames the page as the S3 pricing
anatomy page and routes broader storage-budget questions back to `storage-costs`.

**Step 2:** In `aws-s3-storage-classes.astro`, add a role statement that frames the page as the storage-class decision
page and routes broader storage-budget questions back to `storage-costs`.

**Step 3:** In `aws-s3-request-costs.astro`, add a role statement that frames the page as the request-cost boundary
page and routes broader storage-budget questions back to `storage-costs`.

**Step 4:** In `aws-s3-replication-pricing.astro`, add a role statement that frames the page as the storage copy-path
economics page and routes broader storage-budget questions back to `storage-costs`.

**Step 5:** Keep the batch limited to these four guides unless a direct blocker forces a scope change.

### Task 3: Run verification

**Files:**
- Tests and guides from Tasks 1-2

**Step 1:** Run `node --test tests/s3-governance.test.mjs`.

Expected: PASS.

**Step 2:** Run `npm run check`.

Expected: `0 errors`, `0 warnings`, and only the accepted existing hints.

**Step 3:** Run `npm run build`.

Expected: success.

### Task 4: Commit

**Files:** the four guides plus the new regression test and the planning docs

**Step:** `git add docs/plans/2026-04-05-s3-governance-design.md docs/plans/2026-04-05-s3-governance.md tests/s3-governance.test.mjs src/pages/guides/aws-s3-pricing.astro src/pages/guides/aws-s3-storage-classes.astro src/pages/guides/aws-s3-request-costs.astro src/pages/guides/aws-s3-replication-pricing.astro`

`git commit -m "feat: strengthen s3 guide roles"`
