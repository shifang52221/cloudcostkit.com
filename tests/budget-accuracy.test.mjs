import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";

// Execute the production TypeScript formulas without a build or generated files.
function moduleUrl(relativePath) {
  const source = readFileSync(new URL(relativePath, import.meta.url), "utf8");
  const js = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  }).outputText.replace('"../math"', JSON.stringify(mathUrl));
  return `data:text/javascript;base64,${Buffer.from(js).toString("base64")}`;
}
const mathUrl = `data:text/javascript;base64,${Buffer.from(ts.transpileModule(
  readFileSync(new URL("../src/lib/math.ts", import.meta.url), "utf8"),
  { compilerOptions: { module: ts.ModuleKind.ESNext } },
).outputText).toString("base64")}`;
const { estimateObjectStorageCost } = await import(moduleUrl("../src/lib/calc/storage.ts"));
const { estimateComputeCost } = await import(moduleUrl("../src/lib/calc/compute.ts"));
const near = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-8, `${actual} != ${expected}`);

test("storage worked example reconciles requests, egress and changed downloads", () => {
  const result = estimateObjectStorageCost({ averageStoredGb: 5000, storagePricePerGbMonthUsd: 0.023,
    getRequestsPerMonth: 5_000_000, putRequestsPerMonth: 500_000,
    getPricePer1kUsd: 0.0004, putPricePer1kUsd: 0.005 });
  near(result.storageCostUsd, 115);
  near(result.getCostUsd, 2);
  near(result.putCostUsd, 2.5);
  near(result.totalMonthlyUsd, 119.5);
  near(result.totalMonthlyUsd + 500 * 0.09, 164.5);
  near(result.totalMonthlyUsd + 1000 * 0.09, 209.5);
});

test("negative storage inputs do not produce negative bills", () => {
  const result = estimateObjectStorageCost({ averageStoredGb: -1, storagePricePerGbMonthUsd: -1,
    getRequestsPerMonth: -1, putRequestsPerMonth: -1, getPricePer1kUsd: -1, putPricePer1kUsd: -1 });
  near(result.totalMonthlyUsd, 0);
});

test("compute charges follow running hours, not CPU activity", () => {
  const base = { instances: 1, pricePerHourUsd: 0.1, utilizationPct: 100, daysPerMonth: 30 };
  near(estimateComputeCost({ ...base, hoursPerDay: 24 }).monthlyCostUsd, 72);
  near(estimateComputeCost({ ...base, hoursPerDay: 8 }).monthlyCostUsd, 24);
  near(estimateComputeCost({ ...base, hoursPerDay: 24, utilizationPct: 0 }).monthlyCostUsd, 0);
});

test("shared calculator labels explain units and scope", () => {
  const storage = readFileSync(new URL("../src/components/calculators/ObjectStorageCost.tsx", import.meta.url), "utf8");
  assert.match(storage, /averageStoredGb, 0, 1e12\) \/ 1000/);
  assert.match(storage, /Monthly storage \+ requests subtotal/);
  assert.doesNotMatch(storage, /Estimated monthly total/);
  const compute = readFileSync(new URL("../src/components/calculators/ComputeInstanceCost.tsx", import.meta.url), "utf8");
  assert.match(compute, /Not CPU utilization/);
});