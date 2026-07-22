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

const s3RequestCalculator = read("src/pages/calculators/s3-request-cost-calculator.astro");
const apiRequestCalculator = read("src/pages/calculators/api-request-cost-calculator.astro");
const requestEstimator = read("src/pages/calculators/aws-api-gateway-request-estimator.astro");
const responseTransferCalculator = read("src/pages/calculators/api-response-size-transfer-calculator.astro");

test("S3 request calculator stays in the request-class bill-conversion role", () => {
  assert.match(s3RequestCalculator, /This calculator is the S3 request-class bill-conversion page/i);
  assert.match(
    s3RequestCalculator,
    /use it after GET, PUT, LIST, HEAD, multipart, or other request counts are credible enough/i,
  );
  assert.match(
    s3RequestCalculator,
    /It does not own request discovery, storage GB-month, egress, replication, or the full S3 bill model/i,
  );
});

test("generic request calculator stays distinct from S3 and transfer helpers", () => {
  assert.match(apiRequestCalculator, /This calculator is the generic request bill-conversion page/i);
  assert.match(apiRequestCalculator, /request conversion, not request discovery/i);
});

test("API Gateway request estimator keeps the request-volume workflow role", () => {
  assert.match(
    requestEstimator,
    /This calculator is the request-volume workflow of the API Gateway cluster/i,
  );
  assert.match(
    requestEstimator,
    /once the request model is stable, hand the result to the main API Gateway cost calculator or the pricing guide/i,
  );
});

test("response transfer calculator stays a payload-transfer bridge", () => {
  assert.match(responseTransferCalculator, /This calculator is the payload-transfer bridge page/i);
  assert.match(
    responseTransferCalculator,
    /It does not own request pricing, request discovery, CDN cache behavior, or egress-rate pricing/i,
  );
});

test("request calculator axis descriptions remain distinct", () => {
  const cases = [
    ["s3-request-cost-calculator", s3RequestCalculator],
    ["api-request-cost-calculator", apiRequestCalculator],
    ["aws-api-gateway-request-estimator", requestEstimator],
    ["api-response-size-transfer-calculator", responseTransferCalculator],
  ];

  const descriptions = cases.map(([label, source]) => {
    const description = extractDescription(source, label);
    assert.ok(description.length >= 150, `${label} description should be at least 150 chars`);
    return description;
  });

  assert.equal(new Set(descriptions).size, descriptions.length, "descriptions should remain unique");
});
