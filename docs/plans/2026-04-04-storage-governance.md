# Storage Governance Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Strengthen the storage guide family so the parent page owns storage system budgeting and the three specialist pages own S3 pricing anatomy, copy-path economics, and archive-transition boundaries without overlapping.

**Architecture:** Treat the storage parent and three specialist pages as one bounded governance batch. Add a targeted regression test for role separation, then make minimal but explicit first-screen and routing changes so each page owns a different layer of the storage hierarchy.

**Tech Stack:** Astro guide pages, Node test runner, Markdown planning docs, verification through `node --test`, `npm run check`, and `npm run build`.

---

### Task 1: Write the failing regression test

**Files:**
- Create: `tests/storage-parent-governance.test.mjs`
- Read: `src/pages/guides/storage-costs.astro`
- Read: `src/pages/guides/s3-pricing-explained.astro`
- Read: `src/pages/guides/s3-replication-cost.astro`
- Read: `src/pages/guides/s3-to-glacier-transfer-cost.astro`

**Step 1:** Write a test that loads the four guide files, normalizes whitespace, and asserts:

- `storage-costs` declares itself as the storage system budgeting parent page
- `s3-pricing-explained` declares itself as the S3 pricing anatomy page
- `s3-replication-cost` declares itself as the storage copy-path economics page
- `s3-to-glacier-transfer-cost` declares itself as the archive-transition boundary page
- the three specialist pages route broader storage-budget questions back to `storage-costs`

**Step 2:** Run `node --test tests/storage-parent-governance.test.mjs`.

Expected: FAIL because the stronger hierarchy statements do not yet exist.

### Task 2: Implement the role split

**Files:**
- Modify: `src/pages/guides/storage-costs.astro`
- Modify: `src/pages/guides/s3-pricing-explained.astro`
- Modify: `src/pages/guides/s3-replication-cost.astro`
- Modify: `src/pages/guides/s3-to-glacier-transfer-cost.astro`

**Step 1:** In `storage-costs.astro`, add a first-screen role statement that explicitly frames the page as the storage system budgeting parent page.

**Step 2:** In `storage-costs.astro`, tighten the routing language so it clearly sends readers into S3 pricing, replication, and archive-transition pages only after the broader storage budget shape is clear.

**Step 3:** In `s3-pricing-explained.astro`, add a role statement that frames the page as the S3 pricing anatomy page and points broader storage-budget questions back to `storage-costs`.

**Step 4:** In `s3-replication-cost.astro`, add a role statement that frames the page as the storage copy-path economics page and points broader storage-budget questions back to `storage-costs`.

**Step 5:** In `s3-to-glacier-transfer-cost.astro`, add a role statement that frames the page as the archive-transition boundary page and points broader storage-budget questions back to `storage-costs`.

**Step 6:** Keep the batch limited to these four guides unless a blocker forces a scope change.

### Task 3: Run verification

**Files:**
- Tests and guides from Tasks 1-2

**Step 1:** Run `node --test tests/storage-parent-governance.test.mjs`.

Expected: PASS.

**Step 2:** Run `npm run check`.

Expected: `0 errors`, `0 warnings`, and only the accepted existing hints.

**Step 3:** Run `npm run build`.

Expected: success.

### Task 4: Commit

**Files:** the four guides plus the new regression test

**Step:** `git add tests/storage-parent-governance.test.mjs src/pages/guides/storage-costs.astro src/pages/guides/s3-pricing-explained.astro src/pages/guides/s3-replication-cost.astro src/pages/guides/s3-to-glacier-transfer-cost.astro`

`git commit -m "feat: strengthen storage guide roles"`
