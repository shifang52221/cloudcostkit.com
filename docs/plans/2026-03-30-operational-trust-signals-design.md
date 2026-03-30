# Operational Trust Signals Design

## Why this round exists

The first trust-signal round made the site easier to understand:

- the homepage now exposes a visible trust path
- the footer explains stronger boundaries
- About, Editorial Policy, Methodology, and Contact now communicate clearer roles

That was necessary, but it still leaves one important low-quality-site risk:

the trust pages can still read like well-written policy pages rather than evidence of an actively maintained site.

For AdSense-style review, that difference matters. A reviewer should not only see that trust pages exist. They should
also see signs of ongoing maintenance, correction handling, and responsible ownership.

## What problem this round solves

This round focuses on "operational trust signals." These are the signals that make a site feel maintained by real
people with real review behavior:

- how pages are triaged for review
- what happens after a correction is submitted
- what "reviewed" and "last updated" actually mean
- when a tool or page should stop being trusted or promoted

The goal is to make the trust layer feel less like static policy copy and more like a working operating standard.

## Scope

This round stays intentionally narrow and only deepens four existing pages:

- `src/pages/about.astro`
- `src/pages/editorial-policy.astro`
- `src/pages/methodology.astro`
- `src/pages/contact.astro`

This round does not expand to:

- homepage changes
- footer changes
- large calculator rewrites
- new standalone trust pages

## Design goals

After this round, a reviewer should be able to tell:

1. which pages receive priority review
2. how the site handles different kinds of corrections
3. what counts as a material revision
4. what "reviewed" actually means
5. when an estimate should no longer be used without deeper validation
6. how reports can affect page changes, consolidation, or lower prominence

## Recommended approach

### Option 1: mostly rewrite the existing prose for tone

Pros:

- easy to execute
- improves readability

Cons:

- weak improvement in operational credibility
- risks becoming stylistic without becoming more trustworthy

### Option 2: add explicit maintenance and correction-handling sections

Pros:

- strongest operational signal
- directly answers review questions a human evaluator would have
- improves trust without creating more pages

Cons:

- requires care to avoid sounding invented or performative

### Option 3: add named authors or personal identities immediately

Pros:

- can create stronger ownership signals

Cons:

- risky if the site does not want to commit to that identity model yet
- not necessary to strengthen reviewability today

## Recommendation

Choose Option 2.

The site can become much more credible by explaining how maintenance actually works, without inventing a heavier author
model or creating more policy pages.

## Page-level design

### About

About should explain how maintenance works in practice, not only what the site is for.

New emphasis:

- which kinds of pages are prioritized for review
- how the site decides a page is no longer good enough
- what kinds of correction reports actually trigger change

This gives About a stronger operational identity instead of stopping at mission and boundaries.

### Editorial Policy

Editorial Policy should own the post-submission workflow and the meaning of material revision.

New emphasis:

- what happens after a correction is submitted
- how issues are classified
- what counts as a material revision
- when a page may stay live but lose prominence

This makes the page feel like a real maintenance rulebook instead of only a publication standard.

### Methodology

Methodology should clarify the meaning of review labels and safe-use limits.

New emphasis:

- what "reviewed" means on this site
- what "last updated" does and does not mean for a model
- when a calculator should stop being used without deeper review

This is especially important because trust comes more from bounded use than from broad confidence claims.

### Contact

Contact should feel more like a real intake system.

New emphasis:

- how incoming requests are triaged
- what information speeds review
- what can happen if a report materially changes a page

This makes the feedback loop look active and credible.

## Content principles

The second round should continue avoiding template-like wording:

- use concrete actions, not vague promises
- explain consequences, not just intentions
- state what the site will downgrade, merge, or stop trusting
- avoid repeating the same trust slogan across pages
- keep each page responsible for a distinct operational layer

## Success criteria

This round is successful when:

- About describes maintenance priorities and page-quality thresholds
- Editorial Policy explains correction handling and material revision clearly
- Methodology explains review labels and stop-using conditions
- Contact explains triage and what changes a report can cause
- tests pass and the trust pages still build cleanly

