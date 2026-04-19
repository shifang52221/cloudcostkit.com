import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const normalize = (value) => value.replace(/\s+/g, " ").trim();

const calculatorPage = normalize(
  readFileSync(new URL("../src/pages/calculators/data-egress-cost-calculator.astro", import.meta.url), "utf8"),
);
const egressGuide = normalize(
  readFileSync(new URL("../src/pages/guides/egress-costs.astro", import.meta.url), "utf8"),
);
const calculatorComponent = normalize(
  readFileSync(new URL("../src/components/calculators/DataEgressCost.tsx", import.meta.url), "utf8"),
);

test("calculator presets are concrete egress situations instead of generic traffic sizes", () => {
  assert.match(calculatorComponent, /Scenario presets/i);
  assert.match(calculatorComponent, /(internet|public|outbound)\s+(egress|transfer)/i);
  assert.match(calculatorComponent, /(cdn|edge|cache)\s+(origin|fill|miss|transfer)/i);
  assert.match(
    calculatorComponent,
    /(cross[-\s]?region|replication|dr|failover)\s+(transfer|traffic|sync|egress|movement)/i,
  );
});

test("calculator includes breakdown and decision-support copy for boundary, peak, and next action", () => {
  const calculatorContent = `${calculatorComponent} ${calculatorPage}`;
  assert.match(
    calculatorContent,
    /(cost\s+breakdown|tier\s+breakdown|baseline\s+vs\s+peak|decision[-\s]?support|next\s+action|next\s+step)/i,
  );
  assert.match(
    calculatorContent,
    /(boundary|peak|spike|optimi[sz]ation|dominant[-\s]?path|scenario\s+planning|what\s+to\s+check)/i,
  );
});

test("guide opening includes first-screen diagnostic workflow", () => {
  assert.match(egressGuide, /(what|which)\s+(changed|change|shifted|spiked|increased)/i);
  assert.match(egressGuide, /(which|what)\s+(bill|path|boundary|usage\s+type).*(moved|shifted|drove|changed|inflated)/i);
  assert.match(egressGuide, /(what|where|how)\s+to\s+(check|validate|verify).*(next|first|after)/i);
});

test("guide has mistakes or checklist guidance that is distinct from calculator routing", () => {
  assert.match(egressGuide, /mistakes|checklist/i);
  assert.match(egressGuide, /(already\s+know|known)\s+.*(rate|path|boundary).*?(calculator|model)/i);
  assert.match(egressGuide, /(if\s+not|still\s+unclear|unclear|diagnos|clarif).*(boundary|path|bill|transfer)/i);
});
