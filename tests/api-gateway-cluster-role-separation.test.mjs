import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const pricingPage = readFileSync(new URL("../src/pages/guides/aws-api-gateway-pricing.astro", import.meta.url), "utf8");
const estimatePage = readFileSync(new URL("../src/pages/guides/aws-api-gateway-estimate-requests.astro", import.meta.url), "utf8");
const optimizationPage = readFileSync(new URL("../src/pages/guides/aws-api-gateway-cost-optimization.astro", import.meta.url), "utf8");
const accessLogsPage = readFileSync(new URL("../src/pages/guides/aws-api-gateway-access-logs-cost.astro", import.meta.url), "utf8");

test("pricing page is framed as the bill-boundary page", () => {
  assert.match(
    pricingPage,
    /Use this page when you need to decide what belongs inside the API Gateway bill model before you argue about optimization/i,
  );
  assert.match(
    pricingPage,
    /This guide is about bill boundaries: request charges, transfer-sensitive line items, API Gateway features, and the adjacent log, CDN, WAF, and downstream execution costs that should be tracked beside API Gateway rather than confused with it/i,
  );
});

test("estimate page is framed as the request-measurement workflow page", () => {
  assert.match(
    estimatePage,
    /This page is the request-measurement workflow, not the bill-boundary page: the goal is to turn metrics, logs, RPS, automated traffic, and retries into a defendable requests-per-month model/i,
  );
  assert.match(
    estimatePage,
    /If you still are not sure which costs and traffic belong inside the API Gateway bill, go back to the pricing guide first/i,
  );
});

test("optimization page is framed as the production intervention page", () => {
  assert.match(
    optimizationPage,
    /Optimization starts only after the API request and transfer model is believable; otherwise teams cache or compress the wrong path and keep the real cost driver/i,
  );
  assert.match(
    optimizationPage,
    /This page is for production intervention: caching, batching, retry control, payload reduction, and traffic-shape fixes/i,
  );
});

test("access logs page is framed as the support logging-cost page", () => {
  assert.match(
    accessLogsPage,
    /This page is the logging-cost branch of the API Gateway cluster, not the core request-pricing page: it exists to model ingestion, retention, and query spend once you already know logging is a meaningful side bill/i,
  );
  assert.match(
    accessLogsPage,
    /If you are still deciding what belongs inside the API Gateway bill overall, go back to the pricing guide first/i,
  );
});
