import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const normalize = (value) => value.replace(/\s+/g, " ").trim();

const hubPage = normalize(readFileSync(new URL("../src/pages/guides/kubernetes-costs.astro", import.meta.url), "utf8"));
const awsComparisonPage = normalize(
  readFileSync(new URL("../src/pages/guides/aws-ecs-vs-eks-cost.astro", import.meta.url), "utf8"),
);
const crossCloudComparisonPage = normalize(
  readFileSync(new URL("../src/pages/guides/eks-vs-gke-vs-aks-cost.astro", import.meta.url), "utf8"),
);

test("kubernetes costs page is framed as the navigation hub", () => {
  assert.match(
    hubPage,
    /This page is the Kubernetes cost navigation hub, not the provider-specific pricing page or the platform-comparison page: the job is to route you from generic cluster budgeting to the right next guide before you overfit one estimate/i,
  );
  assert.match(
    hubPage,
    /Use this hub when you still need to decide whether the next question is generic Kubernetes budgeting, AWS platform choice, or cross-cloud managed Kubernetes comparison/i,
  );
});

test("ECS vs EKS page is framed as the AWS orchestration-platform comparison page", () => {
  assert.match(
    awsComparisonPage,
    /This page is the AWS orchestration-platform comparison page, not the ECS or EKS bill-boundary page: the goal is to compare two AWS operating models under the same workload, traffic, and overhead assumptions/i,
  );
  assert.match(
    awsComparisonPage,
    /If you still need to decide what belongs inside the ECS bill or the EKS bill before you compare platforms, go back to the relevant pricing guide first/i,
  );
});

test("EKS vs GKE vs AKS page is framed as the cross-cloud managed Kubernetes comparison page", () => {
  assert.match(
    crossCloudComparisonPage,
    /This page is the cross-cloud managed Kubernetes comparison page, not the generic Kubernetes hub or a provider bill-boundary page: the goal is to normalize the same workload across EKS, GKE, and AKS before debating winners/i,
  );
  assert.match(
    crossCloudComparisonPage,
    /If you still need to define provider-specific bill scope before you compare clouds, go back to the relevant provider pricing page or start from the Kubernetes cost hub/i,
  );
});
