# CloudTrail Cluster Role Separation Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Separate the AWS CloudTrail pricing, estimate, and optimization pages into clearly different editorial jobs so the cluster reads like a deliberate workflow instead of a templated trio.

**Architecture:** Keep the change local to the three CloudTrail guide pages and one regression test. Strengthen role language, page-specific sections, and directional linking without changing layouts or adding new routes.

**Tech Stack:** Astro, Node test runner

---

### Task 1: Write the regression test first

**Files:**
- Create: `tests/cloudtrail-cluster-role-separation.test.mjs`

**Step 1: Write the failing test**

Add assertions for:

- pricing page role language that makes it the bill-boundary page
- estimate page role language that makes it the event-measurement workflow page
- optimization page role language that makes it the production intervention page

**Step 2: Run the focused test and confirm red**

Run: `node --test .\tests\cloudtrail-cluster-role-separation.test.mjs`

Expected: FAIL because the new role-separation language does not exist yet.

### Task 2: Deepen the pricing page role

**Files:**
- Modify: `src/pages/guides/aws-cloudtrail-pricing.astro`

**Step 1: Add role-setting language**

- explain that this page defines what belongs inside the CloudTrail bill before teams debate selector tightening or downstream log reduction
- explain that management events, data events, and insights are the core CloudTrail line items while S3 retention, Athena scans, SIEM ingestion, and copied pipelines should be tracked beside CloudTrail rather than blended into it

**Step 2: Add stronger boundary structure**

- add an "inside the CloudTrail bill vs beside the CloudTrail bill" style section
- add "when this is not the right page" guidance

### Task 3: Deepen the estimate page role

**Files:**
- Modify: `src/pages/guides/aws-cloudtrail-estimate-events.astro`

**Step 1: Add event-measurement language**

- explain that the page exists to turn CloudTrail Lake evidence, S3 log counts, eventCategory splits, eventSource hotspots, and busy-week windows into a defendable monthly event model

**Step 2: Add stronger evidence structure**

- add an evidence-pack section
- strengthen the difference between baseline weeks and deploy-, automation-, or incident-driven spikes

### Task 4: Deepen the optimization page role

**Files:**
- Modify: `src/pages/guides/aws-cloudtrail-cost-optimization.astro`

**Step 1: Add production-intervention language**

- explain that optimization starts only after the team knows whether data event scope, management-event churn, or downstream analysis is the real CloudTrail cost driver
- explain that the page is about selector discipline, automation-noise reduction, retention policy, and scan reduction

**Step 2: Add guardrails**

- add a "do not optimize yet" or equivalent section
- add a before-and-after change-control loop

### Task 5: Verify green

**Files:**
- Test: `tests/cloudtrail-cluster-role-separation.test.mjs`

**Step 1: Run focused test**

Run: `node --test .\tests\cloudtrail-cluster-role-separation.test.mjs`

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
- Modify: `src/pages/guides/aws-cloudtrail-pricing.astro`
- Modify: `src/pages/guides/aws-cloudtrail-estimate-events.astro`
- Modify: `src/pages/guides/aws-cloudtrail-cost-optimization.astro`
- Create: `tests/cloudtrail-cluster-role-separation.test.mjs`

**Step 1: Commit**

```bash
git add src/pages/guides/aws-cloudtrail-pricing.astro src/pages/guides/aws-cloudtrail-estimate-events.astro src/pages/guides/aws-cloudtrail-cost-optimization.astro tests/cloudtrail-cluster-role-separation.test.mjs
git commit -m "feat: separate cloudtrail guide cluster roles"
```

**Step 2: Push**

```bash
git push origin thin-page-triage
```

**Step 3: Open compare URL**

```bash
Start-Process 'https://github.com/shifang52221/cloudcostkit.com/compare/main...thin-page-triage?expand=1'
```
