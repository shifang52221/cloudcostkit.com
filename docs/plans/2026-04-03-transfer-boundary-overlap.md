# Transfer Boundary Overlap Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Split the transfer-boundary cluster so the parent guide owns transfer classification and the egress guide owns the egress decision and billing workflow.

**Architecture:** Treat the two guides as one bounded batch. Add a small regression test that checks role separation without overfitting to exact sentences, then make minimal but clear first-screen and routing changes so the pages no longer read like duplicate broad explainers.

**Tech Stack:** Astro guides, Node test runner, Markdown planning docs, verification through `npm run check` and `npm run build`.

---

### Task 1: Write the failing regression test

**Files:**
- Create: `tests/transfer-boundary-role-separation.test.mjs`
- Read: `src/pages/guides/network-transfer-costs.astro`
- Read: `src/pages/guides/egress-costs.astro`

**Step 1:** Write a test that loads the two guide files, normalizes whitespace, and asserts:

- `network-transfer-costs` says it is the network transfer boundary page and tells readers to define the transfer path before choosing rates
- `egress-costs` says it is the egress decision or billing page
- `egress-costs` tells readers to go back to the broader transfer boundary guide when the path is still unclear

**Step 2:** Run `node --test tests/transfer-boundary-role-separation.test.mjs`.

Expected: FAIL because the explicit role statements do not yet exist.

### Task 2: Implement the minimal guide changes

**Files:**
- Modify: `src/pages/guides/network-transfer-costs.astro`
- Modify: `src/pages/guides/egress-costs.astro`

**Step 1:** In `network-transfer-costs.astro`, add a stronger hero paragraph that explicitly calls it the network transfer boundary page and tells readers to define the transfer path before applying prices.

**Step 2:** In `network-transfer-costs.astro`, add or refine one directional section that routes readers toward calculators and narrower guides only after the transfer boundary is known.

**Step 3:** In `egress-costs.astro`, replace the overlapping generic intro with copy that explicitly identifies the page as the egress decision and billing page.

**Step 4:** In `egress-costs.astro`, add or refine routing language that tells readers to return to `network-transfer-costs` when they have not yet identified whether the traffic is internet egress, cross-AZ, cross-region, or CDN-origin transfer.

**Step 5:** Keep the batch limited to these two guide pages unless a blocker forces a calculator follow-up.

### Task 3: Run verification

**Files:**
- Tests and guides from Tasks 1-2

**Step 1:** Run `node --test tests/transfer-boundary-role-separation.test.mjs`.

Expected: PASS.

**Step 2:** Run `npm run check`.

Expected: existing hints only.

**Step 3:** Run `npm run build`.

Expected: success.

### Task 4: Commit

**Files:** the two guides plus the new regression test

**Step:** `git add tests/transfer-boundary-role-separation.test.mjs src/pages/guides/network-transfer-costs.astro src/pages/guides/egress-costs.astro`

`git commit -m "feat: separate transfer boundary guide roles"`
