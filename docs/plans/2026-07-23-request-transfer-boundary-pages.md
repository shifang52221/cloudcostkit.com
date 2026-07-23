# Request Transfer Boundary Pages Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Separate four broad request and transfer pages so they no longer read like overlapping generic explainers.

**Architecture:** Add a focused regression test for page roles first, then update Astro guide copy only. Keep the noindex routing hub policy intact and preserve generated guide metadata behavior. The edits should be concise: page role, not-page role, and handoff to the next best destination.

**Tech Stack:** Astro, Node `node:test`, existing guide layout and guide metadata utilities.

---

### Task 1: Write the failing role-separation test

**Files:**
- Create: `tests/request-transfer-boundary-pages.test.mjs`

**Step 1: Write the failing test**

```javascript
test("request hub remains a noindex routing hub", () => {
  assert.match(requestHub, /This page is the noindex request routing hub/i);
});
```

**Step 2: Run test to verify it fails**

Run: `node --test tests/request-transfer-boundary-pages.test.mjs`
Expected: FAIL because the exact new role phrases are not yet present.

### Task 2: Tighten the request routing hub

**Files:**
- Modify: `src/pages/guides/requests-costs.astro`

**Step 1: Preserve failing assertions**

Assert it remains `robots="noindex,follow"` and says it is the noindex request routing hub.

**Step 2: Implement minimal copy changes**

Add a direct first-screen role sentence and clarify that it routes to the pricing explainer or calculators after the boundary is defined.

**Step 3: Run focused test**

Run: `node --test tests/request-transfer-boundary-pages.test.mjs`
Expected: request hub assertions pass.

### Task 3: Tighten the request pricing explainer

**Files:**
- Modify: `src/pages/guides/request-based-pricing.astro`

**Step 1: Preserve failing assertions**

Assert it is the generic request billing-math explainer and does not own request discovery, service-specific measurement, or parent workload modeling.

**Step 2: Implement minimal copy changes**

Clarify the first-screen role and remove repeated role paragraphs that make the page read assembled.

**Step 3: Run focused test**

Run: `node --test tests/request-transfer-boundary-pages.test.mjs`
Expected: request pricing assertions pass.

### Task 4: Tighten the network transfer boundary parent

**Files:**
- Modify: `src/pages/guides/network-transfer-costs.astro`

**Step 1: Preserve failing assertions**

Assert it is the transfer path boundary parent and does not own AWS-specific egress billing diagnosis.

**Step 2: Implement minimal copy changes**

Add handoff language to the egress guide and reinforce path classification before rate modeling.

**Step 3: Run focused test**

Run: `node --test tests/request-transfer-boundary-pages.test.mjs`
Expected: network transfer assertions pass.

### Task 5: Tighten the AWS egress diagnosis guide

**Files:**
- Modify: `src/pages/guides/egress-costs.astro`

**Step 1: Preserve failing assertions**

Assert it is the AWS egress diagnosis and billing workflow and does not replace the transfer boundary parent.

**Step 2: Implement minimal copy changes**

Add a concise role sentence and preserve the handoff back to `network-transfer-costs` when the path is not known.

**Step 3: Run focused test**

Run: `node --test tests/request-transfer-boundary-pages.test.mjs`
Expected: all focused assertions pass.

### Task 6: Verify and ship

**Files:**
- Validate all touched pages, docs, and tests.

**Step 1: Run focused and related tests**

Run: `node --test tests/request-transfer-boundary-pages.test.mjs tests/request-axis-role-separation.test.mjs tests/request-boundary-role-separation.test.mjs tests/transfer-boundary-role-separation.test.mjs tests/egress-cluster-refresh.test.mjs tests/egress-rescue-batch.test.mjs`

**Step 2: Run full verification**

Run: `npm test`
Run: `npm run check`
Run: `npm run build`

**Step 3: Commit and push**

```bash
git add docs/plans/2026-07-23-request-transfer-boundary-pages-design.md docs/plans/2026-07-23-request-transfer-boundary-pages.md tests/request-transfer-boundary-pages.test.mjs src/pages/guides/requests-costs.astro src/pages/guides/request-based-pricing.astro src/pages/guides/network-transfer-costs.astro src/pages/guides/egress-costs.astro
git commit -m "feat: separate request and transfer boundary pages"
git push
```
