import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { buildAnalyticsBootstrap } from "../src/lib/analytics-bootstrap.js";

test("analytics page metadata excludes scenario query and fragment without changing share URL", () => {
  const href = "https://cloudcostkit.com/calculators/storage-pricing-calculator/?price=6123#private";
  const window = { location: { href }, dataLayer: [] };
  const scripts = [];
  const document = { referrer: "https://cloudcostkit.com/calculators/?rate=secret#scenario",
    getElementById: (id) => scripts.find((s) => s.id === id), createElement: () => ({}),
    head: { appendChild: (s) => scripts.push(s) } };
  const context = vm.createContext({ window, document, URL });
  const code = buildAnalyticsBootstrap("G-TEST123");
  vm.runInContext(code, context);
  const events = window.dataLayer.map((x) => Array.from(x));
  const config = events.find((x) => x[0] === "config")[2];
  assert.equal(config.send_page_view, false);
  assert.equal(config.page_location, "https://cloudcostkit.com/calculators/storage-pricing-calculator/");
  assert.equal(config.page_referrer, "https://cloudcostkit.com/calculators/");
  assert.ok(!JSON.stringify(events).includes("secret"));
  assert.ok(!JSON.stringify(events).includes("6123"));
  assert.equal(window.location.href, href);
  assert.equal(events.filter((x) => x[0] === "event" && x[1] === "page_view").length, 1);
  vm.runInContext(code, context);
  assert.equal(scripts.length, 1);
});

test("measurement identifier cannot terminate the inline script", () => {
  assert.ok(!buildAnalyticsBootstrap("</script>").includes("</script>"));
});