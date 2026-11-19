import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const read = (p) => readFileSync(new URL(`../src/${p}`, import.meta.url), "utf8");
test("brand byline does not invent a staffed team or universal source verification", () => {
  const config = read("config/site.ts");
  assert.match(config, /publisherName: "CloudCostKit"/);
  assert.doesNotMatch(config, /Editorial Team|current provider documentation/);
  for (const layout of ["GuideLayout", "CalculatorLayout"]) {
    const source = read(`layouts/${layout}.astro`);
    assert.match(source, /SITE.editorial.publisherName/);
    assert.doesNotMatch(source, /Reviewed by|teamName/);
  }
});
test("maintenance and review limits are visible in policy pages", () => {
  assert.match(read("pages/about.astro"), /not a staffed editorial team/);
  assert.match(read("pages/editorial-policy.astro"), /not proof that every legacy page/);
  assert.match(read("pages/methodology.astro"), /Page dates are not provider-price verification dates/);
});