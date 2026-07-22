# Request Calculator Axis Role Separation Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Reduce low-value overlap on the request calculator axis by making the S3 request calculator, generic request calculator, API Gateway request estimator, and response-transfer calculator each own a distinct editorial role.

**Architecture:** This is a small editorial hardening batch. We will write a focused regression test first, then tighten the page copy in the smallest possible way so each page owns one step in the request workflow: request discovery, bill conversion, request measurement, or transfer estimation. We will keep the existing component behavior intact and only change page-facing role language, related links, and supporting explanatory copy where necessary.

**Tech Stack:** Astro pages, Node `node:test`, repository markdown plans, existing calculator components.

---

### Task 1: Write the failing regression test

**Files:**
- Create: `tests/request-calculator-axis-role-separation.test.mjs`

**Step 1: Write the failing test**

```javascript
test("request calculator axis keeps each page in its own role", () => {
  assert.match(s3RequestCalculator, /This calculator is the S3 request-class bill-conversion page/i);
  assert.match(responseTransferCalculator, /This calculator is the payload-transfer bridge page/i);
});
```

**Step 2: Run test to verify it fails**

Run: `node --test tests/request-calculator-axis-role-separation.test.mjs`
Expected: FAIL because the new role phrases are not yet present.

### Task 2: Tighten the S3 request calculator copy

**Files:**
- Modify: `src/pages/calculators/s3-request-cost-calculator.astro`

**Step 1: Write the failing test**

Assert the page says it is the S3 request-class bill-conversion page and explicitly excludes request discovery, storage GB-month, egress, replication, and the full S3 bill model.

**Step 2: Run test to verify it fails**

Run: `node --test tests/request-calculator-axis-role-separation.test.mjs`
Expected: FAIL on the S3 assertions.

**Step 3: Write minimal implementation**

Update the intro, description, and next-step links so the page clearly owns S3 request-class conversion and hands off to the right helpers.

**Step 4: Run test to verify it passes**

Run: `node --test tests/request-calculator-axis-role-separation.test.mjs`
Expected: PASS.

### Task 3: Tighten the response-transfer calculator copy

**Files:**
- Modify: `src/pages/calculators/api-response-size-transfer-calculator.astro`

**Step 1: Write the failing test**

Assert the page says it is the payload-transfer bridge page and does not own request pricing, request discovery, or egress-rate pricing.

**Step 2: Run test to verify it fails**

Run: `node --test tests/request-calculator-axis-role-separation.test.mjs`
Expected: FAIL on the transfer assertions.

**Step 3: Write minimal implementation**

Update the intro and supporting prose so the page is clearly a bridge from request count plus response size to transfer GB.

**Step 4: Run test to verify it passes**

Run: `node --test tests/request-calculator-axis-role-separation.test.mjs`
Expected: PASS.

### Task 4: Preserve the API Gateway request-estimation boundary

**Files:**
- Modify: `src/pages/calculators/aws-api-gateway-request-estimator.astro`
- Modify: `tests/request-calculator-axis-role-separation.test.mjs`

**Step 1: Write the failing test**

Assert the page still calls itself the request-volume workflow of the API Gateway cluster and that it hands off to the main API Gateway cost calculator once the model is stable.

**Step 2: Run test to verify it fails**

Run: `node --test tests/request-calculator-axis-role-separation.test.mjs`
Expected: FAIL if the handoff language is missing or too weak.

**Step 3: Write minimal implementation**

Keep the current wording if it already passes; otherwise add one short handoff sentence without changing the page’s noindex helper role.

**Step 4: Run test to verify it passes**

Run: `node --test tests/request-calculator-axis-role-separation.test.mjs`
Expected: PASS.

### Task 5: Verify the whole batch and commit

**Files:**
- Validate: all touched pages plus the new test file and both plan docs

**Step 1: Run the focused test set**

Run: `node --test tests/request-calculator-axis-role-separation.test.mjs tests/request-axis-role-separation.test.mjs tests/request-boundary-role-separation.test.mjs tests/api-gateway-cluster-role-separation.test.mjs tests/priority-calculator-meta-description-coverage.test.mjs tests/noindex-helper-description-hardening.test.mjs`

**Step 2: Run repo checks**

Run: `npm test`
Run: `npm run check`
Run: `npm run build`

**Step 3: Commit**

```bash
git add docs/plans/2026-07-22-request-calculator-axis-role-separation-design.md docs/plans/2026-07-22-request-calculator-axis-role-separation.md tests/request-calculator-axis-role-separation.test.mjs src/pages/calculators/s3-request-cost-calculator.astro src/pages/calculators/api-response-size-transfer-calculator.astro src/pages/calculators/aws-api-gateway-request-estimator.astro
git commit -m "feat: separate request calculator axis roles"
```
