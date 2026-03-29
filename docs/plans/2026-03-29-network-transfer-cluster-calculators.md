# Network Transfer Cluster Calculators Depth Cleanup Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Remove another large template-like calculator cluster by rewriting five network transfer calculators around
their real billing boundaries and operational breakpoints.

**Architecture:** Keep the current calculator components, but replace the repeated editorial tails with page-specific
guidance about boundaries, directionality, payload shape, endpoint-hours, and transfer multipliers.

**Tech Stack:** Astro page content, existing calculator components, internal links

---

### Task 1: Record the network transfer batch

**Files:**
- Create: `docs/plans/2026-03-29-network-transfer-cluster-calculators-design.md`
- Create: `docs/plans/2026-03-29-network-transfer-cluster-calculators.md`

**Step 1: Capture the cluster**

Document the five target calculators and the repeated tail pattern that still weakens originality.

**Step 2: Capture page-specific intent**

Document how NAT, VPC transfer, cross-region transfer, PrivateLink, and API response transfer differ in cost logic.

### Task 2: Rewrite NAT and VPC transfer pages

**Files:**
- Modify: `src/pages/calculators/aws-nat-gateway-cost-calculator.astro`
- Modify: `src/pages/calculators/vpc-data-transfer-cost-calculator.astro`

**Step 1: Remove generic tails**

Delete the shared sections that currently read like template carryover.

**Step 2: Rebuild around actual network boundaries**

Add NAT-specific and VPC-transfer-specific guidance about:

- hourly base versus traffic multiplier
- boundary-first transfer modeling
- topology and traffic-shape mistakes

### Task 3: Rewrite cross-region transfer and PrivateLink pages

**Files:**
- Modify: `src/pages/calculators/cross-region-transfer-cost-calculator.astro`
- Modify: `src/pages/calculators/aws-vpc-interface-endpoint-cost-calculator.astro`

**Step 1: Preserve calculator purpose**

Keep:

- cross-region transfer as the directional transfer estimator
- PrivateLink as the endpoint-hour plus processed-GB estimator

**Step 2: Replace generic tail language**

Add tailored guidance about:

- steady state versus migration/backfill versus DR
- endpoint sprawl, AZ multipliers, and NAT displacement

### Task 4: Rewrite API response transfer tail

**Files:**
- Modify: `src/pages/calculators/api-response-size-transfer-calculator.astro`

**Step 1: Remove mismatched network boilerplate**

Delete the copied boundary/rate language that does not belong on an API payload estimator.

**Step 2: Rebuild around request-volume and payload-shape logic**

Add tailored guidance about:

- compressed bytes over the wire
- route segmentation
- cache hit ratio and retry multipliers
- when to hand off to egress or CDN calculators

### Task 5: Verify stability and quality

**Files:**
- Review: `docs/plans/2026-03-29-network-transfer-cluster-calculators-design.md`
- Review: `docs/plans/2026-03-29-network-transfer-cluster-calculators.md`
- Review: `src/pages/calculators/aws-nat-gateway-cost-calculator.astro`
- Review: `src/pages/calculators/vpc-data-transfer-cost-calculator.astro`
- Review: `src/pages/calculators/cross-region-transfer-cost-calculator.astro`
- Review: `src/pages/calculators/aws-vpc-interface-endpoint-cost-calculator.astro`
- Review: `src/pages/calculators/api-response-size-transfer-calculator.astro`

**Step 1: Run content audit**

Confirm the new sections are ASCII-only and that the repeated generic headings are gone from these target pages.

**Step 2: Run project verification**

Run:

- `npm run check`
- `npm run build`

**Step 3: Commit cleanly**

Commit docs separately from page implementation, then push `thin-page-triage` for merge and live verification.
