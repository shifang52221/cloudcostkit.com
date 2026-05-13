import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const normalize = (value) => value.replace(/\s+/g, " ").trim();

const metricsApiRequestsEstimatePage = normalize(
  readFileSync(
    new URL("../src/pages/guides/aws-cloudwatch-metrics-estimate-api-requests.astro", import.meta.url),
    "utf8",
  ),
);
const dashboardsPricingPage = normalize(
  readFileSync(new URL("../src/pages/guides/aws-cloudwatch-dashboards-pricing.astro", import.meta.url), "utf8"),
);
const logsPricingPage = normalize(
  readFileSync(new URL("../src/pages/guides/aws-cloudwatch-logs-pricing.astro", import.meta.url), "utf8"),
);

test("metrics API requests estimate page uses sharper caller-reconciliation and handoff language", () => {
  assert.match(
    metricsApiRequestsEstimatePage,
    /Before you trust the request model, show which calls come from human dashboard sessions, which come from always-on wallboards or NOC displays, and which only appear because external tooling polls CloudWatch on its own refresh loop instead of reusing cached results\./i,
  );
  assert.match(
    metricsApiRequestsEstimatePage,
    /This estimate is ready to hand off only when another reviewer can identify the steady polling baseline, the main incident multiplier, and the small set of callers most likely to change next month's API request volume\./i,
  );
});

test("dashboards pricing page uses sharper ownership and adjacency validation language", () => {
  assert.match(
    dashboardsPricingPage,
    /The useful review question is whether you are paying for dashboard-month footprint itself or for the metrics requests, custom metrics, and companion alarms that teams created so the dashboards would stay rich enough for day-to-day operations\./i,
  );
  assert.match(
    dashboardsPricingPage,
    /Before you compare teams or months, separate the billable dashboard inventory from the recurring refresh traffic, then verify which extra spend belongs to dashboards versus the surrounding metrics and alerting choices they trigger\./i,
  );
});

test("logs pricing page uses sharper bucket-reconciliation and decision language", () => {
  assert.match(
    logsPricingPage,
    /A defensible review starts by proving whether the increase came from more bytes written, more days retained, or more data scanned, because teams often blame CloudWatch Logs as one bucket when ingestion, retention, and query behavior moved for different reasons\./i,
  );
  assert.match(
    logsPricingPage,
    /You are ready to take this model into budgeting or optimization only when another reviewer can trace the ingestion baseline, the retention policy that turns it into stored GB-month, and the recurring query patterns that create steady scan cost outside incident spikes\./i,
  );
});
