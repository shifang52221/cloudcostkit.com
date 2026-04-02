# EKS Role Separation Design

## Goal

Deepen the AWS EKS guide cluster so the pricing, node sizing, and control plane pages each perform one clear editorial job instead of revisiting the same Kubernetes cost story from slightly different angles.

Target pages:

- `src/pages/guides/aws-eks-pricing.astro`
- `src/pages/guides/aws-eks-node-sizing.astro`
- `src/pages/guides/aws-eks-control-plane-cost.astro`

## Problem

The current EKS cluster is already useful, but the role boundaries are still too soft:

- the pricing page mixes bill ownership, node-capacity workflow, and adjacent line-item reminders in one place
- the node sizing page teaches strong sizing mechanics, but it still needs to say clearly that it is not the full EKS bill-boundary page
- the control plane page explains fixed hourly fees well, but it still needs stronger positioning as the fixed platform-overhead page rather than the whole-cluster budget page

That overlap creates the same low-quality risk we have been removing across the site:

- several pages repeat the same nouns: nodes, control plane, load balancers, logs, NAT, cross-AZ traffic
- users have to infer whether they are on the total-bill page, the capacity-measurement page, or the cluster-count economics page
- search engines can read the cluster as topic expansion without enough editorial separation

## Recommended Approach

Separate the cluster by the natural jobs this topic wants.

### 1. Pricing page = EKS bill-boundary page

This page should answer:

- what belongs inside a realistic EKS bill
- which lines are fixed cluster overhead versus node-driven versus adjacent infrastructure and observability
- where to go next when the open question is node sizing or cluster-count strategy rather than bill scope

This page should feel like the "what exactly belongs inside the EKS bill?" page.

### 2. Node sizing page = capacity-measurement page

This page should answer:

- how to turn requests, allocatable capacity, DaemonSet overhead, pod caps, and headroom into a defendable node count
- why real packing is worse than the spreadsheet minimum
- when to hand raw billing-scope questions back to the pricing page

This page should feel like the "how do we measure and size EKS nodes correctly?" page.

### 3. Control plane page = fixed platform-overhead page

This page should answer:

- how fixed per-cluster fees scale with cluster count
- when cluster sprawl becomes meaningful even if node fleets are small
- when complete budget questions should route back to the pricing page because control plane cost is only one part of total spend

This page should feel like the "when does cluster count and fixed platform overhead matter?" page.

## Concrete Content Moves

### Pricing page

- add explicit role-setting language that says this is the EKS bill-boundary page
- add a section that separates node-driven, fixed platform, and adjacent infrastructure or observability lines
- route node-shape questions to the node sizing page and cluster-sprawl questions to the control plane page

### Node sizing page

- add explicit "capacity-measurement page" positioning
- clarify that this page is not the full EKS bill-boundary page
- keep the page centered on requests, allocatable capacity, DaemonSets, pod density, and headroom
- route raw bill-scope questions back to pricing

### Control plane page

- add explicit "fixed platform-overhead page" positioning
- clarify that full budget questions still belong on the pricing page
- keep the page centered on cluster count, environment sprawl, and when consolidation is worth it

## Success Criteria

- each page states its role in the EKS cluster clearly
- pricing, node sizing, and control plane no longer feel interchangeable
- internal links become directional instead of repetitive
- a regression test can detect the new role-separation language
- `npm test`, `npm run check`, and `npm run build` remain green
