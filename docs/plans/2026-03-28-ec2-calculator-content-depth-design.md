# EC2 Calculator Content Depth Cleanup Design

## Why this exists

The EC2 calculator page is valuable and relevant, but the supporting content still shows a template-stacking pattern:

- too many small `h2` sections for one planning workflow
- overlapping sections about mistakes, validation, and reconciliation
- repeated advice split across different labels instead of presented as one strong estimate workflow

That structure does not make the page inaccurate, but it does make it feel more generated than curated. For quality
review, especially under AdSense low-value scrutiny, this weakens the editorial signal of a page that should instead
feel like a practical finance and platform planning tool.

## Options considered

### Option 1: Leave the page unchanged

Pros:

- no implementation work

Cons:

- preserves one of the clearer remaining template-like calculator pages
- leaves repetitive sectioning on a high-opportunity EC2 page

### Option 2: Trim a few bullets but keep the structure

Pros:

- lower effort
- lower rewrite risk

Cons:

- does not solve the fragmented reading experience
- still leaves too many overlapping section headings

### Option 3: Merge the repeated sections into a tighter EC2 planning workflow

Pros:

- improves readability and authority
- keeps the useful finance and infrastructure guidance
- reduces template feel without weakening search intent

Cons:

- requires deliberate restructuring

## Recommended approach

Choose Option 3.

Keep the calculator itself and the strong EC2 estimation intent, but rebuild the support copy into fewer sections that
carry more editorial weight:

- when to use the calculator
- what matters in an EC2 estimate
- how to pick inputs and a blended rate
- scenario planning and reconciliation
- failure patterns and next actions

## Final design

### Scope

Modify only:

- `src/pages/calculators/ec2-cost-calculator.astro`

Add design and implementation notes under `docs/plans/`.

### Structural changes

Merge or remove overlapping sections such as:

- fast answer
- result interpretation
- common mistakes
- accuracy checklist
- failure patterns
- reconciliation order

### Content direction

The revised page should feel like an experienced FinOps or platform lead explaining how to build a reliable EC2 compute
estimate, not like a generic template that adds more headings for coverage.

### Success standard

This cleanup is successful when:

- the page has fewer sections
- repeated advice is merged into stronger guidance
- the page still supports EC2 cost estimation, purchase-mix thinking, and baseline-vs-peak planning
- the page feels more editorially intentional and less template-driven
