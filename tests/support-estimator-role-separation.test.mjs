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

const pages = {
  kms: read("src/pages/calculators/aws-kms-request-estimator.astro"),
  sns: read("src/pages/calculators/aws-sns-delivery-estimator.astro"),
  sqs: read("src/pages/calculators/aws-sqs-request-estimator.astro"),
  waf: read("src/pages/calculators/aws-waf-request-estimator.astro"),
};

test("KMS estimator stays a crypto-call-density support workflow", () => {
  assert.match(pages.kms, /This calculator is the KMS request-volume workflow page/i);
  assert.match(pages.kms, /crypto-call density/i);
  assert.match(
    pages.kms,
    /It does not own key-month pricing, full KMS bill conversion, or downstream service costs/i,
  );
});

test("SNS estimator stays a publish-to-delivery support workflow", () => {
  assert.match(pages.sns, /This calculator is the SNS delivery-volume workflow page/i);
  assert.match(pages.sns, /publish count, matched fan-out, and retry behavior/i);
  assert.match(
    pages.sns,
    /It does not own SNS pricing, downstream SQS, Lambda, or email cost, or full messaging architecture decisions/i,
  );
});

test("SQS estimator stays a message-lifecycle support workflow", () => {
  assert.match(pages.sqs, /This calculator is the SQS request-volume workflow page/i);
  assert.match(pages.sqs, /message lifecycle amplification/i);
  assert.match(
    pages.sqs,
    /It does not own queue pricing, storage, downstream compute, or full SQS bill conversion/i,
  );
});

test("WAF estimator stays an evaluated-request support workflow", () => {
  assert.match(pages.waf, /This calculator is the WAF evaluated-request workflow page/i);
  assert.match(pages.waf, /baseline traffic, blocked traffic, and attack windows/i);
  assert.match(
    pages.waf,
    /It does not own Web ACL pricing, rule pricing, security logging, or full WAF bill conversion/i,
  );
});

test("support estimators remain noindex with distinct descriptions", () => {
  const descriptions = Object.entries(pages).map(([label, source]) => {
    assert.match(source, /robots="noindex,follow"/, `${label} should stay noindex,follow`);
    const description = extractDescription(source, label);
    assert.ok(description.length >= 150, `${label} description should be at least 150 chars`);
    return description;
  });

  assert.equal(new Set(descriptions).size, descriptions.length, "support estimator descriptions should remain unique");
});
