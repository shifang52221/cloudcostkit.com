# ECR Cluster Role Separation Design

## Goal

Deepen the AWS ECR guide cluster so the pricing, estimate, and optimization pages perform clearly different editorial jobs instead of reading like lightly rewritten versions of the same storage-and-pulls story.

Target pages:

- `src/pages/guides/aws-ecr-pricing.astro`
- `src/pages/guides/aws-ecr-estimate-storage-gb-month.astro`
- `src/pages/guides/aws-ecr-cost-optimization.astro`

## Problem

The current ECR cluster is useful, but the page roles still overlap too much:

- the pricing page already teaches retention and pull-behavior tactics instead of staying on bill ownership
- the estimate page explains storage math well, but it still needs stronger role-setting language and a clearer handoff
- the optimization page re-explains storage and pull drivers instead of staying focused on production intervention

That overlap creates low-quality risk:

- all three pages revisit retention, image size, pull behavior, and transfer boundaries with only moderate wording changes
- users still have to infer which page answers "what belongs inside the ECR bill", "how do I measure GB-month", and "what should I change in production"
- Google can read the trio as topic expansion without enough editorial separation

## Recommended Approach

Separate the cluster by job, not by synonym.

### 1. Pricing page = bill-boundary page

This page should answer:

- what belongs inside the ECR bill itself
- which cost buckets are ECR-native, such as registry storage, image transfer, and replication-linked storage duplication
- which adjacent costs should be tracked beside the ECR bill rather than blended into it, such as NAT gateway processing, cross-region network transfer outside the registry line item, and workload-side pull behavior

This page should feel like the "what exactly is part of the ECR bill?" page.

### 2. Estimate page = storage-measurement workflow page

This page should answer:

- how to turn repo classes, image sizes, push frequency, retention windows, and multi-arch duplication into a defendable GB-month model
- how to separate baseline storage from growth windows caused by CI churn, release retention, and base-image duplication
- when the storage model is good enough to hand off to pricing or optimization

This page should feel like the "show me how to count and defend stored GB-month" page.

### 3. Optimization page = production intervention page

This page should answer:

- what to change once the team knows whether retention drift, oversized images, duplicate tags, repeated pulls, or unnecessary replication is the real ECR cost driver
- how to reduce ECR spend without breaking rollbacks, deployment safety, or image availability
- when not to optimize yet because the team still lacks a reliable driver split

This page should feel like the "what should we change in production now?" page.

## Concrete Content Moves

### Pricing page

- add explicit role-setting language that says this page defines what belongs inside the ECR bill before teams debate retention policy, image slimming, or pull reduction
- add a section that separates ECR-native costs from adjacent NAT, network, and workload-side costs
- add "when this is not the right page" guidance that routes to estimate or optimization
- reduce embedded retention-policy and optimization language where possible

### Estimate page

- add explicit "storage-measurement workflow" positioning
- add an evidence-pack section for repo classes, image size, push frequency, retention windows, and multi-arch duplication
- strengthen baseline vs growth-window framing
- make the handoff explicit: return to pricing if bill scope is unclear, move to optimization if the storage model is stable

### Optimization page

- add explicit "production intervention" positioning
- add a "do not optimize yet" section tied to unclear dominant drivers
- organize interventions by retention enforcement, image slimming, pull-path discipline, and replication control
- add a change-control loop that protects rollback safety and deployment reliability

## Test Strategy

Create one focused regression test file:

- `tests/ecr-cluster-role-separation.test.mjs`

The test should assert:

- pricing page language makes it the bill-boundary page
- estimate page language makes it the storage-measurement workflow page
- optimization page language makes it the production intervention page

This keeps the editorial separation durable after future edits.
