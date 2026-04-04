import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const normalize = (value) => value.replace(/\s+/g, " ").trim();

const observabilityGuide = normalize(
  readFileSync(new URL("../src/pages/guides/observability-costs.astro", import.meta.url), "utf8"),
);
const metricsGuide = normalize(
  readFileSync(new URL("../src/pages/guides/metrics-costs.astro", import.meta.url), "utf8"),
);
const logGuide = normalize(
  readFileSync(new URL("../src/pages/guides/log-costs.astro", import.meta.url), "utf8"),
);

test("observability guide owns the cross-signal parent budgeting role", () => {
  assert.match(observabilityGuide, /This is the observability system budgeting parent page/i);
  assert.match(observabilityGuide, /move into the metrics or log specialist pages only after the broader signal split is clear/i);
});

test("metrics guide owns the metrics cardinality role", () => {
  assert.match(metricsGuide, /This is the metrics cardinality and monitoring economics page/i);
  assert.match(metricsGuide, /go back to the observability parent page if the broader signal split is still unclear/i);
});

test("log guide owns the log ingestion and scan economics role", () => {
  assert.match(logGuide, /This is the log ingestion, retention, and scan economics page/i);
  assert.match(logGuide, /go back to the observability parent page if the broader signal split is still unclear/i);
});
