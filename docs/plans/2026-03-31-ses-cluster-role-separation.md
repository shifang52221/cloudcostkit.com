# SES Cluster Role Separation Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Separate the AWS SES pricing, estimate, and optimization pages into clearly different editorial jobs so the cluster reads like a deliberate workflow instead of a templated trio.

**Architecture:** Keep the change local to the three SES guide pages plus one regression test. Strengthen role language, page-specific sections, and directional linking without changing layouts or adding new pages.

**Tech Stack:** Astro, Node test runner

---

### Task 1: Write the regression test first

**Files:**
- Create: `tests/ses-cluster-role-separation.test.mjs`

**Step 1: Write the failing test**

Add assertions for:

- pricing page role language that makes it the bill-boundary page
- estimate page role language that makes it the send-measurement workflow page
- optimization page role language that makes it the production intervention page

**Step 2: Run the focused test and confirm red**

Run: `node --test .\tests\ses-cluster-role-separation.test.mjs`

Expected: FAIL because the new role-separation language does not exist yet.

### Task 2: Deepen the pricing page role

**Files:**
- Modify: `src/pages/guides/aws-ses-pricing.astro`

**Step 1: Add role-setting language**

- explain that this page defines what belongs inside the SES bill model before optimization debates begin
- explain that downstream application, storage, or workflow costs should be tracked beside SES instead of being confused with the SES bill

**Step 2: Add stronger boundary structure**

- add an "inside the SES bill vs outside the SES bill" style section
- add "when this is not the right page" guidance

### Task 3: Deepen the estimate page role

**Files:**
- Modify: `src/pages/guides/aws-ses-estimate-email-volume.astro`

**Step 1: Add send-measurement language**

- explain that the page exists to turn transactional events, campaign calendars, recipient counts, and retry windows into a defendable email-volume model

**Step 2: Add stronger evidence structure**

- add an evidence-pack section
- strengthen the difference between baseline sends and duplicate-driven or outage-driven spikes

### Task 4: Deepen the optimization page role

**Files:**
- Modify: `src/pages/guides/aws-ses-cost-optimization.astro`

**Step 1: Add production-intervention language**

- explain that optimization starts only after the SES send model is believable
- explain that the page is about production changes such as dedupe, retry control, non-prod suppression, batching, and preference controls

**Step 2: Add guardrails**

- add a "do not optimize yet" or equivalent section
- add a before and after change-control loop

### Task 5: Verify green

**Files:**
- Test: `tests/ses-cluster-role-separation.test.mjs`

**Step 1: Run focused test**

Run: `node --test .\tests\ses-cluster-role-separation.test.mjs`

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
- Modify: `src/pages/guides/aws-ses-pricing.astro`
- Modify: `src/pages/guides/aws-ses-estimate-email-volume.astro`
- Modify: `src/pages/guides/aws-ses-cost-optimization.astro`
- Create: `tests/ses-cluster-role-separation.test.mjs`

**Step 1: Commit**

```bash
git add src/pages/guides/aws-ses-pricing.astro src/pages/guides/aws-ses-estimate-email-volume.astro src/pages/guides/aws-ses-cost-optimization.astro tests/ses-cluster-role-separation.test.mjs
git commit -m "feat: separate ses guide cluster roles"
```

**Step 2: Push**

```bash
git push origin thin-page-triage
```

**Step 3: Open compare URL**

```bash
Start-Process 'https://github.com/shifang52221/cloudcostkit.com/compare/main...thin-page-triage?expand=1'
```
