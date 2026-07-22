# VPC Transfer and Egress Role Separation Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Separate AWS VPC transfer, cross-AZ, and generic egress pages so each page owns one clear billing or diagnostic role.

**Architecture:** Keep the network-transfer parent as the boundary router. Narrow the VPC transfer calculator to a path-known bill-conversion page, make the cross-AZ guide the AZ-locality diagnostic page, and leave the generic egress calculator/guide responsible for outbound transfer pricing and route validation.

**Tech Stack:** Astro pages, React calculator component, node:test, npm scripts.

---

### Task 1: Add role-separation tests for VPC transfer and cross-AZ pages

**Files:**
- Modify: `tests/transfer-boundary-role-separation.test.mjs`

**Step 1: Write the failing test**

Assert that the VPC transfer guide stays on boundary routing, the cross-AZ guide owns AZ-locality diagnosis, and the VPC calculator is a bill-conversion page rather than a generic transfer planner.

**Step 2: Run test to verify it fails**

Run: `node --test tests/transfer-boundary-role-separation.test.mjs`
Expected: FAIL because the new role-specific wording is not present yet.

**Step 3: Write minimal implementation**

Adjust page copy only as needed to satisfy the new role boundaries.

**Step 4: Run test to verify it passes**

Run: `node --test tests/transfer-boundary-role-separation.test.mjs`
Expected: PASS

**Step 5: Commit**

```bash
git add tests/transfer-boundary-role-separation.test.mjs
git commit -m "test: separate VPC transfer and cross-AZ roles"
```

### Task 2: Refine page copy for VPC transfer, cross-AZ, and egress

**Files:**
- Modify: `src/pages/guides/aws-vpc-data-transfer.astro`
- Modify: `src/pages/guides/aws-cross-az-data-transfer-cost.astro`
- Modify: `src/pages/calculators/vpc-data-transfer-cost-calculator.astro`
- Modify: `src/lib/guides.generated.ts`

**Step 1: Write the failing test**

Keep the same role-separation assertions focused on unique phrases for each page.

**Step 2: Run test to verify it fails**

Run: `node --test tests/transfer-boundary-role-separation.test.mjs`
Expected: FAIL until the copy is updated.

**Step 3: Write minimal implementation**

Make small wording changes only. Do not change routes, layout structure, or calculator math.

**Step 4: Run test to verify it passes**

Run: `node --test tests/transfer-boundary-role-separation.test.mjs`
Expected: PASS

**Step 5: Commit**

```bash
git add src/pages/guides/aws-vpc-data-transfer.astro src/pages/guides/aws-cross-az-data-transfer-cost.astro src/pages/calculators/vpc-data-transfer-cost-calculator.astro src/lib/guides.generated.ts
git commit -m "feat: sharpen VPC transfer and cross-AZ page roles"
```

### Task 3: Verify the batch

**Files:**
- No code changes

**Step 1: Run the full checks**

Run:
`npm test`
`npm run check`
`npm run build`

**Step 2: Confirm output**

Expected: all tests pass, check reports 0 errors, build succeeds.

**Step 3: Push and verify live**

Run:
`git push`
`Invoke-WebRequest` against the affected live pages after deploy settles.
