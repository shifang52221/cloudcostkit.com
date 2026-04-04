# Observability Governance Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Strengthen the observability guide cluster so the parent page owns cross-signal budgeting while the metrics and log pages own their narrower cost boundaries.

**Architecture:** Treat the observability parent plus two specialist guides as one bounded batch. Add a targeted regression test for role separation, then make minimal but explicit first-screen and routing changes so the parent page stays broad and the specialist pages stay intentionally narrower.

**Tech Stack:** Astro guide pages, Node test runner, Markdown planning docs, verification through `npm run check` and `npm run build`.

---

### Task 1: Write the failing regression test

**Files:**
- Create: `tests/observability-role-separation.test.mjs`
- Read: `src/pages/guides/observability-costs.astro`
- Read: `src/pages/guides/metrics-costs.astro`
- Read: `src/pages/guides/log-costs.astro`

**Step 1:** Write a test that loads the three guide files, normalizes whitespace, and asserts:

- `observability-costs` declares itself as the observability system budgeting parent page
- `metrics-costs` declares itself as the metrics cardinality and monitoring economics page
- `log-costs` declares itself as the log ingestion, retention, and scan economics page
- `metrics-costs` routes readers back to `observability-costs` when the broader signal split is still unclear
- `log-costs` routes readers back to `observability-costs` when the broader signal split is still unclear

**Step 2:** Run `node --test tests/observability-role-separation.test.mjs`.

Expected: FAIL because the explicit role statements do not yet exist.

### Task 2: Implement the role split

**Files:**
- Modify: `src/pages/guides/observability-costs.astro`
- Modify: `src/pages/guides/metrics-costs.astro`
- Modify: `src/pages/guides/log-costs.astro`

**Step 1:** In `observability-costs.astro`, add a first-screen role statement that explicitly frames the page as the observability system budgeting parent page.

**Step 2:** In `observability-costs.astro`, tighten the routing language so it clearly sends readers into the metrics and log guides only after the broader signal split is clear.

**Step 3:** In `metrics-costs.astro`, add a role statement that frames the page as the metrics cardinality and monitoring economics page and points unresolved cross-signal questions back to `observability-costs`.

**Step 4:** In `log-costs.astro`, add a role statement that frames the page as the log ingestion, retention, and scan economics page and points unresolved cross-signal questions back to `observability-costs`.

**Step 5:** Keep the batch limited to these three guides unless a blocker forces a scope change.

### Task 3: Run verification

**Files:**
- Tests and guides from Tasks 1-2

**Step 1:** Run `node --test tests/observability-role-separation.test.mjs`.

Expected: PASS.

**Step 2:** Run `npm run check`.

Expected: `0 errors`, `0 warnings`, and only the accepted existing hints.

**Step 3:** Run `npm run build`.

Expected: success.

### Task 4: Commit

**Files:** the three guides plus the new regression test

**Step:** `git add tests/observability-role-separation.test.mjs src/pages/guides/observability-costs.astro src/pages/guides/metrics-costs.astro src/pages/guides/log-costs.astro`

`git commit -m "feat: strengthen observability guide roles"`
