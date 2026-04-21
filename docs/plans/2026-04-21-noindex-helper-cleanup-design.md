# Noindex Helper Cleanup Design

## Why this batch exists

The remaining sitewide quality risk is no longer concentrated on indexable entry pages. The main guides and calculators
have already had several rounds of meta-description hardening, snippet cleanup, and role-separation work. What still
looks dated is a smaller group of intentionally `noindex` helper pages that preserve older template language in their
descriptions.

These pages do not need to rank directly, but they still affect the editorial quality of the project:

- Bing and other crawlers can still read them even when they are not meant to index.
- They contribute to whole-site quality signals and to how internal page samples look during audits.
- They are still visible to users who land through navigation or related links.

The goal of this batch is to remove the last obvious template tails from the helper layer without reopening broader
indexation or cannibalization decisions.

## Scope of this batch

This batch covers the helper and estimator pages that still retain the old `Educational use only.` boilerplate in their
descriptions:

- `src/pages/calculators/aws-api-gateway-request-estimator.astro`
- `src/pages/calculators/aws-kms-request-estimator.astro`
- `src/pages/calculators/aws-sns-delivery-estimator.astro`
- `src/pages/calculators/aws-sqs-request-estimator.astro`
- `src/pages/calculators/aws-waf-request-estimator.astro`
- `src/pages/calculators/rps-to-monthly-requests-calculator.astro`
- `src/pages/calculators/compute-instance-cost-calculator.astro`

All of these pages are intentionally `noindex,follow` and already excluded from sitemap generation. That role should
stay unchanged in this batch.

## Problem pattern

These pages are not suffering from one shared topic problem. They already have different on-page bodies and different
workflow roles. The remaining weakness is narrower:

- the descriptions still end in a generic educational disclaimer
- several still sound like old helper-page templates rather than purpose-built workflow tools
- the helper layer therefore feels less original than the stronger public pages

This is a cleanup of presentation and role clarity, not a rewrite of page architecture.

## Options considered

### Option 1: Leave the helper pages alone because they are noindex

Pros:

- no risk of accidentally broadening their role
- minimal work

Cons:

- leaves visible template residue in the codebase
- weakens sitewide quality signals during crawler sampling and manual audits

### Option 2: Rewrite and index the helper pages

Pros:

- creates more potentially rankable surfaces

Cons:

- wrong direction for this batch
- reopens cannibalization questions we have already deliberately controlled with `noindex`

### Option 3: Keep them noindex, but make them read like real support tools

Pros:

- removes the last obvious template tails
- improves originality without changing sitemap/indexation policy
- keeps the current page hierarchy and workflow roles intact

Cons:

- requires page-by-page wording discipline

## Recommended approach

Choose Option 3.

Each touched page should stay compact and supportive, but its description should explain the actual job of the page:

- API Gateway estimator: traffic shape and retry-amplified request volume
- KMS estimator: workload units translated into crypto-call density
- SNS estimator: publish count transformed by matched fan-out and retries
- SQS estimator: message lifecycle translated into multiple billable requests
- WAF estimator: normal evaluated traffic plus attack-window expansion
- RPS converter: rate-to-period bridge, not a full pricing answer
- generic compute helper: billable-hours cross-check, not a provider pricing destination

## Final design

### Shared rules

Keep:

- existing `robots="noindex,follow"` behavior
- current canonical paths
- existing widgets, FAQs, and helper-page positioning
- current related-link structure unless a direct wording conflict appears

Change:

- description strings only where they still carry the old boilerplate or helper-template tone
- wording so each page sounds like a distinct support workflow, not a reused shell

### Testing design

Add one focused regression test that:

- lists the seven targeted helper pages explicitly
- verifies each description no longer includes `Educational use only.`
- verifies each touched page still declares `robots="noindex,follow"`

That keeps this batch narrow and avoids conflating it with the broader indexable-calculator quality tests.
