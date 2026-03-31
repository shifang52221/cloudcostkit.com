# SQS Cluster Role Separation Design

## Goal

Deepen the AWS SQS guide cluster so the three pages perform clearly different editorial jobs instead of reading like three variations on the same request-cost theme.

Target pages:

- `src/pages/guides/aws-sqs-pricing.astro`
- `src/pages/guides/aws-sqs-estimate-requests.astro`
- `src/pages/guides/aws-sqs-cost-optimization.astro`

## Problem

The current SQS cluster is already useful, but the pages still sit too close together in purpose:

- the pricing page explains request-driven cost and already teaches request math
- the estimate page explains request math and already teaches some operational multipliers
- the optimization page explains operational fixes, but still repeats foundational request-model content

That creates a low-quality risk even when the writing itself is reasonable:

- three pages in the same cluster can still feel batch-produced if they teach the same idea in slightly different order
- the user has to infer which page to start with instead of being routed clearly by job
- Google can read this as topic expansion without enough editorial role separation

## Recommended Approach

Separate the cluster by job, not just by keyword:

### 1. Pricing page = scope and budgeting boundary

This page should answer:

- what belongs inside the SQS bill model
- what sits beside SQS and should not be confused with queue charges
- when SQS request cost is the real issue versus when the adjacent consumer stack dominates

This page should feel like the "what are we budgeting?" page.

### 2. Estimate page = measurement workflow

This page should answer:

- how to translate messages into requests with defensible assumptions
- what data sources to use
- how to create baseline, incident, and uncertainty scenarios

This page should feel like the "show me the math and evidence path" page.

### 3. Optimization page = operational intervention playbook

This page should answer:

- what to change in the system once the model is believable
- how to reduce request multipliers safely
- when not to optimize yet because the measurement model is still weak

This page should feel like the "what do we change in production?" page.

## Concrete Content Moves

### Pricing page

- add explicit "what this page is for" positioning
- add an "inside the SQS bill vs adjacent but outside it" section
- add a "when this is not the right page" section
- reduce duplicated estimate-style walkthrough language where possible

### Estimate page

- add explicit "measurement workflow" positioning
- add a stronger evidence/validation section
- add a clearer uncertainty model: baseline, incident, polling tax, retry amplification
- reinforce that this page exists after scope is known but before optimization changes are made

### Optimization page

- add explicit "operational intervention" positioning
- add "do not optimize yet" guardrails
- add before/after measurement requirements for change safety
- keep the focus on action sequencing, not re-explaining basic pricing scope

## Success Criteria

- each page states its role in the cluster clearly
- the three pages no longer feel interchangeable
- cross-links between them become directional rather than circular
- a regression test can detect the new role-separation language
- `npm test`, `npm run check`, and `npm run build` remain green
