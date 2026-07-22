import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const normalize = (value) => value.replace(/\s+/g, " ").trim();

const read = (path) => normalize(readFileSync(new URL(`../${path}`, import.meta.url), "utf8"));

const copyStorageGuide = read("src/pages/guides/copy-storage-pricing.astro");
const awsS3ReplicationPricingGuide = read("src/pages/guides/aws-s3-replication-pricing.astro");
const s3ReplicationGuide = read("src/pages/guides/s3-replication-cost.astro");
const replicationMeasurementGuide = read("src/pages/guides/estimate-replication-gb-per-month-from-writes.astro");
const s3ReplicationCalculator = read("src/pages/calculators/s3-replication-cost-calculator.astro");
const storageReplicationCalculator = read("src/pages/calculators/storage-replication-cost-calculator.astro");
const crossRegionCalculator = read("src/pages/calculators/cross-region-transfer-cost-calculator.astro");
const glacierTransferGuide = read("src/pages/guides/s3-to-glacier-transfer-cost.astro");

test("copy storage guide stays the copy and backup parent router", () => {
  assert.match(copyStorageGuide, /This is the storage copy and backup routing page/i);
  assert.match(
    copyStorageGuide,
    /use it before calculators when you still need to decide whether the copy is replication, backup copy, migration backfill, cross-region transfer, or archive transition/i,
  );
  assert.match(
    copyStorageGuide,
    /Do not use this page as the final S3 replication pricing page once the provider, rule type, changed GB, and destination storage are already known/i,
  );
});

test("AWS S3 replication pricing owns the AWS-specific bill boundary", () => {
  assert.match(
    awsS3ReplicationPricingGuide,
    /This is the AWS S3 replication bill-boundary page/i,
  );
  assert.match(
    awsS3ReplicationPricingGuide,
    /use it when the question is which AWS S3 replication charges belong in the model: replicated GB, destination storage, replication requests, CRR versus SRR boundary, backfill exposure, and transfer-like effects/i,
  );
  assert.match(
    awsS3ReplicationPricingGuide,
    /Use the S3 replication workflow guide when you need an estimation sequence, and use the write-volume guide when replicated GB is still not credible/i,
  );
});

test("S3 replication guide owns the workflow sequence rather than the AWS pricing anatomy", () => {
  assert.match(
    s3ReplicationGuide,
    /This is the S3 replication workflow page: use it to turn a replication requirement into a sequence of changed-GB measurement, rule coverage, destination storage, request overhead, and transfer-direction checks/i,
  );
  assert.match(
    s3ReplicationGuide,
    /Use AWS S3 replication pricing when the open question is the AWS-specific bill boundary rather than the estimation workflow/i,
  );
});

test("replication GB guide owns measurement before calculator routing", () => {
  assert.match(
    replicationMeasurementGuide,
    /This is the replication-volume measurement page, not the replication pricing page/i,
  );
  assert.match(
    replicationMeasurementGuide,
    /stay here while write GB, churn, object size, replication coverage, retries, or one-time backfill volume still need evidence/i,
  );
  assert.match(
    replicationMeasurementGuide,
    /Move to calculators only after replicated GB\/month is credible enough to price/i,
  );
});

test("replication calculators are bill-conversion pages after changed GB is known", () => {
  assert.match(
    s3ReplicationCalculator,
    /This calculator is the S3 replication bill-conversion page/i,
  );
  assert.match(
    s3ReplicationCalculator,
    /use it after replicated GB\/month, replication coverage, and the S3-specific per-GB assumption are believable enough to translate into a movement-fee estimate/i,
  );
  assert.match(
    storageReplicationCalculator,
    /This calculator is the provider-neutral replication bill-conversion page/i,
  );
  assert.match(
    storageReplicationCalculator,
    /use it after changed GB, copy mode, and effective per-GB replication or transfer rate are credible enough to translate into spend/i,
  );
  assert.match(
    storageReplicationCalculator,
    /The built-in changed-data and event helpers are only quick conversion conveniences, not defendable replication-measurement workflows/i,
  );
});

test("cross-region calculator owns region-pair transfer conversion only", () => {
  assert.match(
    crossRegionCalculator,
    /This calculator is the region-pair transfer bill-conversion page/i,
  );
  assert.match(
    crossRegionCalculator,
    /use it after source region, destination region, traffic direction, monthly GB, and effective cross-region rate are already known/i,
  );
  assert.match(
    crossRegionCalculator,
    /It does not own the replication workflow, replica storage model, request overhead model, or S3-specific replication bill boundary/i,
  );
});

test("S3 to Glacier guide stays archive transition rather than replication or cross-region copy", () => {
  assert.match(
    glacierTransferGuide,
    /This is the archive-transition workflow page, not a replication or cross-region copy pricing page/i,
  );
  assert.match(
    glacierTransferGuide,
    /use it when lifecycle movement into Glacier creates transition requests, minimum-duration exposure, restore-readiness risk, or rewrite churn/i,
  );
  assert.match(
    glacierTransferGuide,
    /Use replication pages only when the same object remains active in another bucket or region as a copy path/i,
  );
});
