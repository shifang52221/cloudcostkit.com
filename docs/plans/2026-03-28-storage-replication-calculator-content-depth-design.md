# Storage Replication Calculator Content Depth Cleanup Design

## Why this exists

The storage replication calculator page has the same pattern we already removed from other high-value calculator pages:

- too many small support sections
- repeated guidance about interpretation, validation, and mistakes
- helpful ideas split into labels that feel template-driven instead of editorially intentional

This is especially noticeable on a replication page because users need one clean answer to a simple question: what
actually drives monthly replication cost? When the page fragments that answer across many headings, it reads more like
expanded scaffolding than a curated estimation workflow.

## Options considered

### Option 1: Leave the page unchanged

Pros:

- no implementation work

Cons:

- preserves a visible template-style calculator page
- weakens the consistency of the higher-quality calculator cluster

### Option 2: Remove a few repeated bullets only

Pros:

- faster
- lower rewrite risk

Cons:

- does not fix the fragmented structure
- keeps too many overlapping headings in place

### Option 3: Rebuild the support copy into a tighter replication workflow

Pros:

- improves readability and authority
- keeps the useful replication-specific insights
- aligns this page with the stronger calculator structure used in recent cleanups

Cons:

- requires more deliberate section merging

## Recommended approach

Choose Option 3.

Keep the calculator component and search intent, but reorganize the support copy into a smaller number of stronger
sections:

- when the calculator is useful
- changed GB vs total stored GB
- SRR vs CRR and billing boundaries
- scenario planning and validation
- replication intent and common failure patterns
- next actions

## Final design

### Scope

Modify only:

- `src/pages/calculators/storage-replication-cost-calculator.astro`

Add design and implementation notes under `docs/plans/`.

### Structural changes

Merge or remove overlapping sections such as:

- result interpretation
- common mistakes
- validate after changes
- replication intent matrix
- billing boundary checklist
- common failure patterns

### Content direction

The revised page should read like a practical replication-planning checklist, focused on changed GB, replication mode,
and adjacent billing lines, not like a generic long calculator page.

### Success standard

This cleanup is successful when:

- the page has fewer headings
- repeated validation and mistake framing is merged into stronger sections
- the user can clearly distinguish changed GB, replica storage, and one-time backfill effects
- the page feels more curated and less templated
