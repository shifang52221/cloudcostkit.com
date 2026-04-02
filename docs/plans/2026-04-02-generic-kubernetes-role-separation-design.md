# Generic Kubernetes Role Separation Design

## Goal

Deepen the generic Kubernetes support cluster so the calculator-intent checklist, non-node completeness checklist, sizing workflow page, and requests-vs-limits concept page each perform one clear editorial job instead of revisiting the same Kubernetes cost story from slightly different angles.

Target pages:

- `src/pages/guides/kubernetes-cost-calculator.astro`
- `src/pages/guides/kubernetes-cost-model-beyond-nodes.astro`
- `src/pages/guides/kubernetes-requests-limits.astro`
- `src/pages/guides/kubernetes-requests-vs-limits-for-sizing.astro`

## Problem

The current generic Kubernetes support cluster is useful, but the role boundaries are still blurry:

- `kubernetes-cost-calculator` already tries to be a support checklist, a short workflow, and a broad Kubernetes cost guide
- `kubernetes-cost-model-beyond-nodes` overlaps with both the calculator checklist and the generic Kubernetes hub because it re-explains broad cost surfaces without a stronger role declaration
- `kubernetes-requests-limits` teaches a sizing workflow, but it still risks overlapping with the requests-vs-limits explainer because both cover requests, limits, allocatable headroom, and node count
- `kubernetes-requests-vs-limits-for-sizing` explains an important concept, but it still reads like a second sizing workflow page rather than a role-specific clarifier

That overlap creates the same low-quality risk we have been removing elsewhere:

- several pages repeat nodes, overhead, headroom, load balancers, logs, and egress without a strong reason for why this page exists
- users have to infer whether they are on a support checklist page, a non-node cost checklist page, a step-by-step sizing workflow page, or a concept clarifier
- search engines can read the cluster as topic expansion without enough editorial separation

## Recommended Approach

Separate the cluster by the natural jobs this topic wants.

### 1. `kubernetes-cost-calculator` = supporting checklist page

This page should answer:

- what a calculator-intent visitor should validate after finding the calculator
- which quick line items belong in the first-pass estimate
- where to go next for full Kubernetes routing, non-node completeness, or sizing workflow details

This page should feel like the "I want the short checklist beside the calculator" page.

### 2. `kubernetes-cost-model-beyond-nodes` = non-node completeness checklist page

This page should answer:

- what gets missed after node count is already modeled
- how control plane, storage, load balancers, observability, and transfer change the bill
- when users should stop using this page and return to node sizing or the generic hub

This page should feel like the "what costs live beyond node compute?" page.

### 3. `kubernetes-requests-limits` = sizing workflow page

This page should answer:

- how to turn requests, allocatable capacity, overhead, pod density, and headroom into a defendable node count
- what sequence to follow when sizing a cluster
- when a user should route concept-only questions to the requests-vs-limits explainer instead of repeating the whole workflow here

This page should feel like the "how do I size nodes step by step?" page.

### 4. `kubernetes-requests-vs-limits-for-sizing` = concept clarifier page

This page should answer:

- why requests drive scheduling and limits do not define the baseline node count
- how teams accidentally inflate node estimates by treating limits as requests
- when a user should go back to the sizing workflow page once the concept is clear

This page should feel like the "what is the conceptual difference between requests and limits for sizing?" page.

## Concrete Content Moves

### `kubernetes-cost-calculator`

- add explicit role-setting language that says this page is the supporting checklist page, not the main Kubernetes hub or the non-node completeness page
- tighten routing language toward the main hub, the non-node checklist, and the sizing workflow
- keep the page short and calculator-adjacent

### `kubernetes-cost-model-beyond-nodes`

- add explicit "non-node completeness checklist page" positioning
- clarify that node count should already be credible before this page is used
- route sizing workflow questions back to the requests-and-limits workflow page

### `kubernetes-requests-limits`

- add explicit "sizing workflow page" positioning
- clarify that the page is not the concept-only explainer and not the non-node completeness page
- route concept-only confusion about requests vs limits back to the clarifier page

### `kubernetes-requests-vs-limits-for-sizing`

- add explicit "concept clarifier page" positioning
- clarify that step-by-step node sizing belongs on the workflow page
- keep the page focused on role differences and inflation mistakes, not the full workflow

## Success Criteria

- each page states its role in the generic Kubernetes support cluster clearly
- the four pages no longer feel interchangeable
- internal links become directional instead of repetitive
- a regression test can detect the new role-separation language
- `npm test`, `npm run check`, and `npm run build` remain green
