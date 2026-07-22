import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const genericCalculator = readFileSync(
  new URL("../src/pages/calculators/aws-fargate-vs-ec2-cost-calculator.astro", import.meta.url),
  "utf8",
);
const ecsCalculator = readFileSync(
  new URL("../src/pages/calculators/aws-ecs-ec2-vs-fargate-cost-calculator.astro", import.meta.url),
  "utf8",
);

test("generic Fargate versus EC2 calculator owns the runtime economics role", () => {
  assert.match(genericCalculator, /generic runtime|generic Fargate|runtime choice/i);
  assert.match(genericCalculator, /same workload shape/i);
  assert.match(genericCalculator, /idle EC2 capacity|packing inefficiency/i);
  assert.match(genericCalculator, /not an ECS-specific|ECS-specific|ECS page/i);
});

test("ECS calculator owns the task placement and host-density role", () => {
  assert.match(ecsCalculator, /ECS-specific|ECS platform|ECS host-density/i);
  assert.match(ecsCalculator, /pack multiple services onto hosts|cluster overhead/i);
  assert.match(ecsCalculator, /daemon tasks|spare headroom/i);
  assert.match(ecsCalculator, /not a generic Fargate|generic runtime/i);
});

test("the two Fargate calculators route users to different decisions", () => {
  assert.match(genericCalculator, /ECS-specific|ECS page/i);
  assert.match(ecsCalculator, /generic Fargate|generic runtime/i);
});
