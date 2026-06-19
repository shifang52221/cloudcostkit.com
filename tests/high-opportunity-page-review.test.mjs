import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const normalize = (value) => value.replace(/\s+/g, " ").trim();

const acrGuide = normalize(
  readFileSync(new URL("../src/pages/guides/azure-container-registry-pricing.astro", import.meta.url), "utf8"),
);
const azureLoadBalancerGuide = normalize(
  readFileSync(new URL("../src/pages/guides/azure-load-balancer-pricing.astro", import.meta.url), "utf8"),
);
const eventHubsGuide = normalize(
  readFileSync(new URL("../src/pages/guides/azure-event-hubs-pricing.astro", import.meta.url), "utf8"),
);
const cloudRunGuide = normalize(
  readFileSync(new URL("../src/pages/guides/gcp-cloud-run-pricing.astro", import.meta.url), "utf8"),
);
const cloudLoggingGuide = normalize(
  readFileSync(new URL("../src/pages/guides/gcp-cloud-logging-pricing.astro", import.meta.url), "utf8"),
);
const cloudSqlGuide = normalize(
  readFileSync(new URL("../src/pages/guides/gcp-cloud-sql-pricing.astro", import.meta.url), "utf8"),
);
const cloudCdnGuide = normalize(
  readFileSync(new URL("../src/pages/guides/gcp-cloud-cdn-pricing.astro", import.meta.url), "utf8"),
);
const route53Guide = normalize(
  readFileSync(new URL("../src/pages/guides/aws-route-53-pricing.astro", import.meta.url), "utf8"),
);
const cloudwatchMetricsGuide = normalize(
  readFileSync(new URL("../src/pages/guides/aws-cloudwatch-metrics-pricing.astro", import.meta.url), "utf8"),
);
const wafGuide = normalize(
  readFileSync(new URL("../src/pages/guides/aws-waf-pricing.astro", import.meta.url), "utf8"),
);
const auroraServerlessGuide = normalize(
  readFileSync(new URL("../src/pages/guides/aws-aurora-serverless-v2-pricing.astro", import.meta.url), "utf8"),
);
const glacierGuide = normalize(
  readFileSync(new URL("../src/pages/guides/aws-s3-glacier-pricing.astro", import.meta.url), "utf8"),
);
const secretsGuide = normalize(
  readFileSync(new URL("../src/pages/guides/aws-secrets-manager-pricing.astro", import.meta.url), "utf8"),
);

test("ACR guide opens with a tier-choice and pull-topology budgeting decision", () => {
  assert.match(
    acrGuide,
    /The real budgeting decision is usually whether your registry problem is storage growth, pull pressure, or cross-region delivery/i,
  );
});

test("Azure Load Balancer guide opens with pricing-first bill-boundary framing", () => {
  assert.match(
    azureLoadBalancerGuide,
    /If you searched for Azure Load Balancer pricing, the first thing to confirm is what Azure actually bills on the load balancer line versus what still lands on bandwidth or adjacent network services/i,
  );
  assert.match(
    azureLoadBalancerGuide,
    /Quick pricing read/i,
  );
  assert.match(
    azureLoadBalancerGuide,
    /rules, data processed, and separate bandwidth charges/i,
  );
  assert.match(
    azureLoadBalancerGuide,
    /outbound internet access or SNAT design.*Azure Load Balancer outbound rules.*NAT Gateway.*more accurate pricing surface/i,
  );
});

test("Event Hubs guide opens with replay-aware budgeting framing", () => {
  assert.match(
    eventHubsGuide,
    /The budgeting decision is not just how much data enters Event Hubs, but how retention and rereads change the total stream cost shape/i,
  );
  assert.match(
    eventHubsGuide,
    /Quick pricing read/i,
  );
  assert.match(
    eventHubsGuide,
    /choose the right pricing tier before you model event volume/i,
  );
  assert.match(
    eventHubsGuide,
    /Basic.*Standard.*Premium.*Dedicated/i,
  );
});

test("Cloud Run guide opens with clearer service-shape budgeting framing", () => {
  assert.match(
    cloudRunGuide,
    /Use this page when you need to decide whether Cloud Run spend is mostly request scale, slow handlers, low-concurrency compute time, large responses, or logging that rises with every retry and timeout/i,
  );
  assert.match(
    cloudRunGuide,
    /Quick pricing read: what most teams need first/i,
  );
  assert.match(
    cloudRunGuide,
    /request-based billing.*instance-based billing/i,
  );
  assert.match(
    cloudRunGuide,
    /vCPU.*memory.*request charges/i,
  );
  assert.match(
    cloudRunGuide,
    /Cloud Run jobs|jobs are billed/i,
  );
  assert.match(
    cloudRunGuide,
    /updated on 2026-06-19/i,
  );
});

test("Cloud Logging guide opens with stronger GCP pricing cues", () => {
  assert.match(
    cloudLoggingGuide,
    /Quick pricing read/i,
  );
  assert.match(
    cloudLoggingGuide,
    /ingestion.*retention.*query|scan/i,
  );
  assert.match(
    cloudLoggingGuide,
    /log buckets|bucket-level/i,
  );
  assert.match(
    cloudLoggingGuide,
    /BigQuery|Pub\/Sub|SIEM|observability/i,
  );
});

test("Cloud SQL guide opens with stronger GCP pricing cues", () => {
  assert.match(
    cloudSqlGuide,
    /Quick pricing read/i,
  );
  assert.match(
    cloudSqlGuide,
    /instance-hours.*HA.*replicas/i,
  );
  assert.match(
    cloudSqlGuide,
    /storage.*backups.*network/i,
  );
  assert.match(
    cloudSqlGuide,
    /BigQuery|application retries|adjacent services/i,
  );
});

test("Cloud CDN guide opens with stronger GCP pricing cues", () => {
  assert.match(
    cloudCdnGuide,
    /Quick pricing read/i,
  );
  assert.match(
    cloudCdnGuide,
    /edge bandwidth.*requests.*cache-fill/i,
  );
  assert.match(
    cloudCdnGuide,
    /hit rate|purges?|cold cache/i,
  );
  assert.match(
    cloudCdnGuide,
    /origin egress|beside the Cloud CDN bill|origin path/i,
  );
});

test("Route 53 guide opens with stronger AWS-specific pricing cues", () => {
  assert.match(
    route53Guide,
    /Quick pricing read/i,
  );
  assert.match(
    route53Guide,
    /public hosted zones.*private hosted zones/i,
  );
  assert.match(
    route53Guide,
    /alias queries.*AWS resources.*free/i,
  );
  assert.match(
    route53Guide,
    /Traffic Flow|routing policy/i,
  );
});

test("CloudWatch metrics guide opens with stronger AWS-specific pricing cues", () => {
  assert.match(
    cloudwatchMetricsGuide,
    /Quick pricing read/i,
  );
  assert.match(
    cloudwatchMetricsGuide,
    /custom metrics.*main paid surface/i,
  );
  assert.match(
    cloudwatchMetricsGuide,
    /API requests.*dashboards/i,
  );
  assert.match(
    cloudwatchMetricsGuide,
    /high-resolution/i,
  );
});

test("WAF guide opens with stronger AWS-specific pricing cues", () => {
  assert.match(
    wafGuide,
    /Quick pricing read/i,
  );
  assert.match(
    wafGuide,
    /Web ACL.*rule groups?.*evaluated requests/i,
  );
  assert.match(
    wafGuide,
    /Bot Control|CAPTCHA|Challenge|Fraud Control|managed add-ons/i,
  );
  assert.match(
    wafGuide,
    /logging|SIEM|beside WAF|outside the WAF bill/i,
  );
});

test("Aurora Serverless v2 guide opens with stronger AWS-specific pricing cues", () => {
  assert.match(
    auroraServerlessGuide,
    /Quick pricing read/i,
  );
  assert.match(
    auroraServerlessGuide,
    /ACU-hours.*minimum-capacity baseline.*peak-window/i,
  );
  assert.match(
    auroraServerlessGuide,
    /storage.*backups/i,
  );
  assert.match(
    auroraServerlessGuide,
    /application costs|Aurora bill anatomy|database parent/i,
  );
});

test("Glacier guide opens with stronger archive pricing cues", () => {
  assert.match(
    glacierGuide,
    /Quick pricing read/i,
  );
  assert.match(
    glacierGuide,
    /Instant Retrieval.*Flexible Retrieval.*Deep Archive/i,
  );
  assert.match(
    glacierGuide,
    /minimum storage duration|minimum-duration/i,
  );
  assert.match(
    glacierGuide,
    /metadata overhead/i,
  );
});

test("Secrets Manager guide surfaces the main bill-shape question earlier", () => {
  assert.match(
    secretsGuide,
    /The first budgeting question is whether the bill is mostly a secret inventory problem or a request-pattern problem/i,
  );
});
