import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const page = readFileSync(new URL("../src/pages/index.astro", import.meta.url), "utf8");

test("homepage leads with tasks, followed by tools and maintenance information", () => {
  const tasks = page.indexOf("Start with the cost you need to estimate");
  const tools = page.indexOf(">Featured tools</h2>");
  const maintenance = page.indexOf('id="site-maintenance"');
  assert.ok(tasks > 0 && tasks < tools && tools < maintenance);
  assert.match(page, /Estimate storage budget/);
  assert.match(page, /title: "Estimate log ingestion"/);
  assert.doesNotMatch(page, /High search demand|live search demand|keep strong placement/);
  assert.match(page, /not live provider quotes/);
});

test("task entry refresh preserves maintenance and correction paths", () => {
  for (const path of ["about", "methodology", "editorial-policy", "contact"]) {
    assert.ok(page.includes(`href="/${path}/"`));
  }
});