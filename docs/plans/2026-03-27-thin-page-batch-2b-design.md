# Thin Page Batch 2B Design

## Why this batch exists

Batch 1 removed the clearest thin hubs and helper estimators from the indexable surface.

Batch 2A resolved duplicate-intent pages where weaker URLs competed with stronger parent destinations.

The next problem is different: some broad topic guides are still indexable, but they read more like reusable hub templates
than pages with a clear editorial job. That is a quality risk for both search and AdSense review because the pages look
organized, but do not yet prove enough topic ownership.

This batch focuses on:

- `src/pages/guides/metrics-costs.astro`
- `src/pages/guides/serverless-costs.astro`

## Diagnosis

### Metrics costs

Current strengths:

- useful topic
- real calculator support
- relevant to observability decision-making

Current problems:

- too short for the breadth implied by the title
- reads like a light hub under `observability-costs`
- the extra "more guides" grid reinforces taxonomy behavior rather than editorial ownership

### Serverless costs

Current strengths:

- real demand topic
- useful cross-links into request, log, and egress workflows
- good candidate for a cross-provider architecture page

Current problems:

- too generic relative to Lambda, Cloud Run, Functions, and Fargate provider pages
- currently behaves more like a connective overview than a decision-owning guide
- the extra "more guides" grid again makes it feel like a topic router more than a standalone page

## Design goals

- keep both URLs indexable for now, but make them earn standalone status
- remove the "template hub" feeling
- give each page a narrower and more defensible editorial role
- reduce internal prominence by making these pages specialized deep dives instead of generic routing pages

## Recommended approach

### Metrics costs: turn it into a metrics-governance deep dive

Primary role:

- the page should own the metrics-specific budgeting problem
- it should no longer act like a mini observability index

What the page should clearly cover:

1. how series count is created and multiplied
2. which labels create runaway cardinality
3. how resolution, retention, alerts, and dashboards affect the bill
4. how to run a metrics-governance review that actually reduces cost without losing signal

Structural changes:

- remove the page-level "more metrics guides" grid
- add substantive sections with examples, review workflow, and prioritization logic
- keep calculators, but frame them as tools inside the workflow rather than the page's main reason to exist

Relationship to `observability-costs`:

- `observability-costs` remains the broader cross-signal parent
- `metrics-costs` becomes the specialized deep dive for cardinality, resolution, and metric hygiene

### Serverless costs: turn it into a cross-provider workload-model guide

Primary role:

- the page should own the "full serverless system cost" workflow
- it should not behave like a generic landing page for all serverless-related content

What the page should clearly cover:

1. compute billing shape: invocations, duration, memory/CPU allocation, and concurrency
2. amplification: retries, event fan-out, queue deliveries, and downstream calls
3. adjacent cost buckets: logs, metrics, transfer, storage, and managed services
4. when to stay on the cross-provider page vs when to move to provider-specific pricing guides

Structural changes:

- remove the page-level "more serverless guides" grid
- add a clearer workflow and decision checkpoints
- add a provider handoff section so the page feels intentional, not generic

Relationship to `compute-costs`:

- `compute-costs` remains the broader compute parent
- `serverless-costs` becomes the specialized architecture guide for event-driven and request-driven systems

## Internal-link strategy

This batch should not do a large sitewide relink sweep.

Instead it should make a few high-confidence adjustments:

- keep `observability-costs` as the broad parent while making `metrics-costs` feel like a deep dive
- keep `compute-costs` as the broad parent while making `serverless-costs` feel like a specialized branch
- avoid adding new broad "more guides" hub patterns inside the two target pages

## Success standard

This batch is successful when:

- `metrics-costs` no longer reads like a short metrics hub, but like a defensible guide for metrics budgeting and
  cardinality governance
- `serverless-costs` no longer reads like a generic serverless overview, but like a cross-provider cost-model page for
  real architectures
- both pages feel materially less template-driven
- both pages still support the broader site structure without acting like weak taxonomy pages
