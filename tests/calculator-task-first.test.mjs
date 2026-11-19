import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";

const read = (p) => readFileSync(new URL(p, import.meta.url), "utf8");

test("task-first ordering is opt-in and surrounds the main tool slot", () => {
  const layout = read("../src/layouts/CalculatorLayout.astro");
  assert.match(layout, /nextStepsPlacement = "before-tool"/);
  const before = layout.indexOf('nextStepsPlacement === "before-tool"');
  const slot = layout.indexOf("<slot />");
  const after = layout.indexOf('nextStepsPlacement === "after-tool"');
  assert.ok(before < slot && slot < after);
  assert.equal((layout.match(/<CalculatorNextSteps /g) || []).length, 2);
});

test("only the two pilot pages opt into after-tool recommendations", () => {
  const dir = new URL("../src/pages/calculators/", import.meta.url);
  const pilots = readdirSync(dir).filter((f) => f.endsWith(".astro") &&
    readFileSync(new URL(f, dir), "utf8").includes('nextStepsPlacement="after-tool"'));
  assert.deepEqual(pilots.sort(), ["log-ingestion-cost-calculator.astro", "storage-pricing-calculator.astro"]);
});

test("extracted recommendations retain link normalization and bounded counts", () => {
  const component = read("../src/components/CalculatorNextSteps.astro");
  assert.match(component, /related\.slice\(0, 4\)/);
  assert.match(component, /guides\.slice\(0, 2\)/);
  assert.match(component, /withTrailingSlash\(r.href\)/);
  assert.match(component, /data-calculator-next-steps/);
});