import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const normalize = (value) => value.replace(/\s+/g, " ").trim();

const pricingPage = normalize(
  readFileSync(new URL("../src/pages/guides/aws-cloudwatch-logs-insights-pricing.astro", import.meta.url), "utf8"),
);
const estimatePage = normalize(
  readFileSync(
    new URL("../src/pages/guides/aws-cloudwatch-logs-insights-estimate-scanned-gb.astro", import.meta.url),
    "utf8",
  ),
);
const optimizationPage = normalize(
  readFileSync(
    new URL("../src/pages/guides/aws-cloudwatch-logs-insights-cost-optimization.astro", import.meta.url),
    "utf8",
  ),
);

test("pricing page is framed as the Logs Insights bill-boundary page", () => {
  assert.match(
    pricingPage,
    /Use this page when you need to decide what belongs inside the Logs Insights bill before you debate query habits, dashboard refreshes, or log-organization fixes/i,
  );
  assert.match(
    pricingPage,
    /This guide is about bill boundaries: scanned-GB charges from Logs Insights queries, and the adjacent log ingestion, retention, export, and wider observability costs that should be tracked beside Logs Insights rather than blended into it/i,
  );
});

test("estimate page is framed as the scanned-GB measurement workflow page", () => {
  assert.match(
    estimatePage,
    /This page is the scanned-GB measurement workflow, not the bill-boundary page: the goal is to turn log volume, query time range, query frequency, and incident behavior into a defendable scanned-GB-per-month model/i,
  );
  assert.match(
    estimatePage,
    /If you still are not sure which costs belong inside the Logs Insights bill versus beside it, go back to the pricing guide first/i,
  );
});

test("optimization page is framed as the production intervention page", () => {
  assert.match(
    optimizationPage,
    /Optimization starts only after you know whether wide time ranges, repeated dashboards, noisy log-group scope, or incident query behavior are the real Logs Insights cost driver; otherwise teams trim the wrong query path/i,
  );
  assert.match(
    optimizationPage,
    /This page is for production intervention: time-range control, query-shape cleanup, log-group scope reduction, dashboard guardrails, and repeat-scan discipline/i,
  );
});
