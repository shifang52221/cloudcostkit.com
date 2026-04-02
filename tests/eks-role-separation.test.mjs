import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const normalize = (value) => value.replace(/\s+/g, " ").trim();

const pricingPage = normalize(readFileSync(new URL("../src/pages/guides/aws-eks-pricing.astro", import.meta.url), "utf8"));
const nodeSizingPage = normalize(readFileSync(new URL("../src/pages/guides/aws-eks-node-sizing.astro", import.meta.url), "utf8"));
const controlPlanePage = normalize(
  readFileSync(new URL("../src/pages/guides/aws-eks-control-plane-cost.astro", import.meta.url), "utf8"),
);

test("pricing page is framed as the EKS bill-boundary page", () => {
  assert.match(
    pricingPage,
    /Use this page when you need to decide what belongs inside the full EKS bill before you tune node shape, cluster count, or adjacent infrastructure assumptions/i,
  );
  assert.match(
    pricingPage,
    /This guide is the EKS bill-boundary page: node-driven compute, fixed platform overhead, and adjacent infrastructure or observability lines should be modeled as separate cost surfaces instead of one blurred Kubernetes total/i,
  );
});

test("node sizing page is framed as the capacity-measurement page", () => {
  assert.match(
    nodeSizingPage,
    /This page is the EKS capacity-measurement page, not the full EKS bill-boundary page: the job is to turn requests, allocatable capacity, DaemonSet overhead, pod density, and headroom into a defendable node count/i,
  );
  assert.match(
    nodeSizingPage,
    /If you still are not sure what belongs inside the total EKS bill before you size nodes, go back to the pricing guide first/i,
  );
});

test("control plane page is framed as the fixed platform-overhead page", () => {
  assert.match(
    controlPlanePage,
    /This page is the fixed platform-overhead page for EKS: the goal is to model the per-cluster fee and cluster-sprawl economics without pretending control plane cost is the whole Kubernetes bill/i,
  );
  assert.match(
    controlPlanePage,
    /Use this page when the open question is cluster count or environment sprawl; if you need the full EKS budget boundary, go back to the pricing guide/i,
  );
});
