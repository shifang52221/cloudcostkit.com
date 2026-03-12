# CTR Lift Design

Date: 2026-03-12

## Goal

Improve click-through rate on the site's highest-impression, low-click pages by tightening:

- title language
- meta-description language
- first-scroll promise
- early next-step pathways

## Why This Is the Right Fourth Wave

The first three waves strengthened:

- engineering baseline
- primary topic clusters
- support-page depth

The next bottleneck is not missing coverage. It is click capture.

Search Console already shows several pages with strong enough impression volume to justify CTR work:

- `/calculators/cdn-cost-calculator/`
- `/guides/cdn-costs/`
- `/calculators/ec2-cost-calculator/`
- `/guides/egress-costs/`
- `/calculators/`

These pages already have topical relevance and some degree of visibility. The next win is making them more compelling in search results and more immediately clear after the click.

## Query Signals Behind This Pass

The strongest supporting phrases still include:

- `cdn cost`
- `cdn pricing`
- `cdn cost calculator`
- `cdn cost comparison`
- `aws egress cost calculator`
- `aws egress cost`
- `ec2 calculator`
- `ec2 cost calculator`
- `ec2 pricing calculator`

Interpretation:

- searchers want practical calculators and decision-ready explanations
- titles must sound more task-oriented, not just descriptive
- first-screen copy should state the answer type, not only the topic

## Approaches Considered

### Approach 1: CTR-only page refinement

Pros:

- Directly matches the current bottleneck.
- Fast to implement and easy to measure later.
- Keeps scope tight.

Cons:

- Does not create new keyword surface area by itself.

### Approach 2: Another support-page expansion pass

Pros:

- Adds more topical depth.

Cons:

- Less aligned with the immediate low-CTR problem.

### Approach 3: Template redesign

Pros:

- Could improve user engagement broadly.

Cons:

- Too expensive for the current need.
- Risks changing too many variables at once.

## Recommendation

Use Approach 1.

The site now has enough structure to benefit from sharper click capture. This is the right moment to improve how high-impression pages present their promise in search results and in the first visible screen.

## Design

### 1. Tighten search-result language on priority pages

Upgrade titles and descriptions so they are more obviously aligned with the searcher's task:

- calculator pages should sound actionable and estimate-focused
- guide pages should sound explanatory and decision-focused
- hub pages should sound like the fastest way to find the right tool

### 2. Make the first screen answer the "why click this?" question

Each page should communicate early:

- what exact problem it solves
- which inputs the user needs
- when the page is the right starting point
- what the next best action is if they need a deeper or adjacent path

### 3. Pull key next-step links higher

Users entering from search should not need to scroll deep to find:

- the matching guide for a calculator
- the matching calculator for a guide
- the most relevant adjacent tool

### 4. Keep the scope operationally narrow

This pass should avoid:

- calculator logic changes
- template rewrites
- broad design changes

It should focus only on page copy, metadata, section order, and CTA clarity.

## Priority Pages

### Highest-value CTR targets

- `/calculators/cdn-cost-calculator/`
- `/guides/cdn-costs/`
- `/calculators/ec2-cost-calculator/`
- `/guides/egress-costs/`
- `/calculators/`

### Supporting rationale

- These pages already have meaningful impressions.
- They are close enough to demand to justify tighter click capture.
- They connect to major site clusters, so better CTR can also improve downstream engagement.

## Success Criteria

This pass is successful if:

- titles and descriptions are more task-aligned
- the first visible screen is clearer and more decisive
- users are offered the right next click earlier
- the site remains technically clean

## Scope Guardrails

- Do not add new calculators.
- Do not redesign layouts.
- Do not expand into another broad content wave.
- Keep the pass focused on CTR and first-scroll clarity.
