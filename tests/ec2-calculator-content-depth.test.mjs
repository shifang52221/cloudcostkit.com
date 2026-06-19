import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const normalize = (value) => value.replace(/\s+/g, " ").trim();

const ec2CalculatorPage = normalize(
  readFileSync(new URL("../src/pages/calculators/ec2-cost-calculator.astro", import.meta.url), "utf8"),
);

test("EC2 calculator page reads like one tighter estimation workflow instead of repeated template blocks", () => {
  assert.match(ec2CalculatorPage, /EC2 Cost Calculator: Estimate Monthly EC2 Pricing Fast/i);
  assert.match(
    ec2CalculatorPage,
    /Use this EC2 cost calculator when you need a quick monthly estimate from instance count, uptime, and a blended \$\/hour/i,
  );
  assert.match(
    ec2CalculatorPage,
    /When to use this EC2 pricing calculator.*What matters most in an EC2 estimate.*How to choose inputs and reconcile the number.*Next actions after the first estimate/i,
  );
  assert.match(
    ec2CalculatorPage,
    /average instance-hours.*effective blended \$\/hour.*baseline vs peak.*separate non-compute lines/i,
  );
  assert.match(
    ec2CalculatorPage,
    /Treat this calculator as the compute line only: validate instance-hours, blended purchase mix, and excluded EBS, transfer, and load-balancer charges before you present the EC2 number as a stack budget/i,
  );
  assert.match(ec2CalculatorPage, /lastUpdated="2026-06-19"/i);
});
