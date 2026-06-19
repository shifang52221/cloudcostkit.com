# Egress Core Entry Refresh Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Upgrade the egress guide and egress calculator entry points so they read like sharper, more original decision pages for AWS-shaped egress pricing and transfer-boundary modeling.

**Architecture:** Keep the existing Astro page structure and current egress calculator component. Add a focused regression test first, then strengthen the guide's first-screen AWS framing and the calculator page's boundary-known planning promise without changing URL structure or weakening the transfer-boundary parent page.

**Tech Stack:** Astro page templates, existing React calculator component, Node test runner, `npm run generate:guides`, `npm run check`.

---

### Task 1: Add a regression test for the egress core entry refresh

**Files:**
- Create: `tests/egress-core-entry-refresh.test.mjs`
- Read: `src/pages/guides/egress-costs.astro`
- Read: `src/pages/calculators/data-egress-cost-calculator.astro`
- Read: `src/pages/guides/network-transfer-costs.astro`
- Read: `tests/transfer-boundary-role-separation.test.mjs`

**Step 1: Write the failing test**

Create a regression test that reads the egress guide and calculator page as normalized text and asserts:

- the guide opens with stronger AWS egress pricing framing
- the guide still identifies the transfer path and next check sequence quickly
- the calculator page reads as a one-boundary-per-run planning tool
- the calculator still routes users to guide validation, AWS line-item mapping, CDN-origin math, and cross-region transfer next

Use `readFileSync`, whitespace normalization, and `assert.match` in the style of the existing governance tests.

**Step 2: Run the test to verify it fails**

Run:

```bash
node --test tests/egress-core-entry-refresh.test.mjs
```

Expected: FAIL because the current pages do not yet expose the sharper entry-point language.

**Step 3: Keep assertions concrete**

Assert for phrases and structures such as:

- `AWS egress cost`, `AWS egress pricing`, or `AWS egress charges`
- `one boundary at a time` or equivalent calculator discipline
- `known boundary` vs `unclear boundary`
- `billing usage types`, `boundary`, `peak`, or `next step`

**Step 4: Re-run after implementation**

Run:

```bash
node --test tests/egress-core-entry-refresh.test.mjs
```

Expected: PASS once Tasks 2 and 3 are complete.

### Task 2: Upgrade the egress calculator page into a sharper planning entry point

**Files:**
- Modify: `src/pages/calculators/data-egress-cost-calculator.astro`
- Read: `src/components/calculators/DataEgressCost.tsx`
- Read: `src/pages/guides/egress-costs.astro`

**Step 1: Sharpen the first-screen promise**

Update the page so it more clearly says this is the right page when the transfer boundary is already known and the user needs a baseline-vs-peak estimate now.

**Step 2: Strengthen the "when to use this first" framing**

Tighten the supporting copy so the page more clearly communicates:

- one boundary per run
- boundary-known modeling
- baseline vs peak decision value
- estimate-now, validate-next workflow

**Step 3: Improve next-step routing**

Keep the current tool-first structure, but make the next-step cards more explicit about intent:

- validate path and rate assumptions
- map to AWS bill lines
- model CDN-origin + edge delivery
- model replication and DR transfer separately

**Step 4: Refresh timestamp and trust signals**

Update the page date and surrounding wrapper copy so the page feels current and deliberately maintained.

### Task 3: Upgrade the egress guide into a stronger AWS-shaped entry page

**Files:**
- Modify: `src/pages/guides/egress-costs.astro`
- Read: `src/pages/guides/network-transfer-costs.astro`
- Read: `src/pages/guides/aws-network-costs.astro`
- Read: `src/pages/calculators/data-egress-cost-calculator.astro`

**Step 1: Tighten the first-screen AWS framing**

Add or refine top-of-page language so the page more directly captures searchers looking for:

- AWS egress cost
- AWS egress pricing
- AWS egress charges
- AWS egress fees

The top should quickly explain that "AWS egress" is usually several different transfer paths, not one rate.

**Step 2: Strengthen guide-vs-calculator routing**

Make it easier to tell:

- when to stay in diagnosis mode
- when to jump to the calculator
- when to go back to the broader transfer-boundary page

**Step 3: Tighten sign-off and validation language**

Keep the existing mistake-prevention sections, but make the page's final posture feel more specific to AWS billing review and less like reusable transfer caution.

**Step 4: Refresh timestamp and preserve boundaries**

Update the page date and preserve all routing that keeps `network-transfer-costs` as the parent boundary-definition page.

### Task 4: Verify locally and guard against regressions

**Files:**
- `tests/egress-core-entry-refresh.test.mjs`
- `src/pages/calculators/data-egress-cost-calculator.astro`
- `src/pages/guides/egress-costs.astro`

**Step 1: Run the focused regression test**

Run:

```bash
node --test tests/egress-core-entry-refresh.test.mjs
```

Expected: PASS.

**Step 2: Run the earlier transfer-boundary separation guard**

Run:

```bash
node --test tests/transfer-boundary-role-separation.test.mjs tests/egress-rescue-batch-1.test.mjs
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
