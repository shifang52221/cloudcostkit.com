# CDN Calculator Content Depth Cleanup Design

## Why this exists

The CDN calculator page is one of the site's higher-opportunity pages, but its current structure carries a visible
template-expansion pattern:

- too many `h2` sections for one calculator page
- repeated ideas under different labels
- multiple CTA blocks that say nearly the same thing
- content that is correct, but not editorially selective

This is risky for both users and quality review. A page can look "long" without looking authoritative. When too many
sections repeat the same advice, the page starts to read like generated filler instead of an intentional estimation
workflow.

## Options considered

### Option 1: Leave the page as-is

Pros:

- zero implementation work

Cons:

- keeps the strongest current example of template-like page construction
- weakens trust on a high-value traffic page
- undermines AdSense quality improvement work

### Option 2: Trim only a few repeated bullets

Pros:

- low-risk edit
- faster than a full structural rewrite

Cons:

- does not fix the page's overall "too many sections" problem
- leaves repeated CTAs and overlapping concepts in place

### Option 3: Rebuild the page around fewer, stronger sections

Pros:

- improves editorial quality and scanability
- keeps the calculator usefulness while reducing template feel
- creates a better model for future high-value calculator cleanups

Cons:

- requires more careful content curation

## Recommended approach

Choose Option 3.

Keep the calculator components and core SEO intent, but collapse the repeated support copy into a smaller set of more
intentional sections:

- when to use the calculator
- what to model before trusting the output
- bandwidth and request inputs
- scenario planning and formula
- practical validation and comparison workflow

## Final design

### Scope

Modify only:

- `src/pages/calculators/cdn-cost-calculator.astro`

Add design and implementation notes under `docs/plans/`.

### Structural changes

Reduce the current section count by removing or merging repeated blocks such as:

- duplicate "fast answer" / "short answer" framing
- overlapping "common pitfalls" and "common mistakes"
- repeated "next actions" / "next steps" CTA groups
- fragmented small sections that can be merged into one stronger workflow section

### Content direction

The revised page should sound more like a practitioner checklist and less like an SEO expansion template.

That means:

- fewer headings
- more responsibility per section
- tighter examples
- clearer distinction between edge bandwidth, requests, and origin egress

### Success standard

This cleanup is successful when:

- the page has materially fewer sections
- duplicated ideas are merged or removed
- the page still supports CDN pricing, comparison, and estimation intent
- the page reads like a curated workflow instead of a stacked template
