import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const pricingPage = readFileSync(new URL("../src/pages/guides/aws-cloudwatch-metrics-pricing.astro", import.meta.url), "utf8");
const estimatePage = readFileSync(
  new URL("../src/pages/guides/aws-cloudwatch-metrics-estimate-custom-metrics.astro", import.meta.url),
  "utf8",
);
const optimizationPage = readFileSync(
  new URL("../src/pages/guides/aws-cloudwatch-metrics-cost-optimization.astro", import.meta.url),
  "utf8",
);

test("pricing page is framed as the metrics bill-boundary page", () => {
  assert.match(
    pricingPage,
    /Use this page when you need to decide what belongs inside the CloudWatch metrics bill before you debate cardinality cleanup, polling reduction, or dashboard pruning/i,
  );
  assert.match(
    pricingPage,
    /This guide is about bill boundaries: custom metrics, high-resolution metrics, metrics API requests, dashboards, and the adjacent alarm and external observability costs that should be tracked beside the metrics bill rather than blended into it/i,
  );
  assert.match(
    pricingPage,
    /custom metrics/i,
  );
  assert.match(
    pricingPage,
    /metrics API requests/i,
  );
});

test("estimate page is framed as the time-series measurement workflow page", () => {
  assert.match(
    estimatePage,
    /This page is the time-series measurement workflow, not the bill-boundary page: the goal is to turn CloudWatch inventory, instrumentation config, exporters, dimension combinations, and growth multipliers into a defendable active-series model/i,
  );
  assert.match(
    estimatePage,
    /If you are still deciding which line items belong inside the CloudWatch metrics bill, go back to the pricing guide first/i,
  );
});

test("optimization page is framed as the production intervention page", () => {
  assert.match(
    optimizationPage,
    /Optimization starts only after you know whether high-cardinality dimensions, duplicate exporters, high-resolution overuse, or metrics API polling is the real CloudWatch metrics cost driver; otherwise teams prune metrics blindly without removing the real waste/i,
  );
  assert.match(
    optimizationPage,
    /This page is for production intervention: cardinality control, exporter dedupe, resolution policy, polling discipline, and observability preservation/i,
  );
});
