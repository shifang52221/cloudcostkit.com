import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const normalize = (value) => value.replace(/\s+/g, " ").trim();

const guideLayout = normalize(
  readFileSync(new URL("../src/layouts/GuideLayout.astro", import.meta.url), "utf8"),
);
const transferBoundaryGuide = normalize(
  readFileSync(new URL("../src/pages/guides/network-transfer-costs.astro", import.meta.url), "utf8"),
);
const egressGuide = normalize(
  readFileSync(new URL("../src/pages/guides/egress-costs.astro", import.meta.url), "utf8"),
);

test("guide layout supports page-level opening assist overrides", () => {
  assert.match(guideLayout, /openingAssist\?: false \| \{ message\?: string; toolSlugs\?: string\[\] \}/i);
  assert.match(guideLayout, /openingAssist !== false/i);
});

test("network transfer guide owns the boundary definition before pricing", () => {
  assert.match(transferBoundaryGuide, /openingAssist=\{false\}/i);
  assert.match(transferBoundaryGuide, /This is the network transfer boundary page/i);
  assert.match(transferBoundaryGuide, /define the transfer path before you choose rates/i);
  assert.match(transferBoundaryGuide, /Choose the next step by transfer boundary/i);
  assert.match(transferBoundaryGuide, /If the traffic goes to end users or external systems/i);
  assert.doesNotMatch(transferBoundaryGuide, /Start with a calculator if you need a first-pass estimate/i);
});

test("egress guide owns the egress decision workflow and routes unclear cases back to the parent", () => {
  assert.match(egressGuide, /openingAssist=\{\{/i);
  assert.match(egressGuide, /This is the egress decision and billing page/i);
  assert.match(
    egressGuide,
    /go back to the network transfer boundary guide if you still have not identified the transfer path/i,
  );
  assert.match(egressGuide, /AWS billing usage types/i);
  assert.match(egressGuide, /What to check when AWS egress spikes/i);
});
