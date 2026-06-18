# GCP Cloud CDN Pricing Refresh Design

**Context**

`gcp-cloud-cdn-pricing` already has practical cost-model content, but its first screen still behaves more like a worksheet opener than a strong Cloud CDN pricing destination. In the 2026-06-18 Search Console review, the page remained part of the near-page-one GCP pricing cluster where stronger first-screen trust and clearer pricing intent could improve click conversion.

The page should stay a Cloud CDN pricing page. It should not drift into:

- a generic CDN parent guide
- a pure origin-egress explainer
- a calculator landing page

**Goal**

Make the page answer Cloud CDN pricing intent earlier by surfacing GCP Cloud CDN billing boundaries before the current edge-bandwidth, requests, and cache-fill workflow sections.

**User Intent Priority**

Approved by continuation and current batch pattern: `price-structure first`

That means the first screen should help a searcher answer quickly:

- what Cloud CDN actually bills on
- whether the bill is mostly edge bandwidth, request shape, or cache-fill pressure
- which adjacent origin or transfer charges belong beside the Cloud CDN bill rather than inside it

**Approach Options**

### Option 1: Price-structure first

Add a compact `Quick pricing read` section near the top that explains edge bandwidth, requests, cache-fill pressure, and adjacent origin ownership before the step-by-step estimate sections.

**Pros**

- Strongest match for `cloud cdn pricing`
- Improves CTR and trust without changing page role
- Preserves the current practical estimate workflow

**Cons**

- Needs careful wording so the page stays Cloud CDN-specific instead of becoming a broad CDN primer

### Option 2: Cache-miss risk first

Lead with how cache misses, purges, and cold-cache events create surprise bills.

**Pros**

- Very relatable to operators with real surprises
- Emphasizes the most common hidden cost driver

**Cons**

- Slightly weaker match for direct pricing-intent SERPs
- Risks sounding too much like a troubleshooting page

### Option 3: Estimate-workflow first

Lead with the bandwidth, requests, and origin egress worksheet flow and calculator handoff.

**Pros**

- Good for modeling-oriented users

**Cons**

- Weaker canonical pricing-page signal
- Too helper-like for a searcher deciding whether the page is authoritative

**Decision**

Use **Option 1: price-structure first**.

This best matches current search opportunity and stays consistent with the Cloud Run, Cloud Logging, Cloud SQL, and WAF refreshes already completed in this batch.

**Content Design**

The revised page should:

- sharpen the title and meta description toward real Cloud CDN pricing intent
- add a `Quick pricing read` section near the top
- explain edge bandwidth, request fees, and cache-fill pressure earlier
- clarify that origin egress and wider transfer ownership should stay beside the Cloud CDN bill when they belong to the origin path
- preserve the current estimate workflow, pitfalls, validation, and tool routing

**Editorial Boundaries**

The page should continue to own:

- Cloud CDN bill shape
- edge bandwidth exposure
- request-shape exposure
- cache-fill and origin-pressure exposure

The page should not absorb:

- general CDN parent-guide framing
- deep origin-egress theory
- generic network-transfer diagnostics

**Testing Strategy**

Add or expand tests so the page is locked to the new first-screen pricing cues:

- `Quick pricing read`
- edge bandwidth / requests / cache-fill separation
- hit-rate or purge behavior cues
- adjacent origin or transfer separation
- updated title and SERP promise

**Expected Outcome**

After the refresh, the page should feel more like a canonical GCP CDN pricing destination and less like a good-but-generic estimate page, while still retaining the practical workflow that already makes it useful.
