import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const normalize = (value) => value.replace(/\s+/g, " ").trim();

const cloudSqlGuide = normalize(
  readFileSync(new URL("../src/pages/guides/gcp-cloud-sql-pricing.astro", import.meta.url), "utf8"),
);
const cloudLoggingGuide = normalize(
  readFileSync(new URL("../src/pages/guides/gcp-cloud-logging-pricing.astro", import.meta.url), "utf8"),
);
const cloudCdnGuide = normalize(
  readFileSync(new URL("../src/pages/guides/gcp-cloud-cdn-pricing.astro", import.meta.url), "utf8"),
);
const auroraServerlessGuide = normalize(
  readFileSync(new URL("../src/pages/guides/aws-aurora-serverless-v2-pricing.astro", import.meta.url), "utf8"),
);

test("Cloud SQL guide opens with a clearer bill-shape decision", () => {
  assert.match(
    cloudSqlGuide,
    /The first budgeting decision is whether Cloud SQL spend is mainly a provisioned-capacity problem, a storage-and-backup growth problem, or a network-bound access pattern/i,
  );
});

test("Cloud Logging guide opens with a clearer logging bill-shape decision", () => {
  assert.match(
    cloudLoggingGuide,
    /The first budgeting decision is whether Cloud Logging cost is mainly being created by noisy ingestion, long retention, or repeated wide-window scans/i,
  );
});

test("Cloud CDN guide opens with a clearer cache-fill versus delivery decision", () => {
  assert.match(
    cloudCdnGuide,
    /The real budgeting decision is whether Cloud CDN cost is mainly an edge bandwidth problem, a request-shape problem, or a cache-fill problem caused by weak hit rate/i,
  );
});

test("Aurora Serverless v2 guide opens with a clearer capacity-shape decision", () => {
  assert.match(
    auroraServerlessGuide,
    /The first budgeting decision is whether Aurora Serverless v2 spend is mostly a minimum-capacity baseline problem or a repeated peak-window problem/i,
  );
});
