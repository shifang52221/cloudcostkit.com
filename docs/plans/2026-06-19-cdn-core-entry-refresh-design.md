# CDN Core Entry Refresh Design

## Problem

The 2026-06-18 three-month Search Console review shows that the CDN cluster still has one of the clearest visibility-to-click gaps on the site:

- `/guides/cdn-costs/` has strong generic-topic exposure but still behaves more like a capable routing page than a decisive CDN pricing entry page.
- `/calculators/cdn-cost-calculator/` has useful multi-surface planning logic, but the surrounding content still leaves some generic "calculator index" energy on the page.
- `/calculators/cdn-bandwidth-cost-calculator/` is already more specific than the earlier egress tooling, but it can still do a better job of owning edge-delivery intent on the first screen.

These pages are not thin. The opportunity is to make them feel more exact, more original, and more obviously matched to the searcher's actual CDN pricing question without expanding scope or creating overlap with the comparison, per-GB, request, or concept pages.

## Goal

Strengthen the three existing CDN core entry pages so they:

- explain the decision faster on first screen
- route more clearly into the right next calculator or guide
- sound less like reusable cost-copy patterns and more like real CDN budgeting workflows
- preserve the established role boundaries across the CDN cluster

## Approaches Considered

### 1. Metadata-only refresh

Update titles, descriptions, and a few opening paragraphs.

Why not:

- too shallow for this stage
- does not materially improve first-screen routing or page-specific trust
- risks another low-signal copy pass

### 2. Real-page enhancement of the three core entry points

Upgrade:

- `src/pages/guides/cdn-costs.astro`
- `src/pages/calculators/cdn-cost-calculator.astro`
- `src/pages/calculators/cdn-bandwidth-cost-calculator.astro`

Why this is best:

- builds on pages that already have visibility
- improves click capture and on-page self-selection at the same time
- preserves the rest of the CDN cluster instead of reopening page ownership

### 3. Net-new CDN variant pages

Publish more dedicated pages for generic CDN phrasing.

Why not:

- spreads attention and authority
- increases the chance of internal overlap
- works against the current principle of strengthening real pages first

## Recommendation

Use approach 2.

This should be a focused core-entry refresh, not a structural CDN rewrite. We will tighten the opening promise, add sharper diagnostic and next-step language, and preserve the current specialist subpages as the deeper routes.

## Page-Level Design

### 1. `cdn-costs` becomes a stronger generic CDN pricing entry page

Keep the page as the CDN bill-boundary page, but sharpen the top of the page so it more quickly answers:

- what changed first
- which bill surface moved first
- which page the reader should open next
- what mistake usually breaks the model

Add stronger "pricing and comparison" framing near the top without collapsing the provider-comparison or per-GB pages into this page.

### 2. `cdn-cost-calculator` becomes the obvious multi-surface planner

Keep the existing planner component, but strengthen the editorial wrapper so the page feels like:

- the place to keep bandwidth, request fees, and origin egress visible together
- the right page when the user still does not know which surface dominates
- a real action page with next-step routing by intent

The page should feel more like a planner and less like a general calculator listing.

### 3. `cdn-bandwidth-cost-calculator` becomes the clear edge-delivery page

Keep this page tightly scoped to delivered edge GB and effective `$ / GB`.

Strengthen:

- when to use this page first
- what it still excludes
- why bandwidth-only models fail
- what page should take over next if requests or origin leakage are the real problem

The result should make the page feel clearly different from both the full CDN planner and the general egress tools.

## Guardrails

- Do not create new URLs in this pass.
- Do not change the role of `cdn-cost-comparison`, `cdn-cost-per-gigabyte`, `cdn-request-pricing`, `estimate-cdn-bandwidth-gb-per-month`, or `origin-egress-vs-cdn-bandwidth`.
- Do not use generic "complete guide" filler.
- Prefer compact, high-signal additions over length for its own sake.
- Keep the writing original and operational.

## Testing Strategy

Add a focused regression test that proves:

- the guide opens with sharper bill-triage and routing language
- the full calculator reads as a real multi-surface planner
- the bandwidth page stays CDN-specific and avoids generic egress leakage
- the guide cluster role-separation remains intact

Then rerun the existing CDN role-separation test and the repo-wide checks.
