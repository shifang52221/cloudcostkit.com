import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const pricingPage = readFileSync(new URL("../src/pages/guides/aws-sqs-pricing.astro", import.meta.url), "utf8");
const estimatePage = readFileSync(new URL("../src/pages/guides/aws-sqs-estimate-requests.astro", import.meta.url), "utf8");
const optimizationPage = readFileSync(new URL("../src/pages/guides/aws-sqs-cost-optimization.astro", import.meta.url), "utf8");

test("pricing page is framed as the scope-and-budgeting page", () => {
  assert.match(
    pricingPage,
    /Use this page when you still need to decide what belongs inside the SQS bill model before you argue about optimization/i,
  );
  assert.match(
    pricingPage,
    /This guide is about scope discipline: queue requests, retry amplification, polling tax, and the downstream services that should be budgeted beside SQS rather than confused with it/i,
  );
});

test("estimate page is framed as the measurement workflow page", () => {
  assert.match(
    estimatePage,
    /This page is the measurement workflow, not the policy page: the goal is to turn observed message behavior into a request-volume model you can defend/i,
  );
  assert.match(
    estimatePage,
    /If you still are not sure whether SQS is even the right service boundary, go back to the pricing guide first/i,
  );
});

test("optimization page is framed as the operational intervention page", () => {
  assert.match(
    optimizationPage,
    /Optimization starts only after the request model is believable; otherwise teams cut the wrong thing and keep the real multiplier/i,
  );
  assert.match(
    optimizationPage,
    /This page is for operational intervention: batching, polling, retry control, visibility tuning, and DLQ policy changes/i,
  );
});
