# Fargate Role Separation Design

## Goal

Deepen the AWS Fargate guide cluster so the pricing, optimization, Fargate-vs-EC2, and Fargate-vs-EKS pages each perform one clear editorial job instead of revisiting the same container-cost story from slightly different angles.

Target pages:

- `src/pages/guides/aws-fargate-pricing.astro`
- `src/pages/guides/aws-fargate-cost-optimization.astro`
- `src/pages/guides/aws-fargate-vs-ec2-cost.astro`
- `src/pages/guides/aws-fargate-vs-eks-cost.astro`

## Problem

The current Fargate cluster is useful, but the page roles still overlap:

- the pricing page already explains the main compute model, hidden line items, and some operational implications
- the optimization page re-explains the same bill structure instead of staying centered on production interventions
- the Fargate-vs-EC2 page repeats the Fargate pricing model before getting to the actual decision variables
- the Fargate-vs-EKS page also restates the Fargate model and broad line items before focusing on orchestration trade-offs

That overlap creates the same low-quality risk we have been removing elsewhere:

- multiple pages reuse the same nouns: average running tasks, load balancers, logs, transfer, idle capacity
- users have to infer whether they are on a pricing page, a production-action page, or a platform-choice page
- search engines can read the cluster as topic expansion without enough editorial separation

## Recommended Approach

Separate the cluster by the natural jobs this topic wants.

### 1. Pricing page = bill-boundary page

This page should answer:

- what belongs inside the Fargate bill
- what compute assumptions matter most for monthly cost
- which adjacent line items should be tracked beside Fargate instead of blended into one "container" number

This page should feel like the "what exactly belongs inside the Fargate bill?" page.

### 2. Optimization page = production intervention page

This page should answer:

- what to change after the dominant Fargate cost driver is already known
- how to reduce idle task-hours, oversized task definitions, log waste, and avoidable networking spend safely
- how to validate savings without introducing availability or performance regressions

This page should feel like the "what production changes do we make now?" page.

### 3. Fargate vs EC2 page = host-model comparison page

This page should answer:

- when pay-per-task beats pay-for-instance
- how idle capacity, packing efficiency, and EBS/ops overhead change the result
- what assumptions teams must normalize before comparing Fargate to EC2

This page should feel like the "should this workload stay on Fargate or move to EC2?" page.

### 4. Fargate vs EKS page = orchestration-platform comparison page

This page should answer:

- when pay-per-task beats pay-per-node plus cluster overhead
- how workload consolidation, headroom, cluster sprawl, and add-on overhead change the result
- what assumptions teams must normalize before comparing Fargate to EKS

This page should feel like the "should this workload stay on Fargate or move to EKS?" page.

## Concrete Content Moves

### Pricing page

- add explicit role-setting language that says this is the Fargate bill-boundary page
- add a section that separates Fargate compute from adjacent line items such as load balancers, logs, and transfer
- route production savings questions to the optimization page
- route platform-choice questions to the two comparison pages

### Optimization page

- add explicit "production intervention page" positioning
- add a warning not to optimize before the dominant Fargate cost driver is known
- keep the page centered on task-hours, task sizing, logging, and networking actions rather than re-teaching the full bill model
- add a measure-change-remeasure loop

### Fargate vs EC2 page

- add explicit "host-model comparison page" positioning
- clarify that this page is not the Fargate bill-boundary page
- keep the page centered on idle, packing, EBS, and operational overhead
- route raw billing questions back to the pricing page

### Fargate vs EKS page

- add explicit "orchestration-platform comparison page" positioning
- clarify that this page is not the Fargate bill-boundary page
- keep the page centered on cluster fees, node utilization, headroom, and consolidation
- route raw billing questions back to the pricing page

## Success Criteria

- each page states its role in the Fargate cluster clearly
- pricing, optimization, Fargate-vs-EC2, and Fargate-vs-EKS no longer feel interchangeable
- internal links become directional instead of repetitive
- a regression test can detect the new role-separation language
- `npm test`, `npm run check`, and `npm run build` remain green
