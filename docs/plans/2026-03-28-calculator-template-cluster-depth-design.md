# Calculator Template Cluster Depth Cleanup Design

## Why this exists

The site's current AdSense risk is no longer dominated by broken trust pages or obvious thin-content failures. The
larger remaining risk is that too many indexable calculator pages still share the same generic editorial tail:

- the same "How to get your inputs" bullets
- the same "Common mistakes" bullets
- the same "Validate after changes" checklist
- similar scenario tables that change labels but not the real workflow

That pattern makes a large section of the calculator library feel mass-produced even when the tools themselves are
useful.

## Scope of this batch

This batch focuses on one narrow cluster of AWS calculators whose tails still carry obvious shared-template language:

- `src/pages/calculators/aws-api-gateway-cost-calculator.astro`
- `src/pages/calculators/aws-dynamodb-cost-calculator.astro`
- `src/pages/calculators/aws-route-53-cost-calculator.astro`
- `src/pages/calculators/aws-secrets-manager-cost-calculator.astro`
- `src/pages/calculators/aws-ssm-parameter-store-cost-calculator.astro`
- `src/pages/calculators/aws-cloudtrail-cost-calculator.astro`

## Options considered

### Option 1: Lightly reword the repeated bullets

Pros:

- fast
- reduces obvious copy-paste matches a little

Cons:

- does not change the underlying template feel
- still reads like one master page with service names swapped

### Option 2: Remove most editorial tails and let the calculator component stand alone

Pros:

- eliminates repeated prose quickly
- lowers the visible template footprint

Cons:

- weakens page usefulness for users who need boundaries, measurement guidance, and reconciliation steps
- makes the calculators feel thinner, which is risky for both SEO and AdSense quality review

### Option 3: Rebuild each page tail around its real billing workflow

Pros:

- keeps the calculators useful and reviewable
- removes the shared-template feel by making each page own a distinct operating workflow
- strengthens originality without inventing fake complexity

Cons:

- requires careful page-by-page rewriting

## Recommended approach

Choose Option 3.

Each calculator should keep the shared `CalculatorLayout`, but the post-calculator prose must stop behaving like a
generic site-wide appendix. Instead, each page should explain the service-specific workflow behind a trustworthy
estimate:

- what to measure first
- which pricing boundaries are easy to miss
- what kind of spike or workload shape breaks naive estimates
- how to reconcile the estimate with a real bill or usage export

## Final design

### Shared structural rule

Keep:

- the calculator component
- related internal links
- page-specific FAQs, includes, excludes, and how-it-works sections already passed into `CalculatorLayout`

Replace:

- generic tail sections copied across many calculators

With:

- service-specific measurement guidance
- service-specific cost drift explanations
- service-specific reconciliation steps
- service-specific next actions

### Page-by-page direction

#### AWS API Gateway cost calculator

Make the tail about:

- request class and API type boundaries
- when response transfer actually matters
- why caching, retries, and log settings distort cost
- how to reconcile estimated requests and transfer with a real bill

#### AWS DynamoDB cost calculator

Make the tail about:

- on-demand versus provisioned mental models
- partition hot spots, read/write mix, and storage growth
- where Streams, backups, or global tables sit outside the estimate
- how to reconcile with consumed capacity and storage behavior

#### AWS Route 53 cost calculator

Make the tail about:

- hosted zones versus query-driven cost
- resolver behavior, TTL, retries, and query amplification
- when health checks are steady versus meaningful
- how to validate query counts using DNS metrics and logs

#### AWS Secrets Manager cost calculator

Make the tail about:

- steady secret inventory versus bursty API reads
- deploy/startup patterns and cache-miss behavior
- why secret fetches per request are dangerous
- how to compare estimate versus application fetch patterns

#### AWS SSM Parameter Store cost calculator

Make the tail about:

- advanced parameter inventory
- standard versus advanced mental model
- chatty polling and startup storms
- where Parameter Store differs from Secrets Manager in cost shape

#### AWS CloudTrail cost calculator

Make the tail about:

- management versus data versus Insights events
- why data events can dwarf everything else
- downstream storage and analysis costs that sit outside this page
- how to audit event-heavy services before trusting the estimate

### Success standard

This batch is successful when:

- these six calculators no longer share the same obvious editorial appendix
- each page reads like it belongs to its own billing workflow
- the calculators feel less industrially templated and more genuinely maintained
- build and type checks remain stable
