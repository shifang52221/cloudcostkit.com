# GCP Cloud Logging Pricing Refresh Design

**Context**

`gcp-cloud-logging-pricing` already has real content and a workable estimation structure, but its first screen still behaves more like a generic log-cost explainer than a strong GCP pricing destination. In the 2026-06-18 three-month Search Console review, the page showed real impressions with average ranking in the page-one-adjacent range, which makes it a good candidate for a trust-and-intent refresh rather than a structural rewrite.

The page should stay a Cloud Logging pricing page. It should not drift into:

- the broader observability parent guide
- a generic log-retention explainer
- a calculator landing page

**Goal**

Make the page answer Cloud Logging pricing intent earlier by surfacing Google Cloud-native billing boundaries before the existing estimation workflow, while preserving the page's role as the Cloud Logging pricing and bill-shape decision page.

**User Intent Priority**

Approved direction: `price-structure first`

That means the first screen should help a searcher quickly answer:

- what Cloud Logging actually bills on
- whether the bill is mainly ingestion, retention, or query-driven usage
- which nearby costs belong beside Cloud Logging rather than inside it

**Approach Options**

### Option 1: Price-structure first

Move a compact pricing snapshot to the top of the page that explains ingestion, retention, query/scan behavior, log buckets, routing behavior, and adjacent-cost separation before the existing workflow sections.

**Pros**

- Best fit for search intent like "cloud logging pricing"
- Strongest CTR and first-screen trust improvement
- Preserves the existing estimation sections instead of replacing them

**Cons**

- Requires careful wording so the page does not become too dense too early

### Option 2: Incident-driven diagnosis first

Lead with why bills spike: noisy application logs, load balancer or firewall logs, long retention, and dashboard scan loops.

**Pros**

- Strong for operators with an active billing surprise
- More immediately relatable for existing GCP users

**Cons**

- Less aligned with raw pricing-intent searches
- Risks sounding like an optimization page instead of a pricing page

### Option 3: Estimation workflow first

Lead with the practical estimate flow and calculator handoff instead of pricing anatomy.

**Pros**

- Strong for tool usage and worksheet completion
- Easy to keep consistent with existing site patterns

**Cons**

- Weakest positioning for pricing-intent trust
- Can make the page feel closer to a helper page than a canonical pricing guide

**Decision**

Use **Option 1: price-structure first**.

This is the best match for the current search opportunity and for the user's direction to strengthen Google trust before anything else.

**Content Design**

The revised page should:

- upgrade the title and meta description so they explicitly mention Cloud Logging billing surfaces
- add a `Quick pricing read` section near the top
- explain that Cloud Logging bills should be separated into ingestion, retention, and query-style behavior
- make clear that nearby systems such as BigQuery, Pub/Sub, SIEM pipelines, archived object storage, or observability-wide tooling belong beside the Cloud Logging line unless the page is intentionally modeling the broader logging estate
- retain the current estimate, retention, scan, pitfalls, and validation workflow

**Editorial Boundaries**

The page should continue to own:

- Cloud Logging ingestion economics
- retention economics
- query / scan behavior
- Cloud Logging-specific bill-shape decisions

The page should not absorb:

- cross-signal observability budgeting that belongs to `observability-costs`
- generic retention math that belongs to `log-retention-storage-cost`
- pure calculator intent that belongs to log calculators

**Testing Strategy**

Add or expand tests so the page is locked to the new first-screen pricing cues:

- `Quick pricing read`
- ingestion / retention / query-or-scan separation
- GCP-specific billing language
- adjacent-cost separation
- updated title / SERP promise

**Expected Outcome**

After the refresh, the page should feel more like a canonical GCP pricing page and less like a generic logging tutorial, while still helping the user move from pricing understanding to estimation and validation without losing the page's original usefulness.
