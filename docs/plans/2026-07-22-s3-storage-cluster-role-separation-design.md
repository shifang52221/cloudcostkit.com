# S3 Storage Cluster Role Separation Design

**Date:** 2026-07-22

## Goal

Separate the search and user-intent roles of the S3 base-storage page cluster without deleting useful pages or replacing page-specific guidance with generic metadata boilerplate.

## Scope

This batch covers seven adjacent pages:

- `aws-s3-pricing`: AWS S3 bill-boundary page.
- `s3-pricing-explained`: S3-like object-storage concept clarifier.
- `aws-s3-data-transfer`: S3 transfer-path diagnosis and measurement page.
- `aws-s3-storage-classes`: storage-class decision and lifecycle economics page.
- `s3-cost-calculator`: AWS S3 multi-line bill-conversion calculator.
- `object-storage-cost-calculator`: simple capacity-plus-request calculator.
- `storage-pricing-calculator`: provider-neutral early planning calculator.

The existing S3 request, replication, cross-region, and Glacier pages remain separate owners of their narrower workflows.

## Design

Each page will open with a concise role statement that names both its job and its boundary:

1. The AWS pricing guide will explain which S3-specific billing surfaces belong in an AWS model, while routing request, replication, transfer, and archive questions to their dedicated pages.
2. The S3 pricing explainer will describe the generic storage/request/egress anatomy of an S3-like bill and avoid presenting itself as an AWS regional pricing reference.
3. The S3 transfer guide will classify source-to-destination paths and evidence inputs before sending readers to egress, cross-region, CDN, or replication calculators.
4. The storage-class guide will focus on access pattern, retrieval, transition, and minimum-duration tradeoffs rather than repeating the full S3 bill anatomy.
5. The S3 calculator will convert known AWS S3 workload inputs into separate storage, request, egress, and replication lines.
6. The object-storage calculator will stay intentionally narrow: average stored capacity plus request shape, with explicit handoffs for transfer, replication, and archive behavior.
7. The provider-neutral storage calculator will remain a first-pass comparison tool using blended rates, with explicit handoffs when product-specific rules become material.

Descriptions and internal links will reinforce these boundaries. No page will be made thinner solely to create artificial uniqueness, and no page will be noindexed solely because another page contains related keywords.

## Testing

Add a focused regression test that checks:

- each page contains its intended role statement;
- the three calculator pages route to different next decisions;
- the AWS-specific and provider-neutral descriptions remain distinct and long enough;
- the transfer and storage-class guides do not claim ownership of the full S3 bill;
- existing S3 governance tests continue to pass.

Run the focused test first, then the full test suite, `npm run check`, and `npm run build`.

## Success Criteria

- Seven pages have clearly distinguishable first-screen jobs.
- Existing narrow page owners remain intact.
- Generated guide metadata reflects the revised descriptions and topics.
- All tests and the production build pass.
- The change is pushed to `main` and the seven live URLs expose the new role statements after deployment settles.
