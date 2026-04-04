# Networking Governance Design

## Problem

The networking guide family has strong pieces, but the hierarchy is still softer than the stronger clusters we have already governed.

Current shape:

- `src/pages/guides/networking-costs.astro` is useful, but it still reads like an older broad overview rather than a firm system-budgeting parent page
- `src/pages/guides/aws-network-costs.astro` is detailed, but it is not yet clearly framed as the AWS networking parent page
- `src/pages/guides/aws-vpc-data-transfer.astro` is a good path-mapping guide, but it does not yet clearly identify itself as the AWS transfer-path boundary page beside the AWS parent

This creates two quality risks:

- the parent-child hierarchy is not obvious enough for readers or Google
- adjacent pages can still look like variations on the same network-cost explainer instead of a deliberate editorial system

## Approved Direction

Use a parent-plus-specialist split:

- `networking-costs` becomes the cross-provider networking system budgeting parent page
- `aws-network-costs` becomes the AWS networking budgeting parent page
- `aws-vpc-data-transfer` becomes the AWS transfer-path boundary page

The cross-provider parent should own the broad networking budgeting question:

- which billing boundaries exist
- how egress, transfer, NAT, private endpoints, and CDN origin paths fit together
- when to move into a provider-specific network model

The AWS parent should own the AWS-specific networking budgeting question:

- NAT, VPC endpoints, PrivateLink, cross-AZ, cross-region, and internet egress as one AWS system
- how to route readers into narrower AWS transfer-path analysis only after the wider AWS network shape is clear

The transfer-path page should own the narrower path-mapping question:

- how to draw one real traffic path through AZ, region, internet, and NAT boundaries
- how to estimate GB per boundary without re-teaching the full AWS networking system model

## Role Split

### `networking-costs`

This page should explicitly identify itself as the cross-provider networking system budgeting parent page.

Its job is to:

- frame networking as a system of billing boundaries instead of one egress line
- route readers into provider-specific networking pages only after the broader cost shape is clear
- stay broader than the AWS parent and narrower than general cloud-cost pages

### `aws-network-costs`

This page should explicitly identify itself as the AWS networking budgeting parent page.

Its job is to:

- explain the AWS network system as NAT plus endpoints plus transfer boundaries
- help readers decide whether the main problem is NAT, VPC endpoints, PrivateLink, cross-AZ, cross-region, or egress
- route readers into `aws-vpc-data-transfer` only after the broader AWS network shape is clear

### `aws-vpc-data-transfer`

This page should explicitly identify itself as the AWS transfer-path boundary page.

Its job is to:

- focus on drawing one traffic path and identifying which parts cross billable boundaries
- help readers estimate GB by boundary once the AWS network system model is already clear
- route readers back to `aws-network-costs` when they still need the broader AWS networking budget map

## Content Strategy

This round should apply the same governance pattern across all three pages:

1. add or tighten a first-screen role statement
2. strengthen routing language about when the page is the correct entry point
3. reinforce the biggest budgeting mistake for that page's role
4. reduce overlap by keeping the cross-provider parent broad, the AWS parent provider-specific, and the transfer page path-specific

The goal is not simply more text. The goal is clearer hierarchy, less topic cannibalization, and a more defensible editorial structure.

## Regression Guard

Add a targeted regression test that verifies:

- `networking-costs` declares itself as the cross-provider networking system budgeting parent page
- `aws-network-costs` declares itself as the AWS networking budgeting parent page
- `aws-vpc-data-transfer` declares itself as the AWS transfer-path boundary page
- the AWS child pages route broader questions back to the appropriate parent

The test should protect role separation rather than exact paragraph wording.

## Scope

Keep this round limited to:

- `src/pages/guides/networking-costs.astro`
- `src/pages/guides/aws-network-costs.astro`
- `src/pages/guides/aws-vpc-data-transfer.astro`
- `tests/networking-parent-governance.test.mjs`

Do not expand this batch into load-balancing, endpoint optimization pages, or non-AWS provider pages unless a direct blocker appears.

## Success Standard

This round is successful when:

- `networking-costs` clearly owns the cross-provider system-budgeting role
- `aws-network-costs` clearly owns the AWS networking parent role
- `aws-vpc-data-transfer` feels narrower and more path-specific
- the regression test passes
- `npm run check` and `npm run build` still pass with only the accepted existing hints
