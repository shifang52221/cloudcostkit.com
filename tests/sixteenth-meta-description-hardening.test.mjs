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

test("third-batch guide and calculator descriptions are richer and distinct", () => {
  const cases = [
    ["src/pages/calculators/aws-kms-request-estimator.astro", 165, /KMS|crypto|calls per unit|retry/i],
    ["src/pages/guides/aws-s3-pricing.astro", 165, /S3|GB-month|requests|egress|replication/i],
    ["src/pages/guides/aws-eks-control-plane-cost.astro", 165, /EKS|control plane|cluster|dev|test/i],
    ["src/pages/guides/aws-eks-pricing.astro", 165, /EKS|nodes|control plane|load balancers|logs/i],
    ["src/pages/guides/messaging-costs.astro", 165, /queue|pub\/sub|deliveries|fan-out|payload/i],
    ["src/pages/guides/aws-fargate-cost-optimization.astro", 165, /Fargate|rightsize|idle|networking|logging/i],
    ["src/pages/guides/aws-s3-glacier-retrieval-pricing.astro", 165, /Glacier|retrieval|request fees|small-object/i],
    ["src/pages/guides/aws-cloudwatch-dashboards-pricing.astro", 165, /CloudWatch|dashboard|metrics|API requests|alarms/i],
    ["src/pages/guides/aws-s3-storage-classes.astro", 165, /S3|storage classes|retrieval|transition|lifecycle/i],
    ["src/pages/guides/log-retention-storage-cost.astro", 165, /log retention|GB\/day|GB-month|retention/i],
    ["src/pages/guides/networking-costs.astro", 165, /networking|egress|cross-zone|NAT|endpoints/i],
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

  assert.equal(new Set(descriptions).size, descriptions.length, "third-batch descriptions should remain distinct");
});
