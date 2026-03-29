# Storage Cluster Calculators Depth Cleanup Design

## Why this exists

The next visible calculator matrix on the site is the storage cluster:

- `s3-cost-calculator`
- `object-storage-cost-calculator`
- `storage-pricing-calculator`
- `aws-s3-glacier-cost-calculator`
- `storage-replication-cost-calculator`

These pages already cover useful workflows, but several still end with the same generic sections about inputs,
mistakes, scenarios, and validation. That repeated editorial tail weakens the originality of one of the site's largest
topic clusters.

## Scope of this batch

This batch focuses only on:

- `src/pages/calculators/s3-cost-calculator.astro`
- `src/pages/calculators/object-storage-cost-calculator.astro`
- `src/pages/calculators/storage-pricing-calculator.astro`
- `src/pages/calculators/aws-s3-glacier-cost-calculator.astro`
- `src/pages/calculators/storage-replication-cost-calculator.astro`

## Options considered

### Option 1: Lightly reword the repeated tails

Pros:

- quick
- reduces exact duplication

Cons:

- keeps the same matrix architecture
- does not make storage pages feel genuinely different

### Option 2: Keep only the calculator widgets and minimal prose

Pros:

- removes duplicate language quickly

Cons:

- risks making important storage entry pages too shallow
- weakens the editorial guidance that helps both users and reviewers understand boundaries

### Option 3: Rebuild each page around its real storage cost shape

Pros:

- improves originality and page usefulness
- better matches how storage costs actually drift in production
- reduces cluster-wide template signals

Cons:

- requires page-specific rewriting

## Recommended approach

Choose Option 3.

The storage pages should feel different because the cost models are genuinely different:

- S3 cost: combined storage, requests, egress, and replication planning
- Object storage cost: generic GB-month plus request behavior
- Storage pricing: broad commercial framing for GB-month, request fees, and egress
- Glacier / Deep Archive: low steady storage with retrieval-driven spikes and archive rules
- Replication: changed-data flow, replica storage adjacency, and backfill versus steady-state copy

## Final design

### Shared rule

Keep:

- existing calculator components
- page-level FAQs, includes, excludes, and related links
- multi-tool worksheet structure where already present

Replace:

- generic repeated sections at the bottom of the pages

With:

- storage-model-specific measurement guidance
- storage-model-specific failure patterns
- storage-model-specific bill reconciliation
- storage-model-specific next-step interpretation

### Page-by-page direction

#### S3 cost calculator

Rebuild around:

- separating storage, requests, egress, and replication as different lines
- churn versus total stored data
- when request cost matters versus when transfer dominates
- how to reconcile blended object storage bills

#### Object storage cost calculator

Rebuild around:

- generic object storage baseline
- small-object and request-heavy patterns
- how class mix and access patterns distort a simple estimate
- handoff to egress and replication when needed

#### Storage pricing calculator

Rebuild around:

- broad commercial framing of storage GB-month, request fees, and transfer
- blended versus provider-specific pricing assumptions
- when the generic model is sufficient and when it is not

#### AWS S3 Glacier / Deep Archive calculator

Rebuild around:

- quiet archival storage versus retrieval shocks
- many-small-object restores
- retrieval tiers and archive behavior
- early deletion and downstream restore workflow adjacency

#### Storage replication calculator

Tighten the existing stronger page by:

- removing the leftover generic validation bullets
- sharpening the distinction between steady changed-data replication and one-time backfills
- improving the storage-transfer-replica boundary language

### Success standard

This batch is successful when:

- the storage cluster no longer shares a visible repeated appendix
- each page feels tied to a specific storage billing shape
- the site's storage entry pages become more editorially distinct and less matrix-like
