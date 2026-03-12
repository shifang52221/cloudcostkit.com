# Search Console Cluster Strengthening Design

Date: 2026-03-12

## Goal

Use live Search Console demand to strengthen the site's next three growth clusters without over-expanding scope:

- CDN pricing and comparison
- AWS and cross-cloud egress pricing
- EC2 calculator and adjacent EC2 vs Fargate comparison intent

## Context

The first growth pass already improved:

- high-opportunity pricing guides
- high-opportunity calculator pages
- homepage and hub-page action paths
- mobile-first CTA clarity

Search Console still shows a clear second-wave opportunity:

- CDN queries have the largest impression volume but weak CTR and weak average position.
- Egress queries are strongly AWS-shaped in wording, even when the page intent is broader.
- EC2 demand is still dominated by calculator language, with comparison intent nearby (`ec2 vs fargate`, `fargate vs ec2 pricing`).

## Query Signals

### CDN

Highest-volume observed queries include:

- `cdn cost`
- `cdn costs`
- `cdn pricing`
- `cdn cost comparison`
- `cdn cost calculator`
- `cloud cdn pricing`
- `cdn prices`
- `cdn cost per gigabyte`

Interpretation:

- The site should not frame CDN only as a calculator topic.
- The core guide should explicitly cover pricing, comparison, and per-GB language above the fold.
- Internal links should help users move between comparison, bandwidth, request, and origin-egress estimation.

### Egress

Highest-value observed queries include:

- `aws egress cost calculator`
- `aws egress cost`
- `aws egress pricing`
- `aws egress costs`
- `egress cost aws`
- `aws egress charges`
- `aws egress fees`

Interpretation:

- Even the general egress guide must speak directly to AWS wording early.
- The guide should preserve cross-cloud scope while making AWS examples more explicit.
- The strongest next step remains the egress calculator, but surrounding path links should also point to Azure and GCP egress guides.

### EC2

Highest-volume observed queries include:

- `ec2 calculator`
- `ec2 cost calculator`
- `ec2 pricing calculator`
- `ec2 price calculator`
- `ec2 cost estimator`
- `ec2 vs fargate pricing`
- `ecs fargate vs ec2`

Interpretation:

- The EC2 calculator cluster needs supporting guide language that matches calculator-style search intent.
- Adjacent comparison pages should make EC2 vs Fargate transitions easier.
- The site should treat EC2 estimation and Fargate comparison as one connected decision path.

## Approaches Considered

### Approach 1: Publish many new pages

Pros:

- Covers more keyword variations directly.

Cons:

- Spreads authority and editorial attention too early.
- Increases maintenance cost before current near-opportunity pages are fully improved.

### Approach 2: Strengthen existing cluster pages and cluster pathways

Pros:

- Builds on pages Google already sees.
- Improves both ranking support and click capture.
- Lower implementation risk and faster iteration.

Cons:

- Requires more careful internal-linking decisions.

### Approach 3: Only adjust titles and descriptions

Pros:

- Fastest possible update.

Cons:

- Too shallow for the current stage.
- Does not improve internal linking, query coverage, or action paths enough.

## Recommendation

Use Approach 2.

This is the best fit for the site's current maturity. The next win is not more surface area. The next win is better alignment, stronger cluster pathways, and clearer above-the-fold promise on the pages already receiving impressions.

## Design

### 1. Strengthen the CDN cluster around one core guide

Upgrade `/guides/cdn-costs/` so it clearly owns:

- CDN cost
- CDN pricing
- CDN cost comparison
- CDN cost per GB / per gigabyte

Add earlier sections that:

- define what users usually mean by CDN pricing
- distinguish CDN cost calculator vs pricing guide use cases
- show the fastest comparison framework across providers
- send users into the exact next calculators and comparison guides

### 2. Reframe the general egress guide around AWS-shaped language

Upgrade `/guides/egress-costs/` so the first screen and first major sections explicitly answer:

- what AWS egress cost means
- how to estimate AWS egress pricing quickly
- why internet egress, cross-region, cross-AZ, and origin-to-CDN traffic must be split

Keep the page multi-cloud, but use AWS wording first because that is what Search Console says users are asking for.

### 3. Treat EC2 estimation and Fargate comparison as one path

Upgrade:

- `/guides/aws-ec2-cost-estimation/`
- `/calculators/aws-fargate-vs-ec2-cost-calculator/`

The guide should better match calculator-intent language and explain when users should start with the EC2 calculator vs the comparison calculator. The comparison calculator should more clearly capture `ec2 vs fargate pricing` style searches and route users back to EC2 estimation, Fargate pricing, and non-compute line items.

### 4. Add a visible cluster path on hub pages

Strengthen `/guides/` and `/calculators/` with a compact "growth clusters" or "most-searched paths" section for:

- CDN pricing and comparison
- EC2 pricing and EC2 vs Fargate
- Egress cost and transfer boundaries

This improves internal linking and reduces dead-end behavior from hub pages.

## Success Criteria

This pass is successful if:

- the updated pages use live query wording more directly
- users can move through each cluster in fewer clicks
- CDN, egress, and EC2 pages have clearer next-step pathways
- the site remains build-clean and check-clean

## Scope Guardrails

- Do not create a large batch of net-new pages in this pass.
- Do not redesign templates again unless a page-level need requires it.
- Prefer improving pages already receiving impressions.
- Preserve the current site voice: practical, formula-first, and validation-aware.
