# Tenth Page Quality Batch Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Strengthen page-specific budget framing and validation language across three CloudWatch pricing guides without changing their established observability-cluster roles.

**Architecture:** Add regression coverage for sharper bill-boundary and validation wording first, then make small copy updates on the pricing pages while preserving the existing pricing vs estimate vs optimization separation.

**Tech Stack:** Astro guide pages, Node test runner

---

### Task 1: Lock the batch targets with tests

**Files:**
- Create: `tests/tenth-page-quality-batch.test.mjs`

**Step 1: Write the failing test**

Add assertions that the selected pricing pages:
- use stronger page-specific validation language
- reinforce real charge-ownership decisions
- avoid generic sign-off wording while keeping existing observability role boundaries intact

**Step 2: Run test to verify it fails**

Run: `node --test tests/tenth-page-quality-batch.test.mjs`
Expected: FAIL because the sharper wording does not yet exist.

### Task 2: Apply minimal copy improvements

**Files:**
- Modify: `src/pages/guides/aws-cloudwatch-metrics-pricing.astro`
- Modify: `src/pages/guides/aws-cloudwatch-logs-insights-pricing.astro`
- Modify: `src/pages/guides/aws-cloudwatch-alarms-pricing.astro`

**Step 1: Add page-specific budget framing**

Use wording that matches each page's actual job:
- metrics pricing should stay focused on CloudWatch-native metrics ownership versus downstream consumers
- Logs Insights pricing should stay focused on scanned-GB ownership versus wider log-platform cost
- alarms pricing should stay focused on alarm inventory ownership versus delivery and surrounding observability costs

**Step 2: Add more concrete validation and handoff language**

Keep the pages grounded in realistic review behavior:
- budget review
- bill reconciliation
- scenario comparison
- adjacent page routing

**Step 3: Preserve role boundaries**

Do not weaken:
- pricing vs estimate vs optimization separation
- existing CloudWatch cluster governance wording

### Task 3: Verify the batch

**Files:**
- Verify: `tests/tenth-page-quality-batch.test.mjs`
- Verify: `tests/cloudwatch-metrics-cluster-role-separation.test.mjs`
- Verify: `tests/cloudwatch-logs-insights-role-separation.test.mjs`
- Verify: `tests/cloudwatch-alarms-cluster-role-separation.test.mjs`

**Step 1: Run targeted tests**

Run the new batch test plus the existing CloudWatch role-separation tests.

**Step 2: Run broader checks**

Run:
- `npm test`
- `npm run check`
- `npm run build`

**Step 3: Report exact evidence**

Only claim the batch is ready after the new test, targeted governance coverage, full suite, check, and build all pass.
