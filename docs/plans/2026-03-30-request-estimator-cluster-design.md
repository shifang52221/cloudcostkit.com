# Request Estimator and Utility Calculator Cluster Depth Cleanup Design

## Why this batch exists

The next remaining high-risk cluster is made of support estimators and conversion utilities:

- `aws-api-gateway-request-estimator`
- `aws-sqs-request-estimator`
- `aws-sns-delivery-estimator`
- `aws-kms-request-estimator`
- `rps-to-monthly-requests-calculator`
- `s3-request-cost-calculator`

Most of these pages are intentionally support pages rather than primary public landing pages, but that does not make the
quality problem smaller. Right now several still read like lightly edited calculator templates with generic tails about
inputs, interpretation, mistakes, and validation. That weakens originality and makes the support layer of the site look
mass-produced.

## Scope of this batch

This batch covers:

- `src/pages/calculators/aws-api-gateway-request-estimator.astro`
- `src/pages/calculators/aws-sqs-request-estimator.astro`
- `src/pages/calculators/aws-sns-delivery-estimator.astro`
- `src/pages/calculators/aws-kms-request-estimator.astro`
- `src/pages/calculators/rps-to-monthly-requests-calculator.astro`
- `src/pages/calculators/s3-request-cost-calculator.astro`

## Problem pattern

These pages all estimate request-like volume, but they should not feel like one repeated family with different product
names inserted.

Their actual roles are different:

- `aws-api-gateway-request-estimator`: API traffic plus retry amplification and burst windows
- `aws-sqs-request-estimator`: message lifecycle translated into billable request multipliers
- `aws-sns-delivery-estimator`: publish volume transformed by matched fan-out and delivery retries
- `aws-kms-request-estimator`: workload units translated into crypto-call density
- `rps-to-monthly-requests-calculator`: a workflow bridge that converts rate into request volume for adjacent pricing pages
- `s3-request-cost-calculator`: object-operation mix and request-class cost, not generic storage arithmetic

The current tails flatten these roles into one support-page shell.

## Options considered

### Option 1: Leave support pages short and generic

Pros:

- fast
- low maintenance

Cons:

- preserves the template feel
- weakens the support layer that still contributes to whole-site quality

### Option 2: Trim support pages down to the widget only

Pros:

- removes obvious repetition quickly
- reduces editorial surface

Cons:

- risks making support pages too thin
- misses the chance to clarify each page's role in a request-billing workflow

### Option 3: Keep them as support pages, but make each one role-specific

Pros:

- preserves utility while removing the mass-produced feel
- gives each page a clear place in the broader billing path
- strengthens site quality without pretending every support page is a primary landing page

Cons:

- requires careful page-by-page rewriting

## Recommended approach

Choose Option 3.

The key is not to turn every support page into a big guide. Instead, keep each page compact but specific:

- explain what it is estimating
- explain where that estimate usually goes wrong
- explain how it connects to the adjacent main calculator

## Final design

### Shared rule

Keep:

- current widgets
- FAQs
- related links
- support-page positioning where already appropriate

Replace:

- repeated inputs / interpretation / mistakes / validation sections
- generic calculator advice that could fit almost any page
- blended request language that ignores product-specific multipliers

### Page-specific rewrites

#### API Gateway Request Estimator

Rebuild around gateway traffic shape:

- baseline request flow
- burst windows
- retries, bots, and automation as request amplifiers

This page should read like an API-edge request estimator, not a generic rate converter.

#### SQS Request Estimator

Rebuild around message lifecycle:

- send, receive, delete, visibility changes
- retries and polling loops
- why one message can translate into more than three billable requests

#### SNS Delivery Estimator

Rebuild around fan-out:

- publishes
- matched subscriptions after filtering
- retry-driven delivery amplification

This page should make it obvious that SNS cost is about delivery multiplication, not just raw publish count.

#### KMS Request Estimator

Rebuild around call density:

- workload units
- KMS calls per unit
- caching or batching as the main reason estimates drift

This page should feel cryptography-path specific rather than generic request math.

#### RPS to Monthly Requests Calculator

Keep it clearly marked as a support converter, but rewrite the tail around its bridge role:

- turning rate into request volume
- separating baseline from burst
- avoiding misuse as a full pricing model

#### S3 Request Cost Calculator

Rebuild around operation mix:

- GET, PUT, LIST, HEAD, multipart, and retries
- small-object or metadata-heavy workloads
- distinction between request cost and storage or transfer cost

## Success criteria

This batch is successful when:

- each page reads like a support estimator with a distinct role in a billing workflow
- old template headings are gone from all six target pages
- `rps-to-monthly-requests` clearly reads as a bridge page rather than a generic calculator
- `s3-request-cost-calculator` no longer carries a generic storage-calculator tail
- touched files remain ASCII-only and the site still passes `check` and `build`
