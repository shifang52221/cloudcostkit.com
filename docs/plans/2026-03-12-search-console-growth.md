# Search Console Growth Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Strengthen CloudCostKit by restoring engineering health, improving high-opportunity pages, and adding a repeatable Search Console-driven growth workflow.

**Architecture:** We will work in three layers. First, restore a reliable engineering baseline so checks and builds are trustworthy. Next, improve the small set of pages with the clearest ranking and click opportunities. Finally, strengthen site-level conversion paths and save a repeatable operating document for future Search Console review.

**Tech Stack:** Astro 5, React 18, TypeScript, Cloudflare adapter, static content in `.astro` pages, calculator components in `.tsx`

---

### Task 1: Restore Green Checks

**Files:**
- Modify: `src/components/calculators/AwsDynamoDbCost.tsx`
- Modify: `src/pages/calculators/aws-api-gateway-request-estimator.astro`
- Modify: `src/pages/calculators/aws-kms-request-estimator.astro`
- Modify: `src/pages/calculators/aws-sns-delivery-estimator.astro`
- Modify: `src/pages/calculators/aws-sqs-request-estimator.astro`
- Modify: `src/pages/calculators/aws-waf-request-estimator.astro`
- Modify: `src/pages/calculators/cdn-origin-egress-calculator.astro`

**Step 1: Reproduce the failing baseline**

Run: `npm run check`

Expected: FAIL with the currently known Astro/TypeScript errors, including the missing `totalRequestsPerMonth` reference and import/local declaration conflicts.

**Step 2: Write the minimal fixes**

- In `AwsDynamoDbCost.tsx`, compute the total request count from existing request inputs instead of reading a missing property from the result object.
- In the affected calculator page files, rename imported component identifiers or local symbols so Astro no longer sees declaration conflicts.

**Step 3: Verify the fix**

Run: `npm run check`

Expected: PASS with zero errors.

**Step 4: Commit**

```bash
git add src/components/calculators/AwsDynamoDbCost.tsx src/pages/calculators/aws-api-gateway-request-estimator.astro src/pages/calculators/aws-kms-request-estimator.astro src/pages/calculators/aws-sns-delivery-estimator.astro src/pages/calculators/aws-sqs-request-estimator.astro src/pages/calculators/aws-waf-request-estimator.astro src/pages/calculators/cdn-origin-egress-calculator.astro
git commit -m "fix: restore green astro checks"
```

### Task 2: Strengthen Near-Winner Guide Pages

**Files:**
- Modify: `src/pages/guides/gcp-cloud-run-pricing.astro`
- Modify: `src/pages/guides/azure-container-registry-pricing.astro`
- Modify: `src/pages/guides/azure-event-hubs-pricing.astro`

**Step 1: Capture the current opportunity target**

Use the Search Console export and note the priority signals:

- `gcp-cloud-run-pricing` is already around average position 12.84.
- `azure-container-registry-pricing` is already around average position 24.11.
- `azure-event-hubs-pricing` is already getting clicks.

Expected: A short checklist of exact query patterns to cover in each page before editing.

**Step 2: Apply the minimal content upgrades**

For each page:

- align the first 2-3 paragraphs with the observed query wording
- add clearer pricing-driver breakdowns
- add one comparison or "when this gets expensive" section
- add one stronger next-step CTA block to related calculators/guides
- expand FAQ coverage around the queries already appearing in Search Console

**Step 3: Verify content integrity**

Run: `npm run check`

Expected: PASS.

**Step 4: Commit**

```bash
git add src/pages/guides/gcp-cloud-run-pricing.astro src/pages/guides/azure-container-registry-pricing.astro src/pages/guides/azure-event-hubs-pricing.astro
git commit -m "feat: strengthen high-opportunity pricing guides"
```

### Task 3: Strengthen Near-Winner Calculator Pages

**Files:**
- Modify: `src/pages/calculators/data-egress-cost-calculator.astro`
- Modify: `src/pages/calculators/storage-replication-cost-calculator.astro`
- Modify: `src/pages/calculators/cdn-cost-calculator.astro`
- Modify: `src/pages/calculators/ec2-cost-calculator.astro`

**Step 1: Reproduce the opportunity baseline**

Use the Search Console export and confirm:

- `data-egress-cost-calculator` already gets clicks and sits near page 3.
- `storage-replication-cost-calculator` already gets clicks and sits near page 2.
- `cdn-cost-calculator` and `ec2-cost-calculator` have high impressions but weak CTR.

Expected: A short page-by-page note of what needs to improve: ranking support, CTR support, or both.

**Step 2: Apply the minimal page upgrades**

For each page:

- tighten title/intro wording to better match live query phrasing
- improve the hero copy so users immediately understand what the calculator answers
- add stronger examples and common-mistake guidance
- improve the "next step" section so users do not dead-end on a single page

**Step 3: Verify integrity**

Run: `npm run check`

Expected: PASS.

**Step 4: Commit**

```bash
git add src/pages/calculators/data-egress-cost-calculator.astro src/pages/calculators/storage-replication-cost-calculator.astro src/pages/calculators/cdn-cost-calculator.astro src/pages/calculators/ec2-cost-calculator.astro
git commit -m "feat: improve high-opportunity calculator pages"
```

### Task 4: Strengthen Global Growth Skeleton and Mobile UX

**Files:**
- Modify: `src/pages/index.astro`
- Modify: `src/pages/calculators/index.astro`
- Modify: `src/pages/guides/index.astro`
- Modify: `src/styles/global.css`
- Modify: `src/layouts/CalculatorLayout.astro`
- Modify: `src/layouts/GuideLayout.astro`

**Step 1: Define the target behavior**

Write down the specific mobile and conversion issues to solve:

- weaker mobile performance than desktop
- homepage and hubs need clearer next-step actions
- key templates should surface intent and actions earlier on small screens

Expected: A short implementation checklist before editing.

**Step 2: Apply the minimal template and CSS updates**

- strengthen CTA hierarchy on homepage and hub pages
- reduce mobile-first friction in hero and filter sections
- improve visibility of scenario-saving or follow-up actions on calculator pages
- ensure guide pages surface related calculators and next actions earlier when useful

**Step 3: Verify integrity**

Run:

- `npm run check`
- `npm run build`

Expected: Both commands PASS.

**Step 4: Commit**

```bash
git add src/pages/index.astro src/pages/calculators/index.astro src/pages/guides/index.astro src/styles/global.css src/layouts/CalculatorLayout.astro src/layouts/GuideLayout.astro
git commit -m "feat: improve site-level growth paths and mobile UX"
```

### Task 5: Create the Repeatable Search Console Workflow

**Files:**
- Create: `docs/plans/2026-03-12-search-console-operating-notes.md`

**Step 1: Write the first operating snapshot**

Document:

- current site totals from Search Console
- click-earning pages
- top-20 opportunity pages
- high-impression low-CTR pages
- next review cadence

**Step 2: Verify clarity**

Read the document end to end and confirm that a teammate with zero context could use it to choose the next weekly optimization batch.

Expected: The note is usable without outside explanation.

**Step 3: Commit**

```bash
git add docs/plans/2026-03-12-search-console-operating-notes.md
git commit -m "docs: add search console operating notes"
```

### Task 6: Final Verification

**Files:**
- Modify: all files from Tasks 1-5

**Step 1: Run the full verification suite**

Run:

- `npm run check`
- `npm run build`
- `git status --short`

Expected:

- `npm run check` passes
- `npm run build` passes
- `git status --short` shows only the intended tracked changes before final commit, or a clean tree after commits

**Step 2: Review against the goal**

Confirm all of the following are true:

- engineering errors are fixed
- the selected opportunity pages are stronger
- homepage/hubs/templates have clearer growth paths
- the Search Console operating note exists

**Step 3: Final commit**

```bash
git add .
git commit -m "feat: execute search console growth improvements"
```
