import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const pricingPage = readFileSync(new URL("../src/pages/guides/aws-ssm-parameter-store-pricing.astro", import.meta.url), "utf8");
const estimatePage = readFileSync(new URL("../src/pages/guides/aws-ssm-parameter-store-estimate-api-calls.astro", import.meta.url), "utf8");
const optimizationPage = readFileSync(new URL("../src/pages/guides/aws-ssm-parameter-store-cost-optimization.astro", import.meta.url), "utf8");

test("pricing page is framed as the Parameter Store bill-boundary page", () => {
  assert.match(
    pricingPage,
    /Use this page when you need to decide what belongs inside the Parameter Store bill before you debate caching strategy or request reduction/i,
  );
  assert.match(
    pricingPage,
    /This guide is about bill boundaries: advanced parameter-months, Parameter Store API requests, and the adjacent polling, deploy, and secret-management costs that should be tracked beside Parameter Store rather than blended into it/i,
  );
});

test("estimate page is framed as the API-call measurement workflow page", () => {
  assert.match(
    estimatePage,
    /This page is the Parameter Store API-call measurement workflow, not the bill-boundary page: the goal is to turn CloudTrail evidence, startup counts, refresh TTL, polling loops, batch-read behavior, and retry patterns into a defendable monthly request model/i,
  );
  assert.match(
    estimatePage,
    /If you are still deciding which line items belong inside the Parameter Store bill, go back to the pricing guide first/i,
  );
});

test("optimization page is framed as the production intervention page", () => {
  assert.match(
    optimizationPage,
    /Optimization starts only after you know whether advanced parameter-months or API requests are the real Parameter Store cost driver; otherwise teams change caching and refresh logic without moving the bill/i,
  );
  assert.match(
    optimizationPage,
    /This page is for production intervention: caching policy, batch reads, refresh discipline, polling reduction, and churn control/i,
  );
});
