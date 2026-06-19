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
const gcpCloudLoggingPricingPage = normalize(
  readFileSync(new URL("../src/pages/guides/gcp-cloud-logging-pricing.astro", import.meta.url), "utf8"),
);
const awsWafPricingPage = normalize(
  readFileSync(new URL("../src/pages/guides/aws-waf-pricing.astro", import.meta.url), "utf8"),
);
const cloudTrailPricingPage = normalize(
  readFileSync(new URL("../src/pages/guides/aws-cloudtrail-pricing.astro", import.meta.url), "utf8"),
);

test("ACR pricing page uses sharper SERP wording and first-screen promise", () => {
  assert.match(
    azureContainerRegistryPricingPage,
    /Azure Container Registry Pricing: Tier Limits, Storage, and Geo-Replication/i,
  );
  assert.match(
    azureContainerRegistryPricingPage,
    /Use this page when you need to show whether ACR spend is really coming from stored layers, pull churn during deploys, cross-region delivery, or the capability jump from Standard to Premium\./i,
  );
  assert.match(
    azureContainerRegistryPricingPage,
    /Quick tier snapshot: what most teams need first/i,
  );
  assert.match(
    azureContainerRegistryPricingPage,
    /Price per day.*Basic.*10 GiB.*Standard.*100 GiB.*Premium.*500 GiB.*Geo-replication.*Throughput/i,
  );
  assert.match(
    azureContainerRegistryPricingPage,
    /How to think about the ACR Basic monthly price/i,
  );
  assert.match(
    azureContainerRegistryPricingPage,
    /updated on 2026-06-19/i,
  );
});

test("Event Hubs pricing page uses sharper SERP wording and first-screen promise", () => {
  assert.match(
    azureEventHubsPricingPage,
    /Azure Event Hubs Pricing: TUs, PUs, Capture, Retention, and Replay Cost/i,
  );
  assert.match(
    azureEventHubsPricingPage,
    /Use this page when you need to explain whether the bill shape comes from bytes entering the stream, retained history, consumer rereads, or burst windows that make a calm-day average unusable\./i,
  );
  assert.match(
    azureEventHubsPricingPage,
    /Basic, Standard, Premium, and Dedicated/i,
  );
  assert.match(
    azureEventHubsPricingPage,
    /Throughput Units.*Processing Units.*Capacity Units/i,
  );
});

test("Cloud Run pricing page uses sharper SERP wording and first-screen promise", () => {
  assert.match(
    gcpCloudRunPricingPage,
    /GCP Cloud Run Pricing: Request-Based vs Instance-Based Billing, vCPU, Memory, and Egress/i,
  );
  assert.match(
    gcpCloudRunPricingPage,
    /Quick pricing read: what most teams need first/i,
  );
  assert.match(
    gcpCloudRunPricingPage,
    /Use this page when you need to decide whether Cloud Run spend is mostly request scale, slow handlers, low-concurrency compute time, large responses, or logging that rises with every retry and timeout\./i,
  );
  assert.match(
    gcpCloudRunPricingPage,
    /Quick pricing read/i,
  );
  assert.match(
    gcpCloudRunPricingPage,
    /request-based billing.*instance-based billing/i,
  );
  assert.match(
    gcpCloudRunPricingPage,
    /Artifact Registry.*Cloud Build.*beside the Cloud Run bill/i,
  );
  assert.match(
    gcpCloudRunPricingPage,
    /updated on 2026-06-19/i,
  );
});

test("Cloud Logging pricing page uses sharper SERP wording and first-screen promise", () => {
  assert.match(
    gcpCloudLoggingPricingPage,
    /GCP Cloud Logging Pricing: Ingestion, Retention, Query Costs, and Log Buckets/i,
  );
  assert.match(
    gcpCloudLoggingPricingPage,
    /the first budgeting decision is whether Cloud Logging cost is mainly being created by ingestion volume, retention policy, or repeated query and scan behavior/i,
  );
  assert.match(
    gcpCloudLoggingPricingPage,
    /Quick pricing read/i,
  );
  assert.match(
    gcpCloudLoggingPricingPage,
    /Cloud Logging-native charges|inside the Cloud Logging bill/i,
  );
  assert.match(
    gcpCloudLoggingPricingPage,
    /BigQuery|Pub\/Sub|SIEM|beside the Cloud Logging bill/i,
  );
  assert.match(
    gcpCloudLoggingPricingPage,
    /updated on 2026-06-18/i,
  );
});

test("WAF pricing page uses sharper SERP wording and first-screen promise", () => {
  assert.match(
    awsWafPricingPage,
    /AWS WAF Pricing: Web ACLs, Request Charges, Bot Control, and Logging Boundaries/i,
  );
  assert.match(
    awsWafPricingPage,
    /Stay here when the open question is Web ACLs, rules, evaluated requests, optional managed protections, and the downstream logging or SIEM costs that should be tracked beside WAF rather than confused with it/i,
  );
  assert.match(
    awsWafPricingPage,
    /Quick pricing read/i,
  );
  assert.match(
    awsWafPricingPage,
    /Web ACLs?.*evaluated requests.*blocked traffic/i,
  );
  assert.match(
    awsWafPricingPage,
    /Bot Control|CAPTCHA|Challenge|Fraud Control/i,
  );
  assert.match(
    awsWafPricingPage,
    /updated on 2026-06-18/i,
  );
});

test("CloudTrail pricing page now answers the pricing intent earlier", () => {
  assert.match(
    cloudTrailPricingPage,
    /first copy of management events/i,
  );
  assert.match(
    cloudTrailPricingPage,
    /Trails vs CloudTrail Lake/i,
  );
  assert.match(
    cloudTrailPricingPage,
    /data events.*CloudTrail Insights/i,
  );
});
