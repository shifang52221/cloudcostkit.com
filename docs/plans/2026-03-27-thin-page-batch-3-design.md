# Thin Page Batch 3 Design

## Why this batch exists

After the guide-side cleanup, the highest remaining site-quality risk is the support-calculator matrix.

The issue is not that these tools are useless. The issue is that too many helper-style calculators still look like they
want their own standalone indexable prominence, and some high-signal hub pages still promote them almost like primary
destinations.

This batch focuses on:

- `src/pages/calculators/compute-instance-cost-calculator.astro`
- `src/pages/calculators/rps-to-monthly-requests-calculator.astro`
- `src/pages/calculators/api-response-size-transfer-calculator.astro`
- `src/pages/calculators/cdn-origin-egress-calculator.astro`

## Final disposition

### `compute-instance-cost-calculator.astro`

Decision: `Noindex`

Why:

- generic monthly instance math is already better owned by stronger destinations such as `ec2-cost-calculator`
- it overlaps with Kubernetes node-cost workflows and generic purchase-model calculators
- it is useful as a support calculator, weak as a public search destination

### `rps-to-monthly-requests-calculator.astro`

Decision: `Noindex`

Why:

- it is fundamentally a rate-conversion helper
- it is heavily useful inside request-pricing workflows but weak as a standalone indexed destination
- the site currently promotes it too broadly, which reinforces the "many small utility pages" pattern

### `api-response-size-transfer-calculator.astro`

Decision: `Keep and narrow`

Why:

- it solves a real estimation problem that many pricing workflows need: translating request volume and payload size into
  transfer
- it still deserves a support-tool role, but not broad hub-level promotion
- its job should be clearly framed as a transfer-estimation helper inside larger egress, API, and CDN workflows

### `cdn-origin-egress-calculator.astro`

Decision: `Keep and narrow`

Why:

- it addresses a distinct and commonly misunderstood problem: edge delivery versus origin egress
- this is more defensible than a pure unit-conversion helper
- it should remain available and indexable, but as a specialized support tool, not a broad CDN entrypoint

## Design goals

- remove the weakest helper calculators from the indexed surface
- keep the more defensible support tools, but narrow their role
- reduce high-signal internal promotion of helper tools from calculator hubs and methodology pages
- make the site's primary public entrypoints point more strongly toward main workflow calculators

## Recommended approach

### Part 1: Demote the two weakest generic helpers

Apply `noindex,follow` to:

- `compute-instance-cost-calculator`
- `rps-to-monthly-requests-calculator`

Then exclude both routes from the XML sitemap.

These pages can still support users already inside the site and continue serving linked workflows, but they should stop
competing as standalone search results.

### Part 2: Narrow the two retained support tools

For `api-response-size-transfer-calculator`:

- keep it indexable
- rewrite its role language so it clearly acts as a transfer-estimation helper, not a primary egress page
- reduce broad promotion from calculator hub pages where stronger primary tools should lead

For `cdn-origin-egress-calculator`:

- keep it indexable
- rewrite its role language so it clearly acts as a cache-miss/origin-side support tool inside CDN workflows
- keep contextual links from CDN pages, but avoid treating it as a top-level CDN destination

### Part 3: Align hub pages with the new hierarchy

High-signal hub pages should stop promoting helper calculators like top destinations.

Priority pages to adjust:

- `src/pages/calculators/index.astro`
- `src/pages/methodology.astro`
- `src/pages/calculators/azure.astro`
- `src/pages/calculators/gcp.astro`

The change is not to erase support tools entirely. The change is to make sure primary calculator hubs point first to
main workflow calculators and only secondarily to helper tools.

## Success standard

This batch is successful when:

- the two weakest helper calculators no longer compete in the index
- the two retained helper calculators feel narrower and more intentionally scoped
- high-signal hub pages no longer over-promote support calculators
- sitemap, robots, and internal signals reflect the intended hierarchy
