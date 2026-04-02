import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const normalize = (value) => value.replace(/\s+/g, " ").trim();

const pricingPage = normalize(readFileSync(new URL("../src/pages/guides/aws-ecs-pricing.astro", import.meta.url), "utf8"));
const sizingPage = normalize(readFileSync(new URL("../src/pages/guides/aws-ecs-task-sizing.astro", import.meta.url), "utf8"));
const beyondComputePage = normalize(
  readFileSync(new URL("../src/pages/guides/aws-ecs-cost-model-beyond-compute.astro", import.meta.url), "utf8"),
);
const autoscalingPage = normalize(
  readFileSync(new URL("../src/pages/guides/aws-ecs-autoscaling-cost-pitfalls.astro", import.meta.url), "utf8"),
);

test("pricing page is framed as the ECS bill-boundary page", () => {
  assert.match(
    pricingPage,
    /Use this page when you need to decide what belongs inside the ECS bill before you debate task sizing, support line items, or scaling fixes/i,
  );
  assert.match(
    pricingPage,
    /This guide is the ECS bill-boundary page: launch-type compute, surrounding infrastructure, and launch-type-specific storage or network lines should be modeled as separate cost surfaces rather than one generic service total/i,
  );
});

test("task sizing page is framed as the resource-measurement page", () => {
  assert.match(
    sizingPage,
    /This page is the ECS resource-measurement page, not the full ECS bill-boundary page: the job is to turn measured CPU, memory, and traffic behavior into defendable task size and average task count assumptions/i,
  );
  assert.match(
    sizingPage,
    /If you still are not sure what belongs inside the ECS bill before you size tasks, go back to the pricing guide first/i,
  );
});

test("beyond-compute page is framed as the support total-cost checklist page", () => {
  assert.match(
    beyondComputePage,
    /This page is the support total-cost checklist page for ECS: baseline compute should already be modeled, and the goal here is to catch the load balancer, logging, networking, storage, and registry lines that budgets often miss/i,
  );
  assert.match(
    beyondComputePage,
    /Use this page after the compute baseline is credible, not as a replacement for the ECS bill-boundary page or the production intervention page/i,
  );
});

test("autoscaling page is framed as the production intervention page", () => {
  assert.match(
    autoscalingPage,
    /Autoscaling fixes start only after you know whether noisy scaling, retry multiplication, oversized tasks, or traffic-driven side costs are the real ECS cost driver; otherwise teams tune the wrong system/i,
  );
  assert.match(
    autoscalingPage,
    /This page is for production intervention: signal cleanup, cooldown tuning, retry control, and scaling-safe validation/i,
  );
});
