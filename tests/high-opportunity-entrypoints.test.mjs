import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const homepage = readFileSync(new URL("../src/pages/index.astro", import.meta.url), "utf8");
const guidesIndex = readFileSync(new URL("../src/pages/guides/index.astro", import.meta.url), "utf8");
const azureGuideHub = readFileSync(new URL("../src/pages/guides/azure.astro", import.meta.url), "utf8");
const gcpGuideHub = readFileSync(new URL("../src/pages/guides/gcp.astro", import.meta.url), "utf8");

test("homepage promotes the strongest Azure service pricing guides", () => {
  assert.match(homepage, /href="\/guides\/azure-load-balancer-pricing\/"/);
  assert.match(homepage, /href="\/guides\/azure-event-hubs-pricing\/"/);
});

test("guides index elevates Azure Load Balancer and fast-moving service pages", () => {
  assert.match(guidesIndex, /href="\/guides\/azure-load-balancer-pricing\/"/);
  assert.match(guidesIndex, /Fast-moving service pages/i);
  assert.match(guidesIndex, /href="\/guides\/aws-cloudtrail-pricing\/"/);
  assert.match(guidesIndex, /href="\/guides\/aws-cloudwatch-metrics-pricing\/"/);
  assert.match(guidesIndex, /href="\/guides\/aws-route-53-pricing\/"/);
  assert.match(guidesIndex, /href="\/guides\/aws-s3-glacier-pricing\/"/);
});

test("azure provider guide hub spotlights ACR, Load Balancer, and Event Hubs", () => {
  assert.match(azureGuideHub, /Fast-moving Azure pricing pages/i);
  assert.match(azureGuideHub, /href="\/guides\/azure-container-registry-pricing\/"/);
  assert.match(azureGuideHub, /href="\/guides\/azure-load-balancer-pricing\/"/);
  assert.match(azureGuideHub, /href="\/guides\/azure-event-hubs-pricing\/"/);
});

test("gcp provider guide hub spotlights Cloud Run, Cloud SQL, and Cloud Storage", () => {
  assert.match(gcpGuideHub, /Fast-moving GCP pricing pages/i);
  assert.match(gcpGuideHub, /href="\/guides\/gcp-cloud-run-pricing\/"/);
  assert.match(gcpGuideHub, /href="\/guides\/gcp-cloud-sql-pricing\/"/);
  assert.match(gcpGuideHub, /href="\/guides\/gcp-cloud-storage-pricing\/"/);
});
