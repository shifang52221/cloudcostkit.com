# Azure Load Balancer Pricing Guide Refresh Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Strengthen the Azure Load Balancer pricing guide so it answers high-intent pricing queries sooner, clarifies Azure Load Balancer versus NAT Gateway versus Application Gateway boundaries, and improves trust signals without turning into a template network page.

**Architecture:** Keep the existing guide centered on bill-shape reasoning, but refactor the first screen into a direct pricing answer. Add a quick pricing snapshot, a clearer explanation of rules versus data processed versus bandwidth charges, and a dedicated outbound-rule/NAT boundary section. Use current Azure pricing and Microsoft Learn documentation as the factual anchor, while keeping the content original through judgment-oriented boundary explanations and validation workflow language.

**Tech Stack:** Astro guide page, node:test, generated guide metadata, Azure official pricing page, Microsoft Learn Azure Load Balancer documentation.

---

### Task 1: Add a failing Azure Load Balancer guide coverage test

**Files:**
- Modify: `tests/high-opportunity-page-review.test.mjs`

**Step 1: Write the failing test**

Add assertions that the Azure Load Balancer guide now includes a pricing-first opening, a quick pricing read, and explicit product-boundary language around outbound rules, bandwidth charges, and NAT/Application Gateway.

**Step 2: Run test to verify it fails**

Run: `node --test tests/high-opportunity-page-review.test.mjs`
Expected: FAIL because the new pricing snapshot and boundary text do not yet exist.

**Step 3: Write minimal implementation**

Update the Azure Load Balancer guide content and metadata to satisfy the new assertions while preserving cluster links and guide role separation.

**Step 4: Run test to verify it passes**

Run: `node --test tests/high-opportunity-page-review.test.mjs`
Expected: PASS

**Step 5: Commit**

```bash
git add docs/plans/2026-06-18-azure-load-balancer-pricing-refresh.md tests/high-opportunity-page-review.test.mjs src/pages/guides/azure-load-balancer-pricing.astro src/lib/guides.generated.ts
git commit -m "feat: sharpen Azure load balancer pricing guide"
```
