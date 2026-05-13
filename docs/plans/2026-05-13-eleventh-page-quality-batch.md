# Eleventh Page Quality Batch Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Strengthen evidence-building, handoff, and validation language across three CloudWatch estimate guides without changing their established measurement-workflow roles.

**Architecture:** Add regression coverage for sharper estimate-page evidence and handoff wording first, then make small copy updates while preserving the existing pricing vs estimate vs optimization separation across the CloudWatch clusters.

**Tech Stack:** Astro guide pages, Node test runner

---

### Task 1: Lock the batch targets with tests

**Files:**
- Create: `tests/eleventh-page-quality-batch.test.mjs`

**Step 1: Write the failing test**

Add assertions that the selected estimate pages:
- use more concrete evidence-pack and validation language
- distinguish baseline behavior from spike or growth behavior more clearly
- route readers onward with less generic handoff language

**Step 2: Run test to verify it fails**

Run: `node --test tests/eleventh-page-quality-batch.test.mjs`
Expected: FAIL because the sharper estimate-page wording does not yet exist.

### Task 2: Apply minimal copy improvements

**Files:**
- Modify: `src/pages/guides/aws-cloudwatch-metrics-estimate-custom-metrics.astro`
- Modify: `src/pages/guides/aws-cloudwatch-logs-insights-estimate-scanned-gb.astro`
- Modify: `src/pages/guides/aws-cloudwatch-alarms-estimate-alarm-count.astro`

**Step 1: Add more concrete evidence-building language**

Use wording that matches each page's real estimation job:
- metrics estimate should stay focused on defendable active-series evidence
- Logs Insights estimate should stay focused on scan-behavior evidence across routine and incident usage
- alarms estimate should stay focused on inventory-growth evidence across baseline and ephemeral activity

**Step 2: Add more explicit handoff language**

Make it clearer when the reader should:
- return to pricing because bill boundaries are still unclear
- move to optimization because the dominant driver is now credible

**Step 3: Preserve role boundaries**

Do not weaken:
- estimate vs pricing vs optimization separation
- existing CloudWatch cluster governance wording

### Task 3: Verify the batch

**Files:**
- Verify: `tests/eleventh-page-quality-batch.test.mjs`
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

Only claim the batch is ready after the new quality test, targeted governance coverage, full suite, check, and build all pass.
