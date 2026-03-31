import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const pricingPage = readFileSync(new URL("../src/pages/guides/aws-sns-pricing.astro", import.meta.url), "utf8");
const estimatePage = readFileSync(new URL("../src/pages/guides/aws-sns-estimate-deliveries.astro", import.meta.url), "utf8");
const optimizationPage = readFileSync(new URL("../src/pages/guides/aws-sns-cost-optimization.astro", import.meta.url), "utf8");

test("pricing page is framed as the bill-boundary page", () => {
  assert.match(
    pricingPage,
    /Use this page when you need to decide what belongs inside the SNS bill model before you argue about optimization/i,
  );
  assert.match(
    pricingPage,
    /This guide is about bill boundaries: publishes, deliveries, fan-out and retry-driven SNS cost, and the adjacent downstream costs that should be tracked beside SNS rather than confused with it/i,
  );
});

test("estimate page is framed as the delivery-measurement workflow page", () => {
  assert.match(
    estimatePage,
    /This page is the delivery-measurement workflow, not the bill-boundary page: the goal is to turn publishes, matched fan-out, and retries into a defendable delivery model/i,
  );
  assert.match(
    estimatePage,
    /If you still are not sure which costs and traffic belong inside the SNS bill, go back to the pricing guide first/i,
  );
});

test("optimization page is framed as the production intervention page", () => {
  assert.match(
    optimizationPage,
    /Optimization starts only after the SNS delivery model is believable; otherwise teams trim the wrong topic or filter and keep the real cost driver/i,
  );
  assert.match(
    optimizationPage,
    /This page is for production intervention: topic split, filter policies, endpoint repair, dedupe, and rate limits/i,
  );
});
