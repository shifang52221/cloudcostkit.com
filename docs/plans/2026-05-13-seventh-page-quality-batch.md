# Seventh Page Quality Batch Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Improve search-to-decision handoff on three visible entry/comparison pages without changing their existing ownership boundaries.

**Architecture:** Add regression coverage for sharper routing and validation wording first, then make small copy adjustments on the selected pages while preserving their current role-separation language and internal-link structure.

**Tech Stack:** Astro entry pages, Astro guide pages, Astro calculator pages, Node test runner

---

### Task 1: Lock the batch targets with tests

**Files:**
- Create: `tests/seventh-page-quality-batch.test.mjs`

**Step 1: Write the failing test**

Add assertions that the selected pages:
- use more specific routing or comparison language
- include stronger page-specific validation guidance
- do not drift away from the roles already protected by the existing tests

**Step 2: Run test to verify it fails**

Run: `node --test tests/seventh-page-quality-batch.test.mjs`
Expected: FAIL because the sharper wording does not yet exist.

### Task 2: Apply minimal copy improvements

**Files:**
- Modify: `src/pages/calculators/index.astro`
- Modify: `src/pages/guides/aws-rds-vs-aurora-cost.astro`
- Modify: `src/pages/calculators/aws-fargate-vs-ec2-cost-calculator.astro`

**Step 1: Strengthen the routing or comparison promise**

Add wording that makes the page's job explicit before the user scrolls too far.

**Step 2: Add page-specific sign-off language**

Use language that matches the actual decision risk on each page:
- calculator hub should route by bill driver before tool choice
- RDS vs Aurora should emphasize normalized workload and comparison conditions
- Fargate vs EC2 calculator should emphasize same workload shape plus separate non-compute validation

**Step 3: Keep ownership intact**

Do not weaken:
- calculator hub routing semantics
- database comparison role separation
- Fargate/EC2 comparison role separation

### Task 3: Verify the batch

**Files:**
- Verify: `tests/seventh-page-quality-batch.test.mjs`
- Verify: relevant existing calculator-hub, database, and Fargate tests

**Step 1: Run targeted tests**

Run the new batch test plus existing tests that cover these page clusters.

**Step 2: Run broader checks**

Run:
- `npm test`
- `npm run check`
- `npm run build`

**Step 3: Report exact evidence**

Only claim the batch is ready after the new quality test and broader verification pass.
