# GCP Cloud SQL Pricing Refresh Design

**Context**

`gcp-cloud-sql-pricing` already has solid estimation content and a useful capacity-plus-data framing, but its first screen still behaves more like a practical worksheet than a canonical Cloud SQL pricing destination. In the 2026-06-18 Search Console review, the page remained one of the GCP pricing pages with meaningful visibility and weak click conversion, which makes it a good candidate for a pricing-intent refresh rather than a role rewrite.

The page should stay a Cloud SQL pricing page. It should not drift into:

- a generic database parent guide
- a backup-retention specialist page
- a network-transfer explainer

**Goal**

Make the page answer Cloud SQL pricing intent earlier by surfacing Google Cloud-native billing boundaries before the current estimation workflow begins.

**User Intent Priority**

Approved direction by continuation and current batch pattern: `price-structure first`

That means the first screen should tell a searcher quickly:

- what Cloud SQL actually bills on
- whether the bill is mainly capacity, storage plus backups, or network-sensitive access
- which nearby services belong beside the Cloud SQL bill rather than inside it

**Approach Options**

### Option 1: Price-structure first

Add a compact `Quick pricing read` section near the top that explains instance shape, HA, storage, backups, network, and adjacent services such as exports, BigQuery, or application layers before the existing estimation steps.

**Pros**

- Strongest match for `cloud sql pricing`
- Best trust and first-screen clarity improvement
- Preserves the estimation sections that already work

**Cons**

- Needs careful phrasing so the page stays Cloud SQL-specific instead of becoming a broader database budgeting page

### Option 2: Capacity-risk first

Lead with the mistake pattern: average utilization, forgotten HA, forgotten replicas, and silent backup growth.

**Pros**

- Strong for operators trying to explain an unexpectedly high bill
- Feels practical quickly

**Cons**

- Slightly weaker direct match for pricing-intent SERPs
- Risks sounding like an optimization diagnosis page

### Option 3: Estimate-workflow first

Lead with the instance-hours + storage + backups + egress estimate flow and calculator handoff.

**Pros**

- Good for modeling-oriented users

**Cons**

- Weakest canonical pricing-page signal
- Too close to a worksheet helper rather than a pricing destination

**Decision**

Use **Option 1: price-structure first**.

This best matches current search opportunity and stays consistent with the Cloud Run, Cloud Logging, and WAF refreshes already completed in this batch.

**Content Design**

The revised page should:

- sharpen the title and meta description toward real pricing intent
- add a `Quick pricing read` section near the top
- explain Cloud SQL-native billing structure earlier: instance shape, HA, replicas, storage, backups, and network-sensitive access
- make clear that exports, analytics scans, application retries, or adjacent storage should stay beside the Cloud SQL bill unless the page is intentionally modeling the broader system
- preserve the current compute, storage, backups, network, validation, and related-guide sections

**Editorial Boundaries**

The page should continue to own:

- Cloud SQL bill shape
- provisioned capacity exposure
- storage and backup exposure
- network-bound access exposure

The page should not absorb:

- general database system budgeting that belongs elsewhere
- deep backup-retention workflow specialization
- generic egress diagnostics

**Testing Strategy**

Add or expand tests so the page is locked to the new first-screen pricing cues:

- `Quick pricing read`
- instance / HA / replica language
- storage / backup / network separation
- adjacent-cost separation
- updated title and SERP promise

**Expected Outcome**

After the refresh, the page should feel more like a canonical GCP database pricing page and less like a practical worksheet opening, while still keeping the estimation and validation depth that already makes it useful.
