# Second High-Opportunity Page Review Design

**Problem**

The latest 28-day Search Console window still shows another small set of guides with page-one-adjacent rankings, real impressions, and near-zero CTR:

- GCP Cloud SQL pricing
- GCP Cloud Logging pricing
- GCP Cloud CDN pricing
- AWS Aurora Serverless v2 pricing

These pages are not thin and they are not mis-routed. The likely issue is that their openings still explain the topic before they explain the budgeting decision. That leaves the first screen feeling competent but not sharp enough for users deciding whether the page matches their exact cost problem.

**Decision**

Run a second narrow page-review batch that improves first-screen clarity on four near-page-one pages without changing their existing page roles or cross-page boundaries.

**Approach**

1. Keep every page's current role intact.
2. Sharpen the opening promise so the page quickly answers what kind of bill shape the user is trying to diagnose.
3. Surface the main budgeting split earlier:
   - provisioned capacity vs growth vs transfer for Cloud SQL
   - ingestion vs retention vs scan behavior for Cloud Logging
   - edge bandwidth vs request mix vs cache-fill pressure for Cloud CDN
   - minimum ACU baseline vs repeated peak windows for Aurora Serverless v2
4. Avoid generic “complete guide” language, list inflation, or broader rewrites that dilute intent.

**Pages in this batch**

- `src/pages/guides/gcp-cloud-sql-pricing.astro`
- `src/pages/guides/gcp-cloud-logging-pricing.astro`
- `src/pages/guides/gcp-cloud-cdn-pricing.astro`
- `src/pages/guides/aws-aurora-serverless-v2-pricing.astro`

**Expected outcome**

These pages should feel more diagnostic from the first screen, help searchers self-select faster, and preserve the existing search-safe role separation already established in the guide cluster.
