import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const calculatorsIndex = readFileSync(new URL("../src/pages/calculators/index.astro", import.meta.url), "utf8");

test("calculators index explicitly routes to provider and unit hubs", () => {
  assert.match(calculatorsIndex, /href="\/calculators\/azure\/"/);
  assert.match(calculatorsIndex, /href="\/calculators\/gcp\/"/);
  assert.match(calculatorsIndex, /href="\/calculators\/units\/"/);
});

test("calculators index explains the role of the provider and unit hubs", () => {
  assert.match(calculatorsIndex, /Azure calculators/i);
  assert.match(calculatorsIndex, /GCP calculators/i);
  assert.match(calculatorsIndex, /Units [&] conversions|Units & conversions/i);
});
