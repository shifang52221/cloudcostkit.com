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

test("priority guide snippets are richer and distinct", () => {
  const cases = [
    "src/pages/guides/aws-cloudtrail-estimate-events.astro",
    "src/pages/guides/aws-ecs-ec2-vs-fargate-cost.astro",
    "src/pages/guides/aws-ecs-pricing.astro",
    "src/pages/guides/estimate-cdn-bandwidth-gb-per-month.astro",
    "src/pages/guides/storage-costs.astro",
    "src/pages/guides/aws-api-gateway-pricing.astro",
    "src/pages/guides/azure-blob-storage-pricing.astro",
  ];

  const descriptions = cases.map((file) => {
    const description = extractDescription(read(file), file);
    assert.ok(description.length >= 140, `${file} description should be at least 140 chars, got ${description.length}`);
    return description;
  });

  assert.equal(new Set(descriptions).size, descriptions.length, "priority guide descriptions should remain distinct");
});
