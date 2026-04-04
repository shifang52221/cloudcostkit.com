# Networking Governance Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Strengthen the networking guide family so the cross-provider page owns system budgeting, the AWS page owns the provider parent role, and the VPC transfer page owns the narrower transfer-path boundary role.

**Architecture:** Treat the networking parent, AWS networking parent, and AWS transfer-path page as one bounded batch. Add a targeted regression test for role separation, then make minimal but explicit first-screen and routing changes so each page owns a different layer of the hierarchy.

**Tech Stack:** Astro guide pages, Node test runner, Markdown planning docs, verification through `npm run check` and `npm run build`.

---

### Task 1: Write the failing regression test

**Files:**
- Create: `tests/networking-parent-governance.test.mjs`
- Read: `src/pages/guides/networking-costs.astro`
- Read: `src/pages/guides/aws-network-costs.astro`
- Read: `src/pages/guides/aws-vpc-data-transfer.astro`

**Step 1:** Write a test that loads the three guide files, normalizes whitespace, and asserts:

- `networking-costs` declares itself as the cross-provider networking system budgeting parent page
- `aws-network-costs` declares itself as the AWS networking budgeting parent page
- `aws-vpc-data-transfer` declares itself as the AWS transfer-path boundary page
- `aws-network-costs` routes readers back to `networking-costs` when the broader cross-provider networking model is still unclear
- `aws-vpc-data-transfer` routes readers back to `aws-network-costs` when the broader AWS networking budget map is still unclear

**Step 2:** Run `node --test tests/networking-parent-governance.test.mjs`.

Expected: FAIL because the stronger hierarchy statements do not yet exist.

### Task 2: Implement the role split

**Files:**
- Modify: `src/pages/guides/networking-costs.astro`
- Modify: `src/pages/guides/aws-network-costs.astro`
- Modify: `src/pages/guides/aws-vpc-data-transfer.astro`

**Step 1:** In `networking-costs.astro`, add a first-screen role statement that explicitly frames the page as the cross-provider networking system budgeting parent page.

**Step 2:** In `networking-costs.astro`, tighten the routing language so it clearly sends readers into provider-specific pages only after the broader network cost shape is clear.

**Step 3:** In `aws-network-costs.astro`, add a role statement that frames the page as the AWS networking budgeting parent page and points broader cross-provider questions back to `networking-costs`.

**Step 4:** In `aws-network-costs.astro`, add routing language that sends narrower transfer-path questions into `aws-vpc-data-transfer` only after the AWS system model is clear.

**Step 5:** In `aws-vpc-data-transfer.astro`, add a role statement that frames the page as the AWS transfer-path boundary page and points broader AWS networking questions back to `aws-network-costs`.

**Step 6:** Keep the batch limited to these three guides unless a blocker forces a scope change.

### Task 3: Run verification

**Files:**
- Tests and guides from Tasks 1-2

**Step 1:** Run `node --test tests/networking-parent-governance.test.mjs`.

Expected: PASS.

**Step 2:** Run `npm run check`.

Expected: `0 errors`, `0 warnings`, and only the accepted existing hints.

**Step 3:** Run `npm run build`.

Expected: success.

### Task 4: Commit

**Files:** the three guides plus the new regression test

**Step:** `git add tests/networking-parent-governance.test.mjs src/pages/guides/networking-costs.astro src/pages/guides/aws-network-costs.astro src/pages/guides/aws-vpc-data-transfer.astro`

`git commit -m "feat: strengthen networking guide roles"`
