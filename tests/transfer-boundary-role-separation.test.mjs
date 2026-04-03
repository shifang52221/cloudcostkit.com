import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const normalize = (value) => value.replace(/\s+/g, " ").trim();

const transferBoundaryGuide = normalize(
  readFileSync(new URL("../src/pages/guides/network-transfer-costs.astro", import.meta.url), "utf8"),
);
const egressGuide = normalize(
  readFileSync(new URL("../src/pages/guides/egress-costs.astro", import.meta.url), "utf8"),
);

test("network transfer guide owns the boundary definition before pricing", () => {
  assert.match(transferBoundaryGuide, /This is the network transfer boundary page/i);
  assert.match(transferBoundaryGuide, /define the transfer path before you choose rates/i);
});

test("egress guide owns the egress decision workflow and routes unclear cases back to the parent", () => {
  assert.match(egressGuide, /This is the egress decision and billing page/i);
  assert.match(
    egressGuide,
    /go back to the network transfer boundary guide if you still have not identified the transfer path/i,
  );
});
