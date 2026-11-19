import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const read = (name) => readFileSync(new URL(`../src/pages/guides/${name}.astro`, import.meta.url), "utf8");

test("provider guides answer billing before inferred adjacent tool links", () => {
  for (const name of ["azure-container-registry-pricing", "gcp-cloud-run-pricing"]) {
    assert.match(read(name), /openingAssist=\{false\}/);
  }
});

test("ACR worksheet explicitly excludes included storage and avoids invented live rates", () => {
  const source = read("azure-container-registry-pricing");
  assert.match(source, /Illustrative arithmetic, not an Azure price quote/);
  assert.match(source, /not an ACR tier calculator/);
  assert.match(source, /do not invent GET\/PUT fees/);
  assert.equal(1 * 30 + Math.max(80 - 100, 0) * 30 * 0.003, 30);
  assert.equal(1 * 30 + Math.max(130 - 100, 0) * 30 * 0.003, 32.7);
});

test("Cloud Run example uses allocated resource-time and billing-account allowances", () => {
  const source = read("gcp-cloud-run-pricing");
  assert.match(source, /not automatically the number of billable instance-seconds/);
  assert.match(source, /maximum concurrency is a limit/);
  assert.match(source, /aggregated by billing account/);
  assert.equal(2 * 10_000, 20_000);
  assert.equal(2 * 0.5 * 10_000, 10_000);
  assert.equal(2 * 30 * 24 * 3600, 5_184_000);
  assert.equal(2 * 0.5 * 30 * 24 * 3600, 2_592_000);
});