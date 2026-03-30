# Calculator Hub Entry Strengthening Design

## Why this change exists

The latest site audit does not show a broad thin-content failure. The main remaining structural weakness is narrower:

- `https://cloudcostkit.com/calculators/azure/`
- `https://cloudcostkit.com/calculators/gcp/`
- `https://cloudcostkit.com/calculators/units/`

These pages are live and useful, but they are not strongly endorsed by the main calculator hub. That makes them look
more isolated than they should, which weakens internal discovery and can make them feel less central to the site's
workflow than they really are.

## Scope of this change

This change focuses on:

- `src/pages/calculators/index.astro`
- the three hub pages already identified by the audit:
  - `src/pages/calculators/azure.astro`
  - `src/pages/calculators/gcp.astro`
  - `src/pages/calculators/units.astro`

The goal is not a full rewrite of those three hub pages. The goal is to strengthen their route status in the site's
main calculator pathway.

## Problem pattern

Right now the main calculator hub strongly promotes high-demand calculators and topical clusters, but it does not give
the same explicit route-level support to:

- provider-specific calculator hubs for Azure and GCP
- the units/conversion hub that protects estimate quality

That creates two risks:

- weaker internal-link evidence for legitimate hub pages
- a subtle impression that these pages are leftovers rather than deliberate parts of the estimation workflow

## Options considered

### Option 1: Rewrite the Azure, GCP, and Units hub pages

Pros:

- may improve page-specific usefulness
- creates fresher copy

Cons:

- not aligned to the actual audit signal
- higher effort than needed for the current problem

### Option 2: Strengthen the main calculator hub so it explicitly routes users to Azure, GCP, and Units hubs

Pros:

- directly addresses the internal discovery weakness
- keeps the fix small, targeted, and reversible
- improves site structure without another broad rewrite pass

Cons:

- does not materially change the body copy on the three target hubs

### Option 3: De-index or de-emphasize the three hub pages

Pros:

- removes orphan-like risk by removing the pages from the strategy

Cons:

- throws away pages that already return `200` and serve a real job
- weakens site navigation breadth instead of improving it

## Recommended approach

Choose Option 2.

The audit signal is structural, not content-depth-driven. The safest move is to make the main calculator hub explicitly
route users to these three hubs and clarify why each one exists:

- Azure calculators: provider-oriented planning path
- GCP calculators: provider-oriented planning path
- Units & conversions: unit-sanity path before pricing

## Final design

### Main hub addition

Add a dedicated section to `src/pages/calculators/index.astro` that introduces three route cards:

- Azure calculators
- GCP calculators
- Units & conversions

Each card should explain the role of that hub in one sentence and link directly to the hub page.

### Why this section belongs on the main calculator page

The main calculator page is already the central routing page for tool discovery. That makes it the correct place to
signal:

- provider-first browsing paths
- conversion/sanity-check tools that protect estimate quality

This should feel like a navigation-strengthening change, not a marketing block.

### Supporting copy

The section should explain that some users need to browse by provider or by unit-conversion problem before they pick a
specific calculator. This gives the three hub pages a clearer reason to exist in the site's public workflow.

### Page-level expectations

This pass should not:

- redesign the site
- rewrite all provider hub copy
- add new route families
- expand ad surface

It should only strengthen existing hub discoverability and internal-link clarity.

## Success criteria

This change is successful when:

- the main calculator hub explicitly links to `/calculators/azure/`, `/calculators/gcp/`, and `/calculators/units/`
- those links are visible in a deliberate section, not hidden in generic tool search
- the follow-up audit no longer treats these hubs as structurally weak
- the site still passes `npm test`, `npm run check`, `npm run build`, and `npm run audit:seo`
