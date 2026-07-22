# API Gateway Calculator Role Separation Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make the API Gateway calculator family read as three independent tools instead of near-duplicate cost pages.

**Architecture:** Keep the existing calculator components and URLs, and tighten role separation in the page copy around them. Protect the distinction with page-content tests that verify each calculator states its own job, what it excludes, and where the user should go next.

**Tech Stack:** Astro pages, Node test runner, existing calculator layouts and content tests.

---

### Task 1: Protect calculator role separation with failing tests

**Files:**
- Modify: `tests/api-gateway-cluster-role-separation.test.mjs`
- Test: `tests/api-gateway-cluster-role-separation.test.mjs`

**Step 1: Write the failing test**

Add tests that require:
- `src/pages/calculators/aws-api-gateway-cost-calculator.astro` to call itself the bill-conversion calculator after request volume is already known.
- `src/pages/calculators/aws-api-gateway-request-estimator.astro` to call itself the request-volume workflow and explicitly reject transfer, pricing, and logging scope.
- `src/pages/calculators/aws-api-gateway-access-log-cost-calculator.astro` to call itself the logging-side calculator and explicitly reject core API request billing scope.

**Step 2: Run test to verify it fails**

Run: `node --test tests/api-gateway-cluster-role-separation.test.mjs`
Expected: `FAIL` because the calculator-role phrases do not exist yet.

**Step 3: Write minimal implementation**

Update the three calculator pages so each one:
- names its independent job in the opening prose,
- warns against using it for the neighboring jobs,
- links to the correct adjacent page for handoff.

**Step 4: Run test to verify it passes**

Run: `node --test tests/api-gateway-cluster-role-separation.test.mjs`
Expected: `PASS`

**Step 5: Commit**

```bash
git add tests/api-gateway-cluster-role-separation.test.mjs src/pages/calculators/aws-api-gateway-cost-calculator.astro src/pages/calculators/aws-api-gateway-request-estimator.astro src/pages/calculators/aws-api-gateway-access-log-cost-calculator.astro
git commit -m "Separate API Gateway calculator roles"
```

### Task 2: Verify the whole site still stays green

**Files:**
- Modify: `none unless verification reveals a regression`
- Test: `package.json` scripts

**Step 1: Run the focused calculator-family test**

Run: `node --test tests/api-gateway-cluster-role-separation.test.mjs`
Expected: `PASS`

**Step 2: Run the full automated test suite**

Run: `npm test`
Expected: all tests pass

**Step 3: Run type/content checks**

Run: `npm run check`
Expected: exit code `0`

**Step 4: Run production build**

Run: `npm run build`
Expected: exit code `0`

**Step 5: Commit if verification required any follow-up edits**

```bash
git add -A
git commit -m "Verify API Gateway calculator role separation"
```
