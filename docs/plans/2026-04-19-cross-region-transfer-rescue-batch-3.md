# Cross-Region Transfer Rescue Batch 3 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Upgrade the cross-region transfer calculator into a stronger planner for region-pair traffic, steady replication, migration bursts, and DR or failover events without overlapping the replication economics pages.

**Architecture:** Keep the existing URL and Astro page but replace the generic egress calculator usage with a dedicated cross-region planner component. Strengthen the page framing around directionality, steady vs event-driven transfer, and next-step routing so the transfer workflow stays separate from the replication workflow already handled elsewhere in the site.

**Tech Stack:** Astro page templates, React calculator components, local cost helpers under `src/lib`, Node test runner, `npm run check`, and `npm run build`.

---

### Task 1: Add a regression test for the cross-region rescue batch

**Files:**
- Create: `tests/cross-region-rescue-batch-3.test.mjs`
- Read: `src/pages/calculators/cross-region-transfer-cost-calculator.astro`
- Read: `src/pages/calculators/storage-replication-cost-calculator.astro`
- Read: `src/pages/guides/s3-replication-cost.astro`

**Step 1: Write the failing test**

Create a regression test that reads the cross-region calculator page and related replication pages as text and asserts:

- the cross-region page now supports transfer-specific scenarios such as steady replication, backlog catch-up, migration or backfill, and DR or failover
- the cross-region page includes result-interpretation or next-step language tied to directionality and event-driven transfer
- the cross-region page routes changed-GB or copy-path economics questions toward the replication calculator or guide instead of absorbing that role

Use `readFileSync`, whitespace normalization, and `assert.match` in the same style as the existing governance tests.

**Step 2: Run the test to verify it fails**

Run:

```bash
node --test tests/cross-region-rescue-batch-3.test.mjs
```

Expected: FAIL because the current page still uses the generic egress calculator and lacks the stronger rescue signals.

**Step 3: Keep assertions concrete**

Assert for phrases such as:

- `directional`, `region pair`, `backfill`, `failover`, `dr`, `catch-up`, `migration`
- `what this estimate still misses`, `use this calculator first`, `next step`
- routing language that sends replication or changed-data questions to storage replication pages

**Step 4: Re-run after implementation**

Run:

```bash
node --test tests/cross-region-rescue-batch-3.test.mjs
```

Expected: PASS once Tasks 2 and 3 are complete.

### Task 2: Build a dedicated cross-region planner component

**Files:**
- Create: `src/components/calculators/CrossRegionTransferCost.tsx`
- Read: `src/components/calculators/DataEgressCost.tsx`
- Read: `src/components/calculators/StorageReplicationCost.tsx`
- Read: `src/lib/calc/egress.ts`

**Step 1: Create cross-region-specific scenario presets**

Build a dedicated React component that supports real cross-region scenarios such as:

- steady replication baseline
- backlog catch-up or replay window
- migration or backfill month
- DR drill or failover event

The component should not reuse internet-egress language or generic outbound-transfer framing.

**Step 2: Add transfer interpretation**

Add a compact decision-support block that explains:

- the modeled transfer path or scenario
- baseline monthly transfer cost
- peak-event monthly transfer cost
- the incremental peak-event impact
- one or two concrete next validation steps

**Step 3: Keep mobile scanning strong**

Make sure the component keeps scenario presets, transfer inputs, and the result block readable on narrow screens.

**Step 4: Keep role separation clean**

The component should stay focused on transfer math and transfer timing. It should not try to own:

- changed-GB estimation from writes
- replica storage growth
- replication request amplification

### Task 3: Upgrade the cross-region calculator page into a transfer workflow page

**Files:**
- Modify: `src/pages/calculators/cross-region-transfer-cost-calculator.astro`
- Read: `src/pages/calculators/storage-replication-cost-calculator.astro`
- Read: `src/pages/guides/s3-replication-cost.astro`
- Read: `src/pages/guides/network-transfer-costs.astro`

**Step 1: Replace the generic calculator**

Swap the page to use the new `CrossRegionTransferCost` component instead of `DataEgressCostCalculator`.

**Step 2: Strengthen page framing**

Update the surrounding Astro page so it clearly answers:

- when to use this calculator first
- which cross-region scenario it is built for
- why directionality and event separation matter
- what this estimate still misses

**Step 3: Route to the right next page**

Add stronger next-step routing so:

- transfer-path questions stay on cross-region / network-transfer pages
- replication-economics questions go to storage replication tools
- internet-egress questions go back to egress pages

**Step 4: Keep content operational**

Avoid expanding into a generic essay. Keep the page tool-first, scenario-led, and decision-oriented.

### Task 4: Verify locally and guard against regressions

**Files:**
- `tests/cross-region-rescue-batch-3.test.mjs`
- `src/components/calculators/CrossRegionTransferCost.tsx`
- `src/pages/calculators/cross-region-transfer-cost-calculator.astro`

**Step 1: Run the focused regression test**

Run:

```bash
node --test tests/cross-region-rescue-batch-3.test.mjs
```

Expected: PASS.

**Step 2: Run the storage / replication role-separation guard**

Run:

```bash
node --test tests/s3-governance.test.mjs
```

Expected: PASS so the transfer rescue work does not collapse the copy-path economics role.

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
