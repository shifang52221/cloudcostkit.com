# Calculator Template Cluster Depth Cleanup Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Remove the most obvious mass-template feel from a first batch of six indexable AWS calculators by replacing
their shared generic tails with service-specific measurement, boundary, and reconciliation guidance.

**Architecture:** Keep the existing `CalculatorLayout` and calculator components, but rewrite the prose blocks that sit
below the interactive tools so each page owns a distinct billing workflow instead of repeating the same site-wide
appendix.

**Tech Stack:** Astro page content, existing calculator components, internal-link structure

---

### Task 1: Add planning docs for the cleanup batch

**Files:**
- Create: `docs/plans/2026-03-28-calculator-template-cluster-depth-design.md`
- Create: `docs/plans/2026-03-28-calculator-template-cluster-depth.md`

**Step 1: Capture the root problem**

Document that the main risk is not tool usefulness but repeated editorial tails across indexable calculators.

**Step 2: Lock the batch scope**

Document the first six target pages:

- `src/pages/calculators/aws-api-gateway-cost-calculator.astro`
- `src/pages/calculators/aws-dynamodb-cost-calculator.astro`
- `src/pages/calculators/aws-route-53-cost-calculator.astro`
- `src/pages/calculators/aws-secrets-manager-cost-calculator.astro`
- `src/pages/calculators/aws-ssm-parameter-store-cost-calculator.astro`
- `src/pages/calculators/aws-cloudtrail-cost-calculator.astro`

### Task 2: Rewrite API Gateway and DynamoDB calculator tails

**Files:**
- Modify: `src/pages/calculators/aws-api-gateway-cost-calculator.astro`
- Modify: `src/pages/calculators/aws-dynamodb-cost-calculator.astro`

**Step 1: Remove generic repeated sections**

Remove the current shared-template sections such as:

- generic input bullets
- generic common mistakes bullets
- generic validate-after-changes bullets

**Step 2: Replace them with service-specific workflows**

Add API Gateway-specific and DynamoDB-specific guidance about:

- measurement inputs
- cost boundaries
- spike behavior
- bill reconciliation

### Task 3: Rewrite Route 53, Secrets Manager, and Parameter Store calculator tails

**Files:**
- Modify: `src/pages/calculators/aws-route-53-cost-calculator.astro`
- Modify: `src/pages/calculators/aws-secrets-manager-cost-calculator.astro`
- Modify: `src/pages/calculators/aws-ssm-parameter-store-cost-calculator.astro`

**Step 1: Preserve useful internal handoff**

Keep related links that move the reader to matching guides or companion calculators.

**Step 2: Rebuild the narrative around real cost drivers**

Add tailored prose about:

- DNS query amplification and TTL behavior
- secret inventory versus API read bursts
- advanced parameters versus API-call-heavy access patterns

### Task 4: Rewrite the CloudTrail calculator tail

**Files:**
- Modify: `src/pages/calculators/aws-cloudtrail-cost-calculator.astro`

**Step 1: Split event families clearly**

Make the page explicitly explain management, data, and Insights event differences.

**Step 2: Clarify off-page line items**

Point users to downstream storage, SIEM, or log-analysis costs as adjacent but separate line items instead of folding
everything into one generic warning.

### Task 5: Verify quality and build stability

**Files:**
- Review: `docs/plans/2026-03-28-calculator-template-cluster-depth-design.md`
- Review: `docs/plans/2026-03-28-calculator-template-cluster-depth.md`
- Review: `src/pages/calculators/aws-api-gateway-cost-calculator.astro`
- Review: `src/pages/calculators/aws-dynamodb-cost-calculator.astro`
- Review: `src/pages/calculators/aws-route-53-cost-calculator.astro`
- Review: `src/pages/calculators/aws-secrets-manager-cost-calculator.astro`
- Review: `src/pages/calculators/aws-ssm-parameter-store-cost-calculator.astro`
- Review: `src/pages/calculators/aws-cloudtrail-cost-calculator.astro`

**Step 1: Run non-ASCII audit**

Run:

`rg -n "[^\x00-\x7F]" src/pages/calculators/aws-api-gateway-cost-calculator.astro src/pages/calculators/aws-dynamodb-cost-calculator.astro src/pages/calculators/aws-route-53-cost-calculator.astro src/pages/calculators/aws-secrets-manager-cost-calculator.astro src/pages/calculators/aws-ssm-parameter-store-cost-calculator.astro src/pages/calculators/aws-cloudtrail-cost-calculator.astro docs/plans/2026-03-28-calculator-template-cluster-depth-design.md docs/plans/2026-03-28-calculator-template-cluster-depth.md`

Expected: no matches.

**Step 2: Run project verification**

Run:

`npm run check`

Expected: pass with no new errors.

Run:

`npm run build`

Expected: successful production build.

### Task 6: Commit the batch

**Files:**
- Add: `docs/plans/2026-03-28-calculator-template-cluster-depth-design.md`
- Add: `docs/plans/2026-03-28-calculator-template-cluster-depth.md`
- Modify: `src/pages/calculators/aws-api-gateway-cost-calculator.astro`
- Modify: `src/pages/calculators/aws-dynamodb-cost-calculator.astro`
- Modify: `src/pages/calculators/aws-route-53-cost-calculator.astro`
- Modify: `src/pages/calculators/aws-secrets-manager-cost-calculator.astro`
- Modify: `src/pages/calculators/aws-ssm-parameter-store-cost-calculator.astro`
- Modify: `src/pages/calculators/aws-cloudtrail-cost-calculator.astro`

**Step 1: Commit docs**

```bash
git add docs/plans/2026-03-28-calculator-template-cluster-depth-design.md docs/plans/2026-03-28-calculator-template-cluster-depth.md
git commit -m "docs: add calculator template cleanup plan"
```

**Step 2: Commit implementation**

```bash
git add src/pages/calculators/aws-api-gateway-cost-calculator.astro src/pages/calculators/aws-dynamodb-cost-calculator.astro src/pages/calculators/aws-route-53-cost-calculator.astro src/pages/calculators/aws-secrets-manager-cost-calculator.astro src/pages/calculators/aws-ssm-parameter-store-cost-calculator.astro src/pages/calculators/aws-cloudtrail-cost-calculator.astro
git commit -m "fix: de-template aws calculator editorial tails"
```
