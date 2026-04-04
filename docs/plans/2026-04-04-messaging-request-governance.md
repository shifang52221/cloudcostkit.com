# Messaging Request Governance Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Strengthen the messaging and request-pricing guide family so the messaging page owns event and delivery budgeting, the full request guide owns generic request math, and the request hub stays lightweight and navigational.

**Architecture:** Treat the messaging parent, the full request guide, and the request routing hub as one bounded governance batch. Add a targeted regression test for role separation, then make minimal but explicit first-screen and routing changes so each page owns a different layer of the hierarchy.

**Tech Stack:** Astro guide pages, Node test runner, Markdown planning docs, verification through `node --test`, `npm run check`, and `npm run build`.

---

### Task 1: Write the failing regression test

**Files:**
- Create: `tests/messaging-request-governance.test.mjs`
- Read: `src/pages/guides/messaging-costs.astro`
- Read: `src/pages/guides/request-based-pricing.astro`
- Read: `src/pages/guides/requests-costs.astro`

**Step 1:** Write a test that loads the three guide files, normalizes whitespace, and asserts:

- `messaging-costs` declares itself as the event and delivery budgeting parent page
- `request-based-pricing` declares itself as the generic request-math and billing-unit guide
- `requests-costs` declares itself as the lightweight request routing hub
- `request-based-pricing` routes messaging-budget questions back to `messaging-costs`
- `requests-costs` routes readers into `request-based-pricing` as the stronger full guide

**Step 2:** Run `node --test tests/messaging-request-governance.test.mjs`.

Expected: FAIL because the stronger hierarchy statements do not yet exist.

### Task 2: Implement the role split

**Files:**
- Modify: `src/pages/guides/messaging-costs.astro`
- Modify: `src/pages/guides/request-based-pricing.astro`
- Modify: `src/pages/guides/requests-costs.astro`

**Step 1:** In `messaging-costs.astro`, add a first-screen role statement that explicitly frames the page as the event and delivery budgeting parent page.

**Step 2:** In `messaging-costs.astro`, tighten the routing language so it clearly sends readers into generic request math only after the event and delivery pattern is clear.

**Step 3:** In `request-based-pricing.astro`, add a role statement that frames the page as the generic request-math and billing-unit guide and points messaging-budget questions back to `messaging-costs`.

**Step 4:** In `requests-costs.astro`, add a role statement that frames the page as the lightweight request routing hub and makes the full guide handoff more explicit.

**Step 5:** Keep `requests-costs.astro` lighter than `request-based-pricing.astro`; do not turn it into a second full guide.

**Step 6:** Keep the batch limited to these three guides unless a blocker forces a scope change.

### Task 3: Run verification

**Files:**
- Tests and guides from Tasks 1-2

**Step 1:** Run `node --test tests/messaging-request-governance.test.mjs`.

Expected: PASS.

**Step 2:** Run `npm run check`.

Expected: `0 errors`, `0 warnings`, and only the accepted existing hints.

**Step 3:** Run `npm run build`.

Expected: success.

### Task 4: Commit

**Files:** the three guides plus the new regression test

**Step:** `git add tests/messaging-request-governance.test.mjs src/pages/guides/messaging-costs.astro src/pages/guides/request-based-pricing.astro src/pages/guides/requests-costs.astro`

`git commit -m "feat: strengthen messaging request guide roles"`
