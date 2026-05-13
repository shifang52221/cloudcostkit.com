import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const normalize = (value) => value.replace(/\s+/g, " ").trim();

const ebsCalculator = normalize(
  readFileSync(new URL("../src/pages/calculators/aws-ebs-cost-calculator.astro", import.meta.url), "utf8"),
);
const snapshotCalculator = normalize(
  readFileSync(new URL("../src/pages/calculators/aws-ebs-snapshot-cost-calculator.astro", import.meta.url), "utf8"),
);
const ebsGuide = normalize(readFileSync(new URL("../src/pages/guides/aws-ebs-pricing.astro", import.meta.url), "utf8"));

test("EBS calculator closes with live-volume and paid-performance validation guidance", () => {
  assert.match(
    ebsCalculator,
    /Treat this calculator as the live-volume and paid-performance model: validate GB-month, provisioned IOPS, throughput, and excluded snapshot retention before you present the EBS number as complete storage spend/i,
  );
});

test("EBS snapshot calculator closes with changed-block and retention validation guidance", () => {
  assert.match(
    snapshotCalculator,
    /Use this calculator as a retained snapshot-growth model, then confirm daily churn, retention policy, copy behavior, and one-off maintenance spikes before you sign off on the snapshot budget/i,
  );
});

test("EBS pricing guide explicitly warns against collapsing live volumes, performance, and snapshots into one total", () => {
  assert.match(
    ebsGuide,
    /Treat this guide as an EBS bill-boundary workflow: separate live volume GB-month, paid performance, and retained snapshot storage before you accept one rolled-up storage total/i,
  );
});
