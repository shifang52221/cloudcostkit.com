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

const awsS3Pricing = read("src/pages/guides/aws-s3-pricing.astro");
const s3PricingExplained = read("src/pages/guides/s3-pricing-explained.astro");
const s3DataTransfer = read("src/pages/guides/aws-s3-data-transfer.astro");
const s3StorageClasses = read("src/pages/guides/aws-s3-storage-classes.astro");
const s3Calculator = read("src/pages/calculators/s3-cost-calculator.astro");
const objectStorageCalculator = read("src/pages/calculators/object-storage-cost-calculator.astro");
const storagePricingCalculator = read("src/pages/calculators/storage-pricing-calculator.astro");

test("AWS S3 pricing owns the AWS bill-boundary role", () => {
  assert.match(awsS3Pricing, /This is the AWS S3 bill-boundary page/i);
  assert.match(
    awsS3Pricing,
    /Use request, transfer, replication, and archive pages when one of those narrower drivers is the unresolved decision/i,
  );
  assert.match(awsS3Pricing, /Do not use this page as the S3-like concept explainer/i);
});

test("S3 pricing explained owns the provider-agnostic concept role", () => {
  assert.match(s3PricingExplained, /This is the S3-like object-storage concept clarifier/i);
  assert.match(
    s3PricingExplained,
    /It explains storage, request, and egress anatomy without pretending to be the AWS regional pricing reference/i,
  );
  assert.match(s3PricingExplained, /Move to AWS S3 pricing when the question is AWS-specific bill boundaries/i);
});

test("S3 data transfer owns transfer-path diagnosis", () => {
  assert.match(s3DataTransfer, /This is the S3 transfer-path diagnosis page/i);
  assert.match(
    s3DataTransfer,
    /stay here while the unresolved question is which path moved bytes and which evidence proves monthly GB/i,
  );
  assert.match(
    s3DataTransfer,
    /It does not own replication volume, storage-class economics, or the full S3 bill model/i,
  );
});

test("S3 storage classes own tiering and lifecycle economics", () => {
  assert.match(s3StorageClasses, /This is the S3 storage-class decision page/i);
  assert.match(
    s3StorageClasses,
    /use it when access frequency, retrieval latency, transition churn, or minimum-duration exposure changes the storage tier decision/i,
  );
  assert.match(
    s3StorageClasses,
    /It does not own transfer-path diagnosis or the full S3 bill-boundary workflow/i,
  );
});

test("S3 calculator owns AWS S3 multi-line bill conversion", () => {
  assert.match(s3Calculator, /This calculator is the AWS S3 multi-line bill-conversion page/i);
  assert.match(
    s3Calculator,
    /use it after stored GB-month, request families, egress GB, and any replicated GB are credible enough to convert into monthly lines/i,
  );
  assert.match(s3Calculator, /Move back to guides when the unresolved issue is boundary diagnosis rather than arithmetic/i);
});

test("object storage calculator stays the base capacity and request model", () => {
  assert.match(objectStorageCalculator, /This calculator is the base object-storage capacity-and-request page/i);
  assert.match(
    objectStorageCalculator,
    /use it when average stored GB and request shape are the only credible inputs/i,
  );
  assert.match(
    objectStorageCalculator,
    /It deliberately excludes transfer, replication, archive retrieval, and lifecycle policy work/i,
  );
});

test("generic storage pricing calculator owns provider-neutral baseline planning", () => {
  assert.match(storagePricingCalculator, /This calculator is the provider-neutral storage baseline page/i);
  assert.match(
    storagePricingCalculator,
    /use it before the final provider, region mix, storage class policy, or product-specific request rules are known/i,
  );
  assert.match(
    storagePricingCalculator,
    /Move to S3 or product-specific pages when those assumptions become material/i,
  );
});

test("S3 storage cluster descriptions remain distinct", () => {
  const cases = [
    ["aws-s3-pricing", awsS3Pricing, /AWS S3|bill|GB-month|requests|egress|replication/i],
    ["s3-pricing-explained", s3PricingExplained, /S3-like|object storage|concept|storage|requests|egress/i],
    ["aws-s3-data-transfer", s3DataTransfer, /S3|transfer|egress|cross-region|CDN|GB/i],
    ["aws-s3-storage-classes", s3StorageClasses, /S3|storage class|retrieval|transition|minimum-duration/i],
    ["s3-cost-calculator", s3Calculator, /S3|bill-conversion|storage|requests|egress|replication/i],
    ["object-storage-cost-calculator", objectStorageCalculator, /object storage|capacity|requests|transfer|replication/i],
    ["storage-pricing-calculator", storagePricingCalculator, /provider-neutral|storage|baseline|blended|S3/i],
  ];

  const descriptions = cases.map(([label, source, pattern]) => {
    const description = extractDescription(source, label);
    assert.ok(description.length >= 155, `${label} description should be at least 155 chars`);
    assert.match(description, pattern, `${label} description should preserve page-specific intent`);
    return description;
  });

  assert.equal(new Set(descriptions).size, descriptions.length, "descriptions should remain unique");
});
