import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const normalize = (value) => value.replace(/\s+/g, " ").trim();

const calculatorChecklistPage = normalize(
  readFileSync(new URL("../src/pages/guides/kubernetes-cost-calculator.astro", import.meta.url), "utf8"),
);
const beyondNodesPage = normalize(
  readFileSync(new URL("../src/pages/guides/kubernetes-cost-model-beyond-nodes.astro", import.meta.url), "utf8"),
);
const sizingWorkflowPage = normalize(
  readFileSync(new URL("../src/pages/guides/kubernetes-requests-limits.astro", import.meta.url), "utf8"),
);
const conceptClarifierPage = normalize(
  readFileSync(new URL("../src/pages/guides/kubernetes-requests-vs-limits-for-sizing.astro", import.meta.url), "utf8"),
);

test("kubernetes cost calculator page is framed as the supporting checklist page", () => {
  assert.match(
    calculatorChecklistPage,
    /This page is the supporting checklist page for calculator-intent Kubernetes budgeting, not the main Kubernetes hub or the non-node completeness page: the job is to keep the first-pass estimate honest while routing deeper questions outward/i,
  );
  assert.match(
    calculatorChecklistPage,
    /Use this page when you want the short checklist beside the calculator; if you still need the broader Kubernetes map or the non-node checklist, go to those guides next/i,
  );
});

test("beyond-nodes page is framed as the non-node completeness checklist page", () => {
  assert.match(
    beyondNodesPage,
    /This page is the non-node completeness checklist page for Kubernetes: node count should already be credible, and the goal here is to catch the control plane, storage, load balancer, observability, and transfer lines that a node-only model misses/i,
  );
  assert.match(
    beyondNodesPage,
    /If you still are not confident in requests, allocatable headroom, or node count, go back to the sizing workflow first before you use this checklist/i,
  );
});

test("requests-limits page is framed as the sizing workflow page", () => {
  assert.match(
    sizingWorkflowPage,
    /This page is the Kubernetes sizing workflow page, not the concept-only requests-vs-limits explainer: the job is to move from requests to allocatable capacity, headroom, and a defendable node count in sequence/i,
  );
  assert.match(
    sizingWorkflowPage,
    /If the open question is simply why requests and limits play different roles, go to the concept clarifier page first and then come back to this workflow/i,
  );
});

test("requests-vs-limits page is framed as the concept clarifier page", () => {
  assert.match(
    conceptClarifierPage,
    /This page is the requests-vs-limits concept clarifier page, not the full sizing workflow page: the goal is to explain why requests drive node count, why limits do not define the baseline, and how teams accidentally inflate estimates/i,
  );
  assert.match(
    conceptClarifierPage,
    /If you already understand the concept and need the step-by-step node sizing sequence, go back to the sizing workflow page/i,
  );
});
