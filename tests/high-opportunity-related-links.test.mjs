import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const acrGuide = readFileSync(new URL("../src/pages/guides/azure-container-registry-pricing.astro", import.meta.url), "utf8");
const azureLbGuide = readFileSync(new URL("../src/pages/guides/azure-load-balancer-pricing.astro", import.meta.url), "utf8");
const eventHubsGuide = readFileSync(new URL("../src/pages/guides/azure-event-hubs-pricing.astro", import.meta.url), "utf8");
const cloudRunGuide = readFileSync(new URL("../src/pages/guides/gcp-cloud-run-pricing.astro", import.meta.url), "utf8");
const cloudSqlGuide = readFileSync(new URL("../src/pages/guides/gcp-cloud-sql-pricing.astro", import.meta.url), "utf8");
const cloudStorageGuide = readFileSync(new URL("../src/pages/guides/gcp-cloud-storage-pricing.astro", import.meta.url), "utf8");
const cloudTrailGuide = readFileSync(new URL("../src/pages/guides/aws-cloudtrail-pricing.astro", import.meta.url), "utf8");
const cloudwatchMetricsGuide = readFileSync(new URL("../src/pages/guides/aws-cloudwatch-metrics-pricing.astro", import.meta.url), "utf8");
const route53Guide = readFileSync(new URL("../src/pages/guides/aws-route-53-pricing.astro", import.meta.url), "utf8");
const glacierGuide = readFileSync(new URL("../src/pages/guides/aws-s3-glacier-pricing.astro", import.meta.url), "utf8");

test("Azure high-opportunity guides cross-link within the Azure service cluster", () => {
  assert.match(acrGuide, /href="\/guides\/azure-load-balancer-pricing\/"/);
  assert.match(acrGuide, /href="\/guides\/azure-event-hubs-pricing\/"/);
  assert.match(azureLbGuide, /href="\/guides\/azure-container-registry-pricing\/"/);
  assert.match(azureLbGuide, /href="\/guides\/azure-event-hubs-pricing\/"/);
  assert.match(eventHubsGuide, /href="\/guides\/azure-container-registry-pricing\/"/);
  assert.match(eventHubsGuide, /href="\/guides\/azure-load-balancer-pricing\/"/);
});

test("GCP high-opportunity guides cross-link Cloud Run, Cloud SQL, and Cloud Storage", () => {
  assert.match(cloudRunGuide, /href="\/guides\/gcp-cloud-sql-pricing\/"/);
  assert.match(cloudRunGuide, /href="\/guides\/gcp-cloud-storage-pricing\/"/);
  assert.match(cloudSqlGuide, /href="\/guides\/gcp-cloud-run-pricing\/"/);
  assert.match(cloudSqlGuide, /href="\/guides\/gcp-cloud-storage-pricing\/"/);
  assert.match(cloudStorageGuide, /href="\/guides\/gcp-cloud-run-pricing\/"/);
  assert.match(cloudStorageGuide, /href="\/guides\/gcp-cloud-sql-pricing\/"/);
});

test("AWS fast-moving operational guides cross-link CloudTrail, Metrics, and Route 53", () => {
  assert.match(cloudTrailGuide, /href="\/guides\/aws-cloudwatch-metrics-pricing\/"/);
  assert.match(cloudTrailGuide, /href="\/guides\/aws-route-53-pricing\/"/);
  assert.match(cloudwatchMetricsGuide, /href="\/guides\/aws-cloudtrail-pricing\/"/);
  assert.match(cloudwatchMetricsGuide, /href="\/guides\/aws-route-53-pricing\/"/);
  assert.match(route53Guide, /href="\/guides\/aws-cloudtrail-pricing\/"/);
  assert.match(route53Guide, /href="\/guides\/aws-cloudwatch-metrics-pricing\/"/);
});

test("S3 Glacier pricing guide explicitly links deeper Glacier workflow pages", () => {
  assert.match(glacierGuide, /href="\/guides\/aws-s3-glacier-estimate-retrieval\/"/);
  assert.match(glacierGuide, /href="\/guides\/aws-s3-glacier-retrieval-pricing\/"/);
  assert.match(glacierGuide, /href="\/guides\/s3-to-glacier-transfer-cost\/"/);
});
