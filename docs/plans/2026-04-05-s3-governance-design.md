# S3 Governance Design

## Problem

The storage parent layer is already governed, but the newer `aws-s3-*` guide set still behaves like a loose cluster of
nearby S3 explainers instead of a governed specialist family.

Current shape:

- `src/pages/guides/aws-s3-pricing.astro` is useful, but it still reads like a broad S3 cost explainer instead of a
  clearly bounded S3 pricing anatomy page inside the broader storage hierarchy
- `src/pages/guides/aws-s3-storage-classes.astro` is helpful, but it still behaves like a general S3 advice page
  rather than a storage-class decision page with a narrower editorial job
- `src/pages/guides/aws-s3-request-costs.astro` explains request fees well, but it does not yet clearly identify
  itself as the request-cost boundary page that should stay narrower than the storage parent and the broad S3 pricing
  page
- `src/pages/guides/aws-s3-replication-pricing.astro` covers replication mechanics, but it still overlaps with general
  S3 pricing and generic storage copy-path discussions rather than owning one crisp replication economics role

This creates two quality risks:

- readers and search engines can still read these pages as four nearby variants of "S3 pricing"
- the governed storage parent page loses authority if these child pages do not clearly route broader storage-budget
  questions back upward

## Approved Direction

Use a storage-parent-plus-specialist split for the newer AWS S3 family:

- `aws-s3-pricing` becomes the S3 pricing anatomy page
- `aws-s3-storage-classes` becomes the storage-class decision page
- `aws-s3-request-costs` becomes the request-cost boundary page
- `aws-s3-replication-pricing` becomes the storage copy-path economics page

The storage parent should keep owning the broad storage budgeting question:

- how capacity, requests, copies, retrieval, and lifecycle transitions fit together in one storage budget
- when the next step is S3 bill anatomy, storage-class choice, request-cost diagnosis, or replication economics
- why storage budgeting should start from the broader storage budget map instead of a narrow S3 subtopic

The S3 specialist pages should each own one narrower question:

- `aws-s3-pricing`: what belongs inside the broad S3 bill anatomy
- `aws-s3-storage-classes`: how tier choice changes retrieval, transition, and minimum-duration economics
- `aws-s3-request-costs`: when request-like usage becomes the real decision boundary
- `aws-s3-replication-pricing`: how changed data becomes copies, destination storage, and transfer-like costs

## Role Split

### `aws-s3-pricing`

This page should explicitly identify itself as the S3 pricing anatomy page.

Its job is to:

- frame the broad S3 bill as storage, requests, transfer, and replication surfaces
- stay narrower than the storage parent while remaining broader than request-only, class-only, or replication-only
  pages
- route broader storage-budget questions back to `storage-costs`

### `aws-s3-storage-classes`

This page should explicitly identify itself as the storage-class decision page.

Its job is to:

- focus on access tier choice, retrieval, transition, and minimum-duration behavior
- avoid reteaching the whole S3 bill anatomy or the full storage-system map
- route broader storage-budget questions back to `storage-costs`

### `aws-s3-request-costs`

This page should explicitly identify itself as the request-cost boundary page.

Its job is to:

- focus on GET/PUT/LIST and metadata-heavy behavior as a distinct request surface
- stay narrower than both the storage parent and the S3 pricing anatomy page
- route broader storage-budget questions back to `storage-costs`

### `aws-s3-replication-pricing`

This page should explicitly identify itself as the storage copy-path economics page.

Its job is to:

- focus on changed bytes, destination storage, one-time backfills, and CRR vs SRR economics
- avoid becoming a second generic S3 pricing page
- route broader storage-budget questions back to `storage-costs`

## Content Strategy

This round should apply the same governance pattern across all four pages:

1. strengthen the first-screen role statement so the page job is obvious immediately
2. add explicit routing back to `storage-costs` when the broader storage budget shape is still unclear
3. tighten overlap so each page owns one S3 question instead of repeating the whole S3 model
4. keep language original and role-specific rather than expanding with generic filler

The goal is not more copy. The goal is cleaner hierarchy, less topic cannibalization, and stronger editorial
distinctness for AdSense quality and search trust.

## Regression Guard

Add a targeted regression test that verifies:

- `aws-s3-pricing` declares itself as the S3 pricing anatomy page
- `aws-s3-storage-classes` declares itself as the storage-class decision page
- `aws-s3-request-costs` declares itself as the request-cost boundary page
- `aws-s3-replication-pricing` declares itself as the storage copy-path economics page
- all four pages route broader storage-budget questions back to `storage-costs`

The test should protect role separation rather than exact paragraph wording.

## Scope

Keep this round limited to:

- `src/pages/guides/aws-s3-pricing.astro`
- `src/pages/guides/aws-s3-storage-classes.astro`
- `src/pages/guides/aws-s3-request-costs.astro`
- `src/pages/guides/aws-s3-replication-pricing.astro`
- `tests/s3-governance.test.mjs`

Do not expand this round into Glacier retrieval pages, old `s3-pricing-explained` pages, or generic transfer pages
unless a direct blocker appears.

## Success Standard

This round is successful when:

- the four `aws-s3-*` pages each own a distinct role under the storage parent
- readers can tell when to stay with the storage parent versus when to move into a narrower S3 page
- the new regression test passes
- `npm run check` and `npm run build` still pass with only the accepted existing hints
