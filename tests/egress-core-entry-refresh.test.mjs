import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const normalize = (value) => value.replace(/\s+/g, " ").trim();

const egressGuide = normalize(
  readFileSync(new URL("../src/pages/guides/egress-costs.astro", import.meta.url), "utf8"),
);
const egressCalculator = normalize(
  readFileSync(new URL("../src/pages/calculators/data-egress-cost-calculator.astro", import.meta.url), "utf8"),
);
const transferBoundaryGuide = normalize(
  readFileSync(new URL("../src/pages/guides/network-transfer-costs.astro", import.meta.url), "utf8"),
);

test("Egress guide opens like a stronger AWS-shaped pricing entry page", () => {
  assert.match(
    egressGuide,
    /If you searched for AWS egress cost, AWS egress pricing, AWS egress charges, or AWS egress fees, the first job is to identify which transfer path actually moved before you trust any headline \$\/GB rate/i,
  );
  assert.match(
    egressGuide,
    /what changed.*which bill path moved.*how to check first.*what to validate next/i,
  );
  assert.match(
    egressGuide,
    /internet egress.*cross-region.*cross-AZ.*CDN origin/i,
  );
});

test("Egress calculator reads as the boundary-known planning tool", () => {
  assert.match(
    egressCalculator,
    /Use this calculator when the transfer boundary is already known and you need a baseline-vs-peak planning number before a billing or architecture decision/i,
  );
  assert.match(
    egressCalculator,
    /one boundary at a time|one boundary per run/i,
  );
  assert.match(
    egressCalculator,
    /known boundary|boundary is already known|baseline and peak/i,
  );
  assert.match(
    egressCalculator,
    /AWS network bill lines|CDN-origin and edge delivery|replication and DR transfer/i,
  );
});

test("Transfer-boundary parent page stays above the egress guide", () => {
  assert.match(
    transferBoundaryGuide,
    /This is the network transfer boundary page/i,
  );
  assert.match(
    egressGuide,
    /go back to the network transfer boundary guide if you still have not identified the transfer path/i,
  );
});
