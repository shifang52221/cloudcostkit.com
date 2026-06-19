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

test("second-tier high-value entry pages keep richer and distinct descriptions", () => {
  const cases = [
    ["src/pages/guides/aws-ebs-gp2-vs-gp3-cost.astro", 165, /gp2|gp3|IOPS|throughput|performance/i],
    ["src/pages/guides/aws-reserved-vs-on-demand.astro", 165, /break-even|utilization|on-demand|commitments/i],
    ["src/pages/guides/azure-application-gateway-pricing.astro", 165, /gateway|traffic processed|WAF|logs|hours/i],
    ["src/pages/guides/aws-route-53-estimate-dns-queries.astro", 165, /DNS|TTL|resolver|query spikes|Route 53/i],
    ["src/pages/guides/requests-costs.astro", 165, /request pricing|retries|payload transfer|hub|request math/i],
    ["src/pages/calculators/aws-sns-delivery-estimator.astro", 165, /publish|fan-out|delivery|retry|topic/i],
    ["src/pages/guides/aws-sqs-vs-sns-cost.astro", 165, /SQS|SNS|fan-out|request types|payload/i],
    ["src/pages/calculators/index.astro", 165, /CDN|egress|EC2|storage|calculator|planning/i],
  ];

  const descriptions = cases.map(([file, minLength, pattern]) => {
    const description = extractDescription(read(file), file);
    assert.ok(
      description.length >= minLength,
      `${file} description should be at least ${minLength} chars, got ${description.length}`,
    );
    assert.match(description, pattern, `${file} description should preserve page-specific intent`);
    return description;
  });

  assert.equal(new Set(descriptions).size, descriptions.length, "second-tier descriptions should remain distinct");
});
