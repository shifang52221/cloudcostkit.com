import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const normalize = (value) => value.replace(/\s+/g, " ").trim();

const pricingPage = normalize(readFileSync(new URL("../src/pages/guides/aws-fargate-pricing.astro", import.meta.url), "utf8"));
const optimizationPage = normalize(
  readFileSync(new URL("../src/pages/guides/aws-fargate-cost-optimization.astro", import.meta.url), "utf8"),
);
const vsEc2Page = normalize(readFileSync(new URL("../src/pages/guides/aws-fargate-vs-ec2-cost.astro", import.meta.url), "utf8"));
const vsEksPage = normalize(readFileSync(new URL("../src/pages/guides/aws-fargate-vs-eks-cost.astro", import.meta.url), "utf8"));

test("pricing page is framed as the Fargate bill-boundary page", () => {
  assert.match(
    pricingPage,
    /Use this page when you need to decide what belongs inside the Fargate bill before you debate EC2 comparisons, EKS comparisons, or optimization actions/i,
  );
  assert.match(
    pricingPage,
    /This guide is the Fargate bill-boundary page: task-level vCPU-hours, memory GB-hours, and adjacent load balancer, logging, and networking lines should be modeled as separate cost surfaces instead of one generic container total/i,
  );
});

test("optimization page is framed as the production intervention page", () => {
  assert.match(
    optimizationPage,
    /Optimization starts only after you know whether idle task-hours, oversized task definitions, logging overhead, or networking drag are the real Fargate cost driver; otherwise teams tune the wrong lever/i,
  );
  assert.match(
    optimizationPage,
    /This page is for production intervention: task right-sizing, idle reduction, scaling cleanup, log control, and networking-cost containment/i,
  );
});

test("Fargate vs EC2 page is framed as the host-model comparison page", () => {
  assert.match(
    vsEc2Page,
    /This page is the Fargate-vs-EC2 host-model comparison page, not the Fargate bill-boundary page: the goal is to compare pay-per-task against pay-for-instance under real idle, packing, storage, and operations assumptions/i,
  );
  assert.match(
    vsEc2Page,
    /If you still need to decide what belongs inside the Fargate bill before you compare platforms, go back to the pricing guide first/i,
  );
});

test("Fargate vs EKS page is framed as the orchestration-platform comparison page", () => {
  assert.match(
    vsEksPage,
    /This page is the Fargate-vs-EKS orchestration-platform comparison page, not the Fargate bill-boundary page: the job is to compare pay-per-task with pay-per-node plus cluster overhead under realistic consolidation and headroom assumptions/i,
  );
  assert.match(
    vsEksPage,
    /If you still need to separate Fargate compute from load balancers, logs, and networking before you compare with EKS, go back to the pricing guide first/i,
  );
});
