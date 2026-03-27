# Thin Page Batch 1 Design

## Why this batch goes first

The shortlist surfaced two page types with the highest confidence for immediate structural action:

- thin provider hub guides that behave more like taxonomy routes than editorial destinations
- helper-only estimator calculators that are useful inside workflows but weak as standalone search results

These pages do not need a large rewrite first. They need a search-visibility correction.

## Batch scope

### Guides

- `src/pages/guides/gcp.astro`
- `src/pages/guides/azure.astro`

### Calculators

- `src/pages/calculators/aws-api-gateway-request-estimator.astro`
- `src/pages/calculators/aws-kms-request-estimator.astro`
- `src/pages/calculators/aws-sns-delivery-estimator.astro`
- `src/pages/calculators/aws-sqs-request-estimator.astro`
- `src/pages/calculators/aws-waf-request-estimator.astro`

## Design goals

- Keep these pages usable for real users who are already inside the site
- Reduce their standalone search exposure
- Avoid contradictory signals such as `noindex` pages still appearing in XML sitemap
- Make the change minimal, reversible, and easy to verify

## Recommended approach

1. Add optional `robots` support to `GuideLayout` and `CalculatorLayout` so selected pages can emit `noindex,follow`.
2. Apply `robots="noindex,follow"` only to the seven batch pages.
3. Remove the same seven routes from XML sitemap generation in `astro.config.mjs`.
4. Leave internal links intact for now so the pages still work as support steps inside broader workflows.

## Why this is better than immediate deletion or merge

- These pages still have user utility inside guided workflows.
- Removing them entirely would force unnecessary content surgery before the site's structural risk is reduced.
- `Noindex` lets the site stop over-presenting weak standalone pages while preserving product usefulness.

## Success standard

This batch is successful when:

- the seven target pages emit `noindex,follow`
- the same seven pages are excluded from XML sitemap output
- the site still builds cleanly
- the pages remain reachable internally for users who need them as support tools or routing hubs
