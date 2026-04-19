# Cross-Region Transfer Rescue Design

**Date:** 2026-04-19

## Context

The current cross-region transfer calculator page is useful but still inherits too much of the generic egress workflow.
It estimates dollars from GB and $/GB, but it does not yet feel like a dedicated decision tool for region-pair traffic,
directionality, steady replication, backfills, and DR or failover events.

At the same time, the repo already has stronger pages for replication economics:

- `storage-replication-cost-calculator`
- `s3-replication-cost`
- `estimate-replication-gb-per-month-from-writes`

Those pages already own the "changed GB / copy-path / replica storage / request amplification" story. The gap is not
"more replication pages." The gap is a stronger, cleaner cross-region transfer workflow.

## Goal

Turn the existing `cross-region-transfer-cost-calculator` page into a real cross-region planner that:

- models region-pair transfer as its own bill surface
- separates steady-state transfer from one-time or event-driven transfer
- keeps DR and failover traffic visible instead of hiding it in one average month
- routes users to replication pages only when the real question is storage-copy economics rather than transfer itself

## Recommended Approach

Use the existing URL and strengthen that page only.

Do **not** add a new guide or another near-duplicate calculator in this batch.

This keeps page intent clean:

- `cross-region-transfer-cost-calculator` owns network transfer between regions
- `storage-replication-cost-calculator` owns changed-data copy economics
- `s3-replication-cost` owns S3-specific replication reasoning

## Alternatives Considered

### 1. Recommended: strengthen the existing cross-region calculator only

Pros:

- preserves the current URL and ranking target
- avoids creating overlap with replication pages
- easiest for Google and users to understand

Cons:

- relies on one page doing more work, so the calculator component must be meaningfully upgraded

### 2. Add a dedicated cross-region guide plus strengthen the calculator

Pros:

- could create another SEO entry page for cross-region intent

Cons:

- high risk of overlap with `network-transfer-costs` and replication pages
- likely to create another "thin but different wording" page unless tightly constrained

### 3. Merge cross-region into the replication workflow

Pros:

- fewer pages overall

Cons:

- blurs network transfer and replication economics
- weakens intent separation
- makes the site harder to trust because similar but different workflows become mixed

## Scope

### In Scope

- new cross-region-specific calculator component
- stronger scenario presets tied to real use cases
- peak-event modeling for migration, catch-up, and DR windows
- result interpretation for directionality, dominant transfer driver, and next step
- page framing that routes transfer questions away from replication questions when appropriate
- regression tests that protect this role separation

### Out of Scope

- provider-specific rate cards
- contract and discount logic
- new cross-region guide page
- broad changes to replication calculators or storage pages unless needed for link cleanup

## Page Intent Model

### Cross-Region Transfer Page Owns

- region-pair transfer math
- transfer directionality
- steady vs event-driven transfer
- DR and failover transfer scenarios
- next-step routing after the transfer estimate

### Replication Pages Own

- changed GB from writes and churn
- replica storage accumulation
- copy-path request amplification
- feature-fee vs transfer-fee reasoning

## UX Design

The upgraded calculator should feel like a planner, not a plain converter.

### Inputs

- source-to-destination region pair label or scenario identity
- transferred GB per month
- effective cross-region $/GB
- baseline vs peak event toggle
- peak event multiplier
- helper fields or presets for:
  - steady replication baseline
  - backlog catch-up
  - migration/backfill
  - DR drill or failover

### Outputs

- baseline monthly transfer cost
- peak-event monthly transfer cost
- incremental peak-event delta
- modeled transfer path / scenario
- short interpretation block:
  - what is being modeled
  - why this is expensive
  - what to validate next

### Supporting Content

The surrounding Astro page should answer:

- when to use this calculator first
- what this estimate still misses
- how to keep cross-region transfer separate from internet egress and replication economics
- which page to open next based on intent

## Test Strategy

Add one focused regression test for the rescue batch that checks:

- cross-region page now contains scenario framing for replication baseline, backlog catch-up, migration, or DR
- page contains transfer-specific interpretation or next-step language
- page clearly distinguishes transfer directionality and peak events
- page routes copy-economics questions to replication pages instead of duplicating them

Also keep the existing storage / replication role-separation tests passing.

## Risks

### Risk: overlap with replication pages

Mitigation:

- keep the page centered on transfer path and directionality
- avoid re-explaining changed-GB estimation in detail
- link out to replication pages instead of duplicating them

### Risk: another calculator that still feels generic

Mitigation:

- build a dedicated component rather than reusing `DataEgressCostCalculator`
- use real scenario presets and result interpretation

### Risk: content expansion without user value

Mitigation:

- keep page copy short and operational
- prioritize new functional value over more prose

## Success Criteria

- the cross-region page no longer reads like generic egress math
- the calculator visibly supports real transfer workflows: steady, backfill, migration, failover
- users can tell whether they need cross-region transfer math or replication economics next
- regression tests protect that boundary
