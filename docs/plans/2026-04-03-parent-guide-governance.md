# Parent Guide Governance Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Strengthen the compute, storage, database, and messaging parent guides so each one owns a distinct budgeting role instead of reading like a generic category page.

**Architecture:** Treat the four guides as one bounded governance batch. Add a targeted regression test for parent-role separation, then make minimal first-screen and routing changes that sharpen each page's editorial boundary without expanding into calculators.

**Tech Stack:** Astro guide pages, Node test runner, Markdown planning docs, verification through `npm run check` and `npm run build`.

---

### Task 1: Write the failing regression test

**Files:**
- Create: `tests/parent-guide-role-separation.test.mjs`
- Read: `src/pages/guides/compute-costs.astro`
- Read: `src/pages/guides/storage-costs.astro`
- Read: `src/pages/guides/database-costs.astro`
- Read: `src/pages/guides/messaging-costs.astro`

**Step 1:** Write a test that loads the four guide files, normalizes whitespace, and asserts:

- `compute-costs` identifies itself as the runtime budgeting parent page
- `storage-costs` identifies itself as the capacity and lifecycle parent page
- `database-costs` identifies itself as the stateful service budgeting parent page
- `messaging-costs` identifies itself as the event and delivery budgeting parent page

**Step 2:** Run `node --test tests/parent-guide-role-separation.test.mjs`.

Expected: FAIL because those explicit role statements do not yet exist.

### Task 2: Implement the parent-guide role split

**Files:**
- Modify: `src/pages/guides/compute-costs.astro`
- Modify: `src/pages/guides/storage-costs.astro`
- Modify: `src/pages/guides/database-costs.astro`
- Modify: `src/pages/guides/messaging-costs.astro`

**Step 1:** In `compute-costs.astro`, add a hero paragraph that explicitly frames the page as the runtime budgeting parent and clarifies when teams should start here before choosing deeper compute paths.

**Step 2:** In `storage-costs.astro`, add a hero paragraph that explicitly frames the page as the capacity and lifecycle budgeting parent, then reinforce the role of copies, retrieval, and lifecycle transitions.

**Step 3:** In `database-costs.astro`, add a hero paragraph that explicitly frames the page as the stateful service budgeting parent and clarifies why it is not just a lighter storage page.

**Step 4:** In `messaging-costs.astro`, add a hero paragraph that explicitly frames the page as the event and delivery budgeting parent and reinforces retries, fan-out, and payload amplification.

**Step 5:** Add or refine one short routing section per page so readers understand when to stay in the parent page and when to continue to adjacent tools or sub-guides.

**Step 6:** Keep the batch limited to these four guides unless a blocker forces a scope adjustment.

### Task 3: Run verification

**Files:**
- Tests and guides from Tasks 1-2

**Step 1:** Run `node --test tests/parent-guide-role-separation.test.mjs`.

Expected: PASS.

**Step 2:** Run `npm run check`.

Expected: existing hints only.

**Step 3:** Run `npm run build`.

Expected: success.

### Task 4: Commit

**Files:** the four guides plus the new regression test

**Step:** `git add tests/parent-guide-role-separation.test.mjs src/pages/guides/compute-costs.astro src/pages/guides/storage-costs.astro src/pages/guides/database-costs.astro src/pages/guides/messaging-costs.astro`

`git commit -m "feat: strengthen parent guide roles"`
