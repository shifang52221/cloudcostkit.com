# SSM Parameter Store Cluster Role Separation Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Separate the AWS SSM Parameter Store pricing, estimate, and optimization pages into clearly different editorial jobs so the cluster reads like a deliberate workflow instead of a templated trio.

**Architecture:** Keep the change local to the three Parameter Store guide pages and one regression test. Strengthen role language, page-specific sections, and directional linking without changing layouts or adding new routes.

**Tech Stack:** Astro, Node test runner

---

### Task 1: Write the regression test first

**Files:**
- Create: `tests/ssm-parameter-store-cluster-role-separation.test.mjs`

**Step 1: Write the failing test**

Add assertions for:

- pricing page role language that makes it the bill-boundary page
- estimate page role language that makes it the API-call measurement workflow page
- optimization page role language that makes it the production intervention page

**Step 2: Run the focused test and confirm red**

Run: `node --test .\tests\ssm-parameter-store-cluster-role-separation.test.mjs`

Expected: FAIL because the new role-separation language does not exist yet.

### Task 2: Deepen the pricing page role

**Files:**
- Modify: `src/pages/guides/aws-ssm-parameter-store-pricing.astro`

**Step 1: Add role-setting language**

- explain that this page defines what belongs inside the Parameter Store bill before teams argue about caching or request reduction
- explain that advanced parameter-months and Parameter Store API requests are the core bill items while polling behavior, deploy churn, and adjacent secret-management decisions should be tracked beside Parameter Store rather than confused with it

**Step 2: Add stronger boundary structure**

- add an "inside the Parameter Store bill vs beside the Parameter Store bill" style section
- add "when this is not the right page" guidance

### Task 3: Deepen the estimate page role

**Files:**
- Modify: `src/pages/guides/aws-ssm-parameter-store-estimate-api-calls.astro`

**Step 1: Add API-call measurement language**

- explain that the page exists to turn CloudTrail, startup counts, refresh TTL, polling loops, batch-read behavior, and retry patterns into a defendable monthly request model

**Step 2: Add stronger evidence structure**

- add an evidence-pack section
- strengthen the difference between baseline calls and deploy-driven, refresh-driven, or retry-driven spikes

### Task 4: Deepen the optimization page role

**Files:**
- Modify: `src/pages/guides/aws-ssm-parameter-store-cost-optimization.astro`

**Step 1: Add production-intervention language**

- explain that optimization starts only after the team knows whether advanced parameter-months or API requests dominate the bill
- explain that the page is about caching policy, batch reads, refresh discipline, polling reduction, and churn control

**Step 2: Add guardrails**

- add a "do not optimize yet" or equivalent section
- add a before-and-after validation loop

### Task 5: Verify green

**Files:**
- Test: `tests/ssm-parameter-store-cluster-role-separation.test.mjs`

**Step 1: Run focused test**

Run: `node --test .\tests\ssm-parameter-store-cluster-role-separation.test.mjs`

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
- Modify: `src/pages/guides/aws-ssm-parameter-store-pricing.astro`
- Modify: `src/pages/guides/aws-ssm-parameter-store-estimate-api-calls.astro`
- Modify: `src/pages/guides/aws-ssm-parameter-store-cost-optimization.astro`
- Create: `tests/ssm-parameter-store-cluster-role-separation.test.mjs`

**Step 1: Commit**

```bash
git add src/pages/guides/aws-ssm-parameter-store-pricing.astro src/pages/guides/aws-ssm-parameter-store-estimate-api-calls.astro src/pages/guides/aws-ssm-parameter-store-cost-optimization.astro tests/ssm-parameter-store-cluster-role-separation.test.mjs
git commit -m "feat: separate ssm parameter store guide cluster roles"
```

**Step 2: Push**

```bash
git push origin thin-page-triage
```

**Step 3: Open compare URL**

```bash
Start-Process 'https://github.com/shifang52221/cloudcostkit.com/compare/main...thin-page-triage?expand=1'
```
