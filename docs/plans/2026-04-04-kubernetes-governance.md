# Kubernetes Governance Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Strengthen the Kubernetes guide family so the parent page owns cross-system budgeting while the sizing and beyond-nodes pages own their narrower workflow roles.

**Architecture:** Treat the Kubernetes parent plus two specialist guides as one bounded batch. Add a targeted regression test for role separation, then make minimal but explicit first-screen and routing changes so the parent page stays broad and the specialist pages stay intentionally narrower.

**Tech Stack:** Astro guide pages, Node test runner, Markdown planning docs, verification through `npm run check` and `npm run build`.

---

### Task 1: Write the failing regression test

**Files:**
- Create: `tests/kubernetes-parent-governance.test.mjs`
- Read: `src/pages/guides/kubernetes-costs.astro`
- Read: `src/pages/guides/kubernetes-requests-limits.astro`
- Read: `src/pages/guides/kubernetes-cost-model-beyond-nodes.astro`

**Step 1:** Write a test that loads the three guide files, normalizes whitespace, and asserts:

- `kubernetes-costs` declares itself as the Kubernetes system budgeting parent page
- `kubernetes-requests-limits` declares itself as the Kubernetes node-sizing workflow page
- `kubernetes-cost-model-beyond-nodes` declares itself as the Kubernetes non-node completeness checklist page
- the two specialist pages route broader budgeting questions back to `kubernetes-costs`

**Step 2:** Run `node --test tests/kubernetes-parent-governance.test.mjs`.

Expected: FAIL because the stronger parent-governance statements do not yet exist.

### Task 2: Implement the role split

**Files:**
- Modify: `src/pages/guides/kubernetes-costs.astro`
- Modify: `src/pages/guides/kubernetes-requests-limits.astro`
- Modify: `src/pages/guides/kubernetes-cost-model-beyond-nodes.astro`

**Step 1:** In `kubernetes-costs.astro`, add a first-screen role statement that explicitly frames the page as the Kubernetes system budgeting parent page.

**Step 2:** In `kubernetes-costs.astro`, tighten the routing language so it clearly sends readers into the sizing or beyond-nodes pages only after the broader Kubernetes cost shape is clear.

**Step 3:** In `kubernetes-requests-limits.astro`, add a role statement that frames the page as the Kubernetes node-sizing workflow page and points broader budgeting questions back to `kubernetes-costs`.

**Step 4:** In `kubernetes-cost-model-beyond-nodes.astro`, add a role statement that frames the page as the Kubernetes non-node completeness checklist page and points broader budgeting questions back to `kubernetes-costs`.

**Step 5:** Keep the batch limited to these three guides unless a blocker forces a scope change.

### Task 3: Run verification

**Files:**
- Tests and guides from Tasks 1-2

**Step 1:** Run `node --test tests/kubernetes-parent-governance.test.mjs`.

Expected: PASS.

**Step 2:** Run `npm run check`.

Expected: `0 errors`, `0 warnings`, and only the accepted existing hints.

**Step 3:** Run `npm run build`.

Expected: success.

### Task 4: Commit

**Files:** the three guides plus the new regression test

**Step:** `git add tests/kubernetes-parent-governance.test.mjs src/pages/guides/kubernetes-costs.astro src/pages/guides/kubernetes-requests-limits.astro src/pages/guides/kubernetes-cost-model-beyond-nodes.astro`

`git commit -m "feat: strengthen kubernetes guide roles"`
