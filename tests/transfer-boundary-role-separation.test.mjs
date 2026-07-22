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
const vpcTransferGuide = normalize(
  readFileSync(new URL("../src/pages/guides/aws-vpc-data-transfer.astro", import.meta.url), "utf8"),
);
const crossAzGuide = normalize(
  readFileSync(new URL("../src/pages/guides/aws-cross-az-data-transfer-cost.astro", import.meta.url), "utf8"),
);
const vpcTransferCalculator = normalize(
  readFileSync(new URL("../src/pages/calculators/vpc-data-transfer-cost-calculator.astro", import.meta.url), "utf8"),
);
const dataEgressCalculator = normalize(
  readFileSync(new URL("../src/pages/calculators/data-egress-cost-calculator.astro", import.meta.url), "utf8"),
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

test("AWS VPC transfer guide owns VPC path classification before calculators", () => {
  assert.match(vpcTransferGuide, /This is the AWS VPC transfer-path classification page/i);
  assert.match(
    vpcTransferGuide,
    /Use it before calculators when the open question is whether traffic crossed an AZ, region, NAT path, endpoint path, or public-internet boundary/i,
  );
  assert.match(
    vpcTransferGuide,
    /Do not use this page as the final pricing page once the boundary and GB are already credible/i,
  );
});

test("cross-AZ guide owns AZ-locality diagnosis rather than generic VPC transfer routing", () => {
  assert.match(crossAzGuide, /This is the AZ-locality diagnosis page in the VPC transfer cluster/i);
  assert.match(
    crossAzGuide,
    /use it when the suspected cost driver is traffic between Availability Zones/i,
  );
  assert.match(
    crossAzGuide,
    /If you still need to separate internet egress, cross-region, NAT, endpoint, and cross-AZ paths, start with the VPC transfer guide first/i,
  );
});

test("VPC transfer calculator is the bill-conversion page after the path is known", () => {
  assert.match(
    vpcTransferCalculator,
    /This calculator is the bill-conversion page of the VPC transfer cluster/i,
  );
  assert.match(
    vpcTransferCalculator,
    /use it after the transfer boundary, monthly GB, and effective path-specific rate are believable enough to translate into spend/i,
  );
  assert.match(
    vpcTransferCalculator,
    /The built-in Mbps helper is only a quick throughput-to-GB convenience, not a defendable path-measurement workflow/i,
  );
  assert.match(
    dataEgressCalculator,
    /Use this calculator when the transfer boundary is already known and you need a baseline-vs-peak planning number before a billing or architecture decision/i,
  );
});
