# SQS Cluster Role Separation Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Separate the AWS SQS pricing, estimate, and optimization pages into clearly different editorial jobs so the cluster reads like a deliberate workflow instead of a templated trio.

**Architecture:** Keep the change local to the three SQS guide pages plus one regression test. Strengthen role language, page-specific sections, and directional linking without changing layouts or adding new pages.

**Tech Stack:** Astro, Node test runner

---

### Task 1: Write the regression test first

**Files:**
- Create: `tests/sqs-cluster-role-separation.test.mjs`

**Step 1: Write the failing test**

Add assertions for:

- pricing page role language that makes it the scope-and-budgeting page
- estimate page role language that makes it the measurement workflow page
- optimization page role language that makes it the operational intervention page

**Step 2: Run the focused test and confirm red**

Run: `node --test .\tests\sqs-cluster-role-separation.test.mjs`

Expected: FAIL because the new role-separation language does not exist yet.

### Task 2: Deepen the pricing page role

**Files:**
- Modify: `src/pages/guides/aws-sqs-pricing.astro`

**Step 1: Add role-setting language**

- explain that this page defines what belongs inside the SQS cost model
- explain when the queue charge is not the main budget problem

**Step 2: Add stronger scope structure**

- add an "inside the SQS bill vs outside the SQS bill" style section
- add "when this is not the right page" guidance

### Task 3: Deepen the estimate page role

**Files:**
- Modify: `src/pages/guides/aws-sqs-estimate-requests.astro`

**Step 1: Add measurement-workflow language**

- explain that the page exists to turn observed message behavior into a defendable request model

**Step 2: Add stronger evidence structure**

- add a scenario or evidence-pack section
- strengthen the difference between measured inputs and guessed multipliers

### Task 4: Deepen the optimization page role

**Files:**
- Modify: `src/pages/guides/aws-sqs-cost-optimization.astro`

**Step 1: Add operational-intervention language**

- explain that optimization starts after the request model is believable
- explain that the page is about changing batching, polling, retries, visibility behavior, and DLQ handling

**Step 2: Add guardrails**

- add a "do not optimize yet" or equivalent section
- add a before/after measurement requirement

### Task 5: Verify green

**Files:**
- Test: `tests/sqs-cluster-role-separation.test.mjs`

**Step 1: Run focused test**

Run: `node --test .\tests\sqs-cluster-role-separation.test.mjs`

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
- Modify: `src/pages/guides/aws-sqs-pricing.astro`
- Modify: `src/pages/guides/aws-sqs-estimate-requests.astro`
- Modify: `src/pages/guides/aws-sqs-cost-optimization.astro`
- Create: `tests/sqs-cluster-role-separation.test.mjs`

**Step 1: Commit**

```bash
git add src/pages/guides/aws-sqs-pricing.astro src/pages/guides/aws-sqs-estimate-requests.astro src/pages/guides/aws-sqs-cost-optimization.astro tests/sqs-cluster-role-separation.test.mjs
git commit -m "feat: separate sqs guide cluster roles"
```

**Step 2: Push**

```bash
git push origin thin-page-triage
```

**Step 3: Open compare URL**

```bash
Start-Process 'https://github.com/shifang52221/cloudcostkit.com/compare/main...thin-page-triage?expand=1'
```
