# Trust Signal Hardening Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Strengthen CloudCostKit's site-level trust signals so the homepage, trust pages, and footer read as a real,
actively maintained product site rather than a thin template support layer.

**Architecture:** Rewrite the core trust pages so each owns a different responsibility, then reinforce the trust path
through the homepage and base layout. Keep the scope limited to existing pages and shared layout so the site becomes
more reviewable without creating new thin URLs.

**Tech Stack:** Astro, shared BaseLayout, existing trust pages, Node built-in test runner

---

### Task 1: Add trust-page regression tests

**Files:**
- Create: `tests/trust-page-signals.test.mjs`

**Step 1: Write the failing test**

Add tests that assert the revised site-level trust signals exist in source:

- homepage references editorial policy, methodology, and contact as a trust path
- about page states what the site does not replace
- editorial policy includes explicit review or consolidation language
- methodology includes "when not to trust" style guidance
- contact page includes response expectations and correction-intake guidance
- base layout footer includes a stronger independent-site boundary statement

**Step 2: Run test to verify it fails**

Run: `node --test tests/trust-page-signals.test.mjs`
Expected: FAIL because the current wording and structure do not yet match the new trust-signal contract.

### Task 2: Rewrite the trust pages with clearer responsibilities

**Files:**
- Modify: `src/pages/about.astro`
- Modify: `src/pages/editorial-policy.astro`
- Modify: `src/pages/methodology.astro`
- Modify: `src/pages/contact.astro`

**Step 1: Strengthen About**

Rewrite the page so it emphasizes:

- who the site serves
- what decisions it helps with
- what it does not replace
- how a user can challenge or report a page

**Step 2: Strengthen Editorial Policy**

Rewrite the page to emphasize:

- topic selection
- page qualification rules
- revision and consolidation triggers
- correction workflow
- clear boundaries between editorial policy and methodology

**Step 3: Strengthen Methodology**

Rewrite the page to emphasize:

- how calculators and guides are built
- common failure modes
- validation workflow
- when estimates should not be trusted without deeper review

**Step 4: Strengthen Contact**

Rewrite the page so it feels like an operating intake path:

- best reasons to contact
- what to include in a correction report
- expected response pattern
- trust-page cross-links

### Task 3: Expose the trust path more clearly from shared surfaces

**Files:**
- Modify: `src/pages/index.astro`
- Modify: `src/layouts/BaseLayout.astro`

**Step 1: Strengthen homepage trust messaging**

Add a visible trust-path section or messaging block near the upper half of the homepage that routes to:

- `/about/`
- `/editorial-policy/`
- `/methodology/`
- `/contact/`

**Step 2: Strengthen footer identity**

Update the footer copy so it states the site's identity and limits more clearly:

- independent planning resource
- educational and workflow support
- not a replacement for provider billing, quotes, contracts, or formal advice

### Task 4: Verify the trust-signal round

**Files:**
- Review: `src/pages/about.astro`
- Review: `src/pages/editorial-policy.astro`
- Review: `src/pages/methodology.astro`
- Review: `src/pages/contact.astro`
- Review: `src/pages/index.astro`
- Review: `src/layouts/BaseLayout.astro`
- Review: `tests/trust-page-signals.test.mjs`

**Step 1: Run the focused regression test**

Run: `node --test tests/trust-page-signals.test.mjs`
Expected: PASS

**Step 2: Run full repo tests**

Run: `npm test`

**Step 3: Run project checks**

Run: `npm run check`

**Step 4: Commit implementation**

Commit docs separately from implementation, push `thin-page-triage`, and open:

`https://github.com/shifang52221/cloudcostkit.com/compare/main...thin-page-triage?expand=1`

