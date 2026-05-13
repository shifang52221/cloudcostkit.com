# Third Page Quality Batch Design

**Problem**

The latest 28-day Search Console window still shows a small set of pages with real impressions and respectable rankings, but their first screen still reads more like a competent explainer than a sharp decision page:

- Origin egress vs CDN bandwidth
- CloudFront invalidation pricing
- Log costs
- AWS Route 53 pricing

These pages are not thin, and their role separation is already in place. The remaining weakness is that they explain the topic before they explain the key decision or cost-shape split the reader needs to make.

**Decision**

Run a third narrow page-quality batch that strengthens the opening diagnosis and reduces template feel on four already-visible pages without changing their cluster roles.

**Approach**

1. Keep each page's current role intact.
2. Strengthen the first-screen promise so each page names the core decision sooner.
3. Surface the primary bill-shape split earlier:
   - edge delivery vs origin cache-fill ownership
   - direct invalidation charges vs indirect hit-rate damage
   - ingestion vs retention vs scan-driven log cost
   - Route 53 query-led vs zone-led vs health-check-led spend
4. Avoid broad expansion, generic filler, or role drift into estimate/optimization/parent pages.

**Pages in this batch**

- `src/pages/guides/origin-egress-vs-cdn-bandwidth.astro`
- `src/pages/guides/aws-cloudfront-invalidation-pricing.astro`
- `src/pages/guides/log-costs.astro`
- `src/pages/guides/aws-route-53-pricing.astro`

**Expected outcome**

These pages should feel more diagnostic from the first screen, give users a faster self-selection signal, and reduce the impression of templated wording without weakening the search-safe page architecture already in place.
