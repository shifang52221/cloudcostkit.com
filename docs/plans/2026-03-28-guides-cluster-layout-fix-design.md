# Guides Cluster Layout Fix Design

## Why this exists

The guides hub still contains a section that uses the same brittle three-card `col-4` layout pattern that was already
causing visible issues on the calculators hub.

The risk is the same:

- cards are forced into equal narrow widths
- copy length is too high for a rigid three-column layout at mid-range screen sizes
- CTA rows can look cramped and unstable

Even if the problem is not yet as obvious as the calculators hub issue, this section has the same structural weakness and
should be corrected before it turns into another visible production defect.

## Options considered

### Option 1: Leave it alone until it breaks more obviously

Pros:

- zero immediate work

Cons:

- reactive instead of preventative
- leaves a known fragile layout pattern in production
- likely creates another user-visible polish issue later

### Option 2: Change global grid behavior

Pros:

- one change could affect multiple pages

Cons:

- unnecessary risk for a small targeted fix
- could regress many unrelated guide and calculator layouts

### Option 3: Apply the same local responsive fix pattern to the guides hub

Pros:

- small, predictable, and consistent with the calculators hub repair
- removes the fragile `col-4` dependency from this section only
- keeps existing guide cluster content and navigation intact

Cons:

- adds another small local style block

## Recommended approach

Choose Option 3.

Use the same section-scoped layout strategy as the calculators hub fix:

- dedicated responsive grid
- card-level vertical layout
- CTA row that wraps cleanly without collapsing into a broken stack

## Final design

### Scope

Only modify:

- `src/pages/guides/index.astro`

Do not alter shared `.grid`, `.col-4`, or global button behavior.

### Layout changes

Replace the current `Most-searched guide clusters right now` three-card block with:

- a dedicated `guide-cluster-grid`
- cards using a minimum readable width
- internal card layout that separates copy from CTA actions

### Responsive behavior

Expected rendering:

- wide screens: three balanced cards when space allows
- medium screens: cards reflow before becoming too narrow
- mobile: one card per row with readable CTA buttons

### Success standard

This fix is successful when:

- the guides hub cluster section no longer relies on a fragile narrow `col-4` layout
- card widths stay readable across desktop and mobile
- CTA buttons remain legible and usable
- the change is isolated to the guides hub section only
