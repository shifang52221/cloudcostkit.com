# Egress Calculator Content Depth Cleanup Design

## Why this exists

The data egress calculator page covers the right ideas, but the page structure still feels too segmented and template-like:

- too many `h2` sections for one calculator workflow
- repeated advice split into "tips", "result interpretation", "validation", and "sanity checks"
- several sections that could be stronger if merged into one practical transfer-boundary workflow

This is especially risky on an egress page because users need clarity, not section count. When the structure becomes too
fragmented, the page reads more like an SEO expansion template than a disciplined networking cost guide.

## Options considered

### Option 1: Leave the page as-is

Pros:

- zero work

Cons:

- keeps a visible remaining example of template-style structure
- weakens perceived page quality on a high-intent topic

### Option 2: Shorten some lists without changing the page structure

Pros:

- smaller edit
- lower rewrite risk

Cons:

- does not fix the fragmented reading flow
- repeated section headings still signal templated content

### Option 3: Rebuild the page around a tighter egress-boundary workflow

Pros:

- improves usability and editorial quality
- keeps the important networking distinctions intact
- reduces template feel while preserving SEO intent

Cons:

- requires careful merging of related guidance

## Recommended approach

Choose Option 3.

Keep the calculator component and strong search intent, but reorganize the support copy into fewer, clearer modules:

- when this calculator is useful
- how to define the transfer boundary and choose rates
- scenario planning and validation
- dominant-path levers and common failure patterns
- next actions

## Final design

### Scope

Modify only:

- `src/pages/calculators/data-egress-cost-calculator.astro`

Add design and implementation notes under `docs/plans/`.

### Structural changes

Merge or remove overlapping sections such as:

- fast answer
- tips
- result interpretation
- common mistakes
- validate after changes
- sanity checks before sign-off

### Content direction

The revised page should feel like a networking cost workflow for someone tracing where transfer charges actually come
from, not like a long template assembled from generic support sections.

### Success standard

This cleanup is successful when:

- the page has materially fewer sections
- repeated validation and mistake guidance is merged into clearer blocks
- transfer-boundary logic becomes easier to follow
- the page feels more curated and less templated
