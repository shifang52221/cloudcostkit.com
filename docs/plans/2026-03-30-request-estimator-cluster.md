# Request Estimator and Utility Calculator Cluster Depth Cleanup Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Remove another template-heavy cluster by rewriting six support estimators and utilities around their actual
request, fan-out, retry, and conversion roles.

**Architecture:** Keep the current widgets and support-page positioning, but replace repeated editorial tails with
compact, role-specific guidance about API bursts, queue request multiplication, SNS fan-out, KMS call density, request
conversion, and S3 operation mix.

**Tech Stack:** Astro page content, existing calculator components, internal links

---

### Task 1: Record the request-estimator batch

**Files:**
- Create: `docs/plans/2026-03-30-request-estimator-cluster-design.md`
- Create: `docs/plans/2026-03-30-request-estimator-cluster.md`

**Step 1: Capture the support cluster**

Document the six target pages and the repeated-tail problem still present in them.

**Step 2: Capture each page role**

Document how API Gateway requests, SQS requests, SNS deliveries, KMS requests, RPS conversion, and S3 request pricing
serve different points in the broader request-billing workflow.

### Task 2: Rewrite the product-specific estimators

**Files:**
- Modify: `src/pages/calculators/aws-api-gateway-request-estimator.astro`
- Modify: `src/pages/calculators/aws-sqs-request-estimator.astro`
- Modify: `src/pages/calculators/aws-sns-delivery-estimator.astro`
- Modify: `src/pages/calculators/aws-kms-request-estimator.astro`

**Step 1: Remove repeated template sections**

Delete the generic support-page tail language.

**Step 2: Rebuild around product-specific multipliers**

Add tailored guidance about:

- gateway burst windows and retry amplification
- queue lifecycle request multiplication
- publish-to-delivery fan-out
- workload-unit to KMS call-density translation

### Task 3: Rewrite the conversion and request-cost utilities

**Files:**
- Modify: `src/pages/calculators/rps-to-monthly-requests-calculator.astro`
- Modify: `src/pages/calculators/s3-request-cost-calculator.astro`

**Step 1: Preserve support-page role**

Keep:

- `rps-to-monthly-requests` as a bridge utility
- `s3-request-cost-calculator` as a request-class cost page

**Step 2: Replace generic support prose**

Add tailored guidance about:

- rate-to-volume conversion boundaries
- operation mix, metadata-heavy access, multipart behavior, and retry-driven request costs

### Task 4: Verify quality and stability

**Files:**
- Review: `docs/plans/2026-03-30-request-estimator-cluster-design.md`
- Review: `docs/plans/2026-03-30-request-estimator-cluster.md`
- Review: `src/pages/calculators/aws-api-gateway-request-estimator.astro`
- Review: `src/pages/calculators/aws-sqs-request-estimator.astro`
- Review: `src/pages/calculators/aws-sns-delivery-estimator.astro`
- Review: `src/pages/calculators/aws-kms-request-estimator.astro`
- Review: `src/pages/calculators/rps-to-monthly-requests-calculator.astro`
- Review: `src/pages/calculators/s3-request-cost-calculator.astro`

**Step 1: Run content audit**

Confirm the repeated generic headings are gone and all touched files remain ASCII-only.

**Step 2: Run project verification**

Run:

- `npm run check`
- `npm run build`

**Step 3: Commit cleanly**

Commit docs separately from implementation, then push `thin-page-triage` for merge and live verification.
