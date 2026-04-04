import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const normalize = (value) => value.replace(/\s+/g, " ").trim();

const kubernetesGuide = normalize(
  readFileSync(new URL("../src/pages/guides/kubernetes-costs.astro", import.meta.url), "utf8"),
);
const sizingGuide = normalize(
  readFileSync(new URL("../src/pages/guides/kubernetes-requests-limits.astro", import.meta.url), "utf8"),
);
const beyondNodesGuide = normalize(
  readFileSync(new URL("../src/pages/guides/kubernetes-cost-model-beyond-nodes.astro", import.meta.url), "utf8"),
);

test("kubernetes guide owns the cross-system parent budgeting role", () => {
  assert.match(kubernetesGuide, /This is the Kubernetes system budgeting parent page/i);
  assert.match(
    kubernetesGuide,
    /move into the sizing workflow or the non-node completeness page only after the broader Kubernetes cost shape is clear/i,
  );
});

test("kubernetes sizing guide owns the node-sizing workflow role", () => {
  assert.match(sizingGuide, /This is the Kubernetes node-sizing workflow page/i);
  assert.match(sizingGuide, /go back to the Kubernetes parent page if the wider budget map is still unclear/i);
});

test("beyond-nodes guide owns the non-node completeness role", () => {
  assert.match(beyondNodesGuide, /This is the Kubernetes non-node completeness checklist page/i);
  assert.match(
    beyondNodesGuide,
    /go back to the Kubernetes parent page if you still need the broader Kubernetes budget map/i,
  );
});
