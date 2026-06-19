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

test("short-description batch now keeps richer and distinct summaries", () => {
  const cases = [
    ["src/pages/guides/aws-waf-estimate-requests.astro", 150, /evaluated requests|attack windows|bot spikes/i],
    ["src/pages/guides/aws-rds-backups-and-snapshots.astro", 150, /retention|snapshot|backup storage|churn/i],
    ["src/pages/guides/aws-waf-cost-optimization.astro", 150, /evaluated requests|rule sprawl|logging/i],
    ["src/pages/calculators/kubernetes-cost-calculator.astro", 150, /node|control plane|storage|egress|observability/i],
    ["src/pages/guides/s3-crr-vs-srr-cost.astro", 150, /cross-region|same-region|replica storage|changed data/i],
    ["src/pages/guides/aws-rds-cost-optimization.astro", 150, /compute|storage growth|backup retention|i\/o/i],
    ["src/pages/calculators/storage.astro", 150, /replication|retrieval|lifecycle|egress/i],
    ["src/pages/calculators/networking.astro", 150, /cross-region|cross-AZ|NAT|origin egress|internet egress/i],
    ["src/pages/calculators/aws-sqs-request-estimator.astro", 150, /message|retry|polling|visibility/i],
    ["src/pages/guides/aws-sqs-pricing.astro", 150, /request-driven|retry|polling|downstream/i],
    ["src/pages/guides/aws-rds-pricing.astro", 150, /instances|storage|backups|i\/o/i],
    ["src/pages/calculators/logging.astro", 150, /ingestion|retention|query|metrics/i],
    ["src/pages/guides/aws-alb-vs-nlb-cost.astro", 150, /LCU|NLCU|traffic patterns|load balancer/i],
    ["src/pages/guides/aws-kms-pricing.astro", 150, /key-months|request volume|KMS/i],
    ["src/pages/guides/s3-to-glacier-transfer-cost.astro", 150, /transition|minimum storage duration|Glacier|rewrite/i],
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

  assert.equal(new Set(descriptions).size, descriptions.length, "batch descriptions should remain distinct");
});
