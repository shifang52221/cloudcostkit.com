import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const normalize = (value) => value.replace(/\s+/g, " ").trim();

const securityGuide = normalize(
  readFileSync(new URL("../src/pages/guides/security-costs.astro", import.meta.url), "utf8"),
);
const wafGuide = normalize(
  readFileSync(new URL("../src/pages/guides/aws-waf-pricing.astro", import.meta.url), "utf8"),
);
const kmsGuide = normalize(
  readFileSync(new URL("../src/pages/guides/aws-kms-pricing.astro", import.meta.url), "utf8"),
);
const secretsGuide = normalize(
  readFileSync(new URL("../src/pages/guides/aws-secrets-manager-pricing.astro", import.meta.url), "utf8"),
);

test("security guide owns the cross-system parent budgeting role", () => {
  assert.match(securityGuide, /This is the security system budgeting parent page/i);
  assert.match(securityGuide, /move into the WAF, KMS, or Secrets Manager specialist pages only after the broader security cost shape is clear/i);
});

test("WAF guide owns the WAF bill-boundary role", () => {
  assert.match(wafGuide, /This is the AWS WAF bill-boundary page/i);
  assert.match(wafGuide, /go back to the security parent page if the broader security spike question is still unclear/i);
});

test("KMS guide owns the KMS request and key-boundary role", () => {
  assert.match(kmsGuide, /This is the AWS KMS request and key-boundary page/i);
  assert.match(kmsGuide, /go back to the security parent page if the broader security spend diagnosis is still unclear/i);
});

test("Secrets guide owns the Secrets Manager bill-boundary role", () => {
  assert.match(secretsGuide, /This is the Secrets Manager bill-boundary page/i);
  assert.match(secretsGuide, /go back to the security parent page if the wider security system budget is still unclear/i);
});
