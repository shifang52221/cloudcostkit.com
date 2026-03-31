# API Gateway Cluster Role Separation Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Separate the AWS API Gateway pricing, estimate, and optimization pages into clearly different editorial jobs while turning the access-logs page into a clear support page for the cluster.

**Architecture:** Keep the change local to the three API Gateway guide pages, the access-logs support page, and one regression test. Strengthen role language, page-specific sections, and directional linking without changing layouts or adding new routes.

**Tech Stack:** Astro, Node test runner

---

### Task 1: Write the regression test first

**Files:**
- Create: `tests/api-gateway-cluster-role-separation.test.mjs`

**Step 1: Write the failing test**

Add assertions for:

- pricing page role language that makes it the bill-boundary page
- estimate page role language that makes it the request-measurement workflow page
- optimization page role language that makes it the production intervention page
- access-logs page role language that makes it the support logging-cost page

**Step 2: Run the focused test and confirm red**

Run: `node --test .\tests\api-gateway-cluster-role-separation.test.mjs`

Expected: FAIL because the new role-separation language does not exist yet.

### Task 2: Deepen the pricing page role

**Files:**
- Modify: `src/pages/guides/aws-api-gateway-pricing.astro`

**Step 1: Add role-setting language**

- explain that this page defines what belongs inside the API Gateway bill model before optimization debates begin
- explain that transfer, logs, WAF, CDN, and downstream execution costs should be tracked beside API Gateway rather than confused with the core request bill

**Step 2: Add stronger boundary structure**

- add an "inside the API Gateway bill vs outside the API Gateway bill" style section
- add "when this is not the right page" guidance

### Task 3: Deepen the estimate page role

**Files:**
- Modify: `src/pages/guides/aws-api-gateway-estimate-requests.astro`

**Step 1: Add request-measurement language**

- explain that the page exists to turn metrics, logs, RPS, automated traffic, and retries into a defendable requests-per-month model

**Step 2: Add stronger evidence structure**

- add an evidence-pack section
- strengthen the difference between baseline request demand and retry-driven or health-check-driven spikes

### Task 4: Deepen the optimization page role

**Files:**
- Modify: `src/pages/guides/aws-api-gateway-cost-optimization.astro`

**Step 1: Add production-intervention language**

- explain that optimization starts only after the API request and transfer model is believable
- explain that the page is about production changes such as caching, batching, retry control, payload reduction, and traffic-shape fixes

**Step 2: Add guardrails**

- add a "do not optimize yet" or equivalent section
- add a before and after change-control loop

### Task 5: Deepen the access-logs support role

**Files:**
- Modify: `src/pages/guides/aws-api-gateway-access-logs-cost.astro`

**Step 1: Add support-page language**

- explain that this page is the logging-cost branch of the API Gateway cluster, not the core request-pricing page
- explain when logging should be treated as a separate support bill surface

**Step 2: Add stronger handoffs**

- add "when this is not the right page" guidance
- add directional links back to pricing, estimate, and optimization

### Task 6: Verify green

**Files:**
- Test: `tests/api-gateway-cluster-role-separation.test.mjs`

**Step 1: Run focused test**

Run: `node --test .\tests\api-gateway-cluster-role-separation.test.mjs`

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

### Task 7: Commit and prepare merge

**Files:**
- Modify: `src/pages/guides/aws-api-gateway-pricing.astro`
- Modify: `src/pages/guides/aws-api-gateway-estimate-requests.astro`
- Modify: `src/pages/guides/aws-api-gateway-cost-optimization.astro`
- Modify: `src/pages/guides/aws-api-gateway-access-logs-cost.astro`
- Create: `tests/api-gateway-cluster-role-separation.test.mjs`

**Step 1: Commit**

```bash
git add src/pages/guides/aws-api-gateway-pricing.astro src/pages/guides/aws-api-gateway-estimate-requests.astro src/pages/guides/aws-api-gateway-cost-optimization.astro src/pages/guides/aws-api-gateway-access-logs-cost.astro tests/api-gateway-cluster-role-separation.test.mjs
git commit -m "feat: separate api gateway guide cluster roles"
```

**Step 2: Push**

```bash
git push origin thin-page-triage
```

**Step 3: Open compare URL**

```bash
Start-Process 'https://github.com/shifang52221/cloudcostkit.com/compare/main...thin-page-triage?expand=1'
```
