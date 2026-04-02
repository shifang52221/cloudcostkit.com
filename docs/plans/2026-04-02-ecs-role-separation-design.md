# ECS Role Separation Design

## Goal

Deepen the AWS ECS guide cluster so the pricing, task sizing, beyond-compute checklist, and autoscaling pitfalls pages each perform one clear editorial job instead of revisiting the same service-cost story from slightly different angles.

Target pages:

- `src/pages/guides/aws-ecs-pricing.astro`
- `src/pages/guides/aws-ecs-task-sizing.astro`
- `src/pages/guides/aws-ecs-cost-model-beyond-compute.astro`
- `src/pages/guides/aws-ecs-autoscaling-cost-pitfalls.astro`

## Problem

The current ECS cluster is useful, but the role boundaries are still blurry:

- the pricing page already mixes bill structure, non-compute line items, and launch-type comparison
- the task sizing page drifts into a broad cost model because sizing choices are naturally tied to cost
- the beyond-compute page re-explains baseline compute and total-cost modeling without a strong role declaration
- the autoscaling pitfalls page overlaps with task sizing and cost modeling because it covers retries, logs, and non-compute growth

That overlap creates the same low-quality risk we have been removing elsewhere:

- several pages repeat the same nouns: load balancers, logs, NAT, average tasks, Fargate vs EC2
- users have to infer whether they are on the bill-boundary page, the measurement page, the support checklist page, or the production intervention page
- search engines can read the cluster as topic expansion without enough editorial separation

## Recommended Approach

Separate the cluster by the natural jobs this topic wants.

### 1. Pricing page = bill-boundary page

This page should answer:

- what belongs inside the ECS bill
- which costs are launch-type dependent
- which adjacent lines should be tracked beside ECS instead of blended into one service total

This page should feel like the "what exactly belongs inside the ECS bill?" page.

### 2. Task sizing page = resource-measurement page

This page should answer:

- how to turn measured CPU, memory, and traffic behavior into task size and average task count assumptions
- how to separate steady-state sizing from burst headroom
- how to avoid sizing from peak-only guesses

This page should feel like the "how do we measure and size tasks correctly?" page.

### 3. Beyond-compute page = support total-cost checklist page

This page should answer:

- what commonly gets missed after compute is estimated
- how load balancers, logs, metrics, NAT, transfer, storage, and registry behavior add to total ECS cost
- how to build a full-service cost model without turning it into a pricing page or an optimization page

This page should feel like the "what else belongs in the total ECS cost model?" page.

### 4. Autoscaling pitfalls page = production intervention page

This page should answer:

- what to change when scaling behavior is inflating ECS spend
- how noisy signals, retries, flapping, and non-compute multipliers create real waste
- how to validate scaling changes safely

This page should feel like the "what production fixes stop autoscaling from bloating the bill?" page.

## Concrete Content Moves

### Pricing page

- add explicit role-setting language that says this is the ECS bill-boundary page
- add a section that separates compute, surrounding infrastructure, and launch-type-specific costs
- route task-shape questions to task sizing, support line-item questions to beyond-compute, and intervention questions to autoscaling pitfalls

### Task sizing page

- add explicit "resource-measurement page" positioning
- clarify that this page is not the full ECS bill-boundary page
- keep the page centered on measured CPU, memory, utilization targets, and average task count
- route scaling-failure interventions to the autoscaling page

### Beyond-compute page

- add explicit "support total-cost checklist page" positioning
- clarify that this page assumes baseline compute has already been modeled
- keep the page centered on total-cost completeness rather than pricing-boundary or optimization language

### Autoscaling pitfalls page

- add explicit "production intervention page" positioning
- add a warning not to tune autoscaling before the main ECS cost driver is known
- keep the page centered on scaling signals, retries, flapping, and traffic-multiplied side costs
- add a measure-change-remeasure loop

## Success Criteria

- each page states its role in the ECS cluster clearly
- pricing, task sizing, beyond-compute, and autoscaling no longer feel interchangeable
- internal links become directional instead of repetitive
- a regression test can detect the new role-separation language
- `npm test`, `npm run check`, and `npm run build` remain green
