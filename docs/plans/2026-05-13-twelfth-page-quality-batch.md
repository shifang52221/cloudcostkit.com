# Twelfth Page Quality Batch Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Strengthen CloudWatch support-page validation and ownership language across metrics API request estimation, dashboard pricing, and CloudWatch Logs pricing without changing their existing roles or structure.

**Architecture:** Add regression coverage for sharper CloudWatch review-language first, then make small copy updates on the three target pages while preserving the existing observability cluster boundaries and routing.

**Tech Stack:** Astro guide pages, Node test runner

---

### Task 1: Lock the batch targets with tests

**Files:**
- Create: `tests/twelfth-page-quality-batch.test.mjs`

**Step 1: Write the failing test**

Add assertions that the selected pages:
- use more concrete validation and reconciliation language
- distinguish recurring baseline behavior from spike or incident behavior where relevant
- reinforce page-specific ownership without blurring neighboring page roles

**Step 2: Run test to verify it fails**

Run: `node --test tests/twelfth-page-quality-batch.test.mjs`
Expected: FAIL because the sharper wording does not yet exist.

### Task 2: Apply minimal copy improvements

**Files:**
- Modify: `src/pages/guides/aws-cloudwatch-metrics-estimate-api-requests.astro`
- Modify: `src/pages/guides/aws-cloudwatch-dashboards-pricing.astro`
- Modify: `src/pages/guides/aws-cloudwatch-logs-pricing.astro`

**Step 1: Add page-specific review language**

Use wording that matches each page's real job:
- metrics API request estimate should stay focused on persistent polling and incident-driven request expansion
- dashboard pricing should stay focused on dashboard-month ownership versus the costs dashboards trigger around them
- Logs pricing should stay focused on ingestion, retention, and query-bucket reconciliation

**Step 2: Add more specific validation and handoff language**

Make it clearer how a reviewer should:
- validate the recurring baseline
- isolate spike behavior
- route to adjacent pricing or optimization pages when needed

**Step 3: Preserve role boundaries**

Do not weaken:
- CloudWatch support-page boundaries
- surrounding observability-cluster governance

### Task 3: Verify the batch

**Files:**
- Verify: `tests/twelfth-page-quality-batch.test.mjs`
- Verify: relevant CloudWatch role-separation tests

**Step 1: Run targeted tests**

Run the new batch test plus existing related CloudWatch governance tests.

**Step 2: Run broader checks**

Run:
- `npm test`
- `npm run check`
- `npm run build`

**Step 3: Report exact evidence**

Only claim the batch is ready after the new quality test, targeted governance coverage, full suite, check, and build all pass.
