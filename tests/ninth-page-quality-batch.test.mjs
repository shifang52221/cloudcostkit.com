import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const normalize = (value) => value.replace(/\s+/g, " ").trim();

const loadBalancerCalculator = normalize(
  readFileSync(new URL("../src/pages/calculators/aws-load-balancer-cost-calculator.astro", import.meta.url), "utf8"),
);
const lcuCalculator = normalize(
  readFileSync(new URL("../src/pages/calculators/aws-load-balancer-lcu-calculator.astro", import.meta.url), "utf8"),
);
const ecsBeyondComputeGuide = normalize(
  readFileSync(new URL("../src/pages/guides/aws-ecs-cost-model-beyond-compute.astro", import.meta.url), "utf8"),
);

test("Load balancer cost calculator closes with fixed-plus-usage validation guidance", () => {
  assert.match(
    loadBalancerCalculator,
    /Treat this calculator as the main load balancer cost model: validate LB-hours, average capacity units, and excluded transfer or downstream service charges before you sign off on the balancer number/i,
  );
});

test("LCU and NLCU calculator closes with dominant-driver estimation guidance instead of final-pricing framing", () => {
  assert.match(
    lcuCalculator,
    /Use this calculator to identify the dominant LCU or NLCU driver first, then move to the main load balancer cost model before you present a final monthly price/i,
  );
});

test("ECS beyond-compute checklist closes with missing-line-item validation guidance", () => {
  assert.match(
    ecsBeyondComputeGuide,
    /Use this checklist only after compute is credible, then validate load balancers, logs, networking, storage, and registry behavior before you treat the ECS budget as complete/i,
  );
});
