import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const normalize = (value) => value.replace(/\s+/g, " ").trim();

const s3PricingGuide = normalize(
  readFileSync(new URL("../src/pages/guides/aws-s3-pricing.astro", import.meta.url), "utf8"),
);
const storageClassesGuide = normalize(
  readFileSync(new URL("../src/pages/guides/aws-s3-storage-classes.astro", import.meta.url), "utf8"),
);
const requestCostsGuide = normalize(
  readFileSync(new URL("../src/pages/guides/aws-s3-request-costs.astro", import.meta.url), "utf8"),
);
const replicationGuide = normalize(
  readFileSync(new URL("../src/pages/guides/aws-s3-replication-pricing.astro", import.meta.url), "utf8"),
);

test("aws-s3-pricing owns the S3 pricing anatomy role", () => {
  assert.match(s3PricingGuide, /This is the S3 pricing anatomy page/i);
  assert.match(
    s3PricingGuide,
    /go back to the storage parent page if the broader storage budget shape is still unclear/i,
  );
});

test("aws-s3-storage-classes owns the storage-class decision role", () => {
  assert.match(storageClassesGuide, /This is the storage-class decision page/i);
  assert.match(
    storageClassesGuide,
    /go back to the storage parent page if the broader storage budget shape is still unclear/i,
  );
});

test("aws-s3-request-costs owns the request-cost boundary role", () => {
  assert.match(requestCostsGuide, /This is the request-cost boundary page/i);
  assert.match(
    requestCostsGuide,
    /go back to the storage parent page if the broader storage budget shape is still unclear/i,
  );
});

test("aws-s3-replication-pricing owns the storage copy-path economics role", () => {
  assert.match(replicationGuide, /This is the storage copy-path economics page/i);
  assert.match(
    replicationGuide,
    /go back to the storage parent page if the broader storage budget shape is still unclear/i,
  );
});
