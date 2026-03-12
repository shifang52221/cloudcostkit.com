# Search Console Growth Design

Date: 2026-03-12

## Goal

Turn CloudCostKit from a site that is already indexed into a site that can convert existing impressions into sustained clicks and repeatable growth work.

## Current Reality

- Search Console for the last 3 months shows 17 clicks, 7,173 impressions, 0.24% CTR, and an average position of 47.94.
- The site is no longer in a zero-data stage. It already has identifiable winners, near-winners, and high-impression misses.
- Desktop materially outperforms mobile, which means mobile first-impression and interaction quality need attention.
- The codebase has real engineering debt: `npm run check` currently fails with 8 errors, which makes iteration riskier than it should be.

## What We Are Optimizing For

This round prioritizes "getting stronger" in a practical sense:

1. Remove engineering friction that slows future work.
2. Improve the pages that are already closest to gaining traffic.
3. Strengthen site-level conversion and trust paths so new traffic is not wasted.
4. Create a repeatable workflow for using Search Console data as an operating system, not a one-off report.

## Non-Goals

- We are not trying to redesign the whole brand this round.
- We are not trying to publish dozens of new pages before improving pages that already have impressions.
- We are not trying to build a full analytics product or dashboard before fixing the obvious opportunities.

## Data-Backed Opportunity Set

### Already getting clicks

- `/calculators/kubernetes-requests-limits-calculator/`
- `/calculators/storage-replication-cost-calculator`
- `/calculators/data-egress-cost-calculator/`
- `/guides/azure-event-hubs-pricing/`
- `/guides/aws-eks-node-sizing/`

### Near-term opportunity pages

- `/guides/gcp-cloud-run-pricing/`
- `/guides/azure-container-registry-pricing/`
- `/calculators/data-egress-cost-calculator/`
- `/calculators/storage-replication-cost-calculator`
- `/guides/azure-event-hubs-pricing/`

### High-impression pages with weak click capture

- `/calculators/cdn-cost-calculator/`
- `/guides/cdn-costs/`
- `/calculators/ec2-cost-calculator/`
- `/guides/egress-costs/`
- `/calculators/`

## Chosen Approach

We will use a mixed, data-prioritized approach:

- First, restore engineering health by getting `npm run check` back to green.
- Second, improve the small set of pages that already have favorable ranking signals or early clicks.
- Third, tighten homepage and hub-page paths so users can move from discovery to action.
- Fourth, make targeted mobile-first template improvements instead of attempting a full redesign.
- Fifth, document a repeatable Search Console review loop so future work is guided by evidence.

This is better than a pure content push because the site already has enough indexed pages to produce learning. It is also better than a pure engineering cleanup because traffic opportunities already exist and can be acted on now.

## Planned Changes

### 1. Restore engineering baseline

Fix the current Astro/TypeScript errors so that checks and builds can be trusted again.

### 2. Upgrade opportunity pages

For the selected pages, strengthen:

- title and introductory alignment with observed query intent
- clearer decision framing and comparison-oriented copy
- denser FAQ and scenario sections
- stronger internal links to supporting calculators/guides
- clearer next-step CTAs after the core answer

### 3. Improve site-level conversion skeleton

Upgrade the homepage, calculators hub, and guides hub so they do more than list content. They should direct users toward problem-based starting paths and follow-up actions.

### 4. Improve mobile-first usability

Focus on the templates and global styles that most affect:

- calculator hero sections
- CTA visibility
- filter usability on category pages
- first scroll experience on phones

### 5. Create a repeatable growth workflow

Add a working document that classifies pages and queries into:

- pages already earning clicks
- pages ranking in the top 20 that need reinforcement
- high-impression low-CTR pages
- pages that can wait

## Validation

This round is successful when:

- `npm run check` passes
- the site still builds
- the targeted pages are materially stronger in intent match and next-step guidance
- the plan for ongoing Search Console review is saved in the repo

## Risks

- Over-expanding content without keeping each page distinct can dilute intent.
- Over-optimizing for a single query can make pages less useful for related searches.
- Template changes that help mobile can accidentally reduce desktop clarity if they are too aggressive.

## Why This Design

The site already has enough pages and enough impressions to justify optimization over expansion. The fastest path to a stronger site is not "more pages"; it is better execution on the pages Google already notices and users are already almost clicking.
