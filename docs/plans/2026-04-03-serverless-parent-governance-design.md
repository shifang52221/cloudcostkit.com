# Serverless Parent Governance Design

## Problem

The serverless cluster is one of the last broad topic areas that can still create a low-quality impression if the parent page and provider pages blur together.

Current shape:

- `src/pages/guides/serverless-costs.astro` is already stronger than a thin category page, but it still needs a sharper role as the cross-provider parent
- `src/pages/guides/aws-lambda-pricing.astro`
- `src/pages/guides/azure-functions-pricing.astro`
- `src/pages/guides/gcp-cloud-run-pricing.astro`

These provider pages are useful, but without a stricter role split the cluster can still read like several versions of the same "serverless cost guide" with different provider names.

## Approved Direction

Use a parent-plus-provider split:

- `serverless-costs` becomes the cross-provider serverless architecture budgeting parent
- each provider page becomes the provider-specific pricing or bill-boundary page

The parent page should own the system-level budgeting question:

- event amplification
- downstream service spend
- observability amplification
- transfer and egress effects
- when serverless budgets break even if the function unit price looks small

The provider pages should own the service-specific pricing question:

- which line items belong inside that provider bill
- which execution or hosting settings shape that provider's cost
- when to return to the parent page because the broader system model is still unclear

## Role Split

### `serverless-costs`

This page should explicitly identify itself as the cross-provider serverless architecture budgeting parent page.

Its job is to:

- explain why serverless budgets are wider than invocation math
- structure the estimate before the user drills into Lambda, Azure Functions, or Cloud Run
- route readers into provider pages only after the workload shape is clear

It should not drift into one provider's pricing language.

### `aws-lambda-pricing`

This page should explicitly identify itself as the AWS Lambda bill-boundary page.

Its job is to:

- define what belongs inside the Lambda bill
- define what stays beside the Lambda bill
- route readers back to the parent page when retries, downstream amplification, or surrounding architecture are still the bigger uncertainty

### `azure-functions-pricing`

This page should explicitly identify itself as the Azure Functions execution and pricing boundary page.

Its job is to:

- explain the Azure Functions execution model as it affects budgeting
- clarify hosting and execution drivers without collapsing into generic serverless advice
- route readers back to the parent page when the event system shape is still the unresolved problem

### `gcp-cloud-run-pricing`

This page should explicitly identify itself as the Cloud Run service behavior and pricing decision page.

Its job is to:

- explain the service-level billing shape for Cloud Run
- focus on request volume, CPU and memory time, concurrency, transfer, and logs as a Cloud Run-specific workflow
- route readers back to the parent page when the architecture-level serverless question is still unresolved

## Content Strategy

This round should follow the same pattern across all four pages:

1. add a first-screen role statement
2. add a short routing section about when to start on this page
3. reinforce the biggest budgeting mistake for that page's role
4. keep provider pages narrower than the parent page instead of re-teaching the full cross-provider system model

The goal is not simply more text. The goal is less overlap and more intentional editorial structure.

## Regression Guard

Add a targeted regression test that verifies:

- `serverless-costs` declares itself as the cross-provider parent page
- provider pages declare their provider-specific role
- provider pages route users back to `serverless-costs` when the workload or system model is still unclear

The test should protect the role split, not exact sentences.

## Scope

Keep this round limited to:

- `serverless-costs`
- `aws-lambda-pricing`
- `azure-functions-pricing`
- `gcp-cloud-run-pricing`
- one regression test

Do not expand into calculators or secondary Lambda/Fargate comparison pages in this batch.

## Success Standard

This round is successful when:

- the parent page clearly owns cross-provider serverless architecture budgeting
- the provider pages feel narrower and more intentional
- the cluster no longer reads like multiple interchangeable serverless explainers
- the regression test passes
- `npm run check` and `npm run build` still pass with the accepted existing hints only
