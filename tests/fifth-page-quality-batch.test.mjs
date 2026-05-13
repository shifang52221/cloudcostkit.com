import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const normalize = (value) => value.replace(/\s+/g, " ").trim();

const cdnGuide = normalize(readFileSync(new URL("../src/pages/guides/cdn-costs.astro", import.meta.url), "utf8"));
const kubernetesChecklist = normalize(
  readFileSync(new URL("../src/pages/guides/kubernetes-cost-calculator.astro", import.meta.url), "utf8"),
);
const replicationGuide = normalize(
  readFileSync(new URL("../src/pages/guides/s3-replication-cost.astro", import.meta.url), "utf8"),
);

test("CDN guide closes with page-specific validation language instead of generic boilerplate", () => {
  assert.doesNotMatch(cdnGuide, /Educational use only/i);
  assert.match(
    cdnGuide,
    /Treat this page as a routing and validation workflow: confirm billable units, region mix, and cache-hit assumptions before you turn a blended CDN number into a committed budget/i,
  );
});

test("Kubernetes checklist closes with page-specific deployment caution instead of generic boilerplate", () => {
  assert.doesNotMatch(kubernetesChecklist, /Educational use only/i);
  assert.match(
    kubernetesChecklist,
    /Use this checklist as a planning baseline, then validate allocatable headroom, managed-service fees, and observability growth against real cluster behavior after deployment/i,
  );
});

test("Replication guide closes with page-specific provider-rule caution instead of generic boilerplate", () => {
  assert.doesNotMatch(replicationGuide, /Educational use only/i);
  assert.match(
    replicationGuide,
    /Use this page as a copy-path planning framework, then confirm provider directionality, request classes, replica storage, and regional billing rules before you sign off on the number/i,
  );
});
