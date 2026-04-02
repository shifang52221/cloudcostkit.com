# CDN Role Separation Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Separate the generic CDN delivery-cost cluster into a bill-boundary page, provider comparison page, bandwidth-rate page, request-fee page, bandwidth-measurement page, and concept clarifier page.

**Architecture:** Update the six CDN guide pages so each page has one editorial job, then lock those roles in with a focused regression test. Keep the implementation narrow: role-setting language, directional handoffs, and a few support sections that reduce overlap without rebuilding the guides.

**Tech Stack:** Astro content pages, Node test runner, npm scripts, Astro check/build.

---

### Task 1: Add the failing regression test

**Files:**
- Create: `tests/cdn-role-separation.test.mjs`
- Read: `src/pages/guides/cdn-costs.astro`
- Read: `src/pages/guides/cdn-cost-comparison.astro`
- Read: `src/pages/guides/cdn-cost-per-gigabyte.astro`
- Read: `src/pages/guides/cdn-request-pricing.astro`
- Read: `src/pages/guides/estimate-cdn-bandwidth-gb-per-month.astro`
- Read: `src/pages/guides/origin-egress-vs-cdn-bandwidth.astro`

**Step 1: Write the failing test**

Add assertions that require:

- `cdn-costs` to declare itself the CDN bill-boundary page and separate edge bandwidth, request fees, and origin egress
- `cdn-cost-comparison` to declare itself the provider comparison page and route detailed rate math back to the specialized pages
- `cdn-cost-per-gigabyte` to declare itself the bandwidth-rate page and clarify that it does not replace the full bill-boundary page
- `cdn-request-pricing` to declare itself the request-fee page and clarify that it does not replace bandwidth or origin-egress modeling
- `estimate-cdn-bandwidth-gb-per-month` to declare itself the bandwidth-measurement page and route pricing questions back to the dedicated pricing pages
- `origin-egress-vs-cdn-bandwidth` to declare itself the concept clarifier page and route total-model questions back to the bill-boundary page

**Step 2: Run test to verify it fails**

Run: `node --test .\tests\cdn-role-separation.test.mjs`

Expected: FAIL because the required role-separation phrases do not exist yet.

### Task 2: Make `cdn-costs` the bill-boundary page

**Files:**
- Modify: `src/pages/guides/cdn-costs.astro`
- Test: `tests/cdn-role-separation.test.mjs`

**Step 1: Write minimal implementation**

Add:

- an opening paragraph that states this is the CDN bill-boundary page
- a short section that separates edge bandwidth, request fees, and origin egress as distinct cost surfaces
- directional handoffs to comparison, per-GB, request-pricing, bandwidth-measurement, and concept pages

**Step 2: Run targeted test**

Run: `node --test .\tests\cdn-role-separation.test.mjs`

Expected: Still FAIL because the other page roles are not implemented yet.

### Task 3: Make `cdn-cost-comparison` the provider comparison page

**Files:**
- Modify: `src/pages/guides/cdn-cost-comparison.astro`
- Test: `tests/cdn-role-separation.test.mjs`

**Step 1: Write minimal implementation**

Add:

- an opening paragraph that states this is the provider comparison page
- a sentence clarifying that bill boundaries should already be understood before provider comparison
- directional handoffs to per-GB and request-fee pages for detailed cost-surface math

**Step 2: Run targeted test**

Run: `node --test .\tests\cdn-role-separation.test.mjs`

Expected: Still FAIL because the specialized page roles are not implemented yet.

### Task 4: Make `cdn-cost-per-gigabyte` the bandwidth-rate page

**Files:**
- Modify: `src/pages/guides/cdn-cost-per-gigabyte.astro`
- Test: `tests/cdn-role-separation.test.mjs`

**Step 1: Write minimal implementation**

Add:

- an opening paragraph that states this is the bandwidth-rate page
- a sentence clarifying that this page does not replace the full bill-boundary page
- routing to comparison and request-pricing when per-GB is no longer enough

**Step 2: Run targeted test**

Run: `node --test .\tests\cdn-role-separation.test.mjs`

Expected: Still FAIL because the remaining page roles are not implemented yet.

### Task 5: Make `cdn-request-pricing` the request-fee page

**Files:**
- Modify: `src/pages/guides/cdn-request-pricing.astro`
- Test: `tests/cdn-role-separation.test.mjs`

**Step 1: Write minimal implementation**

Add:

- an opening paragraph that states this is the request-fee page
- a sentence clarifying that this page does not replace bandwidth or origin-egress modeling
- routing to monthly-request measurement helpers and full-model pages

**Step 2: Run targeted test**

Run: `node --test .\tests\cdn-role-separation.test.mjs`

Expected: Still FAIL because the measurement and concept page roles are not implemented yet.

### Task 6: Make `estimate-cdn-bandwidth-gb-per-month` the bandwidth-measurement page

**Files:**
- Modify: `src/pages/guides/estimate-cdn-bandwidth-gb-per-month.astro`
- Test: `tests/cdn-role-separation.test.mjs`

**Step 1: Write minimal implementation**

Add:

- an opening paragraph that states this is the bandwidth-measurement page
- a sentence clarifying that this page is for GB evidence, not full pricing
- routing back to the bill-boundary and request-fee pages once traffic measurement is known

**Step 2: Run targeted test**

Run: `node --test .\tests\cdn-role-separation.test.mjs`

Expected: Still FAIL because the concept clarifier role text is not implemented yet.

### Task 7: Make `origin-egress-vs-cdn-bandwidth` the concept clarifier page

**Files:**
- Modify: `src/pages/guides/origin-egress-vs-cdn-bandwidth.astro`
- Test: `tests/cdn-role-separation.test.mjs`

**Step 1: Write minimal implementation**

Add:

- an opening paragraph that states this is the concept clarifier page
- a sentence clarifying that this page is not the full CDN bill page
- routing to the bandwidth-measurement page for GB evidence and to `cdn-costs` for total-model questions

**Step 2: Run targeted test**

Run: `node --test .\tests\cdn-role-separation.test.mjs`

Expected: PASS.

### Task 8: Run full project verification

**Files:**
- Test: `tests/cdn-role-separation.test.mjs`
- Verify: whole project

**Step 1: Run full tests**

Run: `npm test`

Expected: PASS with the new CDN regression test included.

**Step 2: Run Astro check**

Run: `npm run check`

Expected: PASS with the accepted pre-existing hints only.

**Step 3: Run production build**

Run: `npm run build`

Expected: PASS.

### Task 9: Create the two commits

**Files:**
- Add: `docs/plans/2026-04-02-cdn-role-separation-design.md`
- Add: `docs/plans/2026-04-02-cdn-role-separation.md`
- Add: `tests/cdn-role-separation.test.mjs`
- Modify: `src/pages/guides/cdn-costs.astro`
- Modify: `src/pages/guides/cdn-cost-comparison.astro`
- Modify: `src/pages/guides/cdn-cost-per-gigabyte.astro`
- Modify: `src/pages/guides/cdn-request-pricing.astro`
- Modify: `src/pages/guides/estimate-cdn-bandwidth-gb-per-month.astro`
- Modify: `src/pages/guides/origin-egress-vs-cdn-bandwidth.astro`

**Step 1: Commit docs**

Run:

```bash
git add docs/plans/2026-04-02-cdn-role-separation-design.md docs/plans/2026-04-02-cdn-role-separation.md
git commit -m "docs: add cdn role separation plan"
```

**Step 2: Commit feature**

Run:

```bash
git add tests/cdn-role-separation.test.mjs src/pages/guides/cdn-costs.astro src/pages/guides/cdn-cost-comparison.astro src/pages/guides/cdn-cost-per-gigabyte.astro src/pages/guides/cdn-request-pricing.astro src/pages/guides/estimate-cdn-bandwidth-gb-per-month.astro src/pages/guides/origin-egress-vs-cdn-bandwidth.astro
git commit -m "feat: separate cdn guide roles"
```

**Step 3: Push and open compare view**

Run:

```bash
git push origin thin-page-triage
Start-Process "https://github.com/shifang52221/cloudcostkit.com/compare/main...thin-page-triage?expand=1"
```
