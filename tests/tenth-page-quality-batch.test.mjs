import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const normalize = (value) => value.replace(/\s+/g, " ").trim();

const metricsPricingPage = normalize(
  readFileSync(new URL("../src/pages/guides/aws-cloudwatch-metrics-pricing.astro", import.meta.url), "utf8"),
);
const logsInsightsPricingPage = normalize(
  readFileSync(new URL("../src/pages/guides/aws-cloudwatch-logs-insights-pricing.astro", import.meta.url), "utf8"),
);
const alarmsPricingPage = normalize(
  readFileSync(new URL("../src/pages/guides/aws-cloudwatch-alarms-pricing.astro", import.meta.url), "utf8"),
);

test("metrics pricing page uses more concrete budget-review validation language", () => {
  assert.match(
    metricsPricingPage,
    /If two teams publish similar dashboards but only one team owns the custom metrics explosion, this page should help you keep the CloudWatch-native bill attached to the publisher instead of hiding it inside a shared observability bucket\./i,
  );
  assert.match(
    metricsPricingPage,
    /Before you compare environments or teams, verify which request volume is truly CloudWatch-native, which refresh behavior comes from dashboards, and which access pattern starts only after another observability tool begins polling the same metrics\./i,
  );
});

test("Logs Insights pricing page uses more specific scan-ownership and reconciliation language", () => {
  assert.match(
    logsInsightsPricingPage,
    /The practical review question is simple: are you looking at a true Logs Insights scan bill, or are ingestion, retention, export, and SIEM follow-on costs being lumped into the same conversation because they all came from the same log groups\?/i,
  );
  assert.match(
    logsInsightsPricingPage,
    /Before you compare months, reconcile which scanned GB came from recurring dashboards, which came from routine engineer queries, and which only appeared because incidents widened the time range or log-group scope\./i,
  );
});

test("alarms pricing page uses more specific inventory-ownership and validation language", () => {
  assert.match(
    alarmsPricingPage,
    /In practice, this page is most useful when a team needs to prove whether the bill is being driven by real alarm inventory growth or by adjacent delivery paths and observability extras that were incorrectly blamed on alarms\./i,
  );
  assert.match(
    alarmsPricingPage,
    /Before you compare months or ownership across teams, verify which alarm-month growth came from deliberate coverage decisions, which came from template sprawl or ephemeral environments, and which charges only begin after alerts flow into SNS, dashboards, or extra metrics\./i,
  );
});
