import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const normalize = (value) => value.replace(/\s+/g, " ").trim();

const calculatorsIndex = normalize(readFileSync(new URL("../src/pages/calculators/index.astro", import.meta.url), "utf8"));
const rdsVsAuroraGuide = normalize(
  readFileSync(new URL("../src/pages/guides/aws-rds-vs-aurora-cost.astro", import.meta.url), "utf8"),
);
const fargateVsEc2Calculator = normalize(
  readFileSync(new URL("../src/pages/calculators/aws-fargate-vs-ec2-cost-calculator.astro", import.meta.url), "utf8"),
);

test("Calculators index explicitly routes users to the primary bill driver before tool choice", () => {
  assert.match(
    calculatorsIndex,
    /Treat this hub as a route-to-the-right-model page: identify the bill driver first \(transfer, compute, storage, logs, or requests\), then open the narrow calculator instead of forcing one blended estimate/i,
  );
});

test("RDS vs Aurora guide closes with normalized-workload comparison caution", () => {
  assert.match(
    rdsVsAuroraGuide,
    /Use this comparison only after the workload is normalized, then re-check compute shape, storage growth, retention, and peak behavior before you call RDS or Aurora the cheaper engine/i,
  );
});

test("Fargate vs EC2 calculator closes with same-workload and non-compute validation guidance", () => {
  assert.match(
    fargateVsEc2Calculator,
    /Treat this calculator as a same-workload compute comparison first, then validate load balancers, logs, NAT, storage, and real utilization separately before you choose Fargate or EC2/i,
  );
});
