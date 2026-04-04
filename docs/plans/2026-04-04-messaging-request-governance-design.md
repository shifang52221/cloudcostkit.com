# Messaging Request Governance Design

## Problem

The messaging and request-pricing guide family has strong raw material, but the hierarchy is still too compressed.

Current shape:

- `src/pages/guides/messaging-costs.astro` already behaves like a parent, but it needs harder routing language so it clearly owns event and delivery budgeting
- `src/pages/guides/request-based-pricing.astro` is the strongest full workflow guide for request math, but it can still overlap with messaging and the lightweight request hub
- `src/pages/guides/requests-costs.astro` is intentionally noindexed, yet its title and framing still sit too close to `request-based-pricing`

This creates three quality risks:

- Google can see `request-based-pricing` and `requests-costs` as near-duplicate topic pages
- readers can enter the wrong page and get repeated request-math content instead of a clear next step
- `messaging-costs` can lose parent authority because request math pages keep encroaching on the same territory

## Approved Direction

Use a parent-plus-guide-plus-hub split:

- `messaging-costs` becomes the event and delivery budgeting parent page
- `request-based-pricing` becomes the generic request-math and billing-unit guide
- `requests-costs` becomes the lightweight request routing hub

The messaging parent should own the broader event-system budgeting question:

- how publishes become deliveries, retries, fan-out, and payload amplification
- when the next step is generic request math versus messaging-specific delivery modeling
- why messaging cost is not the same thing as generic request pricing

The full request guide should own the generic request-math question:

- how to turn traffic into requests/month
- how to map workloads to billable request units
- how to avoid unit mistakes, retries, and traffic-shape blind spots across APIs, CDNs, messaging, and security products

The lightweight hub should own only navigation and triage:

- it should help users decide whether they need the full request guide, a calculator, or a neighboring topical guide
- it should not read like a second full request-pricing explainer

## Role Split

### `messaging-costs`

This page should explicitly identify itself as the event and delivery budgeting parent page.

Its job is to:

- explain how publishes turn into deliveries, retries, fan-out, and payload amplification
- stay broader than one request-math workflow and more specific than generic cloud-cost pages
- route readers into request math only after the event and delivery pattern is clear

### `request-based-pricing`

This page should explicitly identify itself as the generic request-math and billing-unit guide.

Its job is to:

- explain request-volume estimation, unit mapping, class splits, and validation
- stay broader than one product but narrower than parent pages like messaging or security
- route readers back to `messaging-costs` when the core issue is still event and delivery modeling

### `requests-costs`

This page should explicitly identify itself as the lightweight request routing hub.

Its job is to:

- send readers to the stronger full guide or to calculators quickly
- avoid repeating the full request-pricing workflow
- stay intentionally lighter, shorter, and more navigational than `request-based-pricing`

## Content Strategy

This round should apply the same governance pattern across all three pages:

1. add or tighten first-screen role statements
2. strengthen routing language about when the page is the correct entry point
3. reinforce the biggest modeling mistake for that page's role
4. reduce overlap by keeping messaging about event/delivery systems, the request guide about generic request math, and the hub about navigation only

The goal is not more words. The goal is clearer editorial hierarchy and less topic duplication.

## Regression Guard

Add a targeted regression test that verifies:

- `messaging-costs` declares itself as the event and delivery budgeting parent page
- `request-based-pricing` declares itself as the generic request-math and billing-unit guide
- `requests-costs` declares itself as the lightweight request routing hub
- `request-based-pricing` routes messaging-budget questions back to `messaging-costs`
- `requests-costs` routes readers into `request-based-pricing` as the stronger full guide

The test should protect role separation, not exact paragraph layout.

## Scope

Keep this round limited to:

- `src/pages/guides/messaging-costs.astro`
- `src/pages/guides/request-based-pricing.astro`
- `src/pages/guides/requests-costs.astro`
- `tests/messaging-request-governance.test.mjs`

Do not expand this batch into SQS/SNS provider guides, API gateway pages, or calculator pages unless a direct blocker appears.

## Success Standard

This round is successful when:

- `messaging-costs` clearly owns event and delivery budgeting
- `request-based-pricing` clearly owns the full request-math workflow
- `requests-costs` clearly behaves as a lighter routing hub rather than a second primary guide
- the regression test passes
- `npm run check` and `npm run build` still pass with only the accepted existing hints
