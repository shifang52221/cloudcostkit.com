# Runtime And Storage Calculators Depth Cleanup Design

## Why this exists

After the first two calculator de-templating batches, another visible cluster still carries a shared editorial shape:

- `aws-lambda-cost-calculator`
- `aws-ecr-cost-calculator`
- `aws-ebs-cost-calculator`
- `aws-load-balancer-cost-calculator`

These are important indexable infrastructure pages, but their tails still rely on generic pattern blocks such as:

- generic input-gathering advice
- generic validation guidance
- generic scenario framing

That makes four materially different cost models feel more uniform than they should.

## Scope of this batch

This batch focuses only on:

- `src/pages/calculators/aws-lambda-cost-calculator.astro`
- `src/pages/calculators/aws-ecr-cost-calculator.astro`
- `src/pages/calculators/aws-ebs-cost-calculator.astro`
- `src/pages/calculators/aws-load-balancer-cost-calculator.astro`

## Options considered

### Option 1: Lightly rephrase the existing tail sections

Pros:

- fast
- reduces exact duplicate matches

Cons:

- preserves the same mass-template page architecture
- still weakens originality on high-visibility pages

### Option 2: Trim the tails aggressively

Pros:

- removes duplication quickly

Cons:

- risks making core pages feel too tool-first and editorially shallow

### Option 3: Rebuild each page around its real cost-shape failure mode

Pros:

- makes each page noticeably more original
- matches how these products actually create billing surprises
- improves both user usefulness and review defensibility

Cons:

- requires targeted page-by-page rewriting

## Recommended approach

Choose Option 3.

Each page should explain the specific operational pattern that changes its bill:

- Lambda: duration, memory, retries, cold-start and concurrency behavior, logging adjacency
- ECR: stored image inventory, retention, pull storms, CI/CD churn, cross-region/public pull paths
- EBS: storage baseline, provisioned performance, volume-type choice, idle overprovisioning, snapshot adjacency
- Load balancer: fixed hourly footprint, capacity-unit drivers, idle cost, burst traffic, transfer adjacency

## Final design

### Shared rule

Keep:

- the calculator component
- page-level FAQs, includes, excludes, and related links
- the existing `CalculatorLayout`

Replace:

- generic repeated post-calculator content

With:

- product-specific measurement guidance
- product-specific sources of estimate drift
- product-specific reconciliation workflow
- product-specific next-step interpretation

### Page-by-page direction

#### AWS Lambda cost calculator

Rebuild around:

- invocations versus GB-seconds
- duration distribution and memory configuration
- retries, async bursts, concurrency, and log adjacency
- how to compare estimated compute with real runtime behavior

#### AWS ECR cost calculator

Rebuild around:

- stored image inventory versus pull-driven transfer
- release-day pull storms, CI pipelines, and cache efficiency
- retention and tag sprawl
- how to separate registry cost from downstream cluster/network cost

#### AWS EBS cost calculator

Rebuild around:

- storage baseline versus paid performance
- gp2/gp3/io volume-type thinking
- idle overprovisioning and performance headroom
- where snapshots and backups should sit outside the model

#### AWS Load Balancer cost calculator

Rebuild around:

- fixed LB-hour floor versus variable LCU/NLCU usage
- burst traffic, connection patterns, and bytes processed
- idle load balancer sprawl
- how to compare CloudWatch and billing line items correctly

### Success standard

This batch is successful when:

- these four pages no longer read like variants of one appendix
- each page owns a distinct infrastructure cost model
- originality improves on high-visibility runtime and storage pages
- the site's remaining calculator matrix signal shrinks again
