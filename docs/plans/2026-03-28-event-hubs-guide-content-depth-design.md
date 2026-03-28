# Event Hubs Guide Content Depth Cleanup Design

## Why this exists

The Azure Event Hubs pricing guide targets a promising query, but the current page is too fragmented:

- 14 `h2` sections on one guide
- several sections repeat the same planning ideas with different labels
- quick model, template, pitfalls, validation, and related tools all sit as separate small blocks

The underlying topic is useful because Event Hubs estimates often fail in the same places: burst traffic, replay-heavy
consumer patterns, retention drift, and downstream amplification. The issue is not missing information. The issue is
that the page reads too much like a standard SEO outline instead of a stronger operator-oriented budgeting guide.

## Options considered

### Option 1: Trim a few sections and keep the rest

Pros:

- low effort

Cons:

- keeps the strongest template signals
- still leaves the page over-segmented

### Option 2: Rewrite the page entirely

Pros:

- maximum freedom

Cons:

- higher risk of losing useful Event Hubs-specific planning guidance

### Option 3: Rebuild around a tighter Event Hubs cost workflow

Pros:

- keeps the best topic-specific guidance
- removes repeated sections
- makes the page feel more deliberate and practical

Cons:

- requires careful consolidation

## Recommended approach

Choose Option 3.

Keep the guide centered on the cost workflow teams actually need:

- how to model stream volume from bytes, not just event count
- why retention and replay behavior matter together
- how consumer lag, reprocessing, and downstream pipelines change the real bill
- how to validate burst windows and replay multipliers before trusting the estimate

## Final design

### Scope

Modify only:

- `src/pages/guides/azure-event-hubs-pricing.astro`

Add supporting docs under `docs/plans/`.

### Structural changes

Merge or remove overlapping sections such as:

- short answer
- what to put into estimate first
- quick model
- define stream scope
- worked estimate template
- common pitfalls
- how to validate
- related tools

### Content direction

The revised page should read like a practical Event Hubs budgeting guide for teams planning real stream workloads,
consumer groups, and replay behavior. It should feel less like a sequence of SEO content blocks and more like a guide
that explains how the cost model behaves in production.

### Success standard

This cleanup is successful when:

- the page has materially fewer headings
- replay and downstream amplification are explained as core cost logic, not as a side note
- retention, burst ingestion, and validation are merged into stronger editorial sections
- the page feels more original, more trustworthy, and less templated
