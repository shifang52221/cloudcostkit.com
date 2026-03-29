# Storage and Growth Calculator Cluster Depth Cleanup Design

## Why this batch exists

The next strong candidate for thin-page cleanup is the storage-growth cluster:

- `aws-rds-cost-calculator`
- `database-storage-growth-cost-calculator`
- `aws-ebs-snapshot-cost-calculator`
- `log-retention-storage-cost-calculator`

These pages are all commercially meaningful and indexable, but they still lean on repeated bottom sections that make
 different storage problems read too similarly. This is risky because storage pages are easy to mass-produce around
"GB x retention x price" or "growth x price" patterns unless each page is clearly tied to its own billing boundary.

## Scope of this batch

This batch covers:

- `src/pages/calculators/aws-rds-cost-calculator.astro`
- `src/pages/calculators/database-storage-growth-cost-calculator.astro`
- `src/pages/calculators/aws-ebs-snapshot-cost-calculator.astro`
- `src/pages/calculators/log-retention-storage-cost-calculator.astro`

## Problem pattern

These four pages all deal with stored data, but they should not feel interchangeable.

Their real roles are different:

- `aws-rds-cost-calculator`: one managed database bill made of compute, primary storage, backup storage, and I/O behavior
- `database-storage-growth-cost-calculator`: forward-looking capacity-growth modeling over time
- `aws-ebs-snapshot-cost-calculator`: incremental changed-block retention, not full-volume duplication every day
- `log-retention-storage-cost-calculator`: steady-state retained log volume shaped by per-source retention policy and hot-window discipline

The current repeated tails flatten these distinctions into one shared calculator shell. That weakens originality and
reduces the practical value of pages that should help users reason through very different storage economics.

## Options considered

### Option 1: Reword the repeated tails only

Pros:

- quick
- reduces exact duplication

Cons:

- preserves the same template structure
- still reads like lightly edited page variants

### Option 2: Strip supporting prose down to minimum

Pros:

- removes obvious repetition
- lowers editorial weight

Cons:

- weakens key indexable pages that need explanation
- risks making storage pages too thin for quality review

### Option 3: Rebuild each page around its actual growth boundary

Pros:

- makes each page clearly different in purpose
- supports SEO and AdSense remediation better
- gives users a more useful model for why the bill grows

Cons:

- requires careful page-specific rewriting

## Recommended approach

Choose Option 3.

Treat this cluster as four different storage-growth questions:

1. What does a managed database bill actually consist of?
2. How fast is stored data growing over time?
3. How much changed data is accumulating in snapshots?
4. How does daily log volume turn into retained storage cost?

Each page should explain one of those questions in its own language instead of inheriting a generic calculator tail.

## Final design

### Shared rule

Keep:

- current calculator widgets
- FAQs and related links
- useful scenario tables when they still add value

Replace:

- repeated inputs / interpretation / mistakes / validation sections
- filler prose that could fit almost any storage calculator
- blended language that confuses retained data, changed data, and active storage

### Page-specific rewrites

#### AWS RDS Cost Calculator

Rebuild the tail around RDS as a four-part bill:

- database compute
- primary storage
- backup storage
- I/O or workload-driven variable cost

The supporting prose should emphasize:

- backup retention and churn as a hidden growth layer
- why I/O spikes should not be confused with instance sizing problems
- how read replicas, Multi-AZ, and backup policy expand the total surface

#### Database Storage Growth Cost Calculator

Rebuild the tail around growth forecasting rather than current-size estimation.

This page should emphasize:

- average GB as the budgeting number
- growth slope and horizon length as the primary modeling levers
- why indexes, replicas, and retention rules can make real growth diverge from raw table growth

#### AWS EBS Snapshot Cost Calculator

Rebuild the tail around incremental changed-block storage.

This page should emphasize:

- daily churn, not full volume size alone
- retention as the multiplier on accumulated changed data
- one-time rebuilds or backfills as snapshot-cost spikes

#### Log Retention Storage Cost Calculator

Rebuild the tail around retained log policy rather than generic storage arithmetic.

This page should emphasize:

- GB/day by source instead of blended logging averages
- different retention windows for access, application, and audit logs
- the difference between hot indexed retention and colder long-term retention strategy

## Success criteria

This batch is successful when:

- each page is clearly identifiable by its own storage-growth boundary in the first prose block
- old template headings are gone from all four target pages
- the cluster reads like four different storage models instead of one repeated template
- touched files remain ASCII-only and the site still passes `check` and `build`
