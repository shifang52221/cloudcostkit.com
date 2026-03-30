# Trust Signal Hardening Design

## Why this change exists

CloudCostKit already has the basic trust pages a real site should have:

- `/about/`
- `/editorial-policy/`
- `/methodology/`
- `/contact/`
- `/privacy-policy/`
- `/terms/`

That is a good foundation, but the current set still carries two risks for AdSense-style low-quality review:

1. the pages read as present, but not yet fully differentiated
2. the trust path is visible, but not yet strong enough as a site-wide operating system

The goal of this round is not to publish more URLs. The goal is to make the site easier to trust as an actively
maintained, bounded, reviewable product site.

## What problem this round is solving

This round targets the "low quality site" root pattern where a site appears to have:

- generic trust pages that exist mainly because they are expected
- repetitive brand language across policy pages
- unclear ownership of claims, corrections, and review rules
- weak links between homepage messaging, page-level review labels, and operational trust pages

For this project, the most valuable next move is site-level trust hardening, not more topical expansion.

## Scope

This round will strengthen the trust layer across these files:

- `src/pages/about.astro`
- `src/pages/editorial-policy.astro`
- `src/pages/methodology.astro`
- `src/pages/contact.astro`
- `src/pages/index.astro`
- `src/layouts/BaseLayout.astro`

If needed, a small shared trust component may be added, but only if it reduces duplication cleanly.

This round will not:

- rewrite large batches of calculator pages
- create a large number of new pages
- broaden the privacy or legal pages unless a trust-path mismatch requires it

## Design goals

After this change, a reviewer should be able to understand the site quickly:

1. what the site helps with
2. who it is for
3. what the site does not claim
4. how pages are reviewed and corrected
5. how estimates should be challenged before being trusted
6. how to contact the site with a real issue

## Page responsibilities

### Homepage

The homepage should expose a stronger trust path near the top of the page. It should not try to explain every policy,
but it should make the trust layer visible as part of the core product positioning.

The homepage should answer:

- what the site helps teams do
- why the estimate workflow is reviewable
- where to go for methodology, editorial standards, and contact

### About

`/about/` should answer:

- who the site is for
- what practical job the site performs
- what it does not replace
- how a user should challenge or report a page

This page should sound operational, not promotional.

### Editorial Policy

`/editorial-policy/` should explain:

- how topics are selected
- what qualifies a page for publication
- what triggers a review, rewrite, or consolidation
- how corrections are handled
- what this page governs versus what it does not govern

This page should own publication and maintenance standards, not duplicate methodology.

### Methodology

`/methodology/` should explain:

- how calculators are modeled
- how guides are constructed to support the estimate workflow
- common failure modes and invalid assumptions
- how validation should happen before a number is trusted
- when the model should no longer be used without deeper review

This page should emphasize "reviewable and bounded" over "perfectly accurate."

### Contact

`/contact/` should look like a real operations intake page, not just a mailbox page.

It should clearly organize:

- what kinds of requests are useful
- what information helps review faster
- what the response pattern looks like
- where adjacent trust pages live

### Base layout and footer

The global chrome should support the trust path instead of leaving it buried in policy navigation.

The footer should make the site identity more explicit:

- independent cloud cost planning resource
- built for educational and planning workflows
- not a replacement for provider billing, quotes, contracts, or formal advice

## Content principles

To avoid template-style low-quality signals, the revised pages should follow these rules:

- each page must own a distinct responsibility
- repeated slogans should be removed or reduced
- concrete review actions should replace vague quality claims
- limits and exclusions should be stated plainly
- trust pages should reference each other, but not duplicate each other

## Recommended implementation approach

### Option 1: rewrite only the trust pages

Pros:

- strongest focus on low-quality-site root causes
- limited blast radius
- easier to review and verify

Cons:

- homepage and layout may still under-signal the trust layer

### Option 2: trust pages plus homepage and footer reinforcement

Pros:

- stronger site-wide signal
- trust path becomes visible from the first screen and global chrome
- more aligned with human and automated review

Cons:

- slightly broader change set

### Option 3: trust pages plus a new dedicated review center page

Pros:

- would centralize review and correction logic

Cons:

- unnecessary extra URL right now
- risks creating another thin support page

## Recommendation

Choose Option 2.

This provides the strongest improvement without creating more pages. It makes the trust system visible from the
homepage and global footer while also making each trust page more specific and less template-like.

## Success criteria

This round is successful when:

- the homepage clearly exposes the trust path
- each trust page has a distinct responsibility and less duplicated language
- the footer communicates clearer site identity and boundaries
- the contact page looks like a real correction and support intake path
- the repo still passes tests and checks relevant to the change

