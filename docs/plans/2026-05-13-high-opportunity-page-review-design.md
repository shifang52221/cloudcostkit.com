# High-Opportunity Page Review Design

**Problem**

The latest 28-day Search Console window shows a small group of pages already earning meaningful impressions with rankings near page one, but CTR remains weak:

- Azure Container Registry pricing
- Azure Event Hubs pricing
- GCP Cloud Run pricing
- AWS Secrets Manager pricing

These pages are not failing because they are thin. They already have real depth and workflow separation. The likely issue is weaker entry framing: the opening promise, decision language, and immediate "what this page helps you decide" signals still leave CTR and first-screen engagement on the table.

**Decision**

Start the page-by-page phase with a narrow first batch of four near-page-one pages. Strengthen their first-screen clarity and decision framing without changing page roles or causing cross-page overlap.

**Approach**

1. Keep each page's existing role intact.
2. Improve title/description quality only where the page can make a clearer promise.
3. Strengthen opening paragraphs so the page immediately answers:
   - what decision this page helps with
   - what usually causes budget mistakes
   - what the user should measure or compare first
4. Avoid generic "complete guide" filler or broad expansion that dilutes intent.

**Pages in this batch**

- `src/pages/guides/azure-container-registry-pricing.astro`
- `src/pages/guides/azure-event-hubs-pricing.astro`
- `src/pages/guides/gcp-cloud-run-pricing.astro`
- `src/pages/guides/aws-secrets-manager-pricing.astro`

**Expected outcome**

These pages should feel more decision-ready from the first screen while preserving their existing search-safe role separation and internal-link structure.
