# WAF Cluster Role Separation Design

## Goal

Deepen the AWS WAF guide cluster so the pricing, estimate, and optimization pages perform clearly different editorial jobs instead of reading like three variations on the same request-spike story.

Target pages:

- `src/pages/guides/aws-waf-pricing.astro`
- `src/pages/guides/aws-waf-estimate-requests.astro`
- `src/pages/guides/aws-waf-cost-optimization.astro`

## Problem

The current WAF cluster is useful, but the page roles still overlap too much:

- the pricing page already teaches request-volume evidence and some spike modeling
- the estimate page already leans into budgeting language and hidden-log-bill framing
- the optimization page repeats foundational cost-model ideas instead of focusing on production interventions

That overlap creates a low-quality risk even when the content is factually reasonable:

- the three pages can look batch-produced because they revisit the same ideas with slightly different headings
- the user has to infer which page to start with instead of being routed by job
- Google can read the cluster as keyword expansion without enough editorial separation

## Recommended Approach

Separate the cluster by job, not just by keyword.

### 1. Pricing page = budget-boundary page

This page should answer:

- what belongs inside the WAF bill model
- what sits outside the WAF bill but still matters to the total security-cost picture
- when the real budgeting problem is WAF evaluation charges versus downstream logging and analysis

This page should feel like the "what exactly are we budgeting?" page.

### 2. Estimate page = measurement workflow page

This page should answer:

- how to turn baseline traffic and attack traffic into a defendable evaluated-request model
- what evidence sources to use for allowed and blocked traffic
- how to separate representative baseline windows from attack windows and path-level hot spots

This page should feel like the "show me the measurement workflow and evidence path" page.

### 3. Optimization page = production intervention page

This page should answer:

- what to change in production once the request model is believable
- how to reduce evaluated requests, rule sprawl, and logging waste safely
- when not to optimize yet because the measurement model is still weak

This page should feel like the "what do we change now?" page.

## Concrete Content Moves

### Pricing page

- add explicit role-setting language that says this is the budget-boundary page
- add an "inside the WAF bill vs outside the WAF bill" section
- add a "when this is not the right page" section
- reduce estimate-style measurement framing where possible

### Estimate page

- add explicit "measurement workflow" positioning
- add an evidence-pack section for baseline, attack, and path-level inputs
- make the handoff explicit: return to pricing if scope is unclear, move to optimization if the model is credible
- reduce budgeting language that belongs on the pricing page

### Optimization page

- add explicit "production intervention" positioning
- add "do not optimize yet if these are still unclear" guardrails
- add a change-control loop for before/after measurement
- keep the page focused on operational actions instead of re-explaining pricing

## Success Criteria

- each page states its role in the WAF cluster clearly
- the three pages no longer feel interchangeable
- cross-links become directional rather than circular
- a regression test can detect the new role-separation language
- `npm test`, `npm run check`, and `npm run build` remain green
