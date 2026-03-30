# Operational Trust Signals Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Deepen the site's trust pages so they show real maintenance behavior, correction handling, and clearer review
semantics instead of only generic policy presence.

**Architecture:** Keep the scope limited to four trust pages and add explicit operational sections that explain
maintenance priorities, correction triage, review labels, and when pages or estimates lose trust. Protect the behavior
with a focused regression test on trust-page source content.

**Tech Stack:** Astro pages, existing trust content, Node built-in test runner

---

### Task 1: Add a failing regression test for operational trust signals

**Files:**
- Create: `tests/operational-trust-signals.test.mjs`

**Step 1: Write the failing test**

Create source-based assertions that require:

- About to mention maintenance priorities and page-quality downgrade triggers
- Editorial Policy to mention material revision meaning and post-submission review flow
- Methodology to define what "reviewed" means and when a calculator should stop being used
- Contact to define triage and explain that reports can lead to revisions, clarifications, or lower prominence

**Step 2: Run test to verify it fails**

Run: `node --test tests/operational-trust-signals.test.mjs`
Expected: FAIL because the current pages do not yet contain these exact operational signals.

### Task 2: Strengthen About and Editorial Policy

**Files:**
- Modify: `src/pages/about.astro`
- Modify: `src/pages/editorial-policy.astro`
- Test: `tests/operational-trust-signals.test.mjs`

**Step 1: Update About**

Add concise sections that explain:

- which page groups are prioritized for review
- what signals make a page no longer good enough
- what kind of correction reports usually trigger visible change

**Step 2: Update Editorial Policy**

Add concise sections that explain:

- what happens after a correction is submitted
- what counts as a material revision
- when a page can remain live but lose prominence

**Step 3: Run the focused test**

Run: `node --test tests/operational-trust-signals.test.mjs`
Expected: still FAIL until Methodology and Contact are updated.

### Task 3: Strengthen Methodology and Contact

**Files:**
- Modify: `src/pages/methodology.astro`
- Modify: `src/pages/contact.astro`
- Test: `tests/operational-trust-signals.test.mjs`

**Step 1: Update Methodology**

Add concise sections that explain:

- what "reviewed" means on the site
- what `Last updated` does and does not mean
- when a calculator should stop being used without deeper review

**Step 2: Update Contact**

Add concise sections that explain:

- how requests are triaged
- what information speeds review
- how a strong report can lead to revisions, clarified boundaries, or lower prominence

**Step 3: Run the focused test**

Run: `node --test tests/operational-trust-signals.test.mjs`
Expected: PASS

### Task 4: Verify the round end-to-end

**Files:**
- Review: `src/pages/about.astro`
- Review: `src/pages/editorial-policy.astro`
- Review: `src/pages/methodology.astro`
- Review: `src/pages/contact.astro`
- Review: `tests/operational-trust-signals.test.mjs`

**Step 1: Run full test suite**

Run: `npm test`

**Step 2: Run project checks**

Run: `npm run check`

**Step 3: Run build verification**

Run: `npm run build`

**Step 4: Commit implementation**

Commit docs separately from implementation, push `thin-page-triage`, and open:

`https://github.com/shifang52221/cloudcostkit.com/compare/main...thin-page-triage?expand=1`

