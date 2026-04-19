# Egress Rescue Batch 1 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Upgrade the `data-egress-cost-calculator` and `egress-costs` pages so they become stronger decision tools for users and clearer quality signals for Google during the post-2026-04-07 observation window.

**Architecture:** Keep the URL structure stable and work inside the existing Astro + React calculator stack. Extend the calculator first so it supports more realistic egress planning inputs and clearer result breakdowns, then tighten the paired guide so it routes users into the right modeling workflow, calls out high-risk mistakes, and creates stronger calculator-to-guide intent separation without reopening broad sitewide overlap.

**Tech Stack:** Astro page templates, React calculator component, local utility functions under `src/lib`, Node test runner, `npm run check`, and `npm run build`.

---

### Task 1: Add a regression test for batch-1 egress rescue

**Files:**
- Create: `tests/egress-rescue-batch-1.test.mjs`
- Read: `src/pages/calculators/data-egress-cost-calculator.astro`
- Read: `src/pages/guides/egress-costs.astro`
- Read: `src/components/calculators/DataEgressCost.tsx`

**Step 1: Write the failing test**

Create a test that reads the calculator page, guide page, and React calculator source as text and asserts the batch-1 rescue outcomes:

- the calculator exposes stronger scenario presets that map to concrete egress situations rather than only generic traffic sizes
- the calculator includes a result breakdown or decision-support section for boundary, peak, or optimization interpretation
- the guide includes a first-screen diagnostic workflow for "what changed", "which bill moved", and "what to check next"
- the guide includes a mistakes or checklist section that is materially different from the calculator page

Use the same style as existing governance tests with `readFileSync`, whitespace normalization, and `assert.match`.

**Step 2: Run test to verify it fails**

Run:

```bash
node --test tests/egress-rescue-batch-1.test.mjs
```

Expected: FAIL because the current calculator and guide do not yet expose the stronger rescue signals.

**Step 3: Keep the assertions tightly scoped**

Assert for concrete phrases or identifiers such as:

- calculator presets tied to internet egress, CDN origin fill, or cross-region replication
- calculator copy describing "cost breakdown", "what changed", or "next action"
- guide sections describing "triage", "mistakes", or "checklist"
- guide copy that routes known-rate users to the calculator and unclear-boundary users to diagnostic steps

**Step 4: Re-run after implementation**

Run:

```bash
node --test tests/egress-rescue-batch-1.test.mjs
```

Expected: PASS once Tasks 2 and 3 are complete.

### Task 2: Upgrade the data egress calculator into a stronger planning tool

**Files:**
- Modify: `src/components/calculators/DataEgressCost.tsx`
- Modify: `src/pages/calculators/data-egress-cost-calculator.astro`
- Read: `src/lib/calc/egress.ts`
- Read: `src/layouts/CalculatorLayout.astro`

**Step 1: Expand preset intent**

Replace or supplement the current generic presets with scenario presets that correspond to real user intents, such as:

- public API / SaaS internet egress
- CDN origin fill / cache-miss traffic
- cross-region replication or DR traffic
- burst month / launch month

Each preset should set enough fields to feel like a meaningful starting point instead of just changing GB volume.

**Step 2: Add result interpretation helpers**

Add a compact decision-support area near the results that explains:

- the selected boundary or scenario being modeled
- baseline monthly spend
- peak monthly spend when enabled
- the marginal impact of the peak scenario
- one or two concrete optimization levers tied to the current scenario

Keep this lightweight and based on existing calculator inputs; do not introduce provider-specific rate tables yet.

**Step 3: Improve mobile readability and scannability**

Adjust the calculator UI so the most important outputs and actions remain easy to scan on mobile:

- avoid dense three-column-only control groupings for critical inputs
- keep result interpretation visible without excessive scrolling
- make preset actions and "use estimate" actions clearer on narrow screens

If component-level inline layout changes are needed, keep them local to this calculator.

**Step 4: Strengthen the paired Astro page**

Update `src/pages/calculators/data-egress-cost-calculator.astro` so the surrounding content better supports ranking and conversion:

- sharpen the intro around decision value, not just formula value
- add a distinct "when to use this calculator first" section
- add a short "what this estimate still misses" section
- add a stronger next-step block that routes to the guide, AWS network costs, and adjacent calculators with clearer intent labels

**Step 5: Keep intent separation clear**

Make sure the calculator page stays tool-first:

- no broad AWS billing taxonomy dump
- no duplication of the guide's spike-triage or mistakes checklist word-for-word
- keep the page focused on estimation, interpretation, and action after the estimate

### Task 3: Upgrade the egress guide into a better diagnostic companion

**Files:**
- Modify: `src/pages/guides/egress-costs.astro`
- Read: `src/pages/guides/network-transfer-costs.astro`
- Read: `src/pages/guides/aws-network-costs.astro`
- Read: `src/pages/calculators/data-egress-cost-calculator.astro`

**Step 1: Strengthen the first-screen triage**

Make the top of the guide answer the user's first decision faster:

- "the bill went up, what changed?"
- "is this internet egress, cross-region, cross-AZ, or CDN origin?"
- "should I read the guide or jump straight to the calculator?"

Add a compact triage sequence that feels operational, not essay-like.

**Step 2: Add a high-value mistakes section**

Add a section that isolates the mistakes most likely to create bad estimates or low-value content overlap, for example:

- mixing CDN edge bandwidth with origin egress
- using one blended rate for multiple transfer boundaries
- ignoring retry storms or launch traffic
- assuming billing exports and app telemetry use the same units

Keep the list concrete and decision-oriented.

**Step 3: Add a checklist section for monthly planning**

Add a short checklist that a user can actually follow before trusting a monthly egress number:

- identify the billable boundary
- confirm the unit and source of volume
- split baseline and peak periods
- validate against billing usage types or service-specific transfer lines

This section should differ in purpose from the calculator's interpretation helpers.

**Step 4: Tighten calculator-guide separation**

Revise overlapping copy so the guide owns:

- diagnosis
- mistake prevention
- workflow routing
- boundary clarification

The calculator should own:

- inputs
- scenarios
- result interpretation
- next-step actions after calculation

**Step 5: Preserve the strongest existing assets**

Keep the existing strengths that already help this page:

- AWS-focused positioning
- links back to `network-transfer-costs`
- links to provider-specific egress guides
- practical formulas and tool bridges

### Task 4: Verify locally and guard against regressions

**Files:**
- `tests/egress-rescue-batch-1.test.mjs`
- `src/components/calculators/DataEgressCost.tsx`
- `src/pages/calculators/data-egress-cost-calculator.astro`
- `src/pages/guides/egress-costs.astro`

**Step 1: Run the focused regression test**

Run:

```bash
node --test tests/egress-rescue-batch-1.test.mjs
```

Expected: PASS.

**Step 2: Run the earlier transfer-boundary separation guard**

Run:

```bash
node --test tests/transfer-boundary-role-separation.test.mjs
```

Expected: PASS so the rescue work does not collapse the parent/child guide separation from the 2026-04-07 batch.

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

### Task 5: Commit the batch cleanly

**Files:**
- `docs/plans/2026-04-19-egress-rescue-batch-1.md`
- `tests/egress-rescue-batch-1.test.mjs`
- `src/components/calculators/DataEgressCost.tsx`
- `src/pages/calculators/data-egress-cost-calculator.astro`
- `src/pages/guides/egress-costs.astro`

**Step 1: Stage only the intended files**

Run:

```bash
git add docs/plans/2026-04-19-egress-rescue-batch-1.md tests/egress-rescue-batch-1.test.mjs src/components/calculators/DataEgressCost.tsx src/pages/calculators/data-egress-cost-calculator.astro src/pages/guides/egress-costs.astro
```

**Step 2: Commit**

Run:

```bash
git commit -m "feat: strengthen egress calculator and guide workflow"
```
