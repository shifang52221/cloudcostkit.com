# S3 Glacier Cluster Role Separation Design

## Goal

Deepen the AWS S3 Glacier guide cluster so the pricing, estimate, and optimization pages perform clearly different editorial jobs instead of reading like three versions of the same restore-and-request story.

Target pages:

- `src/pages/guides/aws-s3-glacier-pricing.astro`
- `src/pages/guides/aws-s3-glacier-estimate-retrieval.astro`
- `src/pages/guides/aws-s3-glacier-cost-optimization.astro`

## Problem

The current Glacier cluster is useful, but the page roles still overlap too much:

- the pricing page already teaches restore workflows and optimization choices instead of staying on bill ownership
- the estimate page explains retrieval math well, but it still needs stronger role-setting language and a clearer handoff
- the optimization page re-explains restores, object counts, and tier fit instead of staying focused on production intervention

That overlap creates low-quality risk:

- all three pages revisit retrieval GB, request counts, small-object packaging, and restore frequency with only moderate wording changes
- users still have to infer which page answers "what belongs inside the archive bill", "how do I measure retrieval exposure", and "what should I change now"
- Google can read the trio as topic expansion without enough editorial separation

## Recommended Approach

Separate the cluster by job, not by archive terminology.

### 1. Pricing page = bill-boundary page

This page should answer:

- what belongs inside the archive bill itself
- which cost buckets are archive-native, such as stored GB-month, retrieval GB, retrieval requests, transitions, and minimum-duration exposure
- which adjacent costs should be tracked beside the archive bill rather than blended into it, such as downstream compute on restored data, warm analysis copies, and workflow-side orchestration cost

This page should feel like the "what exactly is part of the archive bill?" page.

### 2. Estimate page = retrieval-measurement workflow page

This page should answer:

- how to turn restore events, job frequency, object counts, backfills, and small-object packaging into a defendable retrieval GB and retrieval-request model
- how to separate baseline retrieval from peak retrieval windows
- when the retrieval model is good enough to hand off to pricing or optimization

This page should feel like the "show me how to count and defend retrieval exposure" page.

### 3. Optimization page = production intervention page

This page should answer:

- what to change once the team knows whether restore frequency, small-object fan-out, minimum-duration churn, or wrong-tier placement is the real archive cost driver
- how to reduce archive cost without breaking restore SLA or analysis workflows
- when not to optimize yet because the team still lacks a reliable driver split

This page should feel like the "what should we change in production now?" page.

## Concrete Content Moves

### Pricing page

- add explicit role-setting language that says this page defines what belongs inside the archive bill before teams debate batching, repackaging, or tier changes
- add a section that separates archive-native costs from adjacent compute, cache, and workflow costs
- add "when this is not the right page" guidance that routes to estimate or optimization
- reduce embedded workflow and optimization language where possible

### Estimate page

- add explicit "retrieval-measurement workflow" positioning
- add an evidence-pack section for restore events, job frequency, object counts, backfill windows, and object packaging
- strengthen baseline vs peak-window framing
- make the handoff explicit: return to pricing if bill scope is unclear, move to optimization if the retrieval model is stable

### Optimization page

- add explicit "production intervention" positioning
- add a "do not optimize yet" section tied to unclear dominant drivers
- organize interventions by restore discipline, object packaging, lifecycle control, and storage-tier fit
- add a change-control loop that protects restore SLA and downstream workflow reliability

## Test Strategy

Create one focused regression test file:

- `tests/s3-glacier-cluster-role-separation.test.mjs`

The test should assert:

- pricing page language makes it the bill-boundary page
- estimate page language makes it the retrieval-measurement workflow page
- optimization page language makes it the production intervention page

This keeps the editorial separation durable after future edits.
