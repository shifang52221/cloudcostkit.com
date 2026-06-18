# Azure Container Registry Pricing Guide Refresh Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Strengthen the Azure Container Registry pricing guide so it better matches high-intent pricing queries, answers tier questions sooner, and carries fresher trust signals without turning into a template page.

**Architecture:** Keep the existing guide structure, but sharpen the SERP-facing metadata, add a compact tier snapshot near the top, and expand the budgeting interpretation around Basic, Standard, and Premium. Use official Azure pricing and SKU-limit documentation as the source of truth for included storage, geo-replication, and throughput limits. Keep the page original by emphasizing decision logic, cost boundary interpretation, and validation steps rather than copying pricing tables.

**Tech Stack:** Astro guide page, node:test, existing content/layout components, Azure official pricing and Microsoft Learn documentation.

---

### Task 1: Add a failing ACR guide coverage test

**Files:**
- Modify: `tests/thirteenth-ctr-rescue-batch.test.mjs`

**Step 1: Write the failing test**

Add assertions that the ACR guide now includes a more direct pricing-focused title, a compact tier snapshot, and refreshed trust/date language.

**Step 2: Run test to verify it fails**

Run: `node --test tests/thirteenth-ctr-rescue-batch.test.mjs`
Expected: FAIL because the new pricing snapshot text and refreshed wording are not yet present.

**Step 3: Write minimal implementation**

Update the ACR guide content and metadata to satisfy the new assertions.

**Step 4: Run test to verify it passes**

Run: `node --test tests/thirteenth-ctr-rescue-batch.test.mjs`
Expected: PASS

**Step 5: Commit**

```bash
git add tests/thirteenth-ctr-rescue-batch.test.mjs src/pages/guides/azure-container-registry-pricing.astro docs/plans/2026-06-18-acr-pricing-guide-refresh.md
git commit -m "feat: sharpen ACR pricing guide"
```
