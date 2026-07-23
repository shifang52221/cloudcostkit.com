import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const normalize = (value) => value.replace(/\s+/g, " ").trim();

function read(relativePath) {
  return normalize(readFileSync(new URL(`../${relativePath}`, import.meta.url), "utf8"));
}

function countMatches(source, pattern) {
  return Array.from(source.matchAll(pattern)).length;
}

const requestHub = read("src/pages/guides/requests-costs.astro");
const requestPricing = read("src/pages/guides/request-based-pricing.astro");
const transferBoundary = read("src/pages/guides/network-transfer-costs.astro");
const egressGuide = read("src/pages/guides/egress-costs.astro");

test("request hub remains a noindex routing hub", () => {
  assert.match(requestHub, /robots="noindex,follow"/);
  assert.match(requestHub, /This page is the noindex request routing hub/i);
  assert.match(requestHub, /It does not own request pricing math, service-specific request measurement, or calculator-ready bill conversion/i);
});

test("request pricing guide owns generic billable-request math", () => {
  assert.match(requestPricing, /This page is the generic request billing-math explainer/i);
  assert.match(requestPricing, /It does not own request discovery, service-specific request measurement, or parent workload modeling/i);
  assert.equal(
    countMatches(
      requestPricing,
      /This page should solve the generic math problem: what counts as a request, how units are priced, and how retries and traffic shape change totals/gi,
    ),
    1,
    "request pricing role paragraph should not be duplicated",
  );
});

test("network transfer guide owns transfer path classification", () => {
  assert.match(transferBoundary, /This page is the transfer path boundary parent/i);
  assert.match(transferBoundary, /It does not own AWS-specific egress billing diagnosis or final path-specific rate modeling/i);
  assert.match(transferBoundary, /Hand off to the AWS egress guide only after the traffic looks like an outbound AWS transfer charge/i);
});

test("egress guide owns AWS outbound-transfer diagnosis after path classification", () => {
  assert.match(egressGuide, /This page is the AWS egress diagnosis and billing workflow/i);
  assert.match(egressGuide, /It does not replace the transfer path boundary parent/i);
  assert.match(egressGuide, /go back to the network transfer boundary guide/i);
});
