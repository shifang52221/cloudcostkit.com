# Search Console Operating Notes

Date: 2026-03-12
Source window: Google Search Console, last 3 months, Web search

## Site Snapshot

- Clicks: 17
- Impressions: 7,173
- CTR: 0.24%
- Average position: 47.94

## Device Signal

- Desktop is currently much stronger than mobile.
- Desktop: about 5,162 impressions and 16 clicks.
- Mobile: about 1,917 impressions and 1 click.

Interpretation:

- Mobile UX and first-scroll clarity are real priorities.
- Hub pages and calculator pages should surface useful actions earlier on small screens.

## Pages Already Earning Clicks

These pages already proved they can capture at least some intent:

- `/calculators/kubernetes-requests-limits-calculator/`
- `/calculators/storage-replication-cost-calculator/`
- `/calculators/data-egress-cost-calculator/`
- `/guides/azure-event-hubs-pricing/`
- `/guides/aws-eks-node-sizing/`
- `/calculators/cdn-cost-calculator/`
- `/calculators/cloudfront-cost-calculator/`
- `/guides/aws-cloudtrail-estimate-events/`

Operating rule:

- Protect these pages first.
- Do not let later template or content changes weaken their clarity.
- Re-check titles, intros, and internal links before expanding new topics.

## Top-20 Opportunity Pages

These pages are already close enough to justify direct optimization:

- `/guides/gcp-cloud-run-pricing/` (about position 12.84)
- `/calculators/storage-replication-cost-calculator/` (about position 13.6)
- `/guides/aws-route-53-pricing/` (about position 12.07)
- `/calculators/log-cost-calculator/` (about position 11.15, lower impression volume)
- `/guides/azure-event-hubs-pricing/` (about position 27.59 but already earning clicks)
- `/guides/azure-container-registry-pricing/` (about position 24.11)
- `/calculators/data-egress-cost-calculator/` (about position 24.43)

Operating rule:

- Prefer upgrading pages already in positions 8-30 before publishing many new pages.
- Add clearer query-intent alignment, examples, FAQ coverage, and next-step links.

## High-Impression, Low-CTR Pages

These pages are being seen but are not yet earning enough clicks:

- `/calculators/cdn-cost-calculator/`
- `/guides/cdn-costs/`
- `/calculators/ec2-cost-calculator/`
- `/guides/egress-costs/`
- `/calculators/`

Operating rule:

- Treat these as CTR and intent-match projects, not only ranking projects.
- Revisit title language, intro framing, and the promise users see above the fold.

## Query Clusters Worth Owning

### CDN cluster

- `cdn cost`
- `cdn costs`
- `cdn pricing`
- `cdn cost comparison`
- `cdn cost calculator`

Interpretation:

- Strong demand exists.
- Current rankings are still weak overall.
- This cluster needs both ranking support and stronger click capture.

### EC2 cluster

- `ec2 calculator`
- `ec2 cost calculator`
- `ec2 pricing calculator`
- `ec2 price calculator`
- `ec2 cost estimator`

Interpretation:

- The topic is validated by demand.
- The page needs clearer positioning as a fast planning calculator and stronger surrounding support.

### Egress cluster

- `aws egress cost calculator`
- `aws egress cost`
- `aws egress pricing`
- `aws egress charges`
- `data egress calculator`

Interpretation:

- Query demand is broad and messy.
- The page must keep boundary-first framing because that is the key differentiator.

### Cloud Run / ACR / Event Hubs cluster

- `google cloud run pricing per request cpu memory 2026`
- `azure container registry pricing`
- `acr pricing`
- `azure event hub pricing`
- `azure event hubs pricing 2026`

Interpretation:

- These are near-winner commercial-intent guides.
- They deserve regular refreshes because they are already close to useful rankings.

## Weekly Review Rhythm

### Every week

1. Export Search Console page and query data for the last 3 months.
2. Update the 4 lists:
   - click-earning pages
   - top-20 opportunity pages
   - high-impression low-CTR pages
   - low-signal pages that can wait
3. Choose one small batch:
   - 2 guide pages
   - 2 calculator pages
   - 1 site-level UX or internal-linking improvement
4. Run:
   - `npm run check`
   - `npm run build`

### Every month

1. Re-check homepage, `/calculators/`, and `/guides/` against the latest demand clusters.
2. Retire stale assumptions about what users are searching for.
3. Refresh internal links on pages that move into the top-20 opportunity bucket.

## Current Priority Order

1. Protect and expand the CDN cluster.
2. Continue pushing EC2 and egress pages.
3. Keep strengthening Cloud Run, ACR, and Event Hubs guide pages.
4. Keep improving mobile-first action paths on hub and calculator pages.

## Working Principle

The site already has enough indexed pages to learn from. For the next phase, the default move should be:

- improve what Google already notices
- strengthen pages already close to clicks
- only then expand into new territory
