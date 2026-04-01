# DynamoDB Role Separation Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Separate the AWS DynamoDB pricing, RCU/WCU explainer, and optimization pages into clearly different editorial jobs so the cluster reads like a deliberate workflow instead of a templated topic trio.

**Architecture:** Keep the change local to the three DynamoDB guide pages and one regression test. Strengthen role language, page-specific sections, and directional linking without changing layouts or adding new routes.

**Tech Stack:** Astro, Node test runner

---

### Task 1: Write the regression test first

**Files:**
- Create: `tests/dynamodb-role-separation.test.mjs`

**Step 1: Write the failing test**

Add assertions for:

- pricing page role language that makes it the bill-boundary page
- RCU/WCU page role language that makes it the capacity-measurement explainer page
- optimization page role language that makes it the production intervention page

**Step 2: Run the focused test and confirm red**

Run: `node --test .\tests\dynamodb-role-separation.test.mjs`

Expected: FAIL because the new role-separation language does not exist yet.

### Task 2: Deepen the pricing page role

**Files:**
- Modify: `src/pages/guides/aws-dynamodb-pricing.astro`

**Step 1: Add role-setting language**

- explain that this page defines what belongs inside the DynamoDB bill before teams debate schema changes, caching, or retry control
- explain that read exposure, write exposure, table storage, index amplification, backups, streams, and global tables are DynamoDB-native costs while cache, stream-consumer, and application-side costs should be tracked beside the DynamoDB bill rather than blended into it

**Step 2: Add stronger boundary structure**

- add an "inside the DynamoDB bill vs beside the DynamoDB bill" style section
- add "when this is not the right page" guidance

### Task 3: Deepen the RCU/WCU page role

**Files:**
- Modify: `src/pages/guides/aws-dynamodb-rcu-wcu-explained.astro`

**Step 1: Add mechanism-explainer language**

- explain that the page exists to turn item size, consistency, query shape, scan behavior, and index updates into a defendable read and write unit model

**Step 2: Add stronger evidence structure**

- add an evidence-pack section
- strengthen the difference between raw request counts and billable unit exposure

### Task 4: Deepen the optimization page role

**Files:**
- Modify: `src/pages/guides/aws-dynamodb-cost-optimization.astro`

**Step 1: Add production-intervention language**

- explain that optimization starts only after the team knows whether reads, writes, storage, or index amplification is the real DynamoDB cost driver
- explain that the page is about read-path cleanup, write amplification control, storage shaping, index hygiene, and correctness-safe query changes

**Step 2: Add guardrails**

- add a "do not optimize yet" or equivalent section
- add a before-and-after change-control loop

### Task 5: Verify green

**Files:**
- Test: `tests/dynamodb-role-separation.test.mjs`

**Step 1: Run focused test**

Run: `node --test .\tests\dynamodb-role-separation.test.mjs`

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
- Create: `docs/plans/2026-04-01-dynamodb-role-separation-design.md`
- Create: `docs/plans/2026-04-01-dynamodb-role-separation.md`
- Modify: `src/pages/guides/aws-dynamodb-pricing.astro`
- Modify: `src/pages/guides/aws-dynamodb-rcu-wcu-explained.astro`
- Modify: `src/pages/guides/aws-dynamodb-cost-optimization.astro`
- Create: `tests/dynamodb-role-separation.test.mjs`

**Step 1: Commit**

```bash
git add docs/plans/2026-04-01-dynamodb-role-separation-design.md docs/plans/2026-04-01-dynamodb-role-separation.md
git commit -m "docs: add dynamodb role separation plan"
git add src/pages/guides/aws-dynamodb-pricing.astro src/pages/guides/aws-dynamodb-rcu-wcu-explained.astro src/pages/guides/aws-dynamodb-cost-optimization.astro tests/dynamodb-role-separation.test.mjs
git commit -m "feat: separate dynamodb guide roles"
```

**Step 2: Push**

```bash
git push origin thin-page-triage
```

**Step 3: Open compare URL**

```bash
Start-Process 'https://github.com/shifang52221/cloudcostkit.com/compare/main...thin-page-triage?expand=1'
```
