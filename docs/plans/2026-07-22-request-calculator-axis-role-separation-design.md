# Request Calculator Axis Role Separation Design

**Goal:** Sharpen the request calculator axis so S3 request fees, generic request billing, API Gateway request measurement, and response-transfer estimation each keep a distinct page role.

**Architecture:** Keep the existing calculator pages, but make their editorial intent more explicit and less overlapping. The S3 page should own request-class fee conversion, the generic API request page should own billable-request conversion, the API Gateway helper should own traffic-to-request measurement, and the response-size page should own payload-transfer math. The goal is not to add new features; it is to remove ambiguity so the site reads like a set of specialized tools instead of one blended request-cost cluster.

**Tech Stack:** Astro content pages, Node test runner, existing calculator components, repository editorial conventions.

---

### Scope

- `src/pages/calculators/s3-request-cost-calculator.astro`: convert this into the S3 request-class bill-conversion page.
- `src/pages/calculators/api-response-size-transfer-calculator.astro`: convert this into the payload-transfer bridge page.
- `src/pages/calculators/aws-api-gateway-request-estimator.astro`: keep it framed as the API Gateway request-volume workflow.
- `src/pages/calculators/api-request-cost-calculator.astro`: preserve its generic bill-conversion role and verify it stays distinct from the S3 and API Gateway helpers.

### Guardrails

- Do not merge request discovery, request pricing, and payload transfer into one description.
- Do not remove working calculator behavior.
- Do not introduce new page families or delete pages unless a test proves they are redundant.
- Keep descriptions long enough to avoid template-like, low-value meta text.

### Success Criteria

- Each page has one clear job and a one-line handoff to the next page in the workflow.
- The new test file fails before implementation and passes after.
- Existing request-axis and API Gateway cluster tests continue to pass.
- Live pages still render and keep their intended role language after deployment.
