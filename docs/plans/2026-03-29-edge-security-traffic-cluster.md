# Edge, Security, and Traffic Calculator Cluster Depth Cleanup Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Remove the next template-heavy calculator cluster by rewriting six CDN, CloudFront, and WAF calculators around
their true traffic, cache, and security billing boundaries.

**Architecture:** Keep the current widgets and route structure, but replace repeated editorial tails with page-specific
guidance about edge bandwidth, request classes, origin miss leakage, evaluated-request modeling, and attack-driven cost
spikes.

**Tech Stack:** Astro page content, existing calculator components, internal links

---

### Task 1: Record the edge and security batch

**Files:**
- Create: `docs/plans/2026-03-29-edge-security-traffic-cluster-design.md`
- Create: `docs/plans/2026-03-29-edge-security-traffic-cluster.md`

**Step 1: Capture the cluster**

Document the six target calculators and the repeated-tail problem still present in this group.

**Step 2: Capture the delivery chain**

Document how CDN bandwidth, CDN requests, CloudFront blended billing, origin egress, WAF request estimation, and WAF
cost fit together as one traffic path instead of isolated templates.

### Task 2: Rewrite the edge-delivery calculators

**Files:**
- Modify: `src/pages/calculators/cloudfront-cost-calculator.astro`
- Modify: `src/pages/calculators/cdn-bandwidth-cost-calculator.astro`
- Modify: `src/pages/calculators/cdn-request-cost-calculator.astro`

**Step 1: Remove repeated tail sections**

Delete the generic inputs / interpretation / mistakes / validation structure where it still appears.

**Step 2: Rebuild around edge billing boundaries**

Add tailored guidance about:

- CloudFront as bandwidth plus request fees
- bandwidth-heavy delivery behavior and regional rate mix
- request-class fragmentation, bot spikes, and cache-key behavior

### Task 3: Rewrite origin leakage and WAF support pages

**Files:**
- Modify: `src/pages/calculators/cdn-origin-egress-calculator.astro`
- Modify: `src/pages/calculators/aws-waf-request-estimator.astro`

**Step 1: Preserve support-page role**

Keep both pages as support calculators that feed adjacent public cost pages.

**Step 2: Replace generic support prose**

Add tailored guidance about:

- cache misses, revalidation, and origin-side billing leakage
- baseline vs attack request modeling and blocked traffic treatment

### Task 4: Rewrite the main WAF calculator

**Files:**
- Modify: `src/pages/calculators/aws-waf-cost-calculator.astro`

**Step 1: Remove reusable calculator-shell prose**

Delete the generic checklist and repeated scenario language.

**Step 2: Rebuild around layered security billing**

Add tailored guidance about:

- ACL and rule inventory
- evaluated-request spikes during attacks
- downstream log and analytics costs as a second incident bill

### Task 5: Verify quality and stability

**Files:**
- Review: `docs/plans/2026-03-29-edge-security-traffic-cluster-design.md`
- Review: `docs/plans/2026-03-29-edge-security-traffic-cluster.md`
- Review: `src/pages/calculators/cloudfront-cost-calculator.astro`
- Review: `src/pages/calculators/cdn-bandwidth-cost-calculator.astro`
- Review: `src/pages/calculators/cdn-request-cost-calculator.astro`
- Review: `src/pages/calculators/cdn-origin-egress-calculator.astro`
- Review: `src/pages/calculators/aws-waf-cost-calculator.astro`
- Review: `src/pages/calculators/aws-waf-request-estimator.astro`

**Step 1: Run content audit**

Confirm the repeated generic headings are gone and all touched files remain ASCII-only.

**Step 2: Run project verification**

Run:

- `npm run check`
- `npm run build`

**Step 3: Commit cleanly**

Commit docs separately from implementation, then push `thin-page-triage` for merge and live verification.
