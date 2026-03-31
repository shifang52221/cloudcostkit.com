# WAF Cluster Role Separation Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Separate the AWS WAF pricing, estimate, and optimization pages into clearly different editorial jobs so the cluster reads like a deliberate workflow instead of a templated trio.

**Architecture:** Keep the change local to the three WAF guide pages plus one regression test. Strengthen role language, page-specific sections, and directional linking without changing layouts or adding new pages.

**Tech Stack:** Astro, Node test runner

---

### Task 1: Write the regression test first

**Files:**
- Create: `tests/waf-cluster-role-separation.test.mjs`

**Step 1: Write the failing test**

Add assertions for:

- pricing page role language that makes it the budget-boundary page
- estimate page role language that makes it the measurement workflow page
- optimization page role language that makes it the production intervention page

**Step 2: Run the focused test and confirm red**

Run: `node --test .\tests\waf-cluster-role-separation.test.mjs`

Expected: FAIL because the new role-separation language does not exist yet.

### Task 2: Deepen the pricing page role

**Files:**
- Modify: `src/pages/guides/aws-waf-pricing.astro`

**Step 1: Add role-setting language**

- explain that this page defines what belongs inside the WAF bill model before optimization debates begin
- explain that logging, storage, and SIEM analysis can sit outside the WAF line item

**Step 2: Add stronger boundary structure**

- add an "inside the WAF bill vs outside the WAF bill" style section
- add "when this is not the right page" guidance

### Task 3: Deepen the estimate page role

**Files:**
- Modify: `src/pages/guides/aws-waf-estimate-requests.astro`

**Step 1: Add measurement-workflow language**

- explain that the page exists to turn observed allowed and blocked traffic into a defendable evaluated-request model

**Step 2: Add stronger evidence structure**

- add an evidence-pack section
- strengthen the difference between representative baseline windows and attack windows

### Task 4: Deepen the optimization page role

**Files:**
- Modify: `src/pages/guides/aws-waf-cost-optimization.astro`

**Step 1: Add production-intervention language**

- explain that optimization starts only after the evaluated-request model is believable
- explain that the page is about production changes such as caching, rate limits, rule consolidation, and logging controls

**Step 2: Add guardrails**

- add a "do not optimize yet" or equivalent section
- add a before/after change-control loop

### Task 5: Verify green

**Files:**
- Test: `tests/waf-cluster-role-separation.test.mjs`

**Step 1: Run focused test**

Run: `node --test .\tests\waf-cluster-role-separation.test.mjs`

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
- Modify: `src/pages/guides/aws-waf-pricing.astro`
- Modify: `src/pages/guides/aws-waf-estimate-requests.astro`
- Modify: `src/pages/guides/aws-waf-cost-optimization.astro`
- Create: `tests/waf-cluster-role-separation.test.mjs`

**Step 1: Commit**

```bash
git add src/pages/guides/aws-waf-pricing.astro src/pages/guides/aws-waf-estimate-requests.astro src/pages/guides/aws-waf-cost-optimization.astro tests/waf-cluster-role-separation.test.mjs
git commit -m "feat: separate waf guide cluster roles"
```

**Step 2: Push**

```bash
git push origin thin-page-triage
```

**Step 3: Open compare URL**

```bash
Start-Process 'https://github.com/shifang52221/cloudcostkit.com/compare/main...thin-page-triage?expand=1'
```
