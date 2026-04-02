# Generic Kubernetes Role Separation Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Separate the generic Kubernetes support cluster into a supporting checklist page, a non-node completeness checklist page, a sizing workflow page, and a concept clarifier page.

**Architecture:** Update the four generic Kubernetes guide pages so each page has one editorial job, then lock those roles in with a focused regression test. Keep the implementation narrow: role-setting language, directional handoffs, and a few support sections that reduce overlap without rebuilding the guides.

**Tech Stack:** Astro content pages, Node test runner, npm scripts, Astro check/build.

---

### Task 1: Add the failing regression test

**Files:**
- Create: `tests/generic-kubernetes-role-separation.test.mjs`
- Read: `src/pages/guides/kubernetes-cost-calculator.astro`
- Read: `src/pages/guides/kubernetes-cost-model-beyond-nodes.astro`
- Read: `src/pages/guides/kubernetes-requests-limits.astro`
- Read: `src/pages/guides/kubernetes-requests-vs-limits-for-sizing.astro`

**Step 1: Write the failing test**

Add assertions that require:

- `kubernetes-cost-calculator` to declare itself the supporting checklist page and route broader questions to the hub or specialized pages
- `kubernetes-cost-model-beyond-nodes` to declare itself the non-node completeness checklist page and assume node sizing is already credible
- `kubernetes-requests-limits` to declare itself the sizing workflow page and route concept-only requests-vs-limits questions to the clarifier page
- `kubernetes-requests-vs-limits-for-sizing` to declare itself the concept clarifier page and route step-by-step sizing back to the workflow page

**Step 2: Run test to verify it fails**

Run: `node --test .\tests\generic-kubernetes-role-separation.test.mjs`

Expected: FAIL because the required role-separation phrases do not exist yet.

### Task 2: Make `kubernetes-cost-calculator` the supporting checklist page

**Files:**
- Modify: `src/pages/guides/kubernetes-cost-calculator.astro`
- Test: `tests/generic-kubernetes-role-separation.test.mjs`

**Step 1: Write minimal implementation**

Add:

- an opening paragraph that states this is the supporting checklist page
- directional handoffs to the Kubernetes hub, non-node checklist, and sizing workflow
- language that keeps the page calculator-adjacent instead of turning it into a second full guide

**Step 2: Run targeted test**

Run: `node --test .\tests\generic-kubernetes-role-separation.test.mjs`

Expected: Still FAIL because the other page roles are not implemented yet.

### Task 3: Make `kubernetes-cost-model-beyond-nodes` the non-node completeness checklist page

**Files:**
- Modify: `src/pages/guides/kubernetes-cost-model-beyond-nodes.astro`
- Test: `tests/generic-kubernetes-role-separation.test.mjs`

**Step 1: Write minimal implementation**

Add:

- an opening paragraph that states this is the non-node completeness checklist page
- a sentence clarifying that node count should already be credible before using this page
- language that routes sizing workflow questions back to the requests-and-limits workflow page

**Step 2: Run targeted test**

Run: `node --test .\tests\generic-kubernetes-role-separation.test.mjs`

Expected: Still FAIL because the sizing and concept roles are not implemented yet.

### Task 4: Make `kubernetes-requests-limits` the sizing workflow page

**Files:**
- Modify: `src/pages/guides/kubernetes-requests-limits.astro`
- Test: `tests/generic-kubernetes-role-separation.test.mjs`

**Step 1: Write minimal implementation**

Add:

- an opening paragraph that states this is the sizing workflow page
- a sentence clarifying that concept-only requests-vs-limits questions belong on the clarifier page
- language that keeps the page centered on sequence and workflow rather than concept repetition

**Step 2: Run targeted test**

Run: `node --test .\tests\generic-kubernetes-role-separation.test.mjs`

Expected: Still FAIL because the concept clarifier role text is not implemented yet.

### Task 5: Make `kubernetes-requests-vs-limits-for-sizing` the concept clarifier page

**Files:**
- Modify: `src/pages/guides/kubernetes-requests-vs-limits-for-sizing.astro`
- Test: `tests/generic-kubernetes-role-separation.test.mjs`

**Step 1: Write minimal implementation**

Add:

- an opening paragraph that states this is the concept clarifier page
- a sentence clarifying that step-by-step node sizing belongs on the workflow page
- language that keeps the page focused on role differences and estimate inflation mistakes

**Step 2: Run targeted test**

Run: `node --test .\tests\generic-kubernetes-role-separation.test.mjs`

Expected: PASS.

### Task 6: Run full project verification

**Files:**
- Test: `tests/generic-kubernetes-role-separation.test.mjs`
- Verify: whole project

**Step 1: Run full tests**

Run: `npm test`

Expected: PASS with the new generic Kubernetes regression test included.

**Step 2: Run Astro check**

Run: `npm run check`

Expected: PASS with the accepted pre-existing hints only.

**Step 3: Run production build**

Run: `npm run build`

Expected: PASS.

### Task 7: Create the two commits

**Files:**
- Add: `docs/plans/2026-04-02-generic-kubernetes-role-separation-design.md`
- Add: `docs/plans/2026-04-02-generic-kubernetes-role-separation.md`
- Add: `tests/generic-kubernetes-role-separation.test.mjs`
- Modify: `src/pages/guides/kubernetes-cost-calculator.astro`
- Modify: `src/pages/guides/kubernetes-cost-model-beyond-nodes.astro`
- Modify: `src/pages/guides/kubernetes-requests-limits.astro`
- Modify: `src/pages/guides/kubernetes-requests-vs-limits-for-sizing.astro`

**Step 1: Commit docs**

Run:

```bash
git add docs/plans/2026-04-02-generic-kubernetes-role-separation-design.md docs/plans/2026-04-02-generic-kubernetes-role-separation.md
git commit -m "docs: add generic kubernetes role separation plan"
```

**Step 2: Commit feature**

Run:

```bash
git add tests/generic-kubernetes-role-separation.test.mjs src/pages/guides/kubernetes-cost-calculator.astro src/pages/guides/kubernetes-cost-model-beyond-nodes.astro src/pages/guides/kubernetes-requests-limits.astro src/pages/guides/kubernetes-requests-vs-limits-for-sizing.astro
git commit -m "feat: separate generic kubernetes guide roles"
```

**Step 3: Push and open compare view**

Run:

```bash
git push origin thin-page-triage
Start-Process "https://github.com/shifang52221/cloudcostkit.com/compare/main...thin-page-triage?expand=1"
```
