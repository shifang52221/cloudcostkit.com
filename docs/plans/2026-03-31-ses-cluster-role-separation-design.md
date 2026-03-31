# SES Cluster Role Separation Design

## Goal

Deepen the AWS SES guide cluster so the pricing, estimate, and optimization pages perform clearly different editorial jobs instead of reading like three versions of the same send-volume story.

Target pages:

- `src/pages/guides/aws-ses-pricing.astro`
- `src/pages/guides/aws-ses-estimate-email-volume.astro`
- `src/pages/guides/aws-ses-cost-optimization.astro`

## Problem

The current SES cluster is useful, but the page roles still overlap too much:

- the pricing page already teaches email-volume estimation logic that belongs on the estimate page
- the estimate page already leans into budget framing and spike explanation that belongs on the pricing page
- the optimization page repeats the same send-volume drivers instead of staying focused on production interventions

That overlap creates a low-quality risk even when the content is factually reasonable:

- the three pages can look batch-produced because they revisit sends, retries, duplicates, and alert storms with only small structural changes
- the user has to infer which page to start with instead of being routed by job
- Google can read the cluster as topic expansion without enough editorial role separation

## Recommended Approach

Separate the cluster by job, not just by keyword.

### 1. Pricing page = bill-boundary page

This page should answer:

- what belongs inside the SES bill model
- what sits outside the SES line item even if email workflows trigger downstream work
- when send volume matters versus when payload, dedicated IPs, or other fixed line items deserve separate treatment

This page should feel like the "what exactly are we budgeting in SES?" page.

### 2. Estimate page = send-measurement workflow page

This page should answer:

- how to turn transactional events, campaign calendars, recipient counts, and retry windows into a defendable email-volume model
- what evidence sources to use for baseline sends, resend logic, and incident spikes
- how to separate normal send volume from outage-driven or duplicate-driven spikes

This page should feel like the "show me the email-volume model and evidence path" page.

### 3. Optimization page = production intervention page

This page should answer:

- what to change in production once the send model is believable
- how to reduce duplicates, retries, non-prod waste, and low-value sends safely
- when not to optimize yet because the send baseline or retry behavior is still unclear

This page should feel like the "what do we change now?" page.

## Concrete Content Moves

### Pricing page

- add explicit role-setting language that says this is the SES bill-boundary page
- add an "inside the SES bill vs outside the SES bill" section
- add a "when this is not the right page" section
- reduce workflow-level estimation framing where possible

### Estimate page

- add explicit "send measurement workflow" positioning
- add an evidence-pack section for event-derived sends, campaign sends, resend logic, and incident windows
- make the handoff explicit: return to pricing if bill scope is unclear, move to optimization if the model is credible
- reduce budget or optimization language that belongs on the other two pages

### Optimization page

- add explicit "production intervention" positioning
- add "do not optimize yet if these are still unclear" guardrails
- add a change-control loop for safe before and after measurement
- keep the page focused on operational actions instead of re-explaining pricing or volume estimation

## Success Criteria

- each page states its role in the SES cluster clearly
- the three pages no longer feel interchangeable
- cross-links become directional rather than circular
- a regression test can detect the new role-separation language
- `npm test`, `npm run check`, and `npm run build` remain green
