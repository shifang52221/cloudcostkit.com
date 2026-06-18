import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const pricingPage = readFileSync(new URL("../src/pages/guides/aws-cloudtrail-pricing.astro", import.meta.url), "utf8");
const estimatePage = readFileSync(new URL("../src/pages/guides/aws-cloudtrail-estimate-events.astro", import.meta.url), "utf8");
const optimizationPage = readFileSync(
  new URL("../src/pages/guides/aws-cloudtrail-cost-optimization.astro", import.meta.url),
  "utf8",
);

test("pricing page is framed as the CloudTrail bill-boundary page", () => {
  assert.match(
    pricingPage,
    /Use this page when you need to decide what belongs inside the CloudTrail bill before you debate selector tuning, retention changes, or downstream log reduction/i,
  );
  assert.match(
    pricingPage,
    /This guide is about bill boundaries: management events, data events, CloudTrail Insights, and the adjacent storage, scan, and SIEM costs that should be tracked beside CloudTrail rather than blended into it/i,
  );
  assert.match(
    pricingPage,
    /first copy of management events/i,
  );
  assert.match(
    pricingPage,
    /CloudTrail Lake/i,
  );
});

test("estimate page is framed as the event-measurement workflow page", () => {
  assert.match(
    estimatePage,
    /This page is the CloudTrail event-measurement workflow, not the bill-boundary page: the goal is to turn CloudTrail Lake counts, S3 log queries, eventCategory splits, eventSource hotspots, and busy-week evidence into a defendable monthly event model/i,
  );
  assert.match(
    estimatePage,
    /If you are still deciding which line items belong inside the CloudTrail bill, go back to the pricing guide first/i,
  );
});

test("optimization page is framed as the production intervention page", () => {
  assert.match(
    optimizationPage,
    /Optimization starts only after you know whether data event scope, management-event churn, or downstream storage and query waste is the real CloudTrail cost driver; otherwise teams tighten selectors or retention blindly without moving the right bill/i,
  );
  assert.match(
    optimizationPage,
    /This page is for production intervention: selector discipline, automation-noise reduction, retention policy, and scan reduction/i,
  );
});
