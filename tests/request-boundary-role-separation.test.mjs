import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const normalize = (value) => value.replace(/\s+/g, " ").trim();

const requestBoundaryGuide = normalize(
  readFileSync(new URL("../src/pages/guides/requests-costs.astro", import.meta.url), "utf8"),
);
const requestPricingGuide = normalize(
  readFileSync(new URL("../src/pages/guides/request-based-pricing.astro", import.meta.url), "utf8"),
);
const apiRequestCalculator = normalize(
  readFileSync(new URL("../src/pages/calculators/api-request-cost-calculator.astro", import.meta.url), "utf8"),
);
const rpsToRequestsCalculator = normalize(
  readFileSync(new URL("../src/pages/calculators/rps-to-monthly-requests-calculator.astro", import.meta.url), "utf8"),
);

test("requests guide owns the request boundary and routes to calculators when counts are needed", () => {
  assert.match(requestBoundaryGuide, /This is the request boundary page/i);
  assert.match(requestBoundaryGuide, /(retries|bots|cache misses)/i);
  assert.match(
    requestBoundaryGuide,
    /Use the calculators .* boundary is defined .* same definition of billable requests/i,
  );
});

test("request pricing guide owns the billing story and routes back to the boundary when counts are unclear", () => {
  assert.match(requestPricingGuide, /This is the billing page for request fees/i);
  assert.match(requestPricingGuide, /per-10k or per-1M pricing/i);
  assert.match(requestPricingGuide, /go back to the request boundary guide before you finalize the price/i);
});

test("API request calculator feeds boundary and pricing stories", () => {
  assert.match(apiRequestCalculator, /This calculator maps API call volume into billable requests/i);
  assert.match(apiRequestCalculator, /Confirm the request boundary first/i);
  assert.match(apiRequestCalculator, /request-fee pricing guide/i);
});

test("RPS-to-monthly calculator produces counts for the API request calculator", () => {
  assert.match(rpsToRequestsCalculator, /This helper estimates monthly request volume from RPS/i);
  assert.match(rpsToRequestsCalculator, /Feed the result into the API request calculator before pricing/i);
  assert.match(rpsToRequestsCalculator, /calculator owns the billable-request logic and pricing-ready units/i);
});
