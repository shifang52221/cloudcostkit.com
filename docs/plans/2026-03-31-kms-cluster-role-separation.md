# KMS Cluster Role Separation Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Separate the AWS KMS pricing, estimate, and optimization pages into clearly different editorial jobs so the cluster reads like a deliberate workflow instead of a templated trio.

**Architecture:** Keep the change local to the three KMS guide pages plus one regression test. Strengthen role language, page-specific sections, and directional linking without changing layouts or adding new pages.

**Tech Stack:** Astro, Node test runner

---

### Task 1: Write the regression test first

**Files:**
- Create: `tests/kms-cluster-role-separation.test.mjs`

**Step 1: Write the failing test**

Add assertions for:

- pricing page role language that makes it the bill-boundary page
- estimate page role language that makes it the request-measurement workflow page
- optimization page role language that makes it the production intervention page

**Step 2: Run the focused test and confirm red**

Run: `node --test .\tests\kms-cluster-role-separation.test.mjs`

Expected: FAIL because the new role-separation language does not exist yet.

### Task 2: Deepen the pricing page role

**Files:**
- Modify: `src/pages/guides/aws-kms-pricing.astro`

**Step 1: Add role-setting language**

- explain that this page defines what belongs inside the KMS bill model before optimization debates begin
- explain that many AWS services can trigger KMS requests without changing the fact that the billing question is still "what is KMS versus adjacent service cost"

**Step 2: Add stronger boundary structure**

- add an "inside the KMS bill vs outside the KMS bill" style section
- add "when this is not the right page" guidance

### Task 3: Deepen the estimate page role

**Files:**
- Modify: `src/pages/guides/aws-kms-estimate-requests.astro`

**Step 1: Add request-measurement language**

- explain that the page exists to turn workload units and per-unit KMS calls into a defendable request model

**Step 2: Add stronger evidence structure**

- add an evidence-pack section
- strengthen the difference between baseline request behavior and incident or retry-heavy behavior

### Task 4: Deepen the optimization page role

**Files:**
- Modify: `src/pages/guides/aws-kms-cost-optimization.astro`

**Step 1: Add production-intervention language**

- explain that optimization starts only after the KMS request model is believable
- explain that the page is about changes such as caching, batching, key-generation frequency, retry control, and non-prod discipline

**Step 2: Add guardrails**

- add a "do not optimize yet" or equivalent section
- add a before and after change-control loop

### Task 5: Verify green

**Files:**
- Test: `tests/kms-cluster-role-separation.test.mjs`

**Step 1: Run focused test**

Run: `node --test .\tests\kms-cluster-role-separation.test.mjs`

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
- Modify: `src/pages/guides/aws-kms-pricing.astro`
- Modify: `src/pages/guides/aws-kms-estimate-requests.astro`
- Modify: `src/pages/guides/aws-kms-cost-optimization.astro`
- Create: `tests/kms-cluster-role-separation.test.mjs`

**Step 1: Commit**

```bash
git add src/pages/guides/aws-kms-pricing.astro src/pages/guides/aws-kms-estimate-requests.astro src/pages/guides/aws-kms-cost-optimization.astro tests/kms-cluster-role-separation.test.mjs
git commit -m "feat: separate kms guide cluster roles"
```

**Step 2: Push**

```bash
git push origin thin-page-triage
```

**Step 3: Open compare URL**

```bash
Start-Process 'https://github.com/shifang52221/cloudcostkit.com/compare/main...thin-page-triage?expand=1'
```
