# Thin Page Batch 2A Design

## Why this batch exists

Batch 1 removed the clearest thin standalone pages from the site's indexable surface.

The next highest-confidence problem is not "thin helper page" but "duplicate-intent guide":

- `requests-costs.astro` overlaps heavily with `request-based-pricing.astro`
- `kubernetes-cost-calculator.astro` overlaps directly with the real calculator route and with the broader Kubernetes parent workflow

These pages are not useless. The problem is that they compete for the same job as stronger destinations.

## Design goals

- reduce duplicate-intent risk without deleting useful content
- concentrate stronger guidance into the better parent page
- keep support pages available to users already inside the site
- avoid contradictory SEO signals

## Recommended approach

### Page pair 1: request-pricing duplicate

Primary destination:

- `src/pages/guides/request-based-pricing.astro`

Overlapping page:

- `src/pages/guides/requests-costs.astro`

Action:

1. move any uniquely useful framing from `requests-costs` into `request-based-pricing`
2. sharpen `request-based-pricing` so it clearly owns the broad request-pricing workflow
3. mark `requests-costs` as `noindex,follow`
4. repoint the strongest internal links to `request-based-pricing`
5. remove `/guides/requests-costs/` from XML sitemap

### Page pair 2: Kubernetes calculator-intent duplicate

Primary destinations:

- `src/pages/calculators/kubernetes-cost-calculator.astro`
- `src/pages/guides/kubernetes-costs.astro`

Overlapping page:

- `src/pages/guides/kubernetes-cost-calculator.astro`

Action:

1. preserve any strong checklist language only if it is not already covered by the broader Kubernetes parent workflow
2. make `kubernetes-cost-calculator` guide clearly secondary to the actual calculator and the stronger parent guide
3. mark the overlapping guide route as `noindex,follow`
4. repoint the strongest internal links to the calculator and `kubernetes-costs`
5. remove `/guides/kubernetes-cost-calculator/` from XML sitemap

## Why this batch is separate from prominence reductions

`metrics-costs`, `serverless-costs`, `compute-instance-cost-calculator`, and `rps-to-monthly-requests-calculator` need a more distributed internal-link and parent-page judgment call.

The two duplicate-intent guide pages above have cleaner, higher-confidence treatment:

- consolidate value
- noindex the weaker standalone route
- keep the stronger route owning the topic

## Success standard

This batch is successful when:

- `request-based-pricing` is the clear owner of broad request-pricing intent
- `requests-costs` no longer competes as an indexable duplicate
- the real Kubernetes calculator and broader Kubernetes guide own the search and workflow intent
- `kubernetes-cost-calculator` guide no longer competes as a near-duplicate standalone page
