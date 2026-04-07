# Transfer Egress Second Pass Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Reduce live overlap between the transfer boundary parent and the AWS egress guide by making the parent page more classification-oriented, the egress page more AWS-diagnostic and decision-oriented, and the first-screen assist less artificially similar.

**Architecture:** Work from the live-site comparison backward into a tightly bounded local change set. Extend the existing regression test first so it proves second-pass differentiation, then add one small `GuideLayout` override mechanism that only these two pages need. Use that override to remove the calculator-first opening assist from the parent page and to make the egress page's opening assist more AWS-specific.

**Tech Stack:** Astro guide pages and layout, Node test runner, Markdown planning docs, verification through `node --test`, `npm run check`, and `npm run build`.

---

### Task 1: Extend the regression test for second-pass differentiation

**Files:**
- Modify: `tests/transfer-boundary-role-separation.test.mjs`
- Read: `src/layouts/GuideLayout.astro`
- Read: `src/pages/guides/network-transfer-costs.astro`
- Read: `src/pages/guides/egress-costs.astro`

**Step 1:** Add assertions that `GuideLayout` supports a page-level override for the top-of-page calculator assist.

**Step 2:** Add assertions that `network-transfer-costs` disables the shared top-of-page calculator assist, clearly tells readers to classify the transfer path before pricing, and routes readers by boundary rather than by a generic calculator-first intro.

**Step 3:** Add assertions that `egress-costs` clearly positions itself as an AWS egress pricing or billing decision page, uses an AWS-specific opening assist, and includes diagnosis language such as billing usage type checks or spike investigation.

**Step 4:** Run:

```bash
node --test tests/transfer-boundary-role-separation.test.mjs
```

Expected: FAIL because the stronger second-pass differentiation does not yet exist.

### Task 2: Add the bounded layout override

**Files:**
- Modify: `src/layouts/GuideLayout.astro`

**Step 1:** Add a small optional prop that lets a guide page disable the default top-of-page calculator assist.

**Step 2:** Add a small optional prop that lets a guide page override the default assist text and tool selection without affecting other guide pages.

**Step 3:** Keep the default experience unchanged for every guide that does not pass the new props.

### Task 3: Refine the transfer boundary parent page

**Files:**
- Modify: `src/pages/guides/network-transfer-costs.astro`

**Step 1:** Disable the shared top-of-page calculator assist for this page.

**Step 2:** Strengthen the parent-page positioning so the reader knows this page is for choosing the right transfer boundary before any rate model is trusted.

**Step 3:** Add a directional section that routes readers by boundary type:

- internet egress
- CDN edge versus origin
- cross-region
- cross-AZ

**Step 4:** Keep the page broad and practical, but avoid making it feel like a second AWS-specific egress explainer.

### Task 4: Refine the AWS egress decision page

**Files:**
- Modify: `src/pages/guides/egress-costs.astro`

**Step 1:** Keep the opening role statement, but sharpen the first-screen message so it feels like an AWS billing decision page rather than another broad transfer explainer.

**Step 2:** Override the shared top-of-page calculator assist so it reinforces AWS billing diagnosis instead of generic estimate-first behavior.

**Step 3:** Reduce repeated taxonomy structure where it overlaps too closely with the parent page.

**Step 4:** Add or strengthen AWS-specific diagnosis sections focused on:

- identifying the actual AWS outbound charge being modeled
- checking billing usage types or pricing-rule categories
- investigating spike patterns before trusting the estimate

**Step 5:** Keep the routing back to `network-transfer-costs` for unclear transfer boundaries.

### Task 5: Verify

**Files:**
- `tests/transfer-boundary-role-separation.test.mjs`
- `src/layouts/GuideLayout.astro`
- `src/pages/guides/network-transfer-costs.astro`
- `src/pages/guides/egress-costs.astro`

**Step 1:** Run:

```bash
node --test tests/transfer-boundary-role-separation.test.mjs
```

Expected: PASS.

**Step 2:** Run:

```bash
npm run check
```

Expected: exit code `0`.

**Step 3:** Run:

```bash
npm run build
```

Expected: exit code `0`.

### Task 6: Commit

**Files:**
- `docs/plans/2026-04-07-transfer-egress-second-pass-design.md`
- `docs/plans/2026-04-07-transfer-egress-second-pass.md`
- `tests/transfer-boundary-role-separation.test.mjs`
- `src/layouts/GuideLayout.astro`
- `src/pages/guides/network-transfer-costs.astro`
- `src/pages/guides/egress-costs.astro`

**Step 1:** Stage only the intended files.

**Step 2:** Commit with:

```bash
git commit -m "feat: deepen transfer and egress guide separation"
```
