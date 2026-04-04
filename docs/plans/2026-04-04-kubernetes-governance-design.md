# Kubernetes Governance Design

## Problem

The Kubernetes guide family is no longer thin, but it still lacks the sharper parent-child governance we now have in stronger clusters.

Current shape:

- `src/pages/guides/kubernetes-costs.astro` behaves like a navigation hub, but it still reads more like a route chooser than a true system-budgeting parent page
- `src/pages/guides/kubernetes-requests-limits.astro` already frames itself as a sizing workflow page
- `src/pages/guides/kubernetes-cost-model-beyond-nodes.astro` already frames itself as a non-node checklist page

The issue is not that these pages are bad. The issue is that the hierarchy is still softer than it should be:

- the parent page does not clearly own the cross-system Kubernetes budgeting role
- the child pages do not consistently route broader budgeting questions back to the parent
- the cluster can still read as several adjacent explainers instead of one deliberate editorial system

## Approved Direction

Use a parent-plus-specialist split:

- `kubernetes-costs` becomes the Kubernetes system budgeting parent page
- `kubernetes-requests-limits` becomes the node-sizing workflow page
- `kubernetes-cost-model-beyond-nodes` becomes the non-node completeness checklist page

The parent page should own the system-budgeting question:

- node baseline
- network and transfer shape
- load balancers and ingress
- observability amplification
- when to route into sizing workflow versus non-node completeness

The specialist pages should own their narrower jobs:

- `kubernetes-requests-limits`: requests, allocatable headroom, limits, node count workflow
- `kubernetes-cost-model-beyond-nodes`: control plane, storage, load balancers, observability, transfer after node baseline is already credible

## Role Split

### `kubernetes-costs`

This page should explicitly identify itself as the Kubernetes system budgeting parent page.

Its job is to:

- frame Kubernetes as a multi-surface system budget rather than a node-only estimate
- separate node sizing from non-node completeness before the reader goes too deep
- route readers into `kubernetes-requests-limits` or `kubernetes-cost-model-beyond-nodes` only after the broader Kubernetes cost shape is clear

It should not read like only a navigation hub.

### `kubernetes-requests-limits`

This page should explicitly identify itself as the Kubernetes node-sizing workflow page.

Its job is to:

- move readers from requests to allocatable capacity, headroom, and defendable node count
- stay focused on sizing workflow rather than broad total-cost completeness
- route readers back to `kubernetes-costs` when the wider Kubernetes budget question is still unresolved

### `kubernetes-cost-model-beyond-nodes`

This page should explicitly identify itself as the Kubernetes non-node completeness checklist page.

Its job is to:

- catch control plane, storage, load balancer, observability, and transfer lines after node count is already believable
- stay focused on completeness after sizing rather than re-teaching the full Kubernetes system budget
- route readers back to `kubernetes-costs` when they still need the broader budget map

## Content Strategy

This round should apply the same governance pattern across all three pages:

1. add or tighten a first-screen role statement
2. strengthen routing language about when this page is the correct entry point
3. reinforce the biggest budgeting mistake for that page's role
4. reduce overlap by keeping the parent broad and the two children intentionally narrower

The goal is not simply more copy. The goal is clearer hierarchy, less topic cannibalization, and a more defensible editorial structure for both users and Google.

## Regression Guard

Add a targeted regression test that verifies:

- `kubernetes-costs` declares itself as the Kubernetes system budgeting parent page
- `kubernetes-requests-limits` declares itself as the Kubernetes node-sizing workflow page
- `kubernetes-cost-model-beyond-nodes` declares itself as the Kubernetes non-node completeness checklist page
- the two specialist pages route broader system questions back to `kubernetes-costs`

The test should protect role separation rather than brittle paragraph matches.

## Scope

Keep this round limited to:

- `src/pages/guides/kubernetes-costs.astro`
- `src/pages/guides/kubernetes-requests-limits.astro`
- `src/pages/guides/kubernetes-cost-model-beyond-nodes.astro`
- `tests/kubernetes-parent-governance.test.mjs`

Do not expand this batch into the calculator checklist page, the concept clarifier page, or the comparison pages unless a direct blocker appears.

## Success Standard

This round is successful when:

- `kubernetes-costs` clearly owns the cross-system Kubernetes budgeting role
- the sizing page and beyond-nodes page feel narrower and more intentional
- the cluster no longer reads like several adjacent Kubernetes explainers
- the regression test passes
- `npm run check` and `npm run build` still pass with only the accepted existing hints
