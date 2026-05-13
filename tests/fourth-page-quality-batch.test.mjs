import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const normalize = (value) => value.replace(/\s+/g, " ").trim();

const objectStorageCalc = normalize(
  readFileSync(new URL("../src/pages/calculators/object-storage-cost-calculator.astro", import.meta.url), "utf8"),
);
const logCostCalc = normalize(
  readFileSync(new URL("../src/pages/calculators/log-cost-calculator.astro", import.meta.url), "utf8"),
);
const storageReplicationCalc = normalize(
  readFileSync(new URL("../src/pages/calculators/storage-replication-cost-calculator.astro", import.meta.url), "utf8"),
);
const glacierGuide = normalize(
  readFileSync(new URL("../src/pages/guides/aws-s3-glacier-pricing.astro", import.meta.url), "utf8"),
);

test("object storage calculator opens with a clearer capacity-versus-request decision", () => {
  assert.match(
    objectStorageCalc,
    /The first modeling decision is whether this bucket is mainly a stored-capacity problem or a request-shape problem/i,
  );
});

test("log cost calculator opens with a clearer three-part logging bill decision", () => {
  assert.match(
    logCostCalc,
    /The first modeling decision is whether the logging bill is mainly ingestion, retention, or search-driven/i,
  );
});

test("storage replication calculator opens with a clearer changed-data decision", () => {
  assert.match(
    storageReplicationCalc,
    /The first modeling decision is whether the replication bill is being created by steady changed data or by one-time backfill and migration traffic/i,
  );
});

test("Glacier pricing guide opens with a clearer archive-bill decision", () => {
  assert.match(
    glacierGuide,
    /The first budgeting decision is whether the archive bill is mainly a quiet-storage problem, a retrieval-volume problem, or a small-object request problem/i,
  );
});
