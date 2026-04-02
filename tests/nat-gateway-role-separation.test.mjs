import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const normalize = (value) => value.replace(/\s+/g, " ").trim();

const pricingPage = normalize(readFileSync(new URL("../src/pages/guides/aws-nat-gateway-cost.astro", import.meta.url), "utf8"));
const estimatePage = normalize(
  readFileSync(new URL("../src/pages/guides/aws-nat-gateway-estimate-gb-processed.astro", import.meta.url), "utf8"),
);
const optimizationPage = normalize(
  readFileSync(new URL("../src/pages/guides/aws-nat-gateway-cost-optimization.astro", import.meta.url), "utf8"),
);

test("pricing page is framed as the NAT Gateway bill-boundary page", () => {
  assert.match(
    pricingPage,
    /Use this page when you need to decide what belongs inside the NAT Gateway bill before you debate endpoints, retries, or traffic-shape fixes/i,
  );
  assert.match(
    pricingPage,
    /This guide is about bill boundaries: gateway-hours, processed-GB charges, and the adjacent cross-AZ transfer, internet egress, private-connectivity, and downstream traffic costs that should be tracked beside NAT Gateway rather than blended into it/i,
  );
});

test("estimate page is framed as the processed-GB measurement workflow page", () => {
  assert.match(
    estimatePage,
    /This page is the processed-GB measurement workflow, not the bill-boundary page: the goal is to turn NAT metrics, flow logs, throughput charts, and traffic-source evidence into a defendable GB-per-month model/i,
  );
  assert.match(
    estimatePage,
    /If you still are not sure which costs belong inside the NAT Gateway bill versus beside it, go back to the pricing guide first/i,
  );
});

test("optimization page is framed as the production intervention page", () => {
  assert.match(
    optimizationPage,
    /Optimization starts only after you know whether gateway-hours, processed GB, download storms, external API traffic, or retry-driven spikes are the real NAT Gateway cost driver; otherwise teams privatize, cache, or schedule the wrong path/i,
  );
  assert.match(
    optimizationPage,
    /This page is for production intervention: private-path adoption, download control, retry cleanup, non-prod scheduling, and validation of what actually moved off NAT/i,
  );
});
