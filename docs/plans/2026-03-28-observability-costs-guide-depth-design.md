# Observability Costs Guide Depth Cleanup Design

## Why this exists

The observability costs guide is a high-level parent page, but it still behaves too much like a topic hub:

- it imports `GUIDES` and renders a large "More observability guides" grid
- the page body is short relative to the breadth of the topic
- it gestures at logs, metrics, and traces without fully owning the cross-signal cost model

For a parent page that sits above logging, metrics, tracing, dashboards, and incident query behavior, the current
structure makes it feel more like a navigation page than a true editorial destination.

## Options considered

### Option 1: Keep the page hub-like and lightly expand it

Pros:

- low effort

Cons:

- preserves the strongest template and hub signals
- leaves the page lighter than its role implies

### Option 2: Demote the page

Pros:

- removes pressure to make the page own a broad topic

Cons:

- weakens the top-level observability workflow
- pushes too much shared framing into provider-specific child pages

### Option 3: Rebuild it as the site's cross-signal observability cost framework

Pros:

- gives the page a stronger editorial role
- improves how logs, metrics, traces, and query behavior relate to each other
- removes the hub feel while keeping useful handoff paths

Cons:

- requires deliberate restructuring

## Recommended approach

Choose Option 3.

Keep the page indexable, but make it clearly own the generic observability budgeting workflow:

- signal families: logs, metrics, traces
- ingestion, retention, and query behavior
- cardinality and label explosion
- dashboards, alerts, and incident-time amplification
- governance, validation, and when to hand off to narrower pages

## Final design

### Scope

Modify only:

- `src/pages/guides/observability-costs.astro`

Add supporting docs under `docs/plans/`.

### Structural changes

Remove or replace:

- `GUIDES` import
- `obsGuides` derived grid
- "Related tools" as a thin CTA block near the middle of the page
- "More observability guides" hub grid

Replace them with a stronger editorial structure that treats this page as the parent observability framework.

### Content direction

The revised page should read like a cross-signal observability cost model for teams trying to understand which signal
family is driving spend and how governance, incident behavior, and query patterns change the bill.

### Success standard

This cleanup is successful when:

- the page no longer reads like an observability guide index
- the relationship between logs, metrics, traces, and query behavior is clear
- the page has stronger ownership of governance and incident amplification
- the page feels more original, more useful, and more defensible as a standalone destination
