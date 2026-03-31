# Provider Guide Hub Hardening Design

## Goal

Turn the provider guide hubs from thin directory-like landing pages into editorial routing pages that help users choose the right next estimating workflow and reduce low-quality-site signals during AdSense review.

## Problem

The current provider guide hubs do not carry enough editorial intent.

- `src/pages/guides/aws.astro` is a long manually curated list that reads more like an archive index than a reviewed navigation page.
- `src/pages/guides/azure.astro` and `src/pages/guides/gcp.astro` are cleaner, but they still lean heavily on generic list rendering and light intro copy.
- The three pages are inconsistent in crawl posture: Azure and GCP are `noindex,follow`, while AWS is indexable even though it is the weakest of the three.

That combination creates a real quality risk:

- directory-like pages can look like page-count expansion rather than user-first routing
- inconsistent crawl treatment weakens the logic behind which pages are meant to rank
- provider hubs should explain when to start from them, when to skip them, and how to route into the stronger service-specific guides

## Recommended Approach

Harden the three provider guide hubs as curated routing pages and align their crawl posture.

### Scope

- `src/pages/guides/aws.astro`
- `src/pages/guides/azure.astro`
- `src/pages/guides/gcp.astro`
- a new regression test for provider guide hub hardening

### Content changes

Each provider hub should do four jobs explicitly:

1. Explain what the hub is for
2. Explain when the hub is not the right starting point
3. Route users by billing shape or service family
4. Surface provider-specific boundary mistakes that commonly break estimates

### Structural changes

- Replace flat or overly broad guide lists with grouped sections
- Introduce clearer route labels such as networking, observability, storage, runtime, and messaging/security
- Add stronger first-step copy so the page reads like an editorial decision page rather than a category dump

### Crawl posture

Use `robots="noindex,follow"` for all three provider guide hubs in this round.

Reasoning:

- these pages still function primarily as routing surfaces
- the all-guides hub and the service-specific guides are the stronger search assets
- consistent noindex treatment is safer than letting the weakest provider hub remain indexable while the other two stay noindex

## Alternatives Considered

### Option A: keep the pages as-is and only add more copy

Rejected because it would still leave the AWS page acting like a long archive list.

### Option B: delete provider guide hubs entirely

Rejected because they still help user routing and internal linking, especially for humans moving from provider-specific budgeting questions into deeper pages.

### Option C: fully index all three hubs after expansion

Rejected for this round because the safer immediate move is to strengthen them as routing pages first, then revisit indexing after another review cycle if they become strong enough to stand on their own.

## Success Criteria

- the three provider guide hubs contain clear routing language, not just lists
- AWS no longer reads like a raw link directory
- AWS, Azure, and GCP guide hubs share a consistent noindex/follow posture
- tests verify the new routing and crawl signals
- the site still passes `npm test`, `npm run check`, and `npm run build`
