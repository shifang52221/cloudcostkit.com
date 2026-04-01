# Route 53 Cluster Role Separation Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Separate the AWS Route 53 pricing, estimate, and optimization pages into clearly different editorial jobs so the cluster reads like a deliberate workflow instead of a templated trio.

**Architecture:** Keep the change local to the three Route 53 guide pages and one regression test. Strengthen role language, page-specific sections, and directional linking without changing layouts or adding new routes.

**Tech Stack:** Astro, Node test runner

---

### Task 1: Write the regression test first

**Files:**
- Create: `tests/route-53-cluster-role-separation.test.mjs`

**Step 1: Write the failing test**

Add assertions for:

- pricing page role language that makes it the bill-boundary page
- estimate page role language that makes it the DNS measurement workflow page
- optimization page role language that makes it the production intervention page

**Step 2: Run the focused test and confirm red**

Run: `node --test .\tests\route-53-cluster-role-separation.test.mjs`

Expected: FAIL because the new role-separation language does not exist yet.

### Task 2: Deepen the pricing page role

**Files:**
- Modify: `src/pages/guides/aws-route-53-pricing.astro`

**Step 1: Add role-setting language**

- explain that this page defines what belongs inside the Route 53 bill before optimization debates begin
- explain that hosted zones, DNS queries, and health checks are the core bill items while resolver-layer work, CDN behavior, and broader incident impact should be tracked beside Route 53 rather than confused with it

**Step 2: Add stronger boundary structure**

- add an "inside the Route 53 bill vs beside the Route 53 bill" style section
- add "when this is not the right page" guidance

### Task 3: Deepen the estimate page role

**Files:**
- Modify: `src/pages/guides/aws-route-53-estimate-dns-queries.astro`

**Step 1: Add DNS-measurement language**

- explain that the page exists to turn authoritative query metrics, query logs, resolver evidence, TTL posture, and retry behavior into a defendable monthly query model

**Step 2: Add stronger evidence structure**

- add an evidence-pack section
- strengthen the difference between baseline demand and retry-driven, failover-driven, or NXDOMAIN-driven spikes

### Task 4: Deepen the optimization page role

**Files:**
- Modify: `src/pages/guides/aws-route-53-cost-optimization.astro`

**Step 1: Add production-intervention language**

- explain that optimization starts only after the team knows whether queries, zones, or health checks dominate the bill
- explain that the page is about TTL policy, query amplification, health-check discipline, and zone-sprawl fixes

**Step 2: Add guardrails**

- add a "do not optimize yet" or equivalent section
- add a before-and-after validation loop

### Task 5: Verify green

**Files:**
- Test: `tests/route-53-cluster-role-separation.test.mjs`

**Step 1: Run focused test**

Run: `node --test .\tests\route-53-cluster-role-separation.test.mjs`

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
- Modify: `src/pages/guides/aws-route-53-pricing.astro`
- Modify: `src/pages/guides/aws-route-53-estimate-dns-queries.astro`
- Modify: `src/pages/guides/aws-route-53-cost-optimization.astro`
- Create: `tests/route-53-cluster-role-separation.test.mjs`

**Step 1: Commit**

```bash
git add src/pages/guides/aws-route-53-pricing.astro src/pages/guides/aws-route-53-estimate-dns-queries.astro src/pages/guides/aws-route-53-cost-optimization.astro tests/route-53-cluster-role-separation.test.mjs
git commit -m "feat: separate route 53 guide cluster roles"
```

**Step 2: Push**

```bash
git push origin thin-page-triage
```

**Step 3: Open compare URL**

```bash
Start-Process 'https://github.com/shifang52221/cloudcostkit.com/compare/main...thin-page-triage?expand=1'
```
