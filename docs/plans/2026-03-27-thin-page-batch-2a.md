# Thin Page Batch 2A Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Consolidate the strongest value from two duplicate-intent guide pages into their better parent destinations, then noindex the weaker duplicate routes so they stop competing as standalone search results.

**Architecture:** Keep the URLs available for internal navigation, but move broad workflow ownership to `request-based-pricing` and the stronger Kubernetes destinations. Mark the weaker duplicate guides as `noindex,follow` and exclude them from XML sitemap so indexing signals stay consistent.

**Tech Stack:** Astro, Markdown docs, TypeScript config

---

### Task 1: Consolidate the request-pricing parent page

**Files:**
- Modify: `src/pages/guides/request-based-pricing.astro`
- Modify: `src/pages/guides/requests-costs.astro`
- Modify: `src/pages/calculators/finops.astro`
- Modify: `src/pages/guides/serverless-costs.astro`

**Step 1: Identify unique value in `requests-costs`**

Keep only the parts that add something distinct to the stronger request-pricing page.

**Step 2: Strengthen `request-based-pricing`**

Make sure it clearly owns:

- request-volume estimation
- retries and amplification
- payload and transfer adjacency
- service-type differences across API, CDN, messaging, and security

**Step 3: Demote the duplicate page**

Apply `robots="noindex,follow"` to `requests-costs.astro`.

**Step 4: Repoint high-signal internal links**

Move the strongest request-pricing CTA links to `request-based-pricing` so the site does not keep promoting the weaker duplicate URL.

### Task 2: Consolidate the Kubernetes duplicate-intent guide

**Files:**
- Modify: `src/pages/guides/kubernetes-cost-calculator.astro`
- Review: `src/pages/guides/kubernetes-costs.astro`
- Review: `src/pages/calculators/kubernetes-cost-calculator.astro`
- Modify: `src/pages/calculators/kubernetes-requests-limits-calculator.astro`
- Modify: `src/pages/calculators/kubernetes-node-cost-calculator.astro`
- Modify: `src/pages/guides/kubernetes-requests-vs-limits-for-sizing.astro`
- Modify: `src/pages/guides/kubernetes-requests-limits.astro`
- Modify: `src/pages/index.astro`

**Step 1: Preserve only unique checklist value**

Keep only value that genuinely helps the broader Kubernetes workflow and is not just duplicating calculator intent.

**Step 2: Demote the duplicate guide**

Apply `robots="noindex,follow"` to `kubernetes-cost-calculator.astro`.

**Step 3: Keep internal workflow clarity**

Ensure the page clearly points users toward:

- the actual calculator
- the broader Kubernetes parent guide

**Step 4: Repoint high-signal internal links**

Update the strongest Kubernetes CTA paths so the site promotes `kubernetes-costs` and the actual calculator instead of the weaker duplicate guide URL.

### Task 3: Keep sitemap and robots signals aligned

**Files:**
- Modify: `astro.config.mjs`

**Step 1: Exclude the two new duplicate-intent routes**

Remove:

- `/guides/requests-costs/`
- `/guides/kubernetes-cost-calculator/`

from XML sitemap generation.

### Task 4: Add a batch-2A verification check

**Files:**
- Create: `scripts/verify-thin-page-batch2a.mjs`

**Step 1: Verify robots**

Check that:

- `requests-costs.astro`
- `kubernetes-cost-calculator.astro`

now emit `robots="noindex,follow"`.

**Step 2: Verify sitemap exclusions**

Check that `astro.config.mjs` excludes both routes.

**Step 3: Verify internal-link corrections**

Check that the most important request-pricing and Kubernetes CTA links now point to the stronger destinations.

### Task 5: Verify the batch

**Files:**
- Review: touched files

**Step 1: Run non-ASCII audit on touched files**

Run:

`rg -n "[^\x00-\x7F]" astro.config.mjs src/pages/guides/request-based-pricing.astro src/pages/guides/requests-costs.astro src/pages/guides/kubernetes-cost-calculator.astro scripts/verify-thin-page-batch2a.mjs docs/plans/2026-03-27-thin-page-batch-2a-design.md docs/plans/2026-03-27-thin-page-batch-2a.md`

Expected: no matches.

**Step 2: Run batch verification**

Run:

`node scripts/verify-thin-page-batch2a.mjs`

Expected: pass.

**Step 3: Run project verification**

Run:

`npm run check`

Expected: pass with no new errors.

Run:

`npm run build`

Expected: successful production build.

### Task 6: Commit the batch

**Files:**
- Add: `docs/plans/2026-03-27-thin-page-batch-2a-design.md`
- Add: `docs/plans/2026-03-27-thin-page-batch-2a.md`
- Add: `scripts/verify-thin-page-batch2a.mjs`
- Modify: implementation files from Tasks 1-3

**Step 1: Commit batch 2A**

```bash
git add docs/plans/2026-03-27-thin-page-batch-2a-design.md docs/plans/2026-03-27-thin-page-batch-2a.md scripts/verify-thin-page-batch2a.mjs astro.config.mjs src/pages/guides/request-based-pricing.astro src/pages/guides/requests-costs.astro src/pages/guides/kubernetes-cost-calculator.astro src/pages/calculators/finops.astro src/pages/guides/serverless-costs.astro src/pages/calculators/kubernetes-cost-calculator.astro src/pages/calculators/kubernetes-requests-limits-calculator.astro src/pages/calculators/kubernetes-node-cost-calculator.astro src/pages/guides/kubernetes-requests-vs-limits-for-sizing.astro src/pages/guides/kubernetes-requests-limits.astro src/pages/index.astro
git commit -m "feat: merge duplicate-intent guide signals"
```
