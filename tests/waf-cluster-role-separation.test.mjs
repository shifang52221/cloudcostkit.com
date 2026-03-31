import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const pricingPage = readFileSync(new URL("../src/pages/guides/aws-waf-pricing.astro", import.meta.url), "utf8");
const estimatePage = readFileSync(new URL("../src/pages/guides/aws-waf-estimate-requests.astro", import.meta.url), "utf8");
const optimizationPage = readFileSync(new URL("../src/pages/guides/aws-waf-cost-optimization.astro", import.meta.url), "utf8");

test("pricing page is framed as the budget-boundary page", () => {
  assert.match(
    pricingPage,
    /Use this page when you need to decide what belongs inside the WAF bill model before you argue about optimization/i,
  );
  assert.match(
    pricingPage,
    /This guide is about budget boundaries: Web ACLs, rules, evaluated requests, and the downstream logging or SIEM costs that should be tracked beside WAF rather than confused with it/i,
  );
});

test("estimate page is framed as the measurement workflow page", () => {
  assert.match(
    estimatePage,
    /This page is the measurement workflow, not the budget-boundary page: the goal is to turn observed traffic and attack windows into a defendable evaluated-request model/i,
  );
  assert.match(
    estimatePage,
    /If you still are not sure which costs belong inside the WAF bill, go back to the pricing guide first/i,
  );
});

test("optimization page is framed as the production intervention page", () => {
  assert.match(
    optimizationPage,
    /Optimization starts only after the evaluated-request model is believable; otherwise teams trim the wrong control and keep the real cost driver/i,
  );
  assert.match(
    optimizationPage,
    /This page is for production intervention: caching strategy, rate limits, rule consolidation, and logging controls/i,
  );
});
