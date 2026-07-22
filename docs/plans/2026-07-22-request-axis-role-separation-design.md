# Request Axis Role Separation Design

**Date:** 2026-07-22

## Goal

Separate the request-pricing family into clearly different page jobs so each page owns one user intent and overlapping request traffic questions are routed to the right narrower page.

## Scope

This batch covers six adjacent pages:

- `requests-costs`: request boundary navigation hub.
- `request-based-pricing`: generic request pricing explainer.
- `api-request-cost-calculator`: generic request bill-conversion calculator.
- `rps-to-monthly-requests-calculator`: rate-to-volume bridge.
- `aws-s3-request-costs`: S3 request-cost boundary page.
- `aws-api-gateway-estimate-requests`: API request measurement workflow.

Other request-adjacent pages such as CDN request pricing, WAF request estimation, KMS request estimation, and messaging delivery pages are out of scope unless they directly conflict with this batch.

## Design

Each page will receive a short first-screen role statement that names both its job and its boundary:

1. `requests-costs` will remain a lightweight routing hub. It should help readers choose the correct guide or calculator without pretending to own the whole request workflow.
2. `request-based-pricing` will own the generic request-pricing logic across services. It should explain what counts as a request, how unit pricing works, and why retries or traffic amplification change the total.
3. `api-request-cost-calculator` will own direct bill conversion from request volume to cost. It should convert known request counts into monthly spend and hand off any request-discovery problem to the measurement guide.
4. `rps-to-monthly-requests-calculator` will stay a narrow bridge from rate to volume. It should not claim request pricing authority.
5. `aws-s3-request-costs` will own the S3-specific request boundary, including GET/PUT/LIST, metadata churn, small-object effects, and unit checks.
6. `aws-api-gateway-estimate-requests` will own the API Gateway request measurement workflow, including metrics, logs, RPS, retries, and traffic splits.

The pages will keep their useful content, but the openings, descriptions, and related links will make the handoff between them explicit. The goal is not to flatten request topics into one generic page; the goal is to stop each page from pretending to own more than one job.

## Testing

Add a regression test that checks:

- each page contains its intended role statement;
- the generic request pricing pages and calculators have distinct next-step language;
- the S3-specific request guide does not claim to be the generic request boundary hub;
- the API Gateway request-measurement page stays a workflow page, not a pricing page;
- descriptions remain long enough and distinct enough to avoid collapsing back into boilerplate.

Run the focused test first, then the existing request, API Gateway, S3, and calculator governance tests. Finish with `npm test`, `npm run check`, and `npm run build`.

## Success Criteria

- Six request-related pages have clearly different first-screen jobs.
- The generic request axis and the S3/API-specific request pages no longer overlap on the same job.
- Generated guide metadata stays distinct after regeneration.
- All tests and production build steps pass.
- The change is pushed to `main` and the six live pages show the new role statements after deployment settles.
