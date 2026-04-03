# Transfer Boundary Overlap Design

## Problem

The transfer cluster still has a broad-overlap problem:

- `src/pages/guides/network-transfer-costs.astro` already behaves like a broad transfer explainer
- `src/pages/guides/egress-costs.astro` also re-explains the transfer buckets in a way that overlaps with the parent
- together, the pair can still read like two versions of the same "network transfer costs" page instead of a parent-child system

That overlap is risky for both site quality and review posture because the two pages are broad, commercially relevant, and visible enough to shape the site's perceived editorial discipline.

## Approved Direction

Use a hybrid of:

- a clear boundary split
- a high-intent AWS egress positioning

This means:

- `network-transfer-costs` becomes the transfer boundary parent page
- `egress-costs` becomes the egress decision and billing page

The parent page owns the taxonomy. The egress page owns the commercial "which egress bill am I modeling and what should I do next" workflow.

## Role Split

### `network-transfer-costs`

This page should explicitly say it is the network transfer boundary page.

Its job is to:

- define the main transfer buckets before pricing starts
- separate internet egress, cross-AZ, cross-region, CDN edge bandwidth, and origin cache fill
- route readers to the right calculators and narrower guides once the boundary is known

It should not try to become the strongest AWS egress landing page. It is the parent map for transfer decisions across providers and architectures.

### `egress-costs`

This page should explicitly say it is the egress decision and billing page.

Its job is to:

- serve users searching for AWS egress cost, AWS egress pricing, and similar high-intent variants
- explain when traffic should be modeled as egress and when the user is actually dealing with another transfer boundary
- tell readers when they can go straight to the egress calculator and when they should return to the broader transfer boundary page first

It should not restate the full parent taxonomy in nearly the same structure. It can mention the relevant egress-related boundaries, but the full transfer map belongs to the parent.

## Content Changes

### Parent guide changes

`network-transfer-costs` should gain:

- a stronger hero paragraph that says "this is the network transfer boundary page"
- a short directional section that says to define the transfer path before choosing rates
- clearer routing language to calculators and narrower guides after the boundary is known

It should retain practical utility, but its first-screen value should come from classification and routing rather than from repeating provider-specific egress copy.

### Egress guide changes

`egress-costs` should be tightened around:

- what counts as egress
- which AWS transfer paths users often confuse with each other
- when to use the egress calculator immediately
- when to go back to the parent boundary guide before pricing

The page should feel more intentional and decision-oriented, not like a second generic transfer explainer.

## Calculator Scope

Default scope for this round is only the two guide pages.

The `data-egress-cost-calculator` page should be touched only if the guide-role split creates an obvious routing gap that cannot be solved from the guides alone.

This preserves one-round discipline and avoids unnecessary batch growth.

## Regression Guard

Add one targeted regression test that asserts:

- `network-transfer-costs` declares itself as the boundary page for transfer path definition
- `egress-costs` declares itself as the egress decision or billing page
- `egress-costs` routes readers back to `network-transfer-costs` when the transfer boundary is still unclear

The test should verify role separation, not brittle exact wording.

## Success Standard

This round is successful when:

- the two guides no longer feel like interchangeable broad transfer explainers
- the parent-child relationship is obvious from the first screen
- the role split survives a targeted regression test
- `npm run check` and `npm run build` still pass with the accepted existing hints only
