# Storage Governance Design

## Problem

The storage guide family already has useful pages, but the editorial hierarchy is still softer than it should be for Google and AdSense review.

Current shape:

- `src/pages/guides/storage-costs.astro` is a decent parent, but it still overlaps too easily with object-storage and archive specialist pages
- `src/pages/guides/s3-pricing-explained.astro` explains S3 well, but it still reads partly like a broad storage overview instead of a narrower S3 pricing anatomy page
- `src/pages/guides/s3-replication-cost.astro` is useful, but it needs a firmer specialist role around copy-path economics
- `src/pages/guides/s3-to-glacier-transfer-cost.astro` has good archive migration advice, but it does not yet clearly identify itself as the archive-transition boundary page

This creates two quality risks:

- the parent-child hierarchy is still not obvious enough for readers or search engines
- several pages can still look like nearby rewrites of the same storage-cost topic rather than distinct editorial jobs

## Approved Direction

Use a parent-plus-specialist split:

- `storage-costs` becomes the storage system budgeting parent page
- `s3-pricing-explained` becomes the S3 pricing anatomy page
- `s3-replication-cost` becomes the storage copy-path economics page
- `s3-to-glacier-transfer-cost` becomes the archive-transition boundary page

The parent should own the broad storage budgeting question:

- how capacity, request activity, copies, retrieval, lifecycle moves, and transfer fit together
- when the next step is base S3 pricing, replication economics, or archive migration analysis
- how to avoid treating storage as only GB-month

The specialist pages should each own one narrower question:

- `s3-pricing-explained`: how an S3-style bill breaks into storage, requests, egress, and storage-class behavior
- `s3-replication-cost`: how changed data becomes copy-path cost, replica storage, request activity, and transfer
- `s3-to-glacier-transfer-cost`: how archive transitions create request, duration, restore, and migration-boundary cost

## Role Split

### `storage-costs`

This page should explicitly identify itself as the storage system budgeting parent page.

Its job is to:

- frame storage as a full operating budget instead of one stored-bytes line
- route readers into base S3 pricing, replication, or archive-transition pages only after the broader storage model is clear
- stay broader than any one provider or one storage workflow

### `s3-pricing-explained`

This page should explicitly identify itself as the S3 pricing anatomy page.

Its job is to:

- explain how one S3-style bill breaks into storage, requests, egress, and storage classes
- stay narrower than the storage parent and avoid reteaching the whole lifecycle and copy system
- route readers back to `storage-costs` when the larger storage budget shape is still unclear

### `s3-replication-cost`

This page should explicitly identify itself as the storage copy-path economics page.

Its job is to:

- focus on changed-data volume, replica storage, request activity, and transfer directionality
- avoid becoming a second generic storage pricing guide
- route readers back to `storage-costs` when they still need the broader storage system budget map

### `s3-to-glacier-transfer-cost`

This page should explicitly identify itself as the archive-transition boundary page.

Its job is to:

- focus on archive migration requests, minimum duration risk, restores, and workflow boundaries
- stay narrower than the general storage parent and narrower than the broad S3 pricing page
- route readers back to `storage-costs` when they still need the full storage budget model

## Content Strategy

This round should apply the same governance pattern across all four pages:

1. add or tighten the first-screen role statement
2. strengthen routing language about when the page is the correct entry point
3. reinforce the biggest budgeting mistake for that page's role
4. reduce overlap by keeping the parent system-wide and the three child pages workflow-specific

The goal is not to add filler. The goal is clearer hierarchy, less topic cannibalization, and more defensible originality.

## Regression Guard

Add a targeted regression test that verifies:

- `storage-costs` declares itself as the storage system budgeting parent page
- `s3-pricing-explained` declares itself as the S3 pricing anatomy page
- `s3-replication-cost` declares itself as the storage copy-path economics page
- `s3-to-glacier-transfer-cost` declares itself as the archive-transition boundary page
- the specialist pages route broader storage-budget questions back to `storage-costs`

The test should protect role separation rather than exact paragraph wording.

## Scope

Keep this round limited to:

- `src/pages/guides/storage-costs.astro`
- `src/pages/guides/s3-pricing-explained.astro`
- `src/pages/guides/s3-replication-cost.astro`
- `src/pages/guides/s3-to-glacier-transfer-cost.astro`
- `tests/storage-parent-governance.test.mjs`

Do not expand this batch into Glacier pricing, copy-storage comparison pages, or calculator changes unless a direct blocker appears.

## Success Standard

This round is successful when:

- `storage-costs` clearly owns the storage system-budgeting parent role
- each child page owns a distinct specialist role
- readers can tell when to stay on the parent versus when to move into a specialist page
- the regression test passes
- `npm run check` and `npm run build` still pass with only the accepted existing hints
