# Weekly Growth Operating System Design

Date: 2026-03-12

## Goal

Turn the site's Search Console-driven growth work into a repeatable weekly operating system so future optimization work is:

- easier to run
- easier to prioritize
- easier to compare week to week

## Why This Is the Right Next Step

The site now has:

- a working Search Console baseline
- several completed growth waves
- a documented set of opportunity clusters
- a cleaner understanding of what kinds of page changes help

At this point, the main risk is not lack of ideas. The main risk is losing rhythm.

Without a repeatable weekly system, future work will drift back toward:

- ad hoc page edits
- inconsistent priority choices
- weak week-to-week learning

## Approaches Considered

### Approach 1: Weekly operating system with checklist and template

Pros:

- most practical
- low maintenance
- easy to hand off or reuse
- keeps growth work small-batch and comparable

Cons:

- depends on disciplined weekly use

### Approach 2: One narrative operating note only

Pros:

- fast to write
- low complexity

Cons:

- harder to reuse consistently
- does not force decision discipline

### Approach 3: Heavy data workbook or internal dashboard spec

Pros:

- could support deeper reporting later

Cons:

- too heavy for the current stage
- slower to maintain than the site's current optimization cadence needs

## Recommendation

Use Approach 1.

The site needs a lightweight weekly system, not a heavyweight reporting product. A checklist plus a reusable template is enough to keep momentum and improve decision quality.

## Design

### 1. One weekly checklist

This should answer:

- what data to export
- what lists to refresh
- how to choose this week's batch
- what verification to run
- what to log after changes ship

It should be short enough to use every week without friction.

### 2. One reusable weekly review template

This should answer:

- what changed in the latest export
- which pages are click-earning, near-winning, or low-CTR
- what batch was selected this week
- what changes were shipped
- what should happen next week

It should be copyable into a dated file or weekly note.

### 3. Strong batching rules

The weekly system should keep the site on a narrow, sustainable batch size:

- 2 guide pages
- 2 calculator pages
- 1 site-level UX or internal-linking improvement

This is enough to create movement without destroying signal clarity.

### 4. Decision logic that matches the site's current maturity

The system should prefer work in this order:

1. protect click-earning pages
2. improve pages already in positions 8-30
3. improve high-impression low-CTR pages
4. only then consider expansion work

## Deliverables

This pass should create:

- a weekly checklist document
- a reusable weekly review template
- an implementation plan that explains where these files live and how to use them

## Success Criteria

This pass is successful if:

- next week's work can be run without reinventing the process
- batch selection rules are explicit
- weekly review notes can be created with low friction
- the system reinforces the site's current Search Console-driven strategy

## Scope Guardrails

- Do not build a heavy reporting system.
- Do not add unnecessary tooling.
- Keep this operational and easy to reuse.
- Prefer markdown-based process assets that live with the repo.
