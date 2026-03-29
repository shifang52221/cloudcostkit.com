# Kubernetes Calculator Cluster Depth Cleanup Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Remove another large template cluster by rewriting five Kubernetes-related calculators around their actual
operational and billing boundaries.

**Architecture:** Keep the existing calculators, but replace the repeated editorial tails with Kubernetes-specific
guidance about node hours, requests and limits, control plane fees, add-ons, and observability drivers.

**Tech Stack:** Astro page content, existing calculator components, internal links

---

### Task 1: Record the Kubernetes cluster batch

**Files:**
- Create: `docs/plans/2026-03-29-kubernetes-cluster-calculators-design.md`
- Create: `docs/plans/2026-03-29-kubernetes-cluster-calculators.md`

**Step 1: Capture the cluster**

Document the five target Kubernetes calculators and the repeated tail pattern still present.

**Step 2: Capture page-specific roles**

Document the difference between generic Kubernetes cost, EKS-specific cost, node cost, sizing logic, and observability cost.

### Task 2: Rewrite generic Kubernetes and EKS cost pages

**Files:**
- Modify: `src/pages/calculators/kubernetes-cost-calculator.astro`
- Modify: `src/pages/calculators/eks-cost-calculator.astro`

**Step 1: Remove repeated tail sections**

Delete the shared inputs / interpretation / mistakes / validation pattern.

**Step 2: Rebuild around real cluster cost boundaries**

Add tailored guidance about:

- nodes versus the rest of the cluster bill
- control plane, add-ons, storage, and transfer
- generic Kubernetes versus EKS-specific modeling boundaries

### Task 3: Rewrite node cost and requests/limits pages

**Files:**
- Modify: `src/pages/calculators/kubernetes-node-cost-calculator.astro`
- Modify: `src/pages/calculators/kubernetes-requests-limits-calculator.astro`

**Step 1: Preserve each page's role**

Keep:

- node cost as node-hours and instance pricing
- requests/limits as sizing-first guidance

**Step 2: Replace generic tail language**

Add tailored guidance about:

- autoscaler behavior, system overhead, and headroom
- scheduler reality, CPU versus memory bottlenecks, and pod caps

### Task 4: Rewrite observability page

**Files:**
- Modify: `src/pages/calculators/kubernetes-observability-cost-calculator.astro`

**Step 1: Remove generic boilerplate**

Delete the repeated bottom sections and the shallow checklist language.

**Step 2: Rebuild around logs and metrics as separate bills**

Add tailored guidance about:

- ingestion versus active series
- cardinality, retention, and incident-driven spikes
- why observability often grows faster than node spend

### Task 5: Verify quality and stability

**Files:**
- Review: `docs/plans/2026-03-29-kubernetes-cluster-calculators-design.md`
- Review: `docs/plans/2026-03-29-kubernetes-cluster-calculators.md`
- Review: `src/pages/calculators/kubernetes-cost-calculator.astro`
- Review: `src/pages/calculators/eks-cost-calculator.astro`
- Review: `src/pages/calculators/kubernetes-node-cost-calculator.astro`
- Review: `src/pages/calculators/kubernetes-requests-limits-calculator.astro`
- Review: `src/pages/calculators/kubernetes-observability-cost-calculator.astro`

**Step 1: Run content audit**

Confirm the repeated generic headings are gone and all touched files remain ASCII-only.

**Step 2: Run project verification**

Run:

- `npm run check`
- `npm run build`

**Step 3: Commit cleanly**

Commit docs separately from implementation, then push `thin-page-triage` for merge and live verification.
