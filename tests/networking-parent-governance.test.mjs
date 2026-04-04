import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const normalize = (value) => value.replace(/\s+/g, " ").trim();

const networkingGuide = normalize(
  readFileSync(new URL("../src/pages/guides/networking-costs.astro", import.meta.url), "utf8"),
);
const awsNetworkingGuide = normalize(
  readFileSync(new URL("../src/pages/guides/aws-network-costs.astro", import.meta.url), "utf8"),
);
const vpcTransferGuide = normalize(
  readFileSync(new URL("../src/pages/guides/aws-vpc-data-transfer.astro", import.meta.url), "utf8"),
);

test("networking guide owns the cross-provider parent budgeting role", () => {
  assert.match(networkingGuide, /This is the cross-provider networking system budgeting parent page/i);
  assert.match(
    networkingGuide,
    /move into provider-specific networking pages only after the broader network cost shape is clear/i,
  );
});

test("AWS networking guide owns the AWS networking parent role", () => {
  assert.match(awsNetworkingGuide, /This is the AWS networking budgeting parent page/i);
  assert.match(
    awsNetworkingGuide,
    /go back to the networking parent page if the broader cross-provider networking model is still unclear/i,
  );
});

test("AWS VPC transfer guide owns the transfer-path boundary role", () => {
  assert.match(vpcTransferGuide, /This is the AWS transfer-path boundary page/i);
  assert.match(
    vpcTransferGuide,
    /go back to the AWS networking parent page if the broader AWS networking budget map is still unclear/i,
  );
});
