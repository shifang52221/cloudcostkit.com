# Governance Language Hardening Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Harden the language of the trust pages so they communicate clearer governance rules, stronger consequences,
and less template-like policy phrasing.

**Architecture:** Keep the scope limited to four existing trust pages and update only the sections where softer policy
explanations should become more explicit site-governance rules. Guard the changes with a focused regression test that
checks for stronger rule language in source content.

**Tech Stack:** Astro pages, existing trust content, Node built-in test runner

---

### Task 1: Add a failing regression test for governance language

**Files:**
- Create: `tests/governance-language-hardening.test.mjs`

**Step 1: Write the failing test**

Add source-based assertions that require:

- About to state that weak pages can lose strong placement before removal
- Editorial Policy to state that surviving pages can still lose recommendation status
- Methodology to state that review does not equal universal safety
- Contact to state that low-specificity reports are harder to act on and that review does not guarantee full adoption

**Step 2: Run test to verify it fails**

Run: `node --test tests/governance-language-hardening.test.mjs`
Expected: FAIL because the current pages do not yet contain the harder governance phrasing.

### Task 2: Harden About and Editorial Policy

**Files:**
- Modify: `src/pages/about.astro`
- Modify: `src/pages/editorial-policy.astro`
- Test: `tests/governance-language-hardening.test.mjs`

**Step 1: Update About**

Tighten the sections that explain:

- how a page loses strong placement
- why a page may stay live but stop being treated as a strong entry point
- how correction reports can expose role failure, not only wording issues

**Step 2: Update Editorial Policy**

Tighten the sections that explain:

- surviving versus recommended pages
- what kinds of reports lead to what kinds of action
- how recommendation loss differs from deletion

**Step 3: Run the focused test**

Run: `node --test tests/governance-language-hardening.test.mjs`
Expected: still FAIL until Methodology and Contact are updated.

### Task 3: Harden Methodology and Contact

**Files:**
- Modify: `src/pages/methodology.astro`
- Modify: `src/pages/contact.astro`
- Test: `tests/governance-language-hardening.test.mjs`

**Step 1: Update Methodology**

Tighten the language that explains:

- reviewed is not universal safety
- bounded usefulness can still stop being enough
- continuing to rely on an overstretched model is risky

**Step 2: Update Contact**

Tighten the language that explains:

- low-specificity reports are harder to action
- review does not guarantee full adoption of every suggestion
- triage determines the kind of response a request can receive

**Step 3: Run the focused test**

Run: `node --test tests/governance-language-hardening.test.mjs`
Expected: PASS

### Task 4: Verify the round end-to-end

**Files:**
- Review: `src/pages/about.astro`
- Review: `src/pages/editorial-policy.astro`
- Review: `src/pages/methodology.astro`
- Review: `src/pages/contact.astro`
- Review: `tests/governance-language-hardening.test.mjs`

**Step 1: Run full test suite**

Run: `npm test`

**Step 2: Run project checks**

Run: `npm run check`

**Step 3: Run build verification**

Run: `npm run build`

**Step 4: Commit implementation**

Commit docs separately from implementation, push `thin-page-triage`, and open:

`https://github.com/shifang52221/cloudcostkit.com/compare/main...thin-page-triage?expand=1`

