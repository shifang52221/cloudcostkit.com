# Request-Driven AWS Calculators Depth Cleanup Design

## Why this exists

The first calculator de-templating batch removed the most obvious repeated appendix from a set of AWS calculators, but
another clear cluster still remains: request-driven messaging, email, and key-management tools.

These pages are useful tools, yet they still share the same structural problem:

- the same generic input guidance
- the same generic "common mistakes"
- the same generic "validate after changes"
- scenario tables that look similar even when the workload behavior is different

That means the site still exposes a visible matrix pattern across several indexable AWS calculators.

## Scope of this batch

This batch focuses on four closely related request-driven AWS calculators:

- `src/pages/calculators/aws-sqs-cost-calculator.astro`
- `src/pages/calculators/aws-sns-cost-calculator.astro`
- `src/pages/calculators/aws-ses-cost-calculator.astro`
- `src/pages/calculators/aws-kms-cost-calculator.astro`

They belong together because they all model request-like or operation-like spend, but each one has a very different
reason the bill drifts in practice.

## Options considered

### Option 1: Reword the existing blocks lightly

Pros:

- fast
- reduces exact duplicate phrasing

Cons:

- keeps the same page shape
- still reads like one master calculator appendix reused across services

### Option 2: Strip the editorial tails down aggressively

Pros:

- removes duplicate prose quickly

Cons:

- weakens page depth
- increases the risk that the pages feel too thin or tool-only

### Option 3: Rebuild each tail around the service's real operational failure mode

Pros:

- makes each page genuinely different
- preserves usefulness for readers and reviewers
- reduces matrix-like site signals without shrinking page quality

Cons:

- requires deliberate per-page rewrites

## Recommended approach

Choose Option 3.

The rewrite should not be about making the prose longer. It should make each calculator explain the specific operational
shape that causes forecasting error:

- SQS: requests per message, retries, long polling, visibility behavior
- SNS: publishes versus deliveries, protocol mix, fan-out, retry bursts
- SES: transactional versus campaign traffic, bounces, payload size, dedicated-email add-ons
- KMS: key inventory versus request volume, downstream service fan-out, bursty encryption paths

## Final design

### Shared rule

Keep:

- existing calculator components
- related links
- page-level includes, excludes, FAQs, and `CalculatorLayout`

Replace:

- generic repeated post-calculator guidance

With:

- service-specific measurement workflow
- service-specific drift and spike patterns
- service-specific reconciliation guidance
- service-specific next-step framing

### Page-by-page direction

#### AWS SQS cost calculator

Rebuild around:

- messages versus requests-per-message
- long polling, batching, delete behavior, retries, visibility extensions
- the difference between queue traffic growth and request amplification
- how to compare estimate versus real SQS request counts

#### AWS SNS cost calculator

Rebuild around:

- publishes versus deliveries
- topic fan-out and filter-policy match rates
- protocol-specific behavior and retry bursts
- when payload transfer matters versus when it does not

#### AWS SES cost calculator

Rebuild around:

- transactional versus marketing traffic
- campaign bursts, bounce and retry behavior
- payload size and attachments
- when dedicated IPs or adjacent email program costs sit outside the model

#### AWS KMS cost calculator

Rebuild around:

- key-month baseline versus request-heavy operations
- downstream services that trigger KMS
- batch jobs, retries, or per-request crypto hot paths
- how to distinguish a KMS bill problem from an upstream service design problem

### Success standard

This batch is successful when:

- these calculators no longer share the same repeated editorial appendix
- each page feels tied to a distinct workload pattern
- the request-driven AWS cluster looks less mass-produced
- the site moves another step away from template-network signals
