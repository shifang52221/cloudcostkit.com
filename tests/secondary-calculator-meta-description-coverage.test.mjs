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

test("secondary calculator batch keeps richer and distinct meta descriptions", () => {
  const cases = [
    "src/pages/calculators/s3-replication-cost-calculator.astro",
    "src/pages/calculators/cross-region-transfer-cost-calculator.astro",
    "src/pages/calculators/aws.astro",
    "src/pages/calculators/units.astro",
    "src/pages/calculators/kubernetes-requests-limits-calculator.astro",
    "src/pages/calculators/log-storage-cost-calculator.astro",
  ];

  const descriptions = cases.map((file) => {
    const description = extractDescription(read(file), file);
    assert.ok(description.length >= 140, `${file} description should be at least 140 chars, got ${description.length}`);
    assert.doesNotMatch(description, /Educational use only\./i, `${file} description should not rely on boilerplate educational suffixes`);
    return description;
  });

  assert.equal(new Set(descriptions).size, descriptions.length, "secondary calculator descriptions should remain distinct");
});
