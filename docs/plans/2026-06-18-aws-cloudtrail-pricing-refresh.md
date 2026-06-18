# AWS CloudTrail Pricing Guide Refresh Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Strengthen the AWS CloudTrail pricing guide so it answers pricing intent earlier, clearly separates trails from CloudTrail Lake, and preserves the page's bill-boundary role.

**Architecture:** Keep the existing bill-boundary structure, but move the first pricing answer to the top of the page. Add a short pricing snapshot that explicitly covers the free first copy of management events, the cost-sensitive roles of data events and Insights, and the distinction between Trails and CloudTrail Lake. Preserve downstream storage, scan, and SIEM separation so the page remains the canonical bill-boundary reference.

**Tech Stack:** Astro guide page, node:test, generated guide metadata, AWS CloudTrail pricing documentation, AWS CloudTrail user guide.

---

### Task 1: Add a failing CloudTrail guide coverage test

**Files:**
- Modify: `tests/cloudtrail-cluster-role-separation.test.mjs`
- Modify: `tests/thirteenth-ctr-rescue-batch.test.mjs`

**Step 1: Write the failing test**

Add assertions that the CloudTrail pricing page now explicitly mentions the free first copy of management events, trails vs CloudTrail Lake, and a pricing-first opening that frames data events and Insights as the main cost-sensitive drivers.

**Step 2: Run test to verify it fails**

Run: `node --test tests/cloudtrail-cluster-role-separation.test.mjs tests/thirteenth-ctr-rescue-batch.test.mjs`
Expected: FAIL because the new pricing snapshot and pricing-first wording are not yet present.

**Step 3: Write minimal implementation**

Update the CloudTrail pricing guide content and metadata to satisfy the new assertions while keeping the bill-boundary page role intact.

**Step 4: Run test to verify it passes**

Run: `node --test tests/cloudtrail-cluster-role-separation.test.mjs tests/thirteenth-ctr-rescue-batch.test.mjs`
Expected: PASS

**Step 5: Commit**

```bash
git add docs/plans/2026-06-18-aws-cloudtrail-pricing-refresh.md tests/cloudtrail-cluster-role-separation.test.mjs tests/thirteenth-ctr-rescue-batch.test.mjs src/pages/guides/aws-cloudtrail-pricing.astro src/lib/guides.generated.ts
git commit -m "feat: sharpen CloudTrail pricing guide"
```
