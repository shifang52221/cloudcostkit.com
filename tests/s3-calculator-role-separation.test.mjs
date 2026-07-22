import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const s3Calculator = readFileSync(
  new URL("../src/pages/calculators/s3-cost-calculator.astro", import.meta.url),
  "utf8",
);
const genericStorageCalculator = readFileSync(
  new URL("../src/pages/calculators/storage-pricing-calculator.astro", import.meta.url),
  "utf8",
);

test("S3 calculator is explicitly scoped to S3-specific billing decisions", () => {
  assert.match(s3Calculator, /S3-specific estimate/i);
  assert.match(s3Calculator, /GET, PUT, LIST/i);
  assert.match(s3Calculator, /storage classes|lifecycle/i);
  assert.match(s3Calculator, /replication|cross-region/i);
});

test("generic storage calculator is explicitly scoped to provider-neutral planning", () => {
  assert.match(genericStorageCalculator, /provider-neutral|provider-neutral model/i);
  assert.match(genericStorageCalculator, /cross-provider|provider comparisons/i);
  assert.match(genericStorageCalculator, /S3-specific|provider-specific/i);
  assert.match(genericStorageCalculator, /archive|retrieval|lifecycle/i);
});

test("the two calculators route users to different next decisions", () => {
  assert.match(s3Calculator, /S3 pricing|S3-specific|storage classes/i);
  assert.match(genericStorageCalculator, /generic|blended-rate|cross-provider/i);
  assert.doesNotMatch(
    s3Calculator,
    /This page is intentionally broader than the S3- or Glacier-specific calculators/i,
  );
  assert.doesNotMatch(
    genericStorageCalculator,
    /This page groups common S3 line items/i,
  );
});
