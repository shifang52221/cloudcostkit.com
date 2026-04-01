# RDS Cluster Role Separation Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Separate the AWS RDS pricing, backup estimate, and optimization pages into clearly different editorial jobs so the cluster reads like a deliberate workflow instead of a templated trio.

**Architecture:** Keep the change local to the three RDS guide pages and one regression test. Strengthen role language, page-specific sections, and directional linking without changing layouts or adding new routes.

**Tech Stack:** Astro, Node test runner

---

### Task 1: Write the regression test first

**Files:**
- Create: `tests/rds-cluster-role-separation.test.mjs`

**Step 1: Write the failing test**

Add assertions for:

- pricing page role language that makes it the bill-boundary page
- estimate page role language that makes it the backup-storage measurement workflow page
- optimization page role language that makes it the production intervention page

**Step 2: Run the focused test and confirm red**

Run: `node --test .\tests\rds-cluster-role-separation.test.mjs`

Expected: FAIL because the new role-separation language does not exist yet.

### Task 2: Deepen the pricing page role

**Files:**
- Modify: `src/pages/guides/aws-rds-pricing.astro`

**Step 1: Add role-setting language**

- explain that this page defines what belongs inside the RDS bill before teams debate instance right-sizing, backup retention changes, or storage tuning
- explain that compute, DB storage, backup storage, I/O-priced storage exposure, and HA or replica capacity are RDS-native costs while monitoring, transfer, and application-side costs should be tracked beside the RDS bill rather than blended into it

**Step 2: Add stronger boundary structure**

- add an "inside the RDS bill vs beside the RDS bill" style section
- add "when this is not the right page" guidance

### Task 3: Deepen the estimate page role

**Files:**
- Modify: `src/pages/guides/aws-rds-backup-storage-gb-month-estimate.astro`

**Step 1: Add measurement-workflow language**

- explain that the page exists to turn churn, retention, manual snapshot behavior, copy policies, and long-term retention windows into a defendable backup GB-month model

**Step 2: Add stronger evidence structure**

- add an evidence-pack section
- strengthen the difference between steady-state backup exposure and spike windows

### Task 4: Deepen the optimization page role

**Files:**
- Modify: `src/pages/guides/aws-rds-cost-optimization.astro`

**Step 1: Add production-intervention language**

- explain that optimization starts only after the team knows whether compute headroom, storage growth, backup retention, or I/O-heavy query patterns are the real RDS cost driver
- explain that the page is about instance right-sizing, storage-growth control, backup-policy tuning, I/O cleanup, and reliability-safe architecture choices

**Step 2: Add guardrails**

- add a "do not optimize yet" or equivalent section
- add a before-and-after change-control loop

### Task 5: Verify green

**Files:**
- Test: `tests/rds-cluster-role-separation.test.mjs`

**Step 1: Run focused test**

Run: `node --test .\tests\rds-cluster-role-separation.test.mjs`

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
- Create: `docs/plans/2026-04-01-rds-cluster-role-separation-design.md`
- Create: `docs/plans/2026-04-01-rds-cluster-role-separation.md`
- Modify: `src/pages/guides/aws-rds-pricing.astro`
- Modify: `src/pages/guides/aws-rds-backup-storage-gb-month-estimate.astro`
- Modify: `src/pages/guides/aws-rds-cost-optimization.astro`
- Create: `tests/rds-cluster-role-separation.test.mjs`

**Step 1: Commit**

```bash
git add docs/plans/2026-04-01-rds-cluster-role-separation-design.md docs/plans/2026-04-01-rds-cluster-role-separation.md
git commit -m "docs: add rds cluster role separation plan"
git add src/pages/guides/aws-rds-pricing.astro src/pages/guides/aws-rds-backup-storage-gb-month-estimate.astro src/pages/guides/aws-rds-cost-optimization.astro tests/rds-cluster-role-separation.test.mjs
git commit -m "feat: separate rds guide cluster roles"
```

**Step 2: Push**

```bash
git push origin thin-page-triage
```

**Step 3: Open compare URL**

```bash
Start-Process 'https://github.com/shifang52221/cloudcostkit.com/compare/main...thin-page-triage?expand=1'
```
