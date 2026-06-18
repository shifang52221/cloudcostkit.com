import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const pricingPage = readFileSync(new URL("../src/pages/guides/aws-route-53-pricing.astro", import.meta.url), "utf8");
const estimatePage = readFileSync(new URL("../src/pages/guides/aws-route-53-estimate-dns-queries.astro", import.meta.url), "utf8");
const optimizationPage = readFileSync(new URL("../src/pages/guides/aws-route-53-cost-optimization.astro", import.meta.url), "utf8");

test("pricing page is framed as the Route 53 bill-boundary page", () => {
  assert.match(
    pricingPage,
    /Use this page when you need to decide what belongs inside the Route 53 bill before you debate TTL tuning or query reduction/i,
  );
  assert.match(
    pricingPage,
    /This guide is about bill boundaries: hosted zones, DNS queries, health checks, and the adjacent resolver, CDN, and incident-side costs that should be tracked beside Route 53 rather than blended into it/i,
  );
  assert.match(
    pricingPage,
    /private hosted zone queries/i,
  );
  assert.match(
    pricingPage,
    /alias queries.*AWS resources.*free/i,
  );
});

test("estimate page is framed as the DNS measurement workflow page", () => {
  assert.match(
    estimatePage,
    /This page is the DNS measurement workflow, not the bill-boundary page: the goal is to turn authoritative query metrics, query logs, resolver evidence, TTL posture, and retry behavior into a defendable monthly query model/i,
  );
  assert.match(
    estimatePage,
    /If you are still deciding which line items belong inside the Route 53 bill, go back to the pricing guide first/i,
  );
});

test("optimization page is framed as the production intervention page", () => {
  assert.match(
    optimizationPage,
    /Optimization starts only after you know whether queries, hosted zones, or health checks are the real Route 53 cost driver; otherwise teams tune TTLs and clean up records without changing the bill/i,
  );
  assert.match(
    optimizationPage,
    /This page is for production intervention: TTL policy, query amplification fixes, health-check discipline, and zone-sprawl cleanup/i,
  );
});
