import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const normalize = (value) => value.replace(/\s+/g, " ").trim();

function read(relativePath) {
  return normalize(readFileSync(new URL(`../${relativePath}`, import.meta.url), "utf8"));
}

function extractDescription(source, label) {
  const match = source.match(/const\s+description\s*=\s*([\s\S]*?);/);
  assert.ok(match, `expected ${label} to define const description`);

  const raw = match[1].trim();
  if (
    (raw.startsWith('"') && raw.endsWith('"')) ||
    (raw.startsWith("'") && raw.endsWith("'")) ||
    (raw.startsWith("`") && raw.endsWith("`"))
  ) {
    return raw.slice(1, -1);
  }

  assert.fail(`could not extract string literal description for ${label}`);
}

const requestHub = read("src/pages/guides/requests-costs.astro");
const requestPricing = read("src/pages/guides/request-based-pricing.astro");
const apiRequestCalculator = read("src/pages/calculators/api-request-cost-calculator.astro");
const rpsCalculator = read("src/pages/calculators/rps-to-monthly-requests-calculator.astro");
const s3RequestCosts = read("src/pages/guides/aws-s3-request-costs.astro");
const apiGatewayRequestEstimate = read("src/pages/guides/aws-api-gateway-estimate-requests.astro");

test("request hub owns routing only", () => {
  assert.match(requestHub, /This is the request boundary page/i);
  assert.match(requestHub, /This page should stay a lightweight navigation stop/i);
  assert.match(requestHub, /do not use this page as your main explainer/i);
});

test("generic request pricing owns the billing math", () => {
  assert.match(requestPricing, /This is the generic request pricing explainer/i);
  assert.match(requestPricing, /This page should solve the generic math problem/i);
  assert.match(requestPricing, /Move back to parent guides when the bigger workload model is still unclear/i);
});

test("API request calculator owns bill conversion only", () => {
  assert.match(apiRequestCalculator, /This calculator is the generic request bill-conversion page/i);
  assert.match(apiRequestCalculator, /request conversion, not request discovery/i);
  assert.match(apiRequestCalculator, /This calculator maps API call volume into billable requests/i);
});

test("RPS converter stays a rate-to-volume bridge", () => {
  assert.match(rpsCalculator, /This calculator is the rate-to-volume bridge/i);
  assert.match(rpsCalculator, /This page is a support converter inside request-pricing workflows/i);
  assert.match(rpsCalculator, /not a full pricing model/i);
});

test("S3 request guide owns S3 request boundary only", () => {
  assert.match(s3RequestCosts, /This is the S3 request-cost boundary page/i);
  assert.match(s3RequestCosts, /not the full storage-system budget or the whole S3 bill anatomy/i);
  assert.match(s3RequestCosts, /Go back to the storage parent page/i);
});

test("API Gateway request estimation owns the measurement workflow", () => {
  assert.match(apiGatewayRequestEstimate, /This page is the API request measurement workflow/i);
  assert.match(apiGatewayRequestEstimate, /request-measurement workflow/i);
  assert.match(apiGatewayRequestEstimate, /go back to the pricing guide first/i);
});

test("request-axis descriptions remain distinct", () => {
  const cases = [
    ["requests-costs", requestHub, /request boundary|routing hub|navigation stop/i],
    ["request-based-pricing", requestPricing, /request pricing|requests\/month|unit/i],
    ["api-request-cost-calculator", apiRequestCalculator, /request|bill-conversion|price per million/i],
    ["rps-to-monthly-requests-calculator", rpsCalculator, /RPS|monthly request|bridge/i],
    ["aws-s3-request-costs", s3RequestCosts, /S3|GET\/PUT\/LIST|metadata|request/i],
    ["aws-api-gateway-estimate-requests", apiGatewayRequestEstimate, /API|request|RPS|logs|metrics/i],
  ];

  const descriptions = cases.map(([label, source, pattern]) => {
    const description = extractDescription(source, label);
    assert.ok(description.length >= 150, `${label} description should be at least 150 chars`);
    assert.match(description, pattern, `${label} description should preserve page-specific intent`);
    return description;
  });

  assert.equal(new Set(descriptions).size, descriptions.length, "descriptions should remain unique");
});
