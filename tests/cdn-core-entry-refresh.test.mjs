import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const normalize = (value) => value.replace(/\s+/g, " ").trim();

const cdnGuide = normalize(
  readFileSync(new URL("../src/pages/guides/cdn-costs.astro", import.meta.url), "utf8"),
);
const cdnCalculator = normalize(
  readFileSync(new URL("../src/pages/calculators/cdn-cost-calculator.astro", import.meta.url), "utf8"),
);
const cdnBandwidthCalculator = normalize(
  readFileSync(new URL("../src/pages/calculators/cdn-bandwidth-cost-calculator.astro", import.meta.url), "utf8"),
);
const comparisonGuide = normalize(
  readFileSync(new URL("../src/pages/guides/cdn-cost-comparison.astro", import.meta.url), "utf8"),
);
const perGbGuide = normalize(
  readFileSync(new URL("../src/pages/guides/cdn-cost-per-gigabyte.astro", import.meta.url), "utf8"),
);
const requestGuide = normalize(
  readFileSync(new URL("../src/pages/guides/cdn-request-pricing.astro", import.meta.url), "utf8"),
);
const measurementGuide = normalize(
  readFileSync(new URL("../src/pages/guides/estimate-cdn-bandwidth-gb-per-month.astro", import.meta.url), "utf8"),
);
const conceptGuide = normalize(
  readFileSync(new URL("../src/pages/guides/origin-egress-vs-cdn-bandwidth.astro", import.meta.url), "utf8"),
);

test("CDN guide opens like a stronger generic pricing entry page", () => {
  assert.match(
    cdnGuide,
    /If you searched for CDN cost, CDN pricing, or CDN cost comparison, the first question is which CDN line item moved first and whether the problem is bandwidth, request fees, origin leakage, or provider choice/i,
  );
  assert.match(
    cdnGuide,
    /which CDN line item moved first.*which tool to use next.*what to validate next/i,
  );
  assert.match(
    cdnGuide,
    /provider comparison|per-GB pricing|request pricing|origin egress/i,
  );
});

test("Main CDN calculator reads as a sharper multi-surface planner", () => {
  assert.match(
    cdnCalculator,
    /full CDN planner when one number is not enough.*bandwidth, request fees, and origin egress visible together/i,
  );
  assert.match(
    cdnCalculator,
    /bandwidth share.*request share.*origin egress share/i,
  );
  assert.match(
    cdnCalculator,
    /image-heavy storefront|video or download distribution|dynamic API at the edge|launch month/i,
  );
  assert.match(
    cdnCalculator,
    /dominant cost surface|next step by intent/i,
  );
});

test("CDN bandwidth calculator owns edge-delivery planning specifically", () => {
  assert.match(
    cdnBandwidthCalculator,
    /edge delivery cost|delivered edge GB|effective \$\/GB|launch or media spike/i,
  );
  assert.match(
    cdnBandwidthCalculator,
    /video|media|download|storefront|campaign|launch/i,
  );
  assert.match(
    cdnBandwidthCalculator,
    /request fees.*origin leakage.*full CDN planner/i,
  );
  assert.doesNotMatch(
    cdnBandwidthCalculator,
    /public internet egress|cross-region replication|DR traffic/i,
  );
});

test("CDN guide refresh keeps the narrower guide roles intact", () => {
  assert.match(
    comparisonGuide,
    /provider comparison page, not the CDN bill-boundary page/i,
  );
  assert.match(
    perGbGuide,
    /bandwidth-rate page, not the full delivery-bill page/i,
  );
  assert.match(
    requestGuide,
    /request-fee page, not the full CDN bill-boundary page/i,
  );
  assert.match(
    measurementGuide,
    /bandwidth-measurement page, not the full CDN pricing page/i,
  );
  assert.match(
    conceptGuide,
    /concept clarifier page, not the full CDN bill-boundary page/i,
  );
});
