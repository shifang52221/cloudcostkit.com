# Network Transfer Cluster Calculators Depth Cleanup Design

## Why this batch exists

The next high-risk template cluster is the network transfer group. These pages are commercially important, but several
still end with the same generic sections about inputs, interpretation, mistakes, and validation. That pattern makes the
site feel mass-produced in one of the most review-sensitive topic areas.

## Scope of this batch

This batch covers:

- `src/pages/calculators/aws-nat-gateway-cost-calculator.astro`
- `src/pages/calculators/vpc-data-transfer-cost-calculator.astro`
- `src/pages/calculators/cross-region-transfer-cost-calculator.astro`
- `src/pages/calculators/aws-vpc-interface-endpoint-cost-calculator.astro`
- `src/pages/calculators/api-response-size-transfer-calculator.astro`

## Problem pattern

These pages should not feel interchangeable because the billing models are genuinely different:

- NAT Gateway: hourly base plus processed GB, with image pulls, updates, and retries as hidden multipliers
- VPC data transfer: boundary-first modeling across cross-AZ, cross-region, and internet paths
- Cross-region transfer: one-way replication, backfills, DR, and migration spikes
- Interface endpoints / PrivateLink: endpoint-hour floor plus processed GB, with AZ count as the main fixed multiplier
- API response transfer: request volume multiplied by payload shape, compression, cache hit ratio, and retry behavior

The current generic tails flatten these differences and weaken originality.

## Options considered

### Option 1: Reword the repeated tail sections

Pros:

- fastest path
- reduces exact duplication

Cons:

- keeps the same matrix shape
- does not address the low-quality impression

### Option 2: Remove most supporting prose

Pros:

- eliminates repeated wording quickly

Cons:

- makes these pages shallower in a topic area where users need billing-boundary guidance
- weakens review signals around usefulness and specificity

### Option 3: Rebuild each page around its actual billing boundary

Pros:

- improves originality and utility
- helps users understand adjacent charges and model breakpoints
- better supports AdSense/site-quality remediation goals

Cons:

- requires page-specific rewriting

## Recommended approach

Choose Option 3.

Each page should answer a different operational question:

- NAT Gateway: is the bill driven by hourly footprint or fleet-wide processed traffic?
- VPC transfer: which boundary are we actually paying for?
- Cross-region transfer: what is steady-state replication versus a one-off event?
- PrivateLink: does the endpoint-hour base replace enough NAT traffic to justify itself?
- API response transfer: how do request count and payload size turn into monthly egress?

## Final design

### Shared rule

Keep:

- existing calculator widgets
- page-level FAQs, includes, excludes, and related links unless obviously broken
- scenario tables where useful

Replace:

- generic editorial tails
- repeated checklists that could belong to almost any calculator
- imported network-transfer boilerplate that does not match the page

### Page-specific rewrites

#### NAT Gateway

Replace the generic tail with:

- fixed hourly floor versus processed-GB multiplier
- common NAT multipliers like patching, image pulls, and retries
- when endpoints, mirrors, or caching are real fixes versus superficial ones

#### VPC Data Transfer

Replace the generic tail with:

- boundary-first framing
- cross-AZ versus cross-region versus internet separation
- topology mistakes that create invisible east-west spend

#### Cross-Region Transfer

Replace the generic tail with:

- steady replication versus migration/backfill versus DR failover
- directionality and region-pair assumptions
- separation from replica storage and destination-side read costs

#### Interface Endpoint / PrivateLink

Replace the generic tail with:

- endpoint-hours as the fixed base cost
- AZ count as the scaling lever
- NAT displacement logic and endpoint sprawl risks
- distinction between interface endpoints and gateway endpoints

#### API Response Size Transfer

Replace the mismatched generic network tail with:

- payload-size measurement guidance
- response-shape segmentation by route class
- compression, cache hit ratio, and retry multipliers
- when to hand off from transfer estimation to egress/CDN calculators
