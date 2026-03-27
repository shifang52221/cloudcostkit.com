# Calculators Cluster Layout Fix Design

## Why this exists

The `Search-led cluster paths` section on the calculators hub is currently rendering poorly on production.

The problem is not content quality. The problem is layout behavior:

- the three cards are forced into equal `col-4` widths
- the copy inside those cards is longer than a narrow three-column layout can comfortably support
- the button row gets squeezed and wraps into a visually broken stack

That makes the section look unfinished even though the underlying content is useful.

## Options considered

### Option 1: Shorten the copy and button labels only

Pros:

- smallest copy-only edit

Cons:

- does not fix the structural layout weakness
- likely breaks again at nearby viewport widths
- reduces clarity just to fit a brittle layout

### Option 2: Change the global grid and column behavior

Pros:

- could improve other sections using the same classes

Cons:

- too risky for a small production fix
- can cause regressions across other calculators and guide pages
- harder to validate quickly

### Option 3: Add a section-specific responsive layout

Pros:

- fixes the exact broken area without touching global layout primitives
- allows cards to respect a minimum readable width
- keeps the current content and hierarchy intact

Cons:

- adds a small amount of local styling to one page

## Recommended approach

Choose Option 3.

Keep the existing section content and CTA intent, but stop relying on the generic `col-4` layout for this block. Give the
cluster cards their own responsive grid and their own internal flex layout so the buttons stay readable.

## Final design

### Scope

Only modify:

- `src/pages/calculators/index.astro`

Do not change the site's shared `.grid`, `.col-4`, or `.btn` behavior globally.

### Layout changes

Replace the current generic three-column card structure with:

- a dedicated `cluster-grid` container
- cards with a minimum width and auto-fit behavior
- a vertical card layout so content and CTA rows are visually stable

### Card structure

Each cluster card should have:

- title
- description
- CTA row pinned toward the bottom of the card

This keeps cards aligned even when descriptions differ in length.

### Button behavior

The CTA row should:

- allow wrapping when needed
- maintain readable spacing
- avoid collapsing into narrow single-word button stacks

### Responsive behavior

Expected rendering:

- desktop: three balanced cards when width allows
- mid-width screens: cards reflow to two columns or wider single cards rather than crushing content
- mobile: one card per row with full readable CTA buttons

## Success standard

This fix is successful when:

- the `Search-led cluster paths` section no longer appears cramped or broken
- card widths stay readable across desktop and mobile
- button labels remain legible and usable
- no global layout behavior is changed outside this section
