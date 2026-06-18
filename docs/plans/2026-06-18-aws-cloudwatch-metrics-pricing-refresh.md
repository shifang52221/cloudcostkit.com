# AWS CloudWatch Metrics Pricing Guide Refresh Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Strengthen the AWS CloudWatch metrics pricing guide so it answers pricing intent sooner while preserving the bill-boundary role between CloudWatch-native metrics and adjacent alarms or external observability systems.

**Architecture:** Keep the existing bill-boundary structure, but add a pricing-first opening that clarifies the main cost surfaces: custom metrics, API requests, dashboards, and high-resolution usage. Add a quick snapshot explaining that AWS service metrics are not the same as custom metrics, and separate CloudWatch metrics from alarms and external polling tools. Preserve the existing cardinality and boundary logic so the page remains the canonical guide for metrics bill ownership.

**Tech Stack:** Astro guide page, node:test, generated guide metadata, AWS CloudWatch pricing documentation, AWS CloudWatch user guide.

---

### Task 1: Add a failing CloudWatch metrics guide coverage test

**Files:**
- Modify: `tests/cloudwatch-metrics-cluster-role-separation.test.mjs`
- Modify: `tests/high-opportunity-page-review.test.mjs`

**Step 1: Write the failing test**

Add assertions that the CloudWatch metrics pricing page now includes a pricing-first quick read covering custom metrics, API requests, dashboards, and high-resolution boundaries.

**Step 2: Run test to verify it fails**

Run: `node --test tests/cloudwatch-metrics-cluster-role-separation.test.mjs tests/high-opportunity-page-review.test.mjs`
Expected: FAIL because the pricing snapshot and CloudWatch-specific billing distinctions are not yet present.

**Step 3: Write minimal implementation**

Update the CloudWatch metrics guide content and metadata to satisfy the new assertions while keeping alarms and external observability separate.

**Step 4: Run test to verify it passes**

Run: `node --test tests/cloudwatch-metrics-cluster-role-separation.test.mjs tests/high-opportunity-page-review.test.mjs`
Expected: PASS

**Step 5: Commit**

```bash
git add docs/plans/2026-06-18-aws-cloudwatch-metrics-pricing-refresh.md tests/cloudwatch-metrics-cluster-role-separation.test.mjs tests/high-opportunity-page-review.test.mjs src/pages/guides/aws-cloudwatch-metrics-pricing.astro src/lib/guides.generated.ts
git commit -m "feat: sharpen CloudWatch metrics pricing guide"
```
