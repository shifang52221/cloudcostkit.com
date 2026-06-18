# AWS Aurora Serverless v2 Pricing Refresh Design

**Context**

`aws-aurora-serverless-v2-pricing` already has useful ACU-hours content, but its first screen still behaves more like a capacity worksheet than a strong Aurora pricing destination. In the 2026-06-18 Search Console review, Aurora Serverless v2 remained in the near-page-one cluster with the same pattern as the other GCP and AWS pages we just refreshed: real visibility, weak click conversion, and a first screen that could explain the topic faster.

The page should stay an Aurora Serverless v2 capacity-shape page. It should not drift into:

- the broader Aurora bill anatomy page
- the generic database parent guide
- a backup-retention specialist page

**Goal**

Make the page answer Aurora Serverless v2 pricing intent earlier by surfacing the ACU-hour baseline/peak split and the main surrounding cost boundaries before the current step-by-step estimate workflow begins.

**User Intent Priority**

Approved by continuation and current batch pattern: `price-structure first`

That means the first screen should tell a searcher quickly:

- what Aurora Serverless v2 bills on
- whether the bill is mainly a minimum-capacity baseline problem or a repeated peak-window problem
- which nearby costs belong beside the Aurora Serverless v2 bill rather than inside it

**Approach Options**

### Option 1: Price-structure first

Add a compact `Quick pricing read` section near the top that explains ACU-hours, min and max scaling posture, storage, backups, and adjacent database or application costs before the step-by-step estimate sections.

**Pros**

- Strongest match for `Aurora Serverless v2 pricing`
- Best first-screen trust improvement
- Preserves the current scenario-driven estimator

**Cons**

- Needs careful wording to avoid overlapping with the broader Aurora pricing page

### Option 2: Peak-window first

Lead with the problem of recurring peak windows and frequent ACU spikes.

**Pros**

- Very practical for operators with real usage spikes
- Easy to understand quickly

**Cons**

- Slightly weaker direct match for pricing-intent SERPs
- Risks sounding like a usage-pattern explainer instead of a pricing page

### Option 3: Estimate-workflow first

Lead with the baseline + peak scenario estimation flow and ACU-hours calculation.

**Pros**

- Good for modeling-oriented users

**Cons**

- Weakest canonical pricing-page signal
- Too worksheet-like for a page that needs more trust at the top

**Decision**

Use **Option 1: price-structure first**.

This keeps the page aligned with the other refreshes in the current batch and improves the first-screen pricing signal without changing the page's editorial role.

**Content Design**

The revised page should:

- sharpen the title and meta description toward real Aurora Serverless v2 pricing intent
- add a `Quick pricing read` section near the top
- explain ACU-hours, min capacity, max capacity, and peak windows earlier
- clarify that storage, backups, query-heavy workloads, and surrounding application costs belong beside the Serverless v2 bill when they are not part of ACU-hours themselves
- preserve the current baseline, peak, storage, backup, validation, and related-guide structure

**Editorial Boundaries**

The page should continue to own:

- Aurora Serverless v2 capacity shape
- ACU-hour exposure
- baseline versus peak-window shaping
- storage and backup retention as neighboring cost surfaces

The page should not absorb:

- the full Aurora bill anatomy page
- the broader database budgeting parent guide
- a backup-retention specialization

**Testing Strategy**

Add or expand tests so the page is locked to the new first-screen pricing cues:

- `Quick pricing read`
- ACU-hours / baseline / peak / min-max language
- storage and backup separation
- adjacent database or application cost separation
- updated title and SERP promise

**Expected Outcome**

After the refresh, the page should feel more like a canonical Serverless v2 pricing destination and less like a straight capacity worksheet, while still keeping the practical scenario workflow that already makes it useful.
