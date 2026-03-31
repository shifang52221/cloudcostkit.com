import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const awsGuideHub = readFileSync(new URL("../src/pages/guides/aws.astro", import.meta.url), "utf8");
const azureGuideHub = readFileSync(new URL("../src/pages/guides/azure.astro", import.meta.url), "utf8");
const gcpGuideHub = readFileSync(new URL("../src/pages/guides/gcp.astro", import.meta.url), "utf8");

test("aws provider guide hub is treated as a routing page and uses noindex,follow", () => {
  assert.match(awsGuideHub, /robots="noindex,follow"/i);
  assert.match(
    awsGuideHub,
    /This page is an AWS routing layer: use it to choose the next estimating job, not to replace the deeper service guide you actually need/i,
  );
  assert.match(
    awsGuideHub,
    /Start with the bill shape that is already causing uncertainty: transfer-heavy, runtime-heavy, storage-growth-heavy, observability-heavy, or request-heavy/i,
  );
});

test("azure provider guide hub explains Azure-specific boundary mistakes", () => {
  assert.match(
    azureGuideHub,
    /Use this hub when the Azure-specific billing boundary matters more than the generic category page/i,
  );
  assert.match(
    azureGuideHub,
    /Azure estimates break fastest when internet egress, private backbone paths, and premium SKU baselines are blended into one number too early/i,
  );
});

test("gcp provider guide hub explains GCP-specific boundary mistakes", () => {
  assert.match(
    gcpGuideHub,
    /Use this hub when the provider boundary is the real question, not just the category label/i,
  );
  assert.match(
    gcpGuideHub,
    /GCP estimates usually drift when inter-zone transfer, serverless retry multiplication, and logging growth are modeled after the main service price instead of before it/i,
  );
});
