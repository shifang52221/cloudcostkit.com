# CDN Core Entry Refresh Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Upgrade the CDN core guide and calculator entry points so they read like sharp, original, decision-ready pages for CDN pricing, comparison, and billing-boundary questions.

**Architecture:** Keep the existing Astro page structure and extend the current CDN guide and calculator pages with more specific first-screen diagnosis, stronger routing language, and scenario-led planning copy. Add regression tests first so we can prove the pages still own the right cluster roles, then make the minimal content changes needed to satisfy those tests without collapsing the narrower CDN subpages.

**Tech Stack:** Astro page templates, existing calculator components, Node test runner, `npm run generate:guides`, `npm run check`.

---

### Task 1: Add a regression test for the CDN core entry refresh

**Files:**
- Create: `tests/cdn-core-entry-refresh.test.mjs`
- Read: `src/pages/guides/cdn-costs.astro`
- Read: `src/pages/calculators/cdn-cost-calculator.astro`
- Read: `src/pages/calculators/cdn-bandwidth-cost-calculator.astro`
- Read: `src/pages/guides/cdn-cost-comparison.astro`
- Read: `src/pages/guides/cdn-cost-per-gigabyte.astro`
- Read: `src/pages/guides/cdn-request-pricing.astro`
- Read: `src/pages/guides/estimate-cdn-bandwidth-gb-per-month.astro`
- Read: `src/pages/guides/origin-egress-vs-cdn-bandwidth.astro`

**Step 1: Write the failing test**

Create a regression test that reads the CDN guide and calculator pages as normalized text and asserts the core refresh outcomes:

- the CDN guide opens with bill-triage language that names the moved line item and routes to bandwidth, request, origin, or full planner next
- the main CDN calculator reads as a multi-surface planner with bandwidth share, request share, and origin exposure
- the CDN bandwidth calculator uses CDN-specific scenario framing and no longer leaks generic egress semantics
- the guide preserves role separation from the comparison, per-GB, request, bandwidth-measurement, and concept pages

Use `readFileSync`, whitespace normalization, and `assert.match` in the same style as the existing governance tests.

**Step 2: Run the test to verify it fails**

Run:

```bash
node --test tests/cdn-core-entry-refresh.test.mjs
```

Expected: FAIL because the current pages do not yet expose the stronger core-entry signals.

**Step 3: Keep the assertions concrete**

Assert for phrases and structures such as:

- guide copy about which CDN line item moved first, what changed first, and which calculator to use next
- calculator copy about dominant cost surface, bandwidth share, request share, origin egress share, and next step by intent
- bandwidth page copy about video, storefront, download, or launch traffic instead of generic transfer wording
- guide copy that explicitly keeps bill-boundary ownership separate from the narrower CDN guide cluster

**Step 4: Re-run after implementation**

Run:

```bash
node --test tests/cdn-core-entry-refresh.test.mjs
```

Expected: PASS once Tasks 2 through 4 are complete.

### Task 2: Upgrade the CDN bandwidth page into a more specific planning entry point

**Files:**
- Modify: `src/pages/calculators/cdn-bandwidth-cost-calculator.astro`
- Read: `src/components/calculators/DataEgressCost.tsx`
- Read: `src/pages/calculators/cdn-cost-calculator.astro`

**Step 1: Sharpen the first-screen promise**

Update the page so it clearly owns CDN edge-delivery planning rather than generic transfer math. The intro should say when to use this page first and why it is different from the full planner.

**Step 2: Strengthen scenario and validation copy**

Add or tighten sections that explain:

- when to use this calculator first
- what the estimate still misses
- how to validate the result after comparing baseline and peak months

Keep the scenario language tied to media, storefront, download, release, or campaign traffic.

**Step 3: Route users more clearly to the next page**

Add intent-labeled next steps for request pricing, origin egress, and the full CDN planner. The page should help users decide whether they need narrower math or the multi-surface view next.

**Step 4: Remove generic transfer leakage**

Make sure the page no longer reads like a general internet egress or cross-region calculator. Avoid reuse of wording that would make the page feel interchangeable with the AWS egress tools.

### Task 3: Turn the main CDN calculator into a sharper multi-surface planner

**Files:**
- Modify: `src/pages/calculators/cdn-cost-calculator.astro`
- Read: `src/components/calculators/CdnRequestCost.tsx`
- Read: `src/pages/calculators/cdn-origin-egress-calculator.astro`
- Read: `src/pages/guides/cdn-costs.astro`

**Step 1: Reframe the page as the CDN workflow hub**

Update the top of the page so it explains when to start here versus the narrower calculators. The page should read as the place to compare surfaces, not as a generic calculator index.

**Step 2: Strengthen the scenario menu and decision support**

Keep the existing planner, but make the surrounding copy more explicit about:

- image-heavy storefronts
- video or download distribution
- API or dynamic edge workloads
- launch months with cache-miss pressure

Add or tighten the output interpretation so users can tell which cost surface dominates and what to do next.

**Step 3: Improve the next-step cards**

Make the next-step cards route by user intent:

- bandwidth dominant
- request dominant
- origin egress risk
- need diagnosis before more math

The goal is to keep the page tool-first and reduce dead-end browsing.

**Step 4: Keep role separation intact**

Do not duplicate the guide's bill-boundary explanation verbatim. The calculator should own multi-surface estimation and next-action routing, while the guide owns diagnosis and boundary clarity.

### Task 4: Upgrade the CDN guide into a stronger diagnostic companion

**Files:**
- Modify: `src/pages/guides/cdn-costs.astro`
- Read: `src/pages/guides/cdn-cost-comparison.astro`
- Read: `src/pages/guides/cdn-cost-per-gigabyte.astro`
- Read: `src/pages/guides/cdn-request-pricing.astro`
- Read: `src/pages/guides/estimate-cdn-bandwidth-gb-per-month.astro`
- Read: `src/pages/guides/origin-egress-vs-cdn-bandwidth.astro`
- Read: `tests/cdn-role-separation.test.mjs`

**Step 1: Tighten first-screen triage**

Add a compact top section that answers the key questions faster:

- what changed first
- which CDN line item moved
- whether the user should go to bandwidth, request, origin, or the full planner next

**Step 2: Add high-value mistake prevention**

Add a section that calls out the most important mistakes that create bad estimates or overlap:

- mixing edge bandwidth and origin egress
- hiding request-unit mistakes inside a bandwidth estimate
- trusting a calm-week cache-hit rate during launch or incident planning
- comparing vendors with different traffic profiles

**Step 3: Add a monthly planning checklist**

Add a short sign-off checklist that differs from the calculator outputs:

- confirm the bill surface that moved
- separate edge, request, and origin assumptions
- split baseline and peak windows
- validate each input back to billing, analytics, or written assumptions

**Step 4: Preserve role separation**

Keep the guide framed as the CDN bill-boundary page and retain the existing cluster separation promises.

### Task 5: Verify locally and guard against regressions

**Files:**
- `tests/cdn-core-entry-refresh.test.mjs`
- `src/pages/calculators/cdn-bandwidth-cost-calculator.astro`
- `src/pages/calculators/cdn-cost-calculator.astro`
- `src/pages/guides/cdn-costs.astro`

**Step 1: Run the focused regression test**

Run:

```bash
node --test tests/cdn-core-entry-refresh.test.mjs
```

Expected: PASS.

**Step 2: Run the CDN role-separation guard**

Run:

```bash
node --test tests/cdn-role-separation.test.mjs
```

Expected: PASS.

**Step 3: Run repository checks**

Run:

```bash
npm run check
```

Expected: exit code `0`.

**Step 4: Regenerate guides if needed**

Run:

```bash
npm run generate:guides
```

Expected: exit code `0`.
