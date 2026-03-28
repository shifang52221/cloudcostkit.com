# Compute Costs Guide Depth Cleanup Design

## Why this exists

The compute costs guide is an important parent page, but it still behaves too much like a themed hub:

- it imports `GUIDES` and renders a large "More compute guides" grid
- the body is only a few short sections
- the page introduces good ideas but does not yet own a strong cross-workload compute cost model

That makes the page feel lighter than its prominence suggests. For a parent guide that sits above instances,
containers, serverless, and adjacent spend, the current structure is too close to a navigation page and not strong
enough as an editorial destination.

## Options considered

### Option 1: Keep the page as a hub and lightly expand it

Pros:

- low effort

Cons:

- keeps the strongest hub-template signals
- does not improve the page's authority enough

### Option 2: Noindex or demote it

Pros:

- removes pressure to make the page own a broad topic

Cons:

- weakens the top-of-funnel compute workflow
- leaves more burden on lower-level provider pages to explain shared compute logic

### Option 3: Rebuild it as the site's cross-workload compute cost framework

Pros:

- gives the page a clear role that is more defensible and useful
- reduces the hub feel by removing the large guide grid
- improves the relationship between instances, containers, serverless, and adjacent cost drivers

Cons:

- requires deliberate editorial restructuring

## Recommended approach

Choose Option 3.

Keep the page indexable, but make it clearly own the generic compute budgeting workflow:

- compute billing shapes across instances, containers, and serverless
- baseline capacity versus peak headroom
- utilization, idle waste, and packing efficiency
- adjacent networking, load-balancer, and observability spend
- commitment and purchasing decisions
- validation rules before trusting the estimate

## Final design

### Scope

Modify only:

- `src/pages/guides/compute-costs.astro`

Add supporting docs under `docs/plans/`.

### Structural changes

Remove or replace:

- `GUIDES` import
- `computeGuides` derived grid
- "Related tools" as a thin CTA block near the middle of the page
- "More compute guides" hub grid

Replace them with a stronger editorial structure that treats this page as the parent compute framework.

### Content direction

The revised page should read like a cross-workload compute cost model for teams comparing VMs, containers, and
serverless systems. It should explain where compute spend comes from, how adjacent costs distort the picture, and when
to hand off to narrower pages.

### Success standard

This cleanup is successful when:

- the page no longer reads like a mini guide index
- the compute cost workflow is clear across multiple workload shapes
- the relationship to serverless, Kubernetes, and networking/logging pages is more intentional
- the page feels stronger, more original, and more useful for budget planning
