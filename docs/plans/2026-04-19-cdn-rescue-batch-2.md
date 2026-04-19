# CDN Rescue Batch 2 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Upgrade the CDN calculator and guide workflow so the CDN pages behave like real decision tools, not thin wrappers around generic transfer math.

**Architecture:** Keep the existing Astro page structure and add CDN-specific calculator components where the current generic egress component leaks the wrong intent. Strengthen the calculator pages first so they model real CDN cost surfaces and route users cleanly into the right next step, then tighten the paired guide so it owns bill-boundary diagnosis without duplicating the calculator workflow.

**Tech Stack:** Astro page templates, React calculator components, local cost helpers under `src/lib`, Node test runner, `npm run check`, and `npm run build`.

---

### Task 1: Add a regression test for the CDN rescue batch

**Files:**
- Create: `tests/cdn-rescue-batch-2.test.mjs`
- Read: `src/pages/calculators/cdn-cost-calculator.astro`
- Read: `src/pages/calculators/cdn-bandwidth-cost-calculator.astro`
- Read: `src/pages/guides/cdn-costs.astro`
- Read: `src/components/calculators/CdnRequestCost.tsx`

**Step 1: Write the failing test**

Create a regression test that reads the CDN calculator pages and guide as text and asserts the rescue outcomes:

- the main CDN calculator exposes a stronger planner workflow for edge bandwidth, request fees, and origin egress instead of just stacking generic calculators
- the CDN bandwidth page uses CDN-specific language and scenario framing rather than internet-egress or cross-region semantics
- the CDN guide opens with a faster bill-triage workflow and routes users to the correct calculator by uncertainty
- the guide still preserves role separation from the comparison / per-GB / request / bandwidth-measurement / concept pages

Use the same style as the existing governance tests with `readFileSync`, whitespace normalization, and `assert.match`.

**Step 2: Run the test to verify it fails**

Run:

```bash
node --test tests/cdn-rescue-batch-2.test.mjs
```

Expected: FAIL because the current pages do not yet expose the stronger rescue signals.

**Step 3: Keep the assertions concrete**

Assert for phrases and structures such as:

- scenario presets tied to video/media delivery, image-heavy storefront traffic, API-at-the-edge, or launch / cache-miss stress
- calculator copy describing cost surface, dominant line item, origin leakage, or next action
- guide copy describing what changed, which CDN line moved, and whether to go to bandwidth, request, origin, or full calculator next
- guide copy that explicitly keeps bill-boundary ownership separate from the narrower CDN guide cluster

**Step 4: Re-run after implementation**

Run:

```bash
node --test tests/cdn-rescue-batch-2.test.mjs
```

Expected: PASS once Tasks 2 through 4 are complete.

### Task 2: Replace generic CDN bandwidth math with a CDN-specific planning component

**Files:**
- Create: `src/components/calculators/CdnBandwidthCost.tsx`
- Modify: `src/pages/calculators/cdn-bandwidth-cost-calculator.astro`
- Read: `src/components/calculators/DataEgressCost.tsx`
- Read: `src/components/calculators/CdnRequestCost.tsx`

**Step 1: Build a CDN-specific bandwidth component**

Create a dedicated React calculator component for CDN bandwidth that supports CDN-specific planning instead of reusing the egress presets. It should include:

- scenario presets tied to real CDN use cases such as media streaming / video library delivery, image-heavy storefront delivery, software download / release traffic, and launch / campaign burst traffic
- baseline and peak month comparison
- a short result-interpretation block that explains the dominant bandwidth risk, why the scenario is expensive, and what the next optimization lever is

Keep the inputs grounded in delivered edge GB and effective $/GB assumptions.

**Step 2: Make the UI more decision-oriented**

Adjust the component layout so mobile scanning stays strong:

- combine throughput helper and peak helper cleanly
- keep the scenario presets readable on narrow screens
- keep the result interpretation visible immediately after the core result

**Step 3: Upgrade the bandwidth page around the new component**

Update `src/pages/calculators/cdn-bandwidth-cost-calculator.astro` so the page supports the stronger tool:

- sharpen the intro around edge-delivery planning, not generic transfer math
- add a distinct "use this calculator first when..." section
- add a "what this estimate still misses" section
- route users clearly to request pricing, origin egress, and the full CDN calculator with intent labels

**Step 4: Remove generic egress leakage**

Make sure the bandwidth page no longer inherits confusing scenario language such as:

- public internet egress
- cross-region replication
- generic outbound transfer framing

The page should read like a CDN bandwidth planning tool throughout.

### Task 3: Turn the main CDN calculator into a real multi-surface planner

**Files:**
- Create: `src/components/calculators/CdnCostPlanner.tsx`
- Modify: `src/pages/calculators/cdn-cost-calculator.astro`
- Read: `src/pages/calculators/cdn-origin-egress-calculator.astro`
- Read: `src/pages/calculators/cdn-request-cost-calculator.astro`
- Read: `src/components/calculators/CdnRequestCost.tsx`

**Step 1: Build a combined CDN planner component**

Create a dedicated planner component for the main CDN calculator page that models the three CDN cost surfaces together:

- edge bandwidth
- request fees
- origin egress / cache-fill share

It should support CDN-first scenario presets such as:

- image-heavy ecommerce storefront
- video / download distribution
- API and dynamic edge workload
- launch month with lower cache hit rate

Use lightweight math derived from existing assumptions rather than introducing provider-specific rate tables.

**Step 2: Add decision-support outputs**

Show outputs that help users decide what to do next:

- total edge cost
- bandwidth share vs request-fee share
- estimated origin egress exposure
- the dominant cost surface
- one or two scenario-specific next actions

**Step 3: Strengthen the surrounding calculator page**

Update `src/pages/calculators/cdn-cost-calculator.astro` so it becomes the CDN workflow hub:

- explain when to start with the full planner versus the narrow calculators
- keep the page tool-first rather than essay-first
- add a short "which number moved?" triage block so users can jump to the right narrower calculator
- improve the next-step cards so they route to guide / bandwidth / request / origin pages by user intent

**Step 4: Keep page-intent separation clean**

Make sure the main CDN calculator does not duplicate the guide's bill-boundary explanation word-for-word and does not collapse the narrower calculator pages into itself. The page should own:

- multi-surface estimation
- scenario comparison
- result interpretation
- action after the estimate

### Task 4: Upgrade the CDN guide into a stronger diagnostic companion

**Files:**
- Modify: `src/pages/guides/cdn-costs.astro`
- Read: `src/pages/guides/cdn-cost-comparison.astro`
- Read: `src/pages/guides/cdn-cost-per-gigabyte.astro`
- Read: `src/pages/guides/cdn-request-pricing.astro`
- Read: `src/pages/guides/estimate-cdn-bandwidth-gb-per-month.astro`
- Read: `src/pages/guides/origin-egress-vs-cdn-bandwidth.astro`
- Read: `tests/cdn-role-separation.test.mjs`

**Step 1: Strengthen first-screen triage**

Add a compact diagnostic sequence near the top that answers:

- which CDN line item moved first
- whether the user should go to bandwidth, request, origin, or full CDN calculator next
- what to validate before using one blended CDN number

Keep the workflow operational and fast.

**Step 2: Add high-value mistake prevention**

Add a section that isolates the mistakes most likely to produce bad estimates or low-value overlap, such as:

- mixing edge bandwidth and origin egress
- hiding request-unit mistakes inside a per-GB estimate
- using a healthy cache-hit number during launch or incident planning
- comparing vendors with different traffic profiles

**Step 3: Add a monthly planning checklist**

Add a short checklist for budget review that differs from the calculator outputs:

- confirm the bill surface that moved
- separate edge, request, and origin assumptions
- split baseline and peak windows
- validate each input back to billing, analytics, or written assumptions

**Step 4: Preserve role separation**

Keep the guide clearly framed as the CDN bill-boundary page and retain the role-separation promises enforced by `tests/cdn-role-separation.test.mjs`.

### Task 5: Verify locally and guard against regressions

**Files:**
- `tests/cdn-rescue-batch-2.test.mjs`
- `src/components/calculators/CdnBandwidthCost.tsx`
- `src/components/calculators/CdnCostPlanner.tsx`
- `src/pages/calculators/cdn-bandwidth-cost-calculator.astro`
- `src/pages/calculators/cdn-cost-calculator.astro`
- `src/pages/guides/cdn-costs.astro`

**Step 1: Run the focused regression test**

Run:

```bash
node --test tests/cdn-rescue-batch-2.test.mjs
```

Expected: PASS.

**Step 2: Run the existing CDN role-separation guard**

Run:

```bash
node --test tests/cdn-role-separation.test.mjs
```

Expected: PASS so the rescue work does not collapse the CDN guide cluster into overlapping pages.

**Step 3: Run repository checks**

Run:

```bash
npm run check
```

Expected: exit code `0`.

**Step 4: Run production build**

Run:

```bash
npm run build
```

Expected: exit code `0`. If the only warning is the known Cloudflare or `sharp` warning, record it as non-blocking.
