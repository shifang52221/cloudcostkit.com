# VPC Endpoints Cluster Role Separation Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Separate the AWS VPC endpoints pricing, estimate, and optimization pages into clearly different editorial jobs so the cluster reads like a deliberate workflow instead of a templated trio.

**Architecture:** Keep the change local to the three VPC endpoints guide pages plus one regression test. Strengthen role language, page-specific sections, and directional linking without changing layouts or adding new pages.

**Tech Stack:** Astro, Node test runner

---

### Task 1: Write the regression test first

**Files:**
- Create: `tests/vpc-endpoints-cluster-role-separation.test.mjs`

**Step 1: Write the failing test**

Add assertions for:

- pricing page role language that makes it the bill-boundary page
- estimate page role language that makes it the input-measurement workflow page
- optimization page role language that makes it the production intervention page

**Step 2: Run the focused test and confirm red**

Run: `node --test .\tests\vpc-endpoints-cluster-role-separation.test.mjs`

Expected: FAIL because the new role-separation language does not exist yet.

### Task 2: Deepen the pricing page role

**Files:**
- Modify: `src/pages/guides/aws-vpc-endpoints-pricing.astro`

**Step 1: Add role-setting language**

- explain that this page defines what belongs inside the endpoint bill model before optimization debates begin
- explain that transfer path changes, NAT comparisons, and adjacent architecture costs can sit beside the endpoint line item

**Step 2: Add stronger boundary structure**

- add an "inside the endpoint bill vs outside the endpoint bill" style section
- add "when this is not the right page" guidance

### Task 3: Deepen the estimate page role

**Files:**
- Modify: `src/pages/guides/aws-vpc-endpoints-estimate-hours-and-gb.astro`

**Step 1: Add input-measurement language**

- explain that the page exists to turn endpoint inventory, AZ coverage, hours, and GB sources into a defendable input model

**Step 2: Add stronger evidence structure**

- add an evidence-pack section
- strengthen the difference between steady-state traffic and one-time or spike traffic

### Task 4: Deepen the optimization page role

**Files:**
- Modify: `src/pages/guides/aws-vpc-endpoints-cost-optimization.astro`

**Step 1: Add production-intervention language**

- explain that optimization starts only after the endpoint-hours and GB model is believable
- explain that the page is about changes such as endpoint consolidation, AZ right-sizing, traffic reduction, and locality fixes

**Step 2: Add guardrails**

- add a "do not optimize yet" or equivalent section
- add a before/after change-control loop

### Task 5: Verify green

**Files:**
- Test: `tests/vpc-endpoints-cluster-role-separation.test.mjs`

**Step 1: Run focused test**

Run: `node --test .\tests\vpc-endpoints-cluster-role-separation.test.mjs`

Expected: PASS

**Step 2: Run full suite**

Run: `npm test`

Expected: PASS

**Step 3: Run Astro checks**

Run: `npm run check`

Expected: PASS

**Step 4: Run build**

Run: `npm run build`

Expected: PASS

### Task 6: Commit and prepare merge

**Files:**
- Modify: `src/pages/guides/aws-vpc-endpoints-pricing.astro`
- Modify: `src/pages/guides/aws-vpc-endpoints-estimate-hours-and-gb.astro`
- Modify: `src/pages/guides/aws-vpc-endpoints-cost-optimization.astro`
- Create: `tests/vpc-endpoints-cluster-role-separation.test.mjs`

**Step 1: Commit**

```bash
git add src/pages/guides/aws-vpc-endpoints-pricing.astro src/pages/guides/aws-vpc-endpoints-estimate-hours-and-gb.astro src/pages/guides/aws-vpc-endpoints-cost-optimization.astro tests/vpc-endpoints-cluster-role-separation.test.mjs
git commit -m "feat: separate vpc endpoints guide cluster roles"
```

**Step 2: Push**

```bash
git push origin thin-page-triage
```

**Step 3: Open compare URL**

```bash
Start-Process 'https://github.com/shifang52221/cloudcostkit.com/compare/main...thin-page-triage?expand=1'
```
