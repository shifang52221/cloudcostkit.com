# SEO-Safe Growth Governance Design

## Why this design exists

The site is now in a different phase from the initial launch phase.

The main problem is no longer "publish enough pages to exist." The real problem is:

- keep improving quality without creating SEO volatility
- keep deepening pages without falling back into template-like repetition
- keep shipping often enough to build momentum without making the site look unstable
- keep moving toward AdSense re-review with stronger trust, editorial control, and page-role clarity

The next step therefore needs to be a governance model, not another loose rewrite sprint.

## What this design must solve

This design must give the project a durable operating model for the next several weeks.

That operating model must answer five practical questions:

1. Which pages should be touched first?
2. How much should change in one round?
3. What must be verified before merge?
4. How do we reduce the chance of harming rankings while improving quality?
5. How do we know whether the work is helping?

## Design goals

- Keep the current deep-remediation momentum without drifting into random page edits
- Prioritize pages by site-quality and review risk, not by intuition alone
- Make every round small enough to control and large enough to matter
- Build a repeatable merge-and-live-verification routine
- Tie content work back to Search Console and approval risk, not just copy volume

## Approach options

### Approach 1: Continue with ad hoc batch selection

Pros:

- fastest to start
- no extra process overhead

Cons:

- weak prioritization discipline
- easier to over-edit lower-value pages
- harder to explain why one round matters more than another

### Approach 2: Freeze edits and do a long audit first

Pros:

- creates a clean strategic baseline
- lowers the chance of impulsive decisions

Cons:

- slows momentum
- delays visible quality gains
- risks replacing execution with analysis

### Approach 3: Use a governed rolling-batch model

Pros:

- keeps progress moving
- gives every round a clear priority reason
- limits SEO risk by controlling scope and verification
- supports both search growth and AdSense remediation

Cons:

- requires stricter discipline
- adds lightweight operational overhead every round

## Recommendation

Choose approach 3.

The site is already past the stage where broad brainstorming alone helps. It needs a stable operating model:

- tier pages by risk and opportunity
- work in small, review-safe rounds
- require verification before merge
- re-check live output after merge
- re-rank priorities each week from data

## The governance model

The recommended model has four layers.

### 1. Priority layers

All remaining work should be classified into four layers:

- `Layer A: Review-risk pages`
  - pages most likely to contribute to a "low quality" impression
  - overlapping pages, weak standalone pages, blurry-role pages, or thin parent pages

- `Layer B: Traffic-opportunity pages`
  - pages with meaningful impressions or ranking potential that still underperform on CTR, clarity, or conversion to stronger sibling pages

- `Layer C: Trust and governance pages`
  - About, Contact, Editorial Policy, Methodology, footer trust language, correction paths, and related site-level trust surfaces

- `Layer D: Growth-routing pages`
  - homepage, calculators hub, guides hub, provider hubs, topic hubs, and parent pages that influence crawl paths and user routing

### 2. Round size

Each implementation round should stay small and intentional:

- one topic group at a time
- normally four to six pages
- one clear purpose per round
- one merge per round

This keeps the site from looking unstable and keeps regressions easier to trace.

### 3. Release gate

No round should merge unless it clears all six gates:

1. Each page has a clearly stated role
2. Each page has non-template value beyond nearby siblings
3. Internal links are directional, not decorative
4. Manual review catches encoding, broken copy, empty claims, and weak transitions
5. Local verification passes
6. Post-merge live verification confirms the new wording is actually deployed

### 4. Weekly feedback loop

The batch queue should be adjusted weekly using:

- Search Console query and page data
- merge/live verification findings
- trust-page gaps
- residual overlap discovered during content work

This prevents the roadmap from becoming detached from real search behavior.

## Safety rules for SEO

The site can keep shipping frequently, but only under stable rules.

The most important rules are:

- do not keep re-positioning a page's main search intent every few days
- do not rotate titles, H1s, or canonical intent without a strong reason
- do not change slugs casually
- do not batch too many unrelated pages into one merge
- do not treat "more words" as quality
- do not skip live verification after merge

Frequent improvement is acceptable.
Frequent strategic wobble is not.

## Success standard

This design is successful when:

- remaining pages are no longer treated as one flat backlog
- each new round has a written reason, a bounded scope, and a verification gate
- SEO-risky editing patterns are explicitly prevented
- the site gets deeper and more selective at the same time
- AdSense re-review preparation becomes systematic instead of reactive

## Recommended immediate outputs

This design should lead to three concrete operating assets:

1. A master page-priority matrix
2. A round execution and release checklist
3. A rolling four-week roadmap that chooses the next batches intentionally
