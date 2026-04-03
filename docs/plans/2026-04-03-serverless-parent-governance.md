# Serverless Parent Governance Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Strengthen the serverless parent cluster so the cross-provider guide owns system budgeting and the provider pages own service-specific pricing boundaries.

**Architecture:** Treat the serverless parent page plus three provider pages as one bounded batch. Add a targeted regression test for role separation, then make minimal first-screen and routing changes that keep the parent page broad and the provider pages intentionally narrower.

**Tech Stack:** Astro guide pages, Node test runner, Markdown planning docs, verification through `npm run check` and `npm run build`.

---

### Task 1: Write the failing regression test

**Files:**
- Create: `tests/serverless-parent-role-separation.test.mjs`
- Read: `src/pages/guides/serverless-costs.astro`
- Read: `src/pages/guides/aws-lambda-pricing.astro`
- Read: `src/pages/guides/azure-functions-pricing.astro`
- Read: `src/pages/guides/gcp-cloud-run-pricing.astro`

**Step 1:** Write a test that loads the four guide files, normalizes whitespace, and asserts:

- `serverless-costs` declares itself as the cross-provider serverless architecture budgeting parent page
- `aws-lambda-pricing` declares itself as the Lambda bill-boundary page
- `azure-functions-pricing` declares itself as the Azure Functions execution and pricing boundary page
- `gcp-cloud-run-pricing` declares itself as the Cloud Run service behavior and pricing decision page
- the provider pages route readers back to `serverless-costs` when the broader serverless system model is still unclear

**Step 2:** Run `node --test tests/serverless-parent-role-separation.test.mjs`.

Expected: FAIL because the explicit role statements do not yet exist.

### Task 2: Implement the role split

**Files:**
- Modify: `src/pages/guides/serverless-costs.astro`
- Modify: `src/pages/guides/aws-lambda-pricing.astro`
- Modify: `src/pages/guides/azure-functions-pricing.astro`
- Modify: `src/pages/guides/gcp-cloud-run-pricing.astro`

**Step 1:** In `serverless-costs.astro`, add a hero paragraph that explicitly frames the page as the cross-provider serverless architecture budgeting parent page.

**Step 2:** In `serverless-costs.astro`, refine the "when to use this page" section so it clearly routes users into provider pages only after the workload shape is clear.

**Step 3:** In `aws-lambda-pricing.astro`, add a role statement that frames the page as the Lambda bill-boundary page and points broader system-modeling questions back to `serverless-costs`.

**Step 4:** In `azure-functions-pricing.astro`, add a role statement that frames the page as the Azure Functions execution and pricing boundary page and points broader system-modeling questions back to `serverless-costs`.

**Step 5:** In `gcp-cloud-run-pricing.astro`, add a role statement that frames the page as the Cloud Run service behavior and pricing decision page and points broader system-modeling questions back to `serverless-costs`.

**Step 6:** Keep the batch limited to these four guides unless a blocker forces a scope change.

### Task 3: Run verification

**Files:**
- Tests and guides from Tasks 1-2

**Step 1:** Run `node --test tests/serverless-parent-role-separation.test.mjs`.

Expected: PASS.

**Step 2:** Run `npm run check`.

Expected: existing hints only.

**Step 3:** Run `npm run build`.

Expected: success.

### Task 4: Commit

**Files:** the four guides plus the new regression test

**Step:** `git add tests/serverless-parent-role-separation.test.mjs src/pages/guides/serverless-costs.astro src/pages/guides/aws-lambda-pricing.astro src/pages/guides/azure-functions-pricing.astro src/pages/guides/gcp-cloud-run-pricing.astro`

`git commit -m "feat: strengthen serverless parent roles"`
