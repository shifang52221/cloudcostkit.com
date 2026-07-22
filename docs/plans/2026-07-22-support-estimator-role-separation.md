# Support Estimator Role Separation Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Strengthen the noindex support estimator layer by giving KMS, SNS, SQS, and WAF estimator pages explicit measurement roles and handoffs.

**Architecture:** Add a focused regression test first, then update Astro page copy only. The pages remain `noindex,follow`; their calculator components and route structure stay unchanged. The implementation only changes intro/includes/excludes/prose to clarify each estimator's workflow boundary.

**Tech Stack:** Astro, existing calculator components, Node `node:test`, repository markdown plans.

---

### Task 1: Write the failing estimator-role test

**Files:**
- Create: `tests/support-estimator-role-separation.test.mjs`

**Step 1: Write the failing test**

```javascript
test("KMS estimator stays a crypto-call-density support workflow", () => {
  assert.match(kmsEstimator, /This calculator is the KMS request-volume workflow page/i);
});
```

**Step 2: Run test to verify it fails**

Run: `node --test tests/support-estimator-role-separation.test.mjs`
Expected: FAIL because the new explicit role statements are not yet present.

### Task 2: Tighten the KMS estimator role

**Files:**
- Modify: `src/pages/calculators/aws-kms-request-estimator.astro`

**Step 1: Write or preserve failing assertions**

Assert the page says it is the KMS request-volume workflow page and excludes key-month pricing, full KMS bill conversion, and downstream service costs.

**Step 2: Implement minimal copy changes**

Update intro/includes/excludes and add one short top prose paragraph that frames crypto-call density as the only job.

**Step 3: Run focused test**

Run: `node --test tests/support-estimator-role-separation.test.mjs`
Expected: KMS assertions pass.

### Task 3: Tighten the SNS estimator role

**Files:**
- Modify: `src/pages/calculators/aws-sns-delivery-estimator.astro`

**Step 1: Preserve failing assertions**

Assert the page says it is the SNS delivery-volume workflow page and excludes SNS pricing, downstream SQS/Lambda/email cost, and full messaging architecture decisions.

**Step 2: Implement minimal copy changes**

Update intro/includes/excludes and one prose paragraph so publish count, matched fan-out, and retries are the owned measurement problem.

**Step 3: Run focused test**

Run: `node --test tests/support-estimator-role-separation.test.mjs`
Expected: SNS assertions pass.

### Task 4: Tighten the SQS estimator role

**Files:**
- Modify: `src/pages/calculators/aws-sqs-request-estimator.astro`

**Step 1: Preserve failing assertions**

Assert the page says it is the SQS request-volume workflow page and excludes queue pricing, storage, downstream compute, and full SQS bill conversion.

**Step 2: Implement minimal copy changes**

Update intro/includes/excludes and one prose paragraph so message lifecycle amplification is the owned measurement problem.

**Step 3: Run focused test**

Run: `node --test tests/support-estimator-role-separation.test.mjs`
Expected: SQS assertions pass.

### Task 5: Tighten the WAF estimator role

**Files:**
- Modify: `src/pages/calculators/aws-waf-request-estimator.astro`

**Step 1: Preserve failing assertions**

Assert the page says it is the WAF evaluated-request workflow page and excludes Web ACL/rule pricing, logging, and full WAF bill conversion.

**Step 2: Implement minimal copy changes**

Update intro/includes/excludes and one prose paragraph so baseline traffic plus attack windows are the owned measurement problem.

**Step 3: Run focused test**

Run: `node --test tests/support-estimator-role-separation.test.mjs`
Expected: WAF assertions pass.

### Task 6: Verify and ship

**Files:**
- Validate all touched files and tests.

**Step 1: Run focused and related tests**

Run: `node --test tests/support-estimator-role-separation.test.mjs tests/noindex-helper-description-hardening.test.mjs tests/fourteenth-meta-description-hardening.test.mjs tests/fifteenth-meta-description-hardening.test.mjs tests/sixteenth-meta-description-hardening.test.mjs`

**Step 2: Run full verification**

Run: `npm test`
Run: `npm run check`
Run: `npm run build`

**Step 3: Commit and push**

```bash
git add docs/plans/2026-07-22-support-estimator-role-separation-design.md docs/plans/2026-07-22-support-estimator-role-separation.md tests/support-estimator-role-separation.test.mjs src/pages/calculators/aws-kms-request-estimator.astro src/pages/calculators/aws-sns-delivery-estimator.astro src/pages/calculators/aws-sqs-request-estimator.astro src/pages/calculators/aws-waf-request-estimator.astro
git commit -m "feat: separate support estimator roles"
git push
```
