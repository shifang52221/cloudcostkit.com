# S3 Storage Cluster Role Separation Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Separate seven S3 and object-storage adjacent pages so each page owns one clear search/user intent and routes overlapping cases to the correct narrower page.

**Architecture:** This is a content-governance change in Astro pages with focused regression tests. Page source owns the user-facing role statements; `scripts/generate-guides.mjs` regenerates `src/lib/guides.generated.ts` from page metadata during verification.

**Tech Stack:** Astro pages, Node test runner, existing generated guide metadata script, npm verification commands.

---

### Task 1: Add the Failing Role-Separation Test

**Files:**
- Create: `tests/s3-storage-cluster-role-separation.test.mjs`

**Step 1: Write the failing test**

Create a test that reads and normalizes:

- `src/pages/guides/aws-s3-pricing.astro`
- `src/pages/guides/s3-pricing-explained.astro`
- `src/pages/guides/aws-s3-data-transfer.astro`
- `src/pages/guides/aws-s3-storage-classes.astro`
- `src/pages/calculators/s3-cost-calculator.astro`
- `src/pages/calculators/object-storage-cost-calculator.astro`
- `src/pages/calculators/storage-pricing-calculator.astro`

Assert for the intended role phrases:

- `This is the AWS S3 bill-boundary page`
- `This is the S3-like object-storage concept clarifier`
- `This is the S3 transfer-path diagnosis page`
- `This is the S3 storage-class decision page`
- `This calculator is the AWS S3 multi-line bill-conversion page`
- `This calculator is the base object-storage capacity-and-request page`
- `This calculator is the provider-neutral storage baseline page`

Also assert key handoff phrases:

- AWS S3 pricing routes transfer, replication, archive, and request-only questions to narrower pages.
- S3 pricing explained does not claim to be the AWS regional pricing reference.
- S3 transfer guide does not own replication, storage-class, or full S3 bill modeling.
- Storage-class guide does not own transfer-path or full bill-boundary work.
- Generic and S3 calculators have distinct next decisions.

**Step 2: Run test to verify it fails**

Run: `node --test tests/s3-storage-cluster-role-separation.test.mjs`

Expected: FAIL because the exact new role phrases are not present yet.

---

### Task 2: Implement Page Role Statements and Handoffs

**Files:**
- Modify: `src/pages/guides/aws-s3-pricing.astro`
- Modify: `src/pages/guides/s3-pricing-explained.astro`
- Modify: `src/pages/guides/aws-s3-data-transfer.astro`
- Modify: `src/pages/guides/aws-s3-storage-classes.astro`
- Modify: `src/pages/calculators/s3-cost-calculator.astro`
- Modify: `src/pages/calculators/object-storage-cost-calculator.astro`
- Modify: `src/pages/calculators/storage-pricing-calculator.astro`

**Step 1: Update guide descriptions and first-screen role statements**

Rewrite only the page-specific opening and metadata where needed. Keep existing useful sections and calculators.

**Step 2: Add explicit handoff language**

Add boundary notes and related links that route readers to narrower pages when their intent is not owned by the current page.

**Step 3: Run focused test**

Run: `node --test tests/s3-storage-cluster-role-separation.test.mjs`

Expected: PASS.

---

### Task 3: Preserve Existing Governance Tests

**Files:**
- Modify only if required: `tests/s3-governance.test.mjs`
- Modify only if required: `tests/s3-calculator-role-separation.test.mjs`
- Modify only if required: `tests/storage-parent-governance.test.mjs`
- Modify only if required: `tests/sixteenth-meta-description-hardening.test.mjs`

**Step 1: Run relevant tests**

Run:

```powershell
node --test tests/s3-storage-cluster-role-separation.test.mjs tests/s3-governance.test.mjs tests/s3-calculator-role-separation.test.mjs tests/storage-parent-governance.test.mjs tests/sixteenth-meta-description-hardening.test.mjs
```

Expected: PASS.

**Step 2: Update expectations only for intentional wording changes**

If a test fails because the canonical role phrase has intentionally changed, update that test to the new role while preserving the original purpose.

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
git add docs/plans/2026-07-22-s3-storage-cluster-role-separation.md tests/s3-storage-cluster-role-separation.test.mjs src/lib/guides.generated.ts src/pages/guides/aws-s3-pricing.astro src/pages/guides/s3-pricing-explained.astro src/pages/guides/aws-s3-data-transfer.astro src/pages/guides/aws-s3-storage-classes.astro src/pages/calculators/s3-cost-calculator.astro src/pages/calculators/object-storage-cost-calculator.astro src/pages/calculators/storage-pricing-calculator.astro
git diff --cached --check
git commit -m "feat: separate S3 storage page roles"
```

**Step 2: Push**

Run: `git push`

Expected: remote `main` advances.

**Step 3: Live verify after deployment settles**

Wait 60-90 seconds, then fetch the seven live URLs and check HTTP 200 plus the new role phrases.

Expected: all seven URLs return 200 and contain the expected phrase.
