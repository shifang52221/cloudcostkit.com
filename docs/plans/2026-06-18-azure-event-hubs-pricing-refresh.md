# Azure Event Hubs Pricing Guide Refresh Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Strengthen the Azure Event Hubs pricing guide so it answers tier and capacity-unit pricing intent sooner while preserving the page's original replay, retention, and downstream-amplification depth.

**Architecture:** Keep the current guide's stream-behavior model, but add a pricing-first opening that explains Basic, Standard, Premium, and Dedicated decision boundaries. Add compact guidance for TU, PU, and CU capacity units, Capture availability/cost boundaries, and retention limits before the deeper replay modeling sections. Use Azure pricing and Microsoft Learn quota/scalability guidance as factual anchors while keeping the content judgment-oriented.

**Tech Stack:** Astro guide page, node:test, generated guide metadata, Azure official pricing page, Microsoft Learn Event Hubs documentation.

---

### Task 1: Add a failing Event Hubs guide coverage test

**Files:**
- Modify: `tests/thirteenth-ctr-rescue-batch.test.mjs`
- Modify: `tests/high-opportunity-page-review.test.mjs`

**Step 1: Write the failing test**

Add assertions that the Event Hubs guide now uses a pricing-first title and includes first-screen language for Basic/Standard/Premium/Dedicated, TU/PU/CU, Capture, and retention boundaries.

**Step 2: Run test to verify it fails**

Run: `node --test tests/thirteenth-ctr-rescue-batch.test.mjs tests/high-opportunity-page-review.test.mjs`
Expected: FAIL because the new pricing snapshot and capacity-unit language do not yet exist.

**Step 3: Write minimal implementation**

Update the Event Hubs guide content and metadata to satisfy the new assertions while keeping replay and downstream-cost sections intact.

**Step 4: Run test to verify it passes**

Run: `node --test tests/thirteenth-ctr-rescue-batch.test.mjs tests/high-opportunity-page-review.test.mjs`
Expected: PASS

**Step 5: Commit**

```bash
git add docs/plans/2026-06-18-azure-event-hubs-pricing-refresh.md tests/thirteenth-ctr-rescue-batch.test.mjs tests/high-opportunity-page-review.test.mjs src/pages/guides/azure-event-hubs-pricing.astro src/lib/guides.generated.ts
git commit -m "feat: sharpen Azure Event Hubs pricing guide"
```
