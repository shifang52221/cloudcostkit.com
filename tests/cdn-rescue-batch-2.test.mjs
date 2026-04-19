import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const normalize = (value) => value.replace(/\s+/g, " ").trim();

const cdnCalculatorPage = normalize(
  readFileSync(new URL("../src/pages/calculators/cdn-cost-calculator.astro", import.meta.url), "utf8"),
);
const cdnBandwidthPage = normalize(
  readFileSync(new URL("../src/pages/calculators/cdn-bandwidth-cost-calculator.astro", import.meta.url), "utf8"),
);
const cdnGuidePage = normalize(
  readFileSync(new URL("../src/pages/guides/cdn-costs.astro", import.meta.url), "utf8"),
);

test("main CDN calculator is framed as a multi-surface planning tool instead of stacked generic calculators", () => {
  assert.match(cdnCalculatorPage, /(dominant|largest|main)\s+(cost\s+surface|line\s+item|cost\s+driver)/i);
  assert.match(cdnCalculatorPage, /(bandwidth\s+share|request\s+share|origin\s+egress\s+share)/i);
  assert.match(cdnCalculatorPage, /(image-heavy|storefront|video|download|dynamic|api|launch)/i);
  assert.match(cdnCalculatorPage, /(which\s+number\s+moved|which\s+line\s+moved|what\s+moved\s+first)/i);
});

test("CDN bandwidth page uses CDN-specific scenario framing instead of generic egress semantics", () => {
  assert.match(cdnBandwidthPage, /(video|media|streaming|download|storefront|image-heavy|campaign|launch)/i);
  assert.match(cdnBandwidthPage, /(edge\s+delivery|viewer\s+traffic|delivered\s+gb|regional\s+mix)/i);
  assert.match(cdnBandwidthPage, /(what\s+this\s+estimate\s+still\s+misses|use\s+this\s+calculator\s+first)/i);
  assert.doesNotMatch(cdnBandwidthPage, /(public\s+internet\s+egress|cross-region\s+replication|dr\s+traffic)/i);
});

test("CDN guide opens with bill-triage and routes users to the right calculator path", () => {
  assert.match(cdnGuidePage, /(which\s+cdn\s+line\s+(item|moved)|what\s+changed\s+first)/i);
  assert.match(cdnGuidePage, /(bandwidth|request|origin).*(calculator|tool|model)/i);
  assert.match(cdnGuidePage, /(mistakes|failure\s+patterns|checklist)/i);
  assert.match(cdnGuidePage, /(baseline|peak|launch|incident|cache\s+hit)/i);
});
