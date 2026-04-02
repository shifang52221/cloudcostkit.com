import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const normalize = (value) => value.replace(/\s+/g, " ").trim();

const billBoundaryPage = normalize(readFileSync(new URL("../src/pages/guides/cdn-costs.astro", import.meta.url), "utf8"));
const comparisonPage = normalize(
  readFileSync(new URL("../src/pages/guides/cdn-cost-comparison.astro", import.meta.url), "utf8"),
);
const bandwidthRatePage = normalize(
  readFileSync(new URL("../src/pages/guides/cdn-cost-per-gigabyte.astro", import.meta.url), "utf8"),
);
const requestFeePage = normalize(
  readFileSync(new URL("../src/pages/guides/cdn-request-pricing.astro", import.meta.url), "utf8"),
);
const bandwidthMeasurementPage = normalize(
  readFileSync(new URL("../src/pages/guides/estimate-cdn-bandwidth-gb-per-month.astro", import.meta.url), "utf8"),
);
const conceptClarifierPage = normalize(
  readFileSync(new URL("../src/pages/guides/origin-egress-vs-cdn-bandwidth.astro", import.meta.url), "utf8"),
);

test("cdn costs page is framed as the CDN bill-boundary page", () => {
  assert.match(
    billBoundaryPage,
    /This guide is the CDN bill-boundary page: edge bandwidth, request fees, and origin egress should be modeled as separate cost surfaces instead of one blurred delivery number/i,
  );
  assert.match(
    billBoundaryPage,
    /Use this page when you need to decide what belongs inside the full CDN delivery bill before you compare providers, simplify to per-GB math, price requests, estimate traffic volume, or untangle origin egress/i,
  );
});

test("cdn comparison page is framed as the provider comparison page", () => {
  assert.match(
    comparisonPage,
    /This page is the CDN provider comparison page, not the CDN bill-boundary page: the goal is to compare two or more providers with one normalized traffic profile after the cost surfaces are already defined/i,
  );
  assert.match(
    comparisonPage,
    /If you still need to define the delivery bill or work out blended bandwidth and request math before comparing providers, go back to the relevant pricing pages first/i,
  );
});

test("cdn cost per gigabyte page is framed as the bandwidth-rate page", () => {
  assert.match(
    bandwidthRatePage,
    /This page is the CDN bandwidth-rate page, not the full delivery-bill page: the job is to turn region mix, tiering, and discounts into a defendable blended \$\/GB assumption/i,
  );
  assert.match(
    bandwidthRatePage,
    /If request fees, origin egress, or provider comparison are starting to matter more than bandwidth alone, go back to the broader pricing pages next/i,
  );
});

test("cdn request pricing page is framed as the request-fee page", () => {
  assert.match(
    requestFeePage,
    /This page is the CDN request-fee page, not the full CDN bill-boundary page: the job is to define billable requests, monthly request volume, and unit-safe request pricing without pretending requests are the whole bill/i,
  );
  assert.match(
    requestFeePage,
    /If you still need bandwidth or origin-egress assumptions before the total model is credible, go back to the broader pricing pages first/i,
  );
});

test("estimate cdn bandwidth page is framed as the bandwidth-measurement page", () => {
  assert.match(
    bandwidthMeasurementPage,
    /This page is the CDN bandwidth-measurement page, not the full CDN pricing page: the job is to turn analytics, RPS plus response size, or Mbps into defendable monthly edge GB/i,
  );
  assert.match(
    bandwidthMeasurementPage,
    /Once you know monthly GB, go back to the CDN pricing pages to price bandwidth, requests, and origin egress separately/i,
  );
});

test("origin egress vs cdn bandwidth page is framed as the concept clarifier page", () => {
  assert.match(
    conceptClarifierPage,
    /This page is the edge-versus-origin concept clarifier page, not the full CDN bill-boundary page: the goal is to explain why CDN bandwidth and origin egress are related but different cost surfaces/i,
  );
  assert.match(
    conceptClarifierPage,
    /If you need the full CDN delivery model after this distinction is clear, go back to the CDN pricing guide; if you need traffic evidence, go to the bandwidth-measurement page/i,
  );
});
