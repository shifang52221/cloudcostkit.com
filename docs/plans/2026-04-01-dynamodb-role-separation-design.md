# DynamoDB Role Separation Design

## Goal

Deepen the AWS DynamoDB guide cluster so the pricing, RCU/WCU explainer, and optimization pages perform clearly different editorial jobs instead of reading like lightly rewritten versions of the same reads-writes-storage story.

Target pages:

- `src/pages/guides/aws-dynamodb-pricing.astro`
- `src/pages/guides/aws-dynamodb-rcu-wcu-explained.astro`
- `src/pages/guides/aws-dynamodb-cost-optimization.astro`

## Problem

The current DynamoDB cluster is useful, but the page roles still overlap too much:

- the pricing page already teaches estimation workflow and optimization direction instead of staying on bill ownership
- the RCU/WCU explainer is helpful, but it still needs stronger role-setting language so it clearly becomes the capacity-measurement page
- the optimization page re-explains billing mechanics instead of staying focused on production intervention

That overlap creates low-quality risk:

- all three pages revisit request volume, item size, scans, indexes, and amplification with only moderate wording changes
- users still have to infer which page answers "what belongs inside the DynamoDB bill", "how do requests become billable units", and "what should I change now"
- Google can read the trio as topic expansion without enough editorial separation

## Recommended Approach

Do not force a fake `pricing / estimate / optimization` trio. Instead, separate the cluster by the jobs it actually needs to perform.

### 1. Pricing page = bill-boundary page

This page should answer:

- what belongs inside the DynamoDB bill itself
- which cost buckets are DynamoDB-native, such as read exposure, write exposure, table storage, index amplification, backups, streams, and global tables
- which adjacent costs should be tracked beside the DynamoDB bill rather than blended into it, such as cache systems, downstream stream consumers, and application retry overhead

This page should feel like the "what exactly is part of the DynamoDB bill?" page.

### 2. RCU/WCU page = capacity-measurement explainer page

This page should answer:

- how item size, consistency, query vs scan behavior, and index updates turn requests into billable read and write exposure
- how to measure the real unit multipliers from workload shape rather than guessing from request counts alone
- when the unit model is good enough to hand off to pricing or optimization

This page should feel like the "show me how requests become billable units" page.

### 3. Optimization page = production intervention page

This page should answer:

- what to change once the team knows whether reads, writes, storage, or index amplification is the real DynamoDB cost driver
- how to reduce spend without breaking latency, correctness, or access patterns
- when not to optimize yet because the team still lacks a reliable driver split

This page should feel like the "what should we change in production now?" page.

## Concrete Content Moves

### Pricing page

- add explicit role-setting language that says this page defines what belongs inside the DynamoDB bill before teams debate schema changes, caching, or retry control
- add a section that separates DynamoDB-native costs from adjacent cache, stream-consumer, and application-side costs
- add "when this is not the right page" guidance that routes to the RCU/WCU explainer or optimization page
- reduce embedded mechanism-explainer and optimization language where possible

### RCU/WCU explainer page

- add explicit "capacity-measurement explainer" positioning
- add an evidence-pack section for item size, consistency, query shape, scan behavior, and index updates
- strengthen the difference between raw request counts and billable unit exposure
- make the handoff explicit: return to pricing if bill scope is unclear, move to optimization if the unit model is stable

### Optimization page

- add explicit "production intervention" positioning
- add a "do not optimize yet" section tied to unclear dominant drivers
- organize interventions by read-path cleanup, write amplification control, storage shape, and index hygiene
- add a change-control loop that protects correctness and latency

## Test Strategy

Create one focused regression test file:

- `tests/dynamodb-role-separation.test.mjs`

The test should assert:

- pricing page language makes it the bill-boundary page
- RCU/WCU page language makes it the capacity-measurement explainer page
- optimization page language makes it the production intervention page

This keeps the editorial separation durable after future edits.
