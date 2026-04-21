import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const normalize = (value) => value.replace(/\s+/g, " ").trim();

const pricingPage = normalize(readFileSync(new URL("../src/pages/guides/aws-kms-pricing.astro", import.meta.url), "utf8"));
const estimatePage = normalize(
  readFileSync(new URL("../src/pages/guides/aws-kms-estimate-requests.astro", import.meta.url), "utf8"),
);
const optimizationPage = normalize(
  readFileSync(new URL("../src/pages/guides/aws-kms-cost-optimization.astro", import.meta.url), "utf8"),
);

test("pricing page is framed as the bill-boundary page", () => {
  assert.match(
    pricingPage,
    /Use this page when you need to decide what belongs inside the KMS bill model before you argue about optimization/i,
  );
  assert.match(
    pricingPage,
    /This is the AWS KMS request and key-boundary page/i,
  );
});

test("estimate page is framed as the request-measurement workflow page", () => {
  assert.match(
    estimatePage,
    /This page is the request-measurement workflow, not the bill-boundary page: the goal is to turn workload units and KMS calls per unit into a defendable request model/i,
  );
  assert.match(
    estimatePage,
    /If you still are not sure which charges and call sources belong inside the KMS bill, go back to the pricing guide first/i,
  );
});

test("optimization page is framed as the production intervention page", () => {
  assert.match(
    optimizationPage,
    /Optimization starts only after the KMS request model is believable; otherwise teams trim the wrong cache or batch and keep the real cost driver/i,
  );
  assert.match(
    optimizationPage,
    /This page is for production intervention: caching, batching, key-generation frequency, retry control, and non-prod discipline/i,
  );
});
