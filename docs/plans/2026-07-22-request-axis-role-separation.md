# Request Axis Role Separation Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Separate the request-pricing family so the hub, generic request explainer, bill-conversion calculator, rate converter, S3 request guide, and API Gateway request-measurement guide each own one clear job.

**Architecture:** This is a content-governance update in Astro pages plus a focused regression test suite. Page content should carry the role statement and handoff language, while `scripts/generate-guides.mjs` regenerates metadata from the updated page sources during verification.

**Tech Stack:** Astro pages, Node test runner, generated guide metadata script, npm verification commands.

---

### Task 1: Add the Failing Request-Axis Test

**Files:**
- Create: `tests/request-axis-role-separation.test.mjs`

**Step 1: Write the failing test**

Create a test that reads and normalizes:

- `src/pages/guides/requests-costs.astro`
- `src/pages/guides/request-based-pricing.astro`
- `src/pages/calculators/api-request-cost-calculator.astro`
- `src/pages/calculators/rps-to-monthly-requests-calculator.astro`
- `src/pages/guides/aws-s3-request-costs.astro`
- `src/pages/guides/aws-api-gateway-estimate-requests.astro`

Assert for the intended role phrases:

- `This is the request boundary page`
- `This is the generic request pricing explainer`
- `This calculator is the generic request bill-conversion page`
- `This calculator is the rate-to-volume bridge`
- `This is the S3 request-cost boundary page`
- `This page is the API request measurement workflow`

Also assert key handoff phrases:

- `requests-costs` is only a routing hub and does not own the full request workflow.
- `request-based-pricing` owns generic request billing math, not workload behavior.
- `api-request-cost-calculator` handles request conversion, not request discovery.
- `rps-to-monthly-requests-calculator` is only a bridge from rate to monthly volume.
- `aws-s3-request-costs` does not own the storage parent or full S3 bill anatomy.
- `aws-api-gateway-estimate-requests` hands off to pricing once request volume is believable.

**Step 2: Run test to verify it fails**

Run: `node --test tests/request-axis-role-separation.test.mjs`

Expected: FAIL because the exact new role phrases are not present yet.

---

### Task 2: Implement Request-Axis Role Statements and Handoffs

**Files:**
- Modify: `src/pages/guides/requests-costs.astro`
- Modify: `src/pages/guides/request-based-pricing.astro`
- Modify: `src/pages/calculators/api-request-cost-calculator.astro`
- Modify: `src/pages/calculators/rps-to-monthly-requests-calculator.astro`
- Modify: `src/pages/guides/aws-s3-request-costs.astro`
- Modify: `src/pages/guides/aws-api-gateway-estimate-requests.astro`

**Step 1: Update descriptions and first-screen role statements**

Rewrite the page openings so each page clearly owns one job and explicitly routes related problems to the correct sibling page.

**Step 2: Keep useful content and cross-links**

Preserve the existing request examples, math, and validation sections where they are already useful. Update related links only when they support the new role split.

**Step 3: Run focused test**

Run: `node --test tests/request-axis-role-separation.test.mjs`

Expected: PASS.

---

### Task 3: Preserve Existing Governance Tests

**Files:**
- Modify only if required: `tests/messaging-request-governance.test.mjs`
- Modify only if required: `tests/api-gateway-cluster-role-separation.test.mjs`
- Modify only if required: `tests/fifteenth-meta-description-hardening.test.mjs`
- Modify only if required: `tests/high-opportunity-page-review.test.mjs`

**Step 1: Run relevant tests**

Run:

```powershell
node --test tests/request-axis-role-separation.test.mjs tests/messaging-request-governance.test.mjs tests/api-gateway-cluster-role-separation.test.mjs tests/fifteenth-meta-description-hardening.test.mjs tests/high-opportunity-page-review.test.mjs
```

Expected: PASS.

**Step 2: Update expectations only for intentional wording changes**

If a test fails because the canonical role phrase intentionally changed, update that test to the new phrase while preserving the original intent.

---

### Task 4: Regenerate Metadata and Verify All

**Files:**
- Modify generated if changed: `src/lib/guides.generated.ts`

**Step 1: Run full verification**

Run:

```powershell
npm test
npm run check
npm run build
```

Expected:

- `npm test`: all tests pass.
- `npm run check`: exit 0, no errors or warnings.
- `npm run build`: exit 0.

**Step 2: Check staged diff**

Run:

```powershell
git status --short
git diff --check
```

Expected: only planned files are changed and whitespace check passes.

---

### Task 5: Commit, Push, and Live Verify

**Files:**
- Commit all planned files.

**Step 1: Commit**

Run:

```powershell
git add docs/plans/2026-07-22-request-axis-role-separation-design.md docs/plans/2026-07-22-request-axis-role-separation.md tests/request-axis-role-separation.test.mjs src/lib/guides.generated.ts src/pages/guides/requests-costs.astro src/pages/guides/request-based-pricing.astro src/pages/calculators/api-request-cost-calculator.astro src/pages/calculators/rps-to-monthly-requests-calculator.astro src/pages/guides/aws-s3-request-costs.astro src/pages/guides/aws-api-gateway-estimate-requests.astro
git diff --cached --check
git commit -m "feat: separate request axis page roles"
```

**Step 2: Push**

Run: `git push`

Expected: remote `main` advances.

**Step 3: Live verify after deployment settles**

Wait 60-90 seconds, then fetch the six live URLs and check HTTP 200 plus the new role phrases.

Expected: all six URLs return 200 and contain the expected phrase.
