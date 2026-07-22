import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const normalize = (value) => value.replace(/\s+/g, " ").trim();

const ec2Calculator = normalize(
  readFileSync(new URL("../src/pages/calculators/ec2-cost-calculator.astro", import.meta.url), "utf8"),
);
const egressCalculator = normalize(
  readFileSync(new URL("../src/pages/calculators/data-egress-cost-calculator.astro", import.meta.url), "utf8"),
);
const egressGuide = normalize(readFileSync(new URL("../src/pages/guides/egress-costs.astro", import.meta.url), "utf8"));
const ecsComparisonGuide = normalize(
  readFileSync(new URL("../src/pages/guides/aws-ecs-ec2-vs-fargate-cost.astro", import.meta.url), "utf8"),
);

test("EC2 calculator closes with compute-line sign-off language instead of relying on generic calculator trust", () => {
  assert.match(
    ec2Calculator,
    /Treat this calculator as the compute line only: validate instance-hours, blended purchase mix, and excluded EBS, transfer, and load-balancer charges before you present the EC2 number as a stack budget/i,
  );
});

test("Data egress calculator includes one-boundary-per-scenario sign-off guidance", () => {
  assert.match(
    egressCalculator,
    /Use one boundary at a time, then confirm path ownership, effective \$\/GB, and peak-window behavior against AWS network bill lines before you sign off on the estimate/i,
  );
});

test("Egress guide explicitly warns against accepting one headline AWS egress rate without path diagnosis", () => {
  assert.match(
    egressGuide,
    /Treat this guide as a transfer-path diagnosis workflow: confirm the billed boundary, usage type, and unit assumptions before you accept any single AWS egress rate as the answer/i,
  );
});

test("ECS on EC2 vs Fargate comparison closes with platform-fit and non-compute validation guidance", () => {
  assert.match(
    ecsComparisonGuide,
    /Use this comparison to test utilization and operating-model fit first, then validate load balancers, logs, NAT, and storage separately before you declare EC2 or Fargate the cheaper platform/i,
  );
});
