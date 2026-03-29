# Specialized Calculator Cluster Depth Cleanup Design

## Why this batch exists

The next worthwhile cleanup batch is a small cluster of calculators with unusually specific billing logic:

- `aws-api-gateway-access-log-cost-calculator`
- `aws-load-balancer-lcu-calculator`
- `s3-replication-cost-calculator`
- `compute-instance-cost-calculator`

These pages are not interchangeable, but several still keep the same generic tail pattern about inputs,
interpretation, mistakes, and validation. That is especially weak here because each page exists to explain a very
particular billing boundary that users usually misunderstand.

## Scope of this batch

This batch covers:

- `src/pages/calculators/aws-api-gateway-access-log-cost-calculator.astro`
- `src/pages/calculators/aws-load-balancer-lcu-calculator.astro`
- `src/pages/calculators/s3-replication-cost-calculator.astro`
- `src/pages/calculators/compute-instance-cost-calculator.astro`

## Problem pattern

These pages should feel distinct because they answer different questions:

- `aws-api-gateway-access-log-cost-calculator`: how request volume and bytes per log line turn into log ingestion and retained storage
- `aws-load-balancer-lcu-calculator`: how maximum hourly usage across several dimensions becomes a billable capacity-unit number
- `s3-replication-cost-calculator`: how changed data volume, not total stored data, drives replication fees
- `compute-instance-cost-calculator`: how generic billable instance-hours work as a cross-check, not a product-specific pricing page

The current repeated tails flatten those distinctions into one shared calculator shell.

## Options considered

### Option 1: Light wording cleanup only

Pros:

- quick
- reduces exact repetition

Cons:

- preserves the same template shape
- wastes pages that should teach highly specific billing mechanics

### Option 2: Shrink the supporting prose substantially

Pros:

- fast cleanup
- less content to maintain

Cons:

- risks making already-narrow pages too thin
- weakens explanation where users most need conceptual help

### Option 3: Rebuild each page around the specific billing boundary it exists to explain

Pros:

- removes the mass-produced feel
- makes each calculator more useful and memorable
- fits the broader site-quality remediation strategy

Cons:

- requires careful page-by-page rewriting

## Recommended approach

Choose Option 3.

This batch works best if every page is rewritten around the one thing users usually get wrong:

- access logs: bytes per request and retention
- LCU/NLCU: the highest driver wins
- replication: changed-data paths, not total size
- compute cross-check: billable hours and blended rate, not full-cloud pricing

## Final design

### Shared rule

Keep:

- current widgets
- FAQs
- related links
- useful scenario tables where they still help

Replace:

- repeated inputs / interpretation / mistakes / validation sections
- generic calculator language that could fit unrelated products
- filler copy that hides the actual billing mechanic

### Page-specific rewrites

#### API Gateway Access Log Cost Calculator

Rebuild around log-byte density and retention policy:

- requests turn into log lines
- log lines turn into ingestion volume
- retention policy turns ingestion into stored log cost

The prose should emphasize that users should measure average bytes per line and control field selection, not just watch
request count.

#### AWS ALB LCU / NLB NLCU Calculator

Rebuild around max-dimension billing:

- connections
- active connections
- bytes processed
- rule evaluations where applicable

The page should make it obvious that the bill does not sum all drivers. The dominant driver is the important one.

#### S3 Replication Cost Calculator

Rebuild around changed-data replication:

- writes and churn
- coverage of the replication policy
- backfills and migrations as special months

This page should make clear that replication fees come from data movement caused by changes, not from the total stored
dataset sitting in the bucket.

#### Compute Instance Cost Calculator

Keep the support-page role, but rewrite it as a generic billable-hours cross-check:

- average running instance count
- hours actually billed
- blended hourly rate after commitments or discounts

This page should clearly signal that it is a generic sanity-check calculator, not the primary destination for provider-
specific pricing workflows.

## Success criteria

This batch is successful when:

- each page is clearly defined by its own billing mechanic in the first prose block
- old template headings are gone from all four target pages
- the access-log, LCU, replication, and compute pages no longer read like cousins from one template
- touched files remain ASCII-only and the site still passes `check` and `build`
