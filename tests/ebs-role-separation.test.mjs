import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const normalize = (value) => value.replace(/\s+/g, " ").trim();

const pricingPage = normalize(readFileSync(new URL("../src/pages/guides/aws-ebs-pricing.astro", import.meta.url), "utf8"));
const gp3Page = normalize(readFileSync(new URL("../src/pages/guides/aws-ebs-gp3-iops-throughput.astro", import.meta.url), "utf8"));
const snapshotPage = normalize(readFileSync(new URL("../src/pages/guides/aws-ebs-snapshot-cost.astro", import.meta.url), "utf8"));
const optimizationPage = normalize(readFileSync(new URL("../src/pages/guides/aws-ebs-cost-optimization.astro", import.meta.url), "utf8"));

test("pricing page is framed as the EBS bill-boundary page", () => {
  assert.match(
    pricingPage,
    /Use this page when you need to decide what belongs inside the EBS bill before you debate gp3 sizing, snapshot retention, or cleanup actions/i,
  );
  assert.match(
    pricingPage,
    /This guide is the EBS bill-boundary page: live volume GB-month, provisioned performance charges when applicable, and retained snapshot storage should be modeled as separate cost surfaces rather than blended into one storage number/i,
  );
});

test("gp3 page is framed as the performance-measurement page", () => {
  assert.match(
    gp3Page,
    /This page is the gp3 performance-measurement page, not the full EBS bill-boundary page: the job is to turn workload IO patterns, latency behavior, and p95 demand into a defendable IOPS and throughput configuration/i,
  );
  assert.match(
    gp3Page,
    /If you still are not sure what belongs inside the EBS bill versus the retained snapshot budget, go back to the pricing guide first/i,
  );
});

test("snapshot page is framed as the retained backup-storage modeling page", () => {
  assert.match(
    snapshotPage,
    /This page is the retained backup-storage modeling page for EBS snapshots: the goal is to translate change rate, retention, and copy policy into stored snapshot GB, not to restate live volume pricing/i,
  );
  assert.match(
    snapshotPage,
    /Snapshot growth is a separate storage-accumulation problem from live volume GB-month, so treat it as its own model before you make optimization changes/i,
  );
});

test("optimization page is framed as the production intervention page", () => {
  assert.match(
    optimizationPage,
    /Optimization starts only after you know whether unused volume GB, over-provisioned gp3 performance, snapshot retention growth, or orphaned disks are the real EBS cost driver; otherwise teams cut the wrong thing/i,
  );
  assert.match(
    optimizationPage,
    /This page is for production intervention: volume cleanup, right-sizing, gp2 to gp3 migration, performance rollback, and snapshot lifecycle control/i,
  );
});
