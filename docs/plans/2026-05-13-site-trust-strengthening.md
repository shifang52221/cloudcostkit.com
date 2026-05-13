# Site Trust Strengthening Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Strengthen CloudCostKit's site-level trust signals so Google and users can more clearly understand who maintains the site, how pages are reviewed, and why the workflows exist.

**Architecture:** Extend the site config and base layout to carry a richer organization identity, then enhance the homepage and trust pages so they present a tighter "who / how / why / correction path" trust surface without turning into generic reassurance copy.

**Tech Stack:** Astro pages and layouts, site config, Node test runner

---

### Task 1: Lock the new trust expectations with tests

**Files:**
- Create: `tests/site-trust-strengthening.test.mjs`

**Step 1: Write the failing test**

Add assertions covering:
- richer organization schema fields in `src/layouts/BaseLayout.astro`
- explicit site identity metadata in `src/config/site.ts`
- stronger homepage trust-path language about who maintains and reviews the site
- clearer correction and source-review language across trust pages

**Step 2: Run test to verify it fails**

Run: `node --test tests/site-trust-strengthening.test.mjs`
Expected: FAIL because the current site config and trust pages do not yet include the stronger site-level trust signals.

### Task 2: Apply the minimal site-trust enhancements

**Files:**
- Modify: `src/config/site.ts`
- Modify: `src/layouts/BaseLayout.astro`
- Modify: `src/pages/index.astro`
- Modify: `src/pages/about.astro`
- Modify: `src/pages/methodology.astro`
- Modify: `src/pages/editorial-policy.astro`
- Modify: `src/pages/contact.astro`

**Step 1: Strengthen the site identity layer**

Add appropriate site metadata that can support clearer organization schema and repeated trust messaging.

**Step 2: Strengthen the base layout organization signals**

Enhance the Organization / WebSite schema and global trust affordances without adding fake credentials or unsupported fields.

**Step 3: Strengthen homepage and trust-page copy**

Clarify:
- who maintains the site
- how pages are reviewed
- why the workflows exist
- where correction responsibility begins and ends

**Step 4: Keep the changes focused**

Do not widen into guide-by-guide rewrites yet. This batch is only for the site trust skeleton.

### Task 3: Verify the trust batch

**Files:**
- Verify: `tests/site-trust-strengthening.test.mjs`
- Verify: `tests/trust-page-signals.test.mjs`
- Verify: `tests/governance-language-hardening.test.mjs`

**Step 1: Run targeted tests**

Run: `node --test tests/site-trust-strengthening.test.mjs tests/trust-page-signals.test.mjs tests/governance-language-hardening.test.mjs`
Expected: PASS

**Step 2: Run broader checks**

Run:
- `npm test`
- `npm run check`
- `npm run build`

Expected: PASS

**Step 3: Report exact evidence**

Only describe the batch as complete after the fresh verification output confirms the site still builds cleanly and the trust regression tests pass.
