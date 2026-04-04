import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const normalize = (value) => value.replace(/\s+/g, " ").trim();

const storageGuide = normalize(readFileSync(new URL("../src/pages/guides/storage-costs.astro", import.meta.url), "utf8"));
const s3PricingGuide = normalize(
  readFileSync(new URL("../src/pages/guides/s3-pricing-explained.astro", import.meta.url), "utf8"),
);
const replicationGuide = normalize(
  readFileSync(new URL("../src/pages/guides/s3-replication-cost.astro", import.meta.url), "utf8"),
);
const glacierTransferGuide = normalize(
  readFileSync(new URL("../src/pages/guides/s3-to-glacier-transfer-cost.astro", import.meta.url), "utf8"),
);

test("storage guide owns the storage system budgeting parent role", () => {
  assert.match(storageGuide, /This is the storage system budgeting parent page/i);
  assert.match(
    storageGuide,
    /move into S3 pricing, replication, or archive-transition pages only after the broader storage budget shape is clear/i,
  );
});

test("S3 pricing guide owns the S3 pricing anatomy role", () => {
  assert.match(s3PricingGuide, /This is the S3 pricing anatomy page/i);
  assert.match(
    s3PricingGuide,
    /go back to the storage parent page if the broader storage budget shape is still unclear/i,
  );
});

test("replication guide owns the storage copy-path economics role", () => {
  assert.match(replicationGuide, /This is the storage copy-path economics page/i);
  assert.match(
    replicationGuide,
    /go back to the storage parent page if the broader storage budget shape is still unclear/i,
  );
});

test("Glacier transfer guide owns the archive-transition boundary role", () => {
  assert.match(glacierTransferGuide, /This is the archive-transition boundary page/i);
  assert.match(
    glacierTransferGuide,
    /go back to the storage parent page if the broader storage budget shape is still unclear/i,
  );
});
