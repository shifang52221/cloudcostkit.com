# ACR Guide Content Depth Cleanup Design

## Why this exists

The Azure Container Registry pricing guide targets a strong commercial and operational query, but the current page is
too segmented to feel editorially intentional:

- 17 `h2` sections on one guide
- repeated treatment of calculator inputs, templates, pitfalls, validation, and decision frameworks
- too many short sections that restate the same storage, pull, and egress ideas in slightly different labels

The underlying topic is useful, but the structure reads more like a generated long-form SEO outline than a guide
written for operators comparing registry cost drivers and tier decisions.

## Options considered

### Option 1: Keep the page and only trim copy

Pros:

- low effort

Cons:

- does not remove the strongest template signals
- leaves the guide too fragmented for a high-value topic

### Option 2: Rewrite the whole guide from scratch

Pros:

- maximum structural freedom

Cons:

- higher risk of losing useful ACR-specific guidance already present
- unnecessary for this round

### Option 3: Rebuild the page around a tighter ACR cost workflow

Pros:

- keeps the practical guidance on storage, pulls, egress, and tier selection
- removes repeated sections and improves readability
- better matches the site's current content-depth cleanup pattern

Cons:

- requires deliberate consolidation work

## Recommended approach

Choose Option 3.

Keep the page focused on the real ACR decisions operators make:

- what the tier changes and what it does not
- how storage, pull storms, and egress interact
- when geo-replication or cross-region topology changes the cost shape
- how to validate retention, pull peaks, and billed transfer paths before trusting the estimate

## Final design

### Scope

Modify only:

- `src/pages/guides/azure-container-registry-pricing.astro`

Add supporting docs under `docs/plans/`.

### Structural changes

Merge or remove overlapping sections such as:

- short answer
- define scope
- calculator inputs
- worked estimate template
- common pitfalls
- how to validate
- tier decision framework
- failure patterns
- related tools

### Content direction

The revised page should read like a practical registry cost-planning guide for teams evaluating ACR usage in
production. It should explain why storage, pull behavior, regional topology, and tier choice belong in the same
workflow instead of in many small SEO-style blocks.

### Success standard

This cleanup is successful when:

- the page has materially fewer headings
- repeated ACR planning and validation sections are merged into stronger blocks
- tier decisions are explained alongside workload shape and topology, not as a separate template section
- the guide feels more original, deliberate, and useful for real budgeting work
