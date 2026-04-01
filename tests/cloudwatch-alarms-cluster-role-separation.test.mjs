import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const pricingPage = readFileSync(new URL("../src/pages/guides/aws-cloudwatch-alarms-pricing.astro", import.meta.url), "utf8");
const estimatePage = readFileSync(
  new URL("../src/pages/guides/aws-cloudwatch-alarms-estimate-alarm-count.astro", import.meta.url),
  "utf8",
);
const optimizationPage = readFileSync(
  new URL("../src/pages/guides/aws-cloudwatch-alarms-cost-optimization.astro", import.meta.url),
  "utf8",
);

test("pricing page is framed as the alarms bill-boundary page", () => {
  assert.match(
    pricingPage,
    /Use this page when you need to decide what belongs inside the CloudWatch alarms bill before you debate alarm deletion, consolidation, or notification cleanup/i,
  );
  assert.match(
    pricingPage,
    /This guide is about bill boundaries: standard alarms, high-resolution alarms, composite alarms, and the adjacent notification, metrics, and dashboard costs that should be tracked beside the alarm bill rather than blended into it/i,
  );
});

test("estimate page is framed as the alarm-inventory measurement workflow page", () => {
  assert.match(
    estimatePage,
    /This page is the alarm-inventory measurement workflow, not the bill-boundary page: the goal is to turn CloudWatch inventory, IaC counts, template expansion rules, ephemeral environments, and scaling multipliers into a defendable monthly alarm-month model/i,
  );
  assert.match(
    estimatePage,
    /If you are still deciding which line items belong inside the CloudWatch alarms bill, go back to the pricing guide first/i,
  );
});

test("optimization page is framed as the production intervention page", () => {
  assert.match(
    optimizationPage,
    /Optimization starts only after you know whether stale inventory, per-resource duplication, high-resolution overuse, or non-production sprawl is the real CloudWatch alarms cost driver; otherwise teams delete alarms blindly without removing the real waste/i,
  );
  assert.match(
    optimizationPage,
    /This page is for production intervention: alarm hygiene, duplication reduction, resolution policy, and incident-coverage preservation/i,
  );
});
