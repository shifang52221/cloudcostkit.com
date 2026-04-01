# Secrets Manager Cluster Role Separation Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Separate the AWS Secrets Manager pricing, estimate, and optimization pages into clearly different editorial jobs so the cluster reads like a deliberate workflow instead of a templated trio.

**Architecture:** Keep the change local to the three Secrets Manager guide pages and one regression test. Strengthen role language, page-specific sections, and directional linking without changing layouts or adding new routes.

**Tech Stack:** Astro, Node test runner

---

### Task 1: Write the regression test first

**Files:**
- Create: `tests/secrets-manager-cluster-role-separation.test.mjs`

**Step 1: Write the failing test**

Add assertions for:

- pricing page role language that makes it the bill-boundary page
- estimate page role language that makes it the API-call measurement workflow page
- optimization page role language that makes it the production intervention page

**Step 2: Run the focused test and confirm red**

Run: `node --test .\tests\secrets-manager-cluster-role-separation.test.mjs`

Expected: FAIL because the new role-separation language does not exist yet.

### Task 2: Deepen the pricing page role

**Files:**
- Modify: `src/pages/guides/aws-secrets-manager-pricing.astro`

**Step 1: Add role-setting language**

- explain that this page defines what belongs inside the Secrets Manager bill before caching or optimization debates begin
- explain that secret-months and Secrets Manager API requests are the core bill items while rotation helpers, downstream Lambda, and incident-side effects should be tracked beside Secrets Manager rather than confused with it

**Step 2: Add stronger boundary structure**

- add an "inside the Secrets Manager bill vs beside the Secrets Manager bill" style section
- add "when this is not the right page" guidance

### Task 3: Deepen the estimate page role

**Files:**
- Modify: `src/pages/guides/aws-secrets-manager-estimate-api-calls.astro`

**Step 1: Add API-call measurement language**

- explain that the page exists to turn CloudTrail, process starts, cache refreshes, hot-path fetches, and retry behavior into a defendable monthly API-call model

**Step 2: Add stronger evidence structure**

- add an evidence-pack section
- strengthen the difference between baseline calls and deploy-driven, cold-start-driven, or retry-driven spikes

### Task 4: Deepen the optimization page role

**Files:**
- Modify: `src/pages/guides/aws-secrets-manager-cost-optimization.astro`

**Step 1: Add production-intervention language**

- explain that optimization starts only after the team knows whether secret-months or API requests dominate the bill
- explain that the page is about caching policy, hot-path removal, refresh discipline, and churn reduction

**Step 2: Add guardrails**

- add a "do not optimize yet" or equivalent section
- add a before-and-after validation loop

### Task 5: Verify green

**Files:**
- Test: `tests/secrets-manager-cluster-role-separation.test.mjs`

**Step 1: Run focused test**

Run: `node --test .\tests\secrets-manager-cluster-role-separation.test.mjs`

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
- Modify: `src/pages/guides/aws-secrets-manager-pricing.astro`
- Modify: `src/pages/guides/aws-secrets-manager-estimate-api-calls.astro`
- Modify: `src/pages/guides/aws-secrets-manager-cost-optimization.astro`
- Create: `tests/secrets-manager-cluster-role-separation.test.mjs`

**Step 1: Commit**

```bash
git add src/pages/guides/aws-secrets-manager-pricing.astro src/pages/guides/aws-secrets-manager-estimate-api-calls.astro src/pages/guides/aws-secrets-manager-cost-optimization.astro tests/secrets-manager-cluster-role-separation.test.mjs
git commit -m "feat: separate secrets manager guide cluster roles"
```

**Step 2: Push**

```bash
git push origin thin-page-triage
```

**Step 3: Open compare URL**

```bash
Start-Process 'https://github.com/shifang52221/cloudcostkit.com/compare/main...thin-page-triage?expand=1'
```
