# Request Boundary Overlap Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Split the request-boundary cluster properly so the parent guide owns the full billing story, the support guide owns pricing nuance, and the calculators feed cleanly into that split.

**Architecture:** Treat the four files as one bounded batch. Write a targeted regression test that asserts each guide clearly states its role and each calculator routes back to the parent boundary. Run TDD for that test, then make minimal copy changes and rerun the project checks before committing.

**Tech Stack:** Astro guides/calculators, Markdown planning, Node test harness, project verification via `npm run check` and `npm run build`.

---

### Task 1: Write the failing regression test

**Files:**
- Create: `tests/request-boundary-role-separation.test.mjs`
- Read: `src/pages/guides/requests-costs.astro`
- Read: `src/pages/guides/request-based-pricing.astro`
- Read: `src/pages/calculators/api-request-cost-calculator.astro`
- Read: `src/pages/calculators/rps-to-monthly-requests-calculator.astro`

**Step 1:** Write a test that loads the four pages, normalizes whitespace, and asserts:

- `requests-costs` mentions “this is the request boundary page” and routes to calculators when the decision is how many requests to model.
- `request-based-pricing` mentions “this is the billing page for request fees” and instructs readers to come back if they still need to understand request counts.
- `api-request-cost-calculator` highlights that it maps API calls into request volume and routes to both the request boundary guide and the request-fee pricing guide.
- `rps-to-monthly-requests-calculator` mentions it produces monthly request counts and must feed into the API request calculator before request-fee pricing.

**Step 2:** Run `node --test tests/request-boundary-role-separation.test.mjs`.

Expected: FAIL because the statements do not yet exist.

### Task 2: Implement the minimal copy changes

**Files:**
- `src/pages/guides/requests-costs.astro`
- `src/pages/guides/request-based-pricing.astro`
- `src/pages/calculators/api-request-cost-calculator.astro`
- `src/pages/calculators/rps-to-monthly-requests-calculator.astro`

**Step 1:** In `requests-costs.astro`, add a hero paragraph stating “This is the request boundary page” plus a short list describing what kinds of request volume belong in the model and link to the calculators for precise counts.
**Step 2:** In `request-based-pricing.astro`, add a hero paragraph calling out “request-fee pricing page,” describe per-10k/1M buckets, and point back to `requests-costs` when the count itself is still unclear.
**Step 3:** In `api-request-cost-calculator.astro`, emphasize that this tool turns API traffic assumptions into request volumes and finish with CTAs guiding readers first to the request boundary guide, then to `request-based-pricing`.
**Step 4:** In `rps-to-monthly-requests-calculator.astro`, clarify it calculates monthly request counts from RPS-style inputs and explicitly direct users to the API request calculator before request-fee pricing.
**Step 5:** Keep all other structure, metadata, and links intact.

### Task 3: Run verification

**Files:**
- Tests and docs from Tasks 1-2

**Step 1:** Run `node --test tests/request-boundary-role-separation.test.mjs`.

Expected: PASS.

**Step 2:** Run `npm run check`.

Expected: existing hints only.

**Step 3:** Run `npm run build`.

Expected: success.

### Task 4: Commit

**Files:** the four pages plus the new test

**Step:** `git add tests/request-boundary-role-separation.test.mjs src/pages/guides/requests-costs.astro src/pages/guides/request-based-pricing.astro src/pages/calculators/api-request-cost-calculator.astro src/pages/calculators/rps-to-monthly-requests-calculator.astro`

`git commit -m "feat: separate request boundary cluster roles"`
