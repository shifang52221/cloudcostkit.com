# Supporting Cluster Pages Design

Date: 2026-03-12

## Goal

Strengthen the second layer of the site's Search Console growth system by improving existing support guides that can capture and reinforce:

- CDN comparison intent
- CDN per-GB pricing intent
- AWS data transfer and network cost intent
- Azure egress pricing intent

## Why This Is the Next Move

The site already has stronger primary pages for:

- CDN costs
- Egress costs
- EC2 pricing and comparison paths

The next gap is not the primary cluster page. The next gap is the supporting layer beneath it.

Search Console shows that users are already asking for more specific variants such as:

- `cdn cost comparison`
- `cdn costs per gb`
- `cdn cost per gigabyte`
- `cloudfront cdn pricing`
- `aws data transfer cost calculator`
- `aws data transfer pricing calculator`
- `azure egress cost calculator`
- `azure egress pricing`

These are exactly the kinds of queries that strong support pages should absorb.

## Existing Page Layer We Can Improve

The site already has relevant supporting pages:

- `/guides/cdn-cost-comparison`
- `/guides/cdn-cost-per-gigabyte`
- `/guides/aws-network-costs`
- `/guides/azure-bandwidth-egress-costs`

This is a strong position because we do not need to invent new structure. We need to sharpen the structure that already exists.

## Approaches Considered

### Approach 1: Strengthen existing support guides

Pros:

- Builds on indexed pages that already fit the current query clusters.
- Improves topic depth without exploding page count.
- Reinforces internal linking between cluster hub pages and supporting detail pages.

Cons:

- Requires careful copy and link decisions so pages do not become repetitive.

### Approach 2: Publish many new long-tail pages

Pros:

- Maximum keyword surface area.

Cons:

- Higher content maintenance burden.
- More likely to dilute authority before existing support pages are fully optimized.

### Approach 3: Keep only working on hub pages and primary guides

Pros:

- Lowest effort.

Cons:

- Leaves support-intent queries underserved.
- Makes the cluster shallower than it should be.

## Recommendation

Use Approach 1.

This is the cleanest next step for a site at the current stage. The core pages are now strong enough that supporting pages can become real traffic entry points rather than just internal documentation.

## Design

### 1. Upgrade the CDN comparison support page

Strengthen `/guides/cdn-cost-comparison/` so it clearly captures:

- CDN cost comparison
- CDN pricing comparison
- provider comparison intent such as CloudFront vs Cloudflare

The page should:

- define what a fair CDN comparison actually requires
- explain when a pricing guide is enough vs when a comparison worksheet is needed
- route users into both calculators and provider-specific comparison pages

### 2. Upgrade the CDN per-GB support page

Strengthen `/guides/cdn-cost-per-gigabyte/` so it better captures:

- CDN costs per GB
- CDN cost per gigabyte
- provider per-GB language such as Cloudflare CDN pricing per GB

The page should:

- make per-GB language visible earlier
- explain when per-GB is the right approximation and when it fails
- connect per-GB budgeting back to full CDN comparison and total-cost modeling

### 3. Reframe the AWS network page as a bridge for AWS data transfer intent

Strengthen `/guides/aws-network-costs/` so it better captures:

- AWS data transfer cost calculator
- AWS data transfer pricing calculator
- the relationship between data transfer and broader AWS network costs

The page should:

- clarify the difference between egress, data transfer, NAT, endpoints, and cross-AZ paths
- surface the calculator and deeper transfer guides earlier
- act as a bridge between searchers with a narrow calculator mindset and the broader AWS network model

### 4. Upgrade the Azure egress support page

Strengthen `/guides/azure-bandwidth-egress-costs/` so it more clearly captures:

- Azure egress cost calculator
- Azure egress pricing
- Azure egress charges

The page should:

- answer Azure-shaped egress language earlier
- distinguish guide-first vs calculator-first usage
- strengthen cross-links to the generic egress calculator and cross-cloud guides

## Internal Linking Principle

This pass should increase two-way movement:

- primary page -> supporting page
- supporting page -> primary page or calculator

Each support page should clearly help users choose:

- keep reading the guide
- run the matching calculator
- move to a provider-specific or adjacent support page

## Success Criteria

This pass is successful if:

- support pages are more obviously aligned with the live long-tail queries
- users can move from high-level cluster pages into deeper support pages naturally
- provider-specific phrasing appears earlier without fragmenting the site voice
- the site remains check-clean and build-clean

## Scope Guardrails

- Do not publish a large new page batch in this pass.
- Prefer title, intro, FAQ, structure, and pathway upgrades over broad content bloat.
- Keep the site voice practical and formula-first.
- Use generated guide metadata updates only as a consequence of real page improvements.
