import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const normalize = (value) => value.replace(/\s+/g, " ").trim();

const pricingPage = normalize(readFileSync(new URL("../src/pages/guides/aws-api-gateway-pricing.astro", import.meta.url), "utf8"));
const estimatePage = normalize(
  readFileSync(new URL("../src/pages/guides/aws-api-gateway-estimate-requests.astro", import.meta.url), "utf8"),
);
const optimizationPage = normalize(
  readFileSync(new URL("../src/pages/guides/aws-api-gateway-cost-optimization.astro", import.meta.url), "utf8"),
);
const accessLogsPage = normalize(
  readFileSync(new URL("../src/pages/guides/aws-api-gateway-access-logs-cost.astro", import.meta.url), "utf8"),
);
const costCalculatorPage = readFileSync(
  new URL("../src/pages/calculators/aws-api-gateway-cost-calculator.astro", import.meta.url),
  "utf8",
);
const costCalculatorComponent = normalize(
  readFileSync(new URL("../src/components/calculators/AwsApiGatewayCost.tsx", import.meta.url), "utf8"),
);
const requestEstimatorPage = normalize(
  readFileSync(new URL("../src/pages/calculators/aws-api-gateway-request-estimator.astro", import.meta.url), "utf8"),
);
const accessLogCalculatorPage = normalize(
  readFileSync(new URL("../src/pages/calculators/aws-api-gateway-access-log-cost-calculator.astro", import.meta.url), "utf8"),
);
const accessLogCalculatorComponent = normalize(
  readFileSync(new URL("../src/components/calculators/AwsApiGatewayAccessLogCost.tsx", import.meta.url), "utf8"),
);
const costCalculatorNormalized = normalize(costCalculatorPage);

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

test("cost calculator is framed as the bill-conversion calculator", () => {
  assert.match(
    costCalculatorNormalized,
    /This calculator is the bill-conversion page of the API Gateway cluster: use it after request volume is already believable and you need to turn that traffic model into request-fee and transfer spend/i,
  );
  assert.match(
    costCalculatorNormalized,
    /The built-in RPS helper is only a quick conversion convenience, not a defendable request-discovery workflow; use the dedicated request estimator when RPS, retries, bots, logs, or peak windows still need evidence/i,
  );
  assert.match(costCalculatorComponent, /Avg RPS/i);
  assert.match(costCalculatorComponent, /Use estimate/i);
});

test("request estimator is framed as the request-volume workflow calculator", () => {
  assert.match(
    requestEstimatorPage,
    /This calculator is the request-volume workflow of the API Gateway cluster: it exists to turn RPS, peak windows, retries, bots, and automation into defendable billable requests before pricing starts/i,
  );
  assert.match(
    requestEstimatorPage,
    /It does not price transfer, request fees, or access-log storage; once the request model is stable, hand the result to the main API Gateway cost calculator or the pricing guide/i,
  );
});

test("access log calculator is framed as the logging-side calculator", () => {
  assert.match(
    accessLogCalculatorPage,
    /This calculator is the logging-side page of the API Gateway cluster: use it only after you know access logs are the side bill that needs its own ingestion and retention model, with query and scan behavior reviewed separately/i,
  );
  assert.match(
    accessLogCalculatorPage,
    /Its local RPS helper is only for traffic-to-log-volume sizing; go back to the main API Gateway cost calculator or the request estimator for core API request billing and defendable request-volume discovery/i,
  );
  assert.match(accessLogCalculatorComponent, /Avg RPS/i);
  assert.match(accessLogCalculatorComponent, /Use estimate/i);
});
