# Egress Core Entry Refresh Design

## Problem

The 2026-06-18 three-month Search Console review still shows strong visibility without enough click capture across the egress cluster:

- `/guides/egress-costs/` remains a high-value AWS-shaped entry page, but the first screen still behaves more like a practical explainer than a sharp "AWS egress pricing" destination.
- `/calculators/data-egress-cost-calculator/` already has meaningful planning support, but its wrapper content can still feel like a capable utility page instead of the obvious first calculator for boundary-known transfer modeling.

These pages are not thin and they are not mis-scoped. The remaining opportunity is to make them feel more exact, more finance-review-ready, and more obviously aligned with the specific transfer decision each page owns.

## Goal

Strengthen the two existing egress core entry pages so they:

- answer the AWS-shaped search intent faster on first screen
- separate diagnosis from calculation more clearly
- sound more original and less like reusable transfer copy
- preserve the transfer-boundary role split already established in the cluster

## Approaches Considered

### 1. Metadata-only refresh

Update titles, descriptions, and a few opening lines.

Why not:

- too shallow for the current stage
- does not materially strengthen first-screen decision framing
- would not do enough to improve calculator-vs-guide self-selection

### 2. Real-page enhancement of the two core egress entry points

Upgrade:

- `src/pages/guides/egress-costs.astro`
- `src/pages/calculators/data-egress-cost-calculator.astro`

Why this is best:

- builds on pages that already earn impressions
- keeps the scope tight and measurable
- improves both click capture and downstream user routing

### 3. Fold EC2 and runtime-comparison pages into the same batch

Why not:

- mixes two different search clusters into one pass
- weakens the batch boundary after a clean CDN push
- makes the next observation window harder to interpret

## Recommendation

Use approach 2.

This should be a focused egress core-entry refresh, not a network-cluster rewrite. The work should make the guide more diagnostic and the calculator more confidently tool-first without reopening the transfer-boundary parent/child split.

## Page-Level Design

### 1. `egress-costs` becomes a sharper AWS egress pricing entry page

Keep the page as the egress decision and billing page, but strengthen the top of the page so it more quickly answers:

- what AWS egress usually means in practice
- which billed path moved first
- whether the reader should stay in guide mode or jump into calculation
- what mistake usually breaks the estimate

The page should stay AWS-first in wording while keeping the broader cross-cloud route links intact.

### 2. `data-egress-cost-calculator` becomes the obvious boundary-known planner

Keep the current calculator component and its scenario presets, but strengthen the page wrapper so it more clearly says:

- use this page when the transfer boundary is already known
- one boundary per run is a feature, not a limitation
- baseline vs peak modeling is the real value
- the next step depends on whether the user needs validation, billing-line mapping, CDN-origin math, or cross-region transfer

The result should make the page feel less like a generic bandwidth calculator and more like a finance-review-ready transfer estimator.

## Guardrails

- Do not create new URLs in this pass.
- Do not weaken the role of `network-transfer-costs` as the parent boundary-definition page.
- Do not reopen the AWS network cost guide or the provider-specific egress guides in this round.
- Do not add generic "complete guide" filler.
- Prefer sharper promise language and decision routing over page-length expansion.

## Testing Strategy

Add a focused regression test that proves:

- the guide opens with stronger AWS-shaped egress pricing framing
- the calculator wrapper reads as a boundary-known planning tool
- the guide preserves the existing transfer-boundary separation
- the calculator still emphasizes one-boundary-per-scenario discipline

Then rerun the existing transfer-boundary guard and repo-wide checks.
