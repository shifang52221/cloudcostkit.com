# Noindex Helper Cleanup Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Remove the last obvious template-boilerplate descriptions from the noindex helper calculator layer while
keeping each page's support-only role intact.

**Architecture:** Add one focused regression test for the helper batch, then rewrite the seven targeted description
strings so they remain compact, role-specific, and clearly noindex support tools rather than primary landing pages.

**Tech Stack:** Astro page content, Node test runner, existing calculator layouts

---

### Task 1: Record the approved helper-cleanup batch

**Files:**
- Create: `docs/plans/2026-04-21-noindex-helper-cleanup-design.md`
- Create: `docs/plans/2026-04-21-noindex-helper-cleanup.md`

**Step 1: Capture scope**

Document the seven helper pages that still carry the old boilerplate description tail.

**Step 2: Capture non-goals**

Record that this batch does not change:

- sitemap policy
- `noindex,follow` usage
- page architecture
- indexable guide/calculator prioritization

### Task 2: Write the failing regression test

**Files:**
- Create: `tests/noindex-helper-description-hardening.test.mjs`

**Step 1: Write the failing test**

Cover the seven target files explicitly and assert:

- descriptions do not include `Educational use only.`
- each file still declares `robots="noindex,follow"`

**Step 2: Run the test to verify it fails**

Run:

- `node --test tests/noindex-helper-description-hardening.test.mjs`

Expected: FAIL because the targeted descriptions still contain the boilerplate suffix.

### Task 3: Rewrite the noindex helper descriptions

**Files:**
- Modify: `src/pages/calculators/aws-api-gateway-request-estimator.astro`
- Modify: `src/pages/calculators/aws-kms-request-estimator.astro`
- Modify: `src/pages/calculators/aws-sns-delivery-estimator.astro`
- Modify: `src/pages/calculators/aws-sqs-request-estimator.astro`
- Modify: `src/pages/calculators/aws-waf-request-estimator.astro`
- Modify: `src/pages/calculators/rps-to-monthly-requests-calculator.astro`
- Modify: `src/pages/calculators/compute-instance-cost-calculator.astro`

**Step 1: Remove the boilerplate suffix**

Replace the old educational disclaimer phrasing in each `description`.

**Step 2: Rebuild the descriptions around page role**

Use short, distinct descriptions that reflect:

- retry-amplified gateway volume
- crypto-call density
- publish-to-delivery fan-out
- queue lifecycle request multiplication
- evaluated WAF traffic plus attack windows
- rate-to-period conversion
- generic billable-hours cross-checking

### Task 4: Verify the batch

**Files:**
- Review: `tests/noindex-helper-description-hardening.test.mjs`
- Review: `src/pages/calculators/aws-api-gateway-request-estimator.astro`
- Review: `src/pages/calculators/aws-kms-request-estimator.astro`
- Review: `src/pages/calculators/aws-sns-delivery-estimator.astro`
- Review: `src/pages/calculators/aws-sqs-request-estimator.astro`
- Review: `src/pages/calculators/aws-waf-request-estimator.astro`
- Review: `src/pages/calculators/rps-to-monthly-requests-calculator.astro`
- Review: `src/pages/calculators/compute-instance-cost-calculator.astro`

**Step 1: Run the focused regression test**

Run:

- `node --test tests/noindex-helper-description-hardening.test.mjs`

Expected: PASS

**Step 2: Run adjacent quality checks**

Run:

- `node --test tests/calculator-template-risk-hardening.test.mjs`
- `npm run check`

Expected:

- helper regression stays green
- existing calculator template-risk coverage stays green
- Astro check reports 0 errors and 0 warnings
