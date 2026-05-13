import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const normalize = (value) => value.replace(/\s+/g, " ").trim();

const azureContainerRegistryPricingPage = normalize(
  readFileSync(new URL("../src/pages/guides/azure-container-registry-pricing.astro", import.meta.url), "utf8"),
);
const azureEventHubsPricingPage = normalize(
  readFileSync(new URL("../src/pages/guides/azure-event-hubs-pricing.astro", import.meta.url), "utf8"),
);
const gcpCloudRunPricingPage = normalize(
  readFileSync(new URL("../src/pages/guides/gcp-cloud-run-pricing.astro", import.meta.url), "utf8"),
);

test("ACR pricing page uses sharper SERP wording and first-screen promise", () => {
  assert.match(
    azureContainerRegistryPricingPage,
    /Azure Container Registry Pricing: Understand storage, image pulls, geo-replication, and tier tradeoffs/i,
  );
  assert.match(
    azureContainerRegistryPricingPage,
    /Use this page when you need to show whether ACR spend is really coming from stored layers, pull churn during deploys, cross-region delivery, or the capability jump from Standard to Premium\./i,
  );
});

test("Event Hubs pricing page uses sharper SERP wording and first-screen promise", () => {
  assert.match(
    azureEventHubsPricingPage,
    /Azure Event Hubs Pricing: Model ingress, retention, replay, and burst-throughput cost/i,
  );
  assert.match(
    azureEventHubsPricingPage,
    /Use this page when you need to explain whether the bill shape comes from bytes entering the stream, retained history, consumer rereads, or burst windows that make a calm-day average unusable\./i,
  );
});

test("Cloud Run pricing page uses sharper SERP wording and first-screen promise", () => {
  assert.match(
    gcpCloudRunPricingPage,
    /GCP Cloud Run Pricing: Estimate requests, CPU-seconds, memory-seconds, concurrency, and egress/i,
  );
  assert.match(
    gcpCloudRunPricingPage,
    /Use this page when you need to decide whether Cloud Run spend is mostly request scale, slow handlers, low-concurrency compute time, large responses, or logging that rises with every retry and timeout\./i,
  );
});
