# AWS S3 Glacier Pricing Guide Refresh Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Strengthen the AWS S3 Glacier pricing guide so it answers storage-class pricing intent sooner while preserving the page's archive bill-boundary role.

**Architecture:** Keep the existing archive-bill structure, but add a pricing-first opening that explains the current Glacier storage classes, minimum storage duration rules, metadata overhead, and retrieval-cost boundaries. Preserve the distinction between archive-native charges and downstream processing or workflow costs so the page remains the bill-boundary reference for Glacier/Deep Archive planning.

**Tech Stack:** Astro guide page, node:test, generated guide metadata, AWS S3 pricing documentation, S3 storage class documentation.

---

### Task 1: Add a failing Glacier guide coverage test

**Files:**
- Modify: `tests/s3-glacier-cluster-role-separation.test.mjs`
- Modify: `tests/high-opportunity-page-review.test.mjs`

**Step 1: Write the failing test**

Add assertions that the Glacier pricing page now includes a pricing-first quick read covering storage classes, minimum storage duration, metadata overhead, and retrieval distinctions.

**Step 2: Run test to verify it fails**

Run: `node --test tests/s3-glacier-cluster-role-separation.test.mjs tests/high-opportunity-page-review.test.mjs`
Expected: FAIL because the pricing snapshot and Glacier-class distinctions are not yet present.

**Step 3: Write minimal implementation**

Update the Glacier pricing guide content and metadata to satisfy the new assertions while keeping the archive bill-boundary page role intact.

**Step 4: Run test to verify it passes**

Run: `node --test tests/s3-glacier-cluster-role-separation.test.mjs tests/high-opportunity-page-review.test.mjs`
Expected: PASS

**Step 5: Commit**

```bash
git add docs/plans/2026-06-18-aws-s3-glacier-pricing-refresh.md tests/s3-glacier-cluster-role-separation.test.mjs tests/high-opportunity-page-review.test.mjs src/pages/guides/aws-s3-glacier-pricing.astro src/lib/guides.generated.ts
git commit -m "feat: sharpen Glacier pricing guide"
```
