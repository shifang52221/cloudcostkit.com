# Governance Language Hardening Design

## Why this round exists

The previous two trust-signal rounds achieved two important goals:

- the site now exposes a visible trust path
- the trust pages now describe real maintenance behavior and correction handling

That is meaningful progress. The remaining opportunity is subtler:

some trust-page sections still sound like careful explanations of policy rather than decisive site-governance rules.

For a reviewer evaluating site quality, this distinction matters. A site feels more credible when it not only explains
its standards, but also communicates what happens when content no longer deserves strong visibility, independent status,
or user trust.

## What problem this round solves

This round focuses on "governance language hardening." That means:

- less values language
- fewer soft general statements
- more explicit decision rules
- clearer consequences when a page or estimate is no longer good enough

The goal is not to sound harsh for its own sake. The goal is to sound governed, reviewable, and operationally real.

## Scope

This round stays intentionally narrow and only refines four existing trust pages:

- `src/pages/about.astro`
- `src/pages/editorial-policy.astro`
- `src/pages/methodology.astro`
- `src/pages/contact.astro`

It does not change:

- homepage trust entry points
- shared layout or footer
- calculator layouts
- guide layouts
- privacy or legal pages

## Design goals

After this round, the trust pages should communicate:

1. that page quality is judged by task ownership, not only by topic relevance
2. that a page can remain live but still lose strong recommendation status
3. that not every report leads to the same kind of action
4. that "reviewed" and "safe to rely on" are related but not identical concepts
5. that incomplete or low-specificity reports are harder to act on

## Recommended approach

### Option 1: keep adding more process detail

Pros:

- adds more operational information

Cons:

- risks making the pages long and bureaucratic
- does not necessarily make them sound more decisive

### Option 2: rewrite targeted sections with stronger decision language

Pros:

- best ratio of clarity to scope
- reduces template feel without adding new pages
- communicates governance more directly

Cons:

- requires precision so the language remains credible

### Option 3: add more branding or editorial voice

Pros:

- could make pages sound more distinct

Cons:

- can drift back toward promotional tone
- does not directly solve governance clarity

## Recommendation

Choose Option 2.

The site already has enough trust-page surface area. The better next step is to sharpen a few high-value sections so
they read like real editorial and maintenance rules, not gentle summaries.

## Page-level design

### About

About should shift from descriptive maintenance language toward stronger page-quality judgment language.

Key change:

- make it clearer that not every surviving page deserves independent emphasis
- make it explicit that weak pages lose strong placement before they are necessarily removed
- clarify that strong correction reports can reveal role failure, not just sentence-level mistakes

### Editorial Policy

Editorial Policy should become more rule-like where it already discusses review and prominence.

Key change:

- convert soft statements about overlap, revision, and prominence into clearer operational outcomes
- distinguish "page still exists" from "page still merits recommendation"
- make correction handling look like a classification and action system, not a general review promise

### Methodology

Methodology should tighten the distinction between:

- reviewed
- usable
- safe to rely on

Key change:

- strengthen the language around when a model stops being suitable as the primary decision tool
- reinforce that review confirms page-role integrity, not universal correctness

### Contact

Contact should read more like an intake gate with realistic handling limits.

Key change:

- clarify that low-specificity reports are harder to act on
- make it explicit that review does not guarantee full adoption of every suggestion
- keep the tone usable and professional rather than defensive

## Content principles

To avoid sounding mechanical or punitive, the rewrite should follow these rules:

- prefer plain decision language over abstract principles
- talk about consequences, not posture
- keep sections short and readable
- avoid repeating the same governance point on multiple pages unless the framing is page-specific
- keep the voice firm but not combative

## Success criteria

This round is successful when:

- About sounds more like a content-governance page for site quality
- Editorial Policy is more explicit about recommendation loss and review outcomes
- Methodology more clearly separates reviewed status from safe-use status
- Contact more clearly communicates triage limits and realistic outcomes
- tests, check, and build still pass

