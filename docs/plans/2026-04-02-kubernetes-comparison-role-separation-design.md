# Kubernetes Comparison Role Separation Design

## Goal

Deepen the Kubernetes comparison axis so the hub, AWS platform comparison page, and cross-cloud comparison page each perform one clear editorial job instead of revisiting the same broad Kubernetes cost story from slightly different angles.

Target pages:

- `src/pages/guides/kubernetes-costs.astro`
- `src/pages/guides/aws-ecs-vs-eks-cost.astro`
- `src/pages/guides/eks-vs-gke-vs-aks-cost.astro`

## Problem

The current Kubernetes comparison axis is useful, but the role boundaries are still blurry:

- `kubernetes-costs` reads like a broad explainer, a checklist, and a partial comparison hub at the same time
- `aws-ecs-vs-eks-cost` is useful, but it still reads like a generic Kubernetes cost checklist before it becomes an AWS orchestration choice page
- `eks-vs-gke-vs-aks-cost` compares three managed Kubernetes platforms, but it still overlaps heavily with the generic Kubernetes cost page because both explain the same node, load balancer, observability, storage, and egress nouns

That overlap creates the same low-quality risk we have been removing elsewhere:

- several pages repeat the same line items without a strong reason for why this page exists
- users have to infer whether they are on a navigation hub, an AWS platform choice page, or a cross-cloud managed Kubernetes comparison page
- search engines can read the cluster as topic expansion without enough editorial separation

## Recommended Approach

Separate the cluster by the natural jobs this topic wants.

### 1. `kubernetes-costs` = navigation hub

This page should answer:

- what major Kubernetes cost surfaces exist
- which specialized page handles each next question
- how to move from generic Kubernetes budgeting to the correct provider, platform, or line-item page

This page should feel like the "where should I go next in the Kubernetes cost system?" page.

### 2. `aws-ecs-vs-eks-cost` = AWS orchestration-platform comparison page

This page should answer:

- how ECS and EKS differ as AWS orchestration choices under the same workload assumptions
- when compute model, cluster overhead, and operating model change the winner
- when a user should return to the ECS or EKS bill-boundary pages before continuing the comparison

This page should feel like the "should this workload stay on ECS or move to EKS?" page.

### 3. `eks-vs-gke-vs-aks-cost` = cross-cloud managed Kubernetes comparison page

This page should answer:

- how to compare managed Kubernetes platforms across AWS, Google Cloud, and Azure without using provider-specific pricing pages as if they were the same document
- which line items should be normalized before comparing providers
- when a user should drop into a provider-specific pricing or scope page instead of staying at the cross-cloud layer

This page should feel like the "how do I compare managed Kubernetes platforms across clouds?" page.

## Concrete Content Moves

### `kubernetes-costs`

- add explicit role-setting language that says this page is the navigation hub, not the provider-specific pricing or platform-comparison page
- add directional routing sections for generic budgeting, AWS platform choice, and cross-cloud comparison
- reduce language that sounds like a full comparison or a standalone final estimate

### `aws-ecs-vs-eks-cost`

- add explicit "AWS orchestration-platform comparison page" positioning
- clarify that this page assumes the user already knows what belongs inside the ECS and EKS bills
- route raw ECS bill questions back to ECS pricing and raw EKS bill questions back to EKS pricing

### `eks-vs-gke-vs-aks-cost`

- add explicit "cross-cloud managed Kubernetes comparison page" positioning
- clarify that this page is for normalized provider comparison, not the generic Kubernetes hub or a provider bill-boundary page
- route provider-specific scope questions back to the relevant provider page or the generic hub when the user is still framing the problem

## Success Criteria

- each page states its role in the Kubernetes comparison axis clearly
- the hub and the two comparison pages no longer feel interchangeable
- internal links become directional instead of repetitive
- a regression test can detect the new role-separation language
- `npm test`, `npm run check`, and `npm run build` remain green
