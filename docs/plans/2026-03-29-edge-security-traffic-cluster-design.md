# Edge, Security, and Traffic Calculator Cluster Depth Cleanup Design

## Why this batch exists

The next highest-risk calculator cluster sits on the edge-delivery and traffic-protection path:

- CDN bandwidth
- CDN requests
- CDN origin egress
- CloudFront blended edge pricing
- WAF request estimation
- WAF cost

This group matters because it mixes public, indexable calculators with support estimators that still look related enough
to read like a matrix. Several pages still carry repeated tails about inputs, interpretation, mistakes, and validation.
That repeated structure weakens originality exactly where users expect concrete guidance about traffic shape, cache
behavior, bot spikes, and layered billing boundaries.

## Scope of this batch

This batch covers:

- `src/pages/calculators/cloudfront-cost-calculator.astro`
- `src/pages/calculators/cdn-request-cost-calculator.astro`
- `src/pages/calculators/cdn-origin-egress-calculator.astro`
- `src/pages/calculators/cdn-bandwidth-cost-calculator.astro`
- `src/pages/calculators/aws-waf-cost-calculator.astro`
- `src/pages/calculators/aws-waf-request-estimator.astro`

## Problem pattern

These pages should feel tightly related, but not interchangeable.

Their real roles are different:

- `cloudfront-cost-calculator`: CloudFront edge bill as bandwidth plus request fees, with origin effects nearby but separate
- `cdn-bandwidth-cost-calculator`: edge-delivery volume and effective per-GB pricing
- `cdn-request-cost-calculator`: request classes, cache-key fragmentation, and request-heavy traffic
- `cdn-origin-egress-calculator`: what the origin still serves after miss rate and revalidation
- `aws-waf-cost-calculator`: Web ACLs, rules, and evaluated-request charges, plus downstream incident costs
- `aws-waf-request-estimator`: baseline plus attack traffic modeling for evaluated requests

The current repeated tails flatten these differences into one reusable calculator shell. That is exactly the pattern we
are trying to eliminate across the site.

## Options considered

### Option 1: Keep the existing structure and only swap wording

Pros:

- quick
- removes exact duplicate phrasing

Cons:

- keeps the same production-template shape
- still feels mass-produced

### Option 2: Remove most tail content and rely on the widget

Pros:

- fast reduction of repeated prose
- lower editorial maintenance

Cons:

- weakens commercial and educational value on pages that need boundary explanations
- does not solve the thin-page problem on key calculators

### Option 3: Rebuild each page around one real billing boundary

Pros:

- makes the cluster read like a coherent cost system instead of a page factory
- improves usefulness for both SEO and AdSense quality review
- gives each page a distinct narrative tied to how the bill actually grows

Cons:

- requires page-by-page rewriting and careful boundary control

## Recommended approach

Choose Option 3.

Treat this cluster as one operational chain:

1. users hit the CDN edge
2. requests and bandwidth are billed differently
3. cache misses and revalidation leak traffic back to the origin
4. WAF evaluates traffic before or around delivery paths
5. attacks and bot spikes distort request-based charges

Each page should explain one part of that chain instead of repeating the same generic calculator advice.

## Final design

### Shared rule

Keep:

- existing calculator widgets
- existing FAQ blocks
- relevant scenario tables where they still help
- related-link structure

Replace:

- repeated inputs / interpretation / mistakes / validation tails
- generic checklist prose that could fit almost any calculator
- filler sections that repeat concepts already covered on adjacent pages

### Page-specific rewrites

#### CloudFront Cost Calculator

Reframe the page around the CloudFront edge bill as two line items:

- edge bandwidth
- request fees

The supporting prose should explain where estimates drift:

- region mix and blended edge rates
- small-object or API-heavy traffic where requests become material
- confusing CloudFront edge cost with origin egress or invalidation-related work

#### CDN Bandwidth Cost Calculator

Rebuild the tail around throughput-to-GB conversion, regional rate mix, and media-heavy delivery behavior.

This page should emphasize:

- edge delivery volume, not origin backhaul
- why compression and object size matter more than request tuning here
- why peak events can distort a monthly bandwidth baseline

#### CDN Request Cost Calculator

Rebuild the tail around request-class behavior and cache-key fragmentation.

This page should emphasize:

- static vs dynamic or hit vs miss classes when pricing differs
- bot spikes and chatty clients
- asset fan-out, query-string churn, and range requests as request multipliers

#### CDN Origin Egress Calculator

Rebuild the tail around what the origin still serves after cache misses, revalidation, and multi-POP behavior.

This page should emphasize:

- miss rate as a financial driver
- why cache hit rate from short windows is misleading
- how origin egress and origin requests become inputs into S3, API, or general egress calculators

#### AWS WAF Cost Calculator

Rebuild the tail around WAF as a layered security bill:

- Web ACL inventory
- rule inventory
- evaluated request volume
- downstream logging and analysis side effects

The page should explain that attacks do not only raise request charges; they can also create secondary observability
costs that teams forget to model.

#### AWS WAF Request Estimator

Keep this page as a support estimator, but make it read like a security-traffic estimator rather than a generic converter.

The page should emphasize:

- baseline traffic vs attack windows
- blocked traffic still being evaluated traffic
- conservative incident modeling before feeding the result into the main WAF cost calculator

## Success criteria

This batch is successful when:

- each page can be identified by its billing boundary in the first prose block
- old template headings are gone from all six target pages
- the cluster reads like one delivery-and-protection system rather than six lightly edited copies
- the content still builds cleanly and stays ASCII-only
