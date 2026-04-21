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

test("priority entrypoints and high-opportunity guides keep richer meta descriptions", () => {
  const cases = [
    ["src/pages/index.astro", 145],
    ["src/pages/guides/index.astro", 140],
    ["src/pages/guides/aws.astro", 150],
    ["src/pages/guides/azure.astro", 140],
    ["src/pages/guides/gcp.astro", 150],
    ["src/pages/guides/azure-container-registry-pricing.astro", 145],
    ["src/pages/guides/azure-event-hubs-pricing.astro", 150],
    ["src/pages/guides/gcp-cloud-run-pricing.astro", 150],
    ["src/pages/guides/gcp-cloud-storage-pricing.astro", 140],
    ["src/pages/guides/aws-cloudtrail-pricing.astro", 140],
    ["src/pages/guides/aws-cloudwatch-metrics-pricing.astro", 140],
    ["src/pages/guides/aws-route-53-pricing.astro", 140],
    ["src/pages/guides/aws-s3-glacier-pricing.astro", 140],
  ];

  for (const [file, minLength] of cases) {
    const description = extractDescription(read(file), file);
    assert.ok(
      description.length >= minLength,
      `${file} description should be at least ${minLength} chars, got ${description.length}`,
    );
  }
});

test("noindex AWS guide hub is excluded from sitemap generation", () => {
  const astroConfig = read("astro.config.mjs");
  assert.match(astroConfig, /"\/guides\/aws\/"/);
});
