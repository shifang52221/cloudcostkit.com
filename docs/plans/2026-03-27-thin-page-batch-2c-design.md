# Thin Page Batch 2C Design

## Why this batch exists

The remaining high-risk pages are not broken pages. They are pages whose shape and role still make the site look more
like a scaled content matrix than a tightly edited knowledge base.

This batch focuses on:

- `src/pages/guides/load-balancing-costs.astro`
- `src/pages/guides/backups-and-snapshots-costs.astro`

These two pages look similar on the surface, but they do not deserve the same treatment.

## Final disposition

### `load-balancing-costs.astro`

Decision: `Keep and deepen`

Why:

- there is still a defensible standalone editorial role for a cross-provider load balancer cost page
- it can own a distinct decision problem: whether the bill is driven by LB baseline, request volume, data processed, or
  adjacent add-ons like WAF, logs, and cross-zone traffic
- provider-specific pages do not fully replace the cross-provider judgment layer

### `backups-and-snapshots-costs.astro`

Decision: `Noindex`

Why:

- the generic page overlaps heavily with stronger parent and child destinations:
  - `storage-costs`
  - `database-costs`
  - provider-specific backup and snapshot pages
- even after strengthening, it would still compete awkwardly with more concrete pages that own clearer search intent
- the safest role for this URL is internal support: useful to readers inside the site, weak as a standalone indexed result

## Design goals

- make `load-balancing-costs` feel like a real decision page, not a themed hub
- remove the template-hub shape from both pages
- keep `backups-and-snapshots-costs` useful, but stop it from competing in the index
- align internal links and sitemap signals with the actual role of each page

## Recommended approach

### Load balancing costs

The page should become a cross-provider cost diagnosis guide.

It should clearly answer:

1. what part of the bill belongs to the load balancer itself
2. what part belongs to request volume or traffic processed
3. when cross-zone traffic, WAF, or logging is the real multiplier
4. when a reader should stay on this guide versus jump to provider-specific pricing

Structural changes:

- remove the `GUIDES` import and "More load balancing guides" grid
- add stronger sections around traffic shape, cross-zone patterns, TLS/connection behavior, and adjacent cost buckets
- make the page explicitly narrower than `networking-costs`

### Backups and snapshots costs

The page should become an internal support page for backup retention and restore economics.

It should clearly answer:

1. how retention and data churn build backup footprint
2. why restore tests, DR copies, and long-lived manual snapshots matter
3. how to separate operational backups from long-term compliance retention

But after that strengthening:

- mark the page `noindex,follow`
- remove it from the XML sitemap
- reduce high-signal promotion from storage entry pages

This keeps the page available to users while letting stronger pages own search intent.

## Internal-link strategy

### For load balancing

- keep it referenced from broader compute/networking contexts
- relabel it as a deep dive rather than a generic hub

### For backups and snapshots

- remove or reduce broad hero-style promotion from storage entry pages
- keep contextual internal links where they help users already inside the backup/storage workflow
- make `storage-costs` and provider-specific backup pages the stronger public-facing destinations

## Success standard

This batch is successful when:

- `load-balancing-costs` reads like a diagnosis framework with independent value
- `backups-and-snapshots-costs` no longer competes as a generic indexed theme page
- both pages look materially less template-driven
- sitemap, robots, and internal signals all reflect the intended roles
