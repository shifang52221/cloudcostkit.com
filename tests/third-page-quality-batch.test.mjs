import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const normalize = (value) => value.replace(/\s+/g, " ").trim();

const originGuide = normalize(
  readFileSync(new URL("../src/pages/guides/origin-egress-vs-cdn-bandwidth.astro", import.meta.url), "utf8"),
);
const invalidationGuide = normalize(
  readFileSync(new URL("../src/pages/guides/aws-cloudfront-invalidation-pricing.astro", import.meta.url), "utf8"),
);
const logGuide = normalize(
  readFileSync(new URL("../src/pages/guides/log-costs.astro", import.meta.url), "utf8"),
);
const route53Guide = normalize(
  readFileSync(new URL("../src/pages/guides/aws-route-53-pricing.astro", import.meta.url), "utf8"),
);

test("origin versus edge guide opens with a clearer ownership decision", () => {
  assert.match(
    originGuide,
    /The first budgeting decision is whether the delivery bill mostly belongs on the CDN edge or on the origin because cache-fill traffic is still too heavy/i,
  );
});

test("CloudFront invalidation guide opens with a clearer direct-versus-indirect cost decision", () => {
  assert.match(
    invalidationGuide,
    /The real budgeting decision is whether invalidation is becoming a direct line-item problem or an indirect origin-and-hit-rate problem caused by broad purge behavior/i,
  );
});

test("log costs guide opens with a clearer log bill-shape decision", () => {
  assert.match(
    logGuide,
    /The first budgeting decision is whether the log bill is mainly an ingestion problem, a retention problem, or an incident-time search problem/i,
  );
});

test("Route 53 guide opens with a clearer bill-shape decision", () => {
  assert.match(
    route53Guide,
    /The first budgeting decision is whether Route 53 spend is mainly query-led, zone-led, or health-check-led/i,
  );
});
