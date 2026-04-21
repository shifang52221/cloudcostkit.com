import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const cases = [
  "src/pages/calculators/aws-api-gateway-request-estimator.astro",
  "src/pages/calculators/aws-kms-request-estimator.astro",
  "src/pages/calculators/aws-sns-delivery-estimator.astro",
  "src/pages/calculators/aws-sqs-request-estimator.astro",
  "src/pages/calculators/aws-waf-request-estimator.astro",
  "src/pages/calculators/rps-to-monthly-requests-calculator.astro",
  "src/pages/calculators/compute-instance-cost-calculator.astro",
];

function read(file) {
  return readFileSync(new URL(`../${file}`, import.meta.url), "utf8");
}

function extractDescription(source, file) {
  const match = source.match(/const\s+description\s*=\s*([\s\S]*?);/);
  assert.ok(match, `expected ${file} to define const description`);
  const raw = match[1].trim();
  if (
    (raw.startsWith('"') && raw.endsWith('"')) ||
    (raw.startsWith("'") && raw.endsWith("'")) ||
    (raw.startsWith("`") && raw.endsWith("`"))
  ) {
    return raw.slice(1, -1);
  }
  assert.fail(`could not extract description literal for ${file}`);
}

test("noindex helper pages keep noindex while dropping the educational boilerplate suffix", () => {
  for (const file of cases) {
    const source = read(file);
    const description = extractDescription(source, file);
    assert.match(source, /robots="noindex,follow"/, `${file} should stay noindex,follow`);
    assert.doesNotMatch(
      description,
      /Educational use only\./i,
      `${file} description should not use the educational boilerplate suffix`,
    );
  }
});
