import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const pricingPage = readFileSync(new URL("../src/pages/guides/aws-vpc-endpoints-pricing.astro", import.meta.url), "utf8");
const estimatePage = readFileSync(new URL("../src/pages/guides/aws-vpc-endpoints-estimate-hours-and-gb.astro", import.meta.url), "utf8");
const optimizationPage = readFileSync(new URL("../src/pages/guides/aws-vpc-endpoints-cost-optimization.astro", import.meta.url), "utf8");

test("pricing page is framed as the bill-boundary page", () => {
  assert.match(
    pricingPage,
    /Use this page when you need to decide what belongs inside the endpoint bill model before you argue about optimization/i,
  );
  assert.match(
    pricingPage,
    /This guide is about bill boundaries: endpoint-hours, GB processed, endpoint type, and the transfer or architecture costs that should be tracked beside endpoints rather than confused with them/i,
  );
});

test("estimate page is framed as the input-measurement workflow page", () => {
  assert.match(
    estimatePage,
    /This page is the input-measurement workflow, not the bill-boundary page: the goal is to turn endpoint inventory, AZ coverage, hours, and GB into a defendable model/i,
  );
  assert.match(
    estimatePage,
    /If you still are not sure which charges belong inside the endpoint bill, go back to the pricing guide first/i,
  );
});

test("optimization page is framed as the production intervention page", () => {
  assert.match(
    optimizationPage,
    /Optimization starts only after the endpoint-hours and GB model is believable; otherwise teams cut the wrong endpoint or AZ and keep the real cost driver/i,
  );
  assert.match(
    optimizationPage,
    /This page is for production intervention: endpoint consolidation, AZ right-sizing, traffic reduction, and locality fixes/i,
  );
});
