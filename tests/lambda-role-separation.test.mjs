import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const normalize = (value) => value.replace(/\s+/g, " ").trim();

const pricingPage = normalize(readFileSync(new URL("../src/pages/guides/aws-lambda-pricing.astro", import.meta.url), "utf8"));
const concurrencyPage = normalize(
  readFileSync(new URL("../src/pages/guides/aws-lambda-concurrency-and-cold-starts.astro", import.meta.url), "utf8"),
);
const optimizationPage = normalize(
  readFileSync(new URL("../src/pages/guides/aws-lambda-cost-optimization.astro", import.meta.url), "utf8"),
);

test("pricing page is framed as the Lambda bill-boundary page", () => {
  assert.match(
    pricingPage,
    /Use this page when you need to decide what belongs inside the Lambda bill before you debate cold starts, retries, or runtime tuning/i,
  );
  assert.match(
    pricingPage,
    /This guide is about bill boundaries: request charges, GB-seconds, provisioned concurrency baseline cost, and the adjacent logging, networking, and downstream service costs that should be tracked beside Lambda rather than blended into it/i,
  );
});

test("concurrency page is framed as the capacity-and-latency measurement page", () => {
  assert.match(
    concurrencyPage,
    /This page is the capacity-and-latency measurement page, not the bill-boundary page: the goal is to turn concurrency shape, cold-start frequency, and provisioned-concurrency windows into a defendable duration and baseline-cost model/i,
  );
  assert.match(
    concurrencyPage,
    /If you still are not sure which costs belong inside the Lambda bill versus beside it, go back to the pricing guide first/i,
  );
});

test("optimization page is framed as the production intervention page", () => {
  assert.match(
    optimizationPage,
    /Optimization starts only after you know whether GB-seconds, memory sizing, retry storms, logging overhead, or provisioned concurrency baseline cost are the real Lambda cost driver; otherwise teams tune the wrong path/i,
  );
  assert.match(
    optimizationPage,
    /This page is for production intervention: duration reduction, memory right-sizing, retry cleanup, logging control, and selective concurrency tuning/i,
  );
});
