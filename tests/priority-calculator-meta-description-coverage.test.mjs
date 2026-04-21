import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

function read(relativePath) {
  return readFileSync(new URL(`../${relativePath}`, import.meta.url), "utf8");
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

test("priority calculators keep richer and less templated meta descriptions", () => {
  const cases = [
    "src/pages/calculators/aws-kms-cost-calculator.astro",
    "src/pages/calculators/log-search-scan-cost-calculator.astro",
    "src/pages/calculators/object-storage-cost-calculator.astro",
    "src/pages/calculators/metrics-timeseries-cost-calculator.astro",
    "src/pages/calculators/cdn-request-cost-calculator.astro",
    "src/pages/calculators/vpc-data-transfer-cost-calculator.astro",
    "src/pages/calculators/s3-request-cost-calculator.astro",
    "src/pages/calculators/cloudfront-cost-calculator.astro",
    "src/pages/calculators/aws-ebs-cost-calculator.astro",
    "src/pages/calculators/aws-lambda-cost-calculator.astro",
  ];

  const descriptions = cases.map((file) => {
    const description = extractDescription(read(file), file);
    assert.ok(description.length >= 140, `${file} description should be at least 140 chars, got ${description.length}`);
    assert.doesNotMatch(description, /Educational use only\./i, `${file} description should not rely on boilerplate educational suffixes`);
    return description;
  });

  assert.equal(new Set(descriptions).size, descriptions.length, "priority calculator descriptions should remain distinct");
});
