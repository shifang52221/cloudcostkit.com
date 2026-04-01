import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const pricingPage = readFileSync(new URL("../src/pages/guides/aws-secrets-manager-pricing.astro", import.meta.url), "utf8");
const estimatePage = readFileSync(new URL("../src/pages/guides/aws-secrets-manager-estimate-api-calls.astro", import.meta.url), "utf8");
const optimizationPage = readFileSync(new URL("../src/pages/guides/aws-secrets-manager-cost-optimization.astro", import.meta.url), "utf8");

test("pricing page is framed as the Secrets Manager bill-boundary page", () => {
  assert.match(
    pricingPage,
    /Use this page when you need to decide what belongs inside the Secrets Manager bill before you debate caching strategy or request reduction/i,
  );
  assert.match(
    pricingPage,
    /This guide is about bill boundaries: secret-months, Secrets Manager API requests, and the adjacent rotation, Lambda, and incident-side costs that should be tracked beside Secrets Manager rather than blended into it/i,
  );
});

test("estimate page is framed as the API-call measurement workflow page", () => {
  assert.match(
    estimatePage,
    /This page is the Secrets Manager API-call measurement workflow, not the bill-boundary page: the goal is to turn CloudTrail evidence, process starts, cache refreshes, hot-path fetches, and retry behavior into a defendable monthly request model/i,
  );
  assert.match(
    estimatePage,
    /If you are still deciding which line items belong inside the Secrets Manager bill, go back to the pricing guide first/i,
  );
});

test("optimization page is framed as the production intervention page", () => {
  assert.match(
    optimizationPage,
    /Optimization starts only after you know whether secret-months or API requests are the real Secrets Manager cost driver; otherwise teams change caching and refresh logic without moving the bill/i,
  );
  assert.match(
    optimizationPage,
    /This page is for production intervention: caching policy, hot-path removal, refresh discipline, and churn reduction/i,
  );
});
