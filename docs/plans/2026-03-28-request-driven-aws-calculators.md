# Request-Driven AWS Calculators Depth Cleanup Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Remove the remaining high-visibility template pattern from a second batch of request-driven AWS calculators by
replacing their shared generic tails with service-specific operational guidance.

**Architecture:** Keep the existing calculator components and `CalculatorLayout`, but rewrite the prose below the tools
for four request-driven AWS calculators so each page explains its own measurement boundaries, drift sources, and
reconciliation workflow.

**Tech Stack:** Astro page content, existing calculator components, internal links

---

### Task 1: Add planning docs for the second de-templating batch

**Files:**
- Create: `docs/plans/2026-03-28-request-driven-aws-calculators-design.md`
- Create: `docs/plans/2026-03-28-request-driven-aws-calculators.md`

**Step 1: Document the cluster**

Describe the request-driven AWS calculator cluster and why it still reads like a repeated appendix.

**Step 2: Lock the page scope**

Document the four target files:

- `src/pages/calculators/aws-sqs-cost-calculator.astro`
- `src/pages/calculators/aws-sns-cost-calculator.astro`
- `src/pages/calculators/aws-ses-cost-calculator.astro`
- `src/pages/calculators/aws-kms-cost-calculator.astro`

### Task 2: Rewrite SQS and SNS calculator tails

**Files:**
- Modify: `src/pages/calculators/aws-sqs-cost-calculator.astro`
- Modify: `src/pages/calculators/aws-sns-cost-calculator.astro`

**Step 1: Remove generic repeated sections**

Remove the shared-template sections that repeat across the calculator library.

**Step 2: Replace them with messaging-specific workflows**

Add tailored guidance about:

- request amplification
- fan-out
- retries
- batching
- delivery behavior

### Task 3: Rewrite SES and KMS calculator tails

**Files:**
- Modify: `src/pages/calculators/aws-ses-cost-calculator.astro`
- Modify: `src/pages/calculators/aws-kms-cost-calculator.astro`

**Step 1: Preserve useful handoff links**

Keep guide and companion-calculator links that still help the user move through the workflow.

**Step 2: Replace generic guidance with service-specific failure modes**

Add tailored guidance about:

- campaign spikes and attachment-heavy traffic for SES
- key inventory versus request-heavy downstream usage for KMS

### Task 4: Verify quality and build stability

**Files:**
- Review: `docs/plans/2026-03-28-request-driven-aws-calculators-design.md`
- Review: `docs/plans/2026-03-28-request-driven-aws-calculators.md`
- Review: `src/pages/calculators/aws-sqs-cost-calculator.astro`
- Review: `src/pages/calculators/aws-sns-cost-calculator.astro`
- Review: `src/pages/calculators/aws-ses-cost-calculator.astro`
- Review: `src/pages/calculators/aws-kms-cost-calculator.astro`

**Step 1: Run non-ASCII audit**

Run:

`rg -n "[^\x00-\x7F]" src/pages/calculators/aws-sqs-cost-calculator.astro src/pages/calculators/aws-sns-cost-calculator.astro src/pages/calculators/aws-ses-cost-calculator.astro src/pages/calculators/aws-kms-cost-calculator.astro docs/plans/2026-03-28-request-driven-aws-calculators-design.md docs/plans/2026-03-28-request-driven-aws-calculators.md`

Expected: no matches.

**Step 2: Run project verification**

Run:

`npm run check`

Expected: pass with no new errors.

Run:

`npm run build`

Expected: successful production build.

### Task 5: Commit the batch

**Files:**
- Add: `docs/plans/2026-03-28-request-driven-aws-calculators-design.md`
- Add: `docs/plans/2026-03-28-request-driven-aws-calculators.md`
- Modify: `src/pages/calculators/aws-sqs-cost-calculator.astro`
- Modify: `src/pages/calculators/aws-sns-cost-calculator.astro`
- Modify: `src/pages/calculators/aws-ses-cost-calculator.astro`
- Modify: `src/pages/calculators/aws-kms-cost-calculator.astro`

**Step 1: Commit docs**

```bash
git add docs/plans/2026-03-28-request-driven-aws-calculators-design.md docs/plans/2026-03-28-request-driven-aws-calculators.md
git commit -m "docs: add request-driven aws calculator plan"
```

**Step 2: Commit implementation**

```bash
git add src/pages/calculators/aws-sqs-cost-calculator.astro src/pages/calculators/aws-sns-cost-calculator.astro src/pages/calculators/aws-ses-cost-calculator.astro src/pages/calculators/aws-kms-cost-calculator.astro
git commit -m "fix: de-template request-driven aws calculators"
```
