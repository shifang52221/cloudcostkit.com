# Live Post-Deploy Verification Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a reusable live verification command that confirms the thin-page triage rollout is actually reflected on
the production site after deployment.

**Architecture:** Keep the existing `verify:live` script focused on broad trust and ad-safety checks. Add a separate
Node script that fetches live robots and sitemap data, verifies removed URLs are absent from the public sitemap,
confirms those demoted pages emit `noindex,follow`, and confirms representative retained pages remain indexable.

**Tech Stack:** Node.js ESM script, npm scripts, Astro repository conventions, lightweight string-based HTML/XML checks

---

### Task 1: Add the new live verification script

**Files:**
- Create: `scripts/verify-live-post-deploy.mjs`

**Step 1: Add shared fetch helpers**

Write small helpers for:

- fetching text with redirects and a stable user-agent
- normalizing base URLs
- extracting XML `<loc>` values
- extracting robots meta content from HTML

**Step 2: Add thin-page removal assertions**

Define the 12 removed URLs and verify they are absent from the live sitemap URL set.

**Step 3: Add demoted-page robots assertions**

Fetch each removed page and verify it returns success and a robots directive containing `noindex,follow`.

**Step 4: Add retained-page assertions**

Fetch representative kept pages and verify they return success and do not emit `noindex`.

**Step 5: Add terminal-friendly output**

Print `OK` and `BAD` lines per check and exit with code `1` if any assertion fails.

### Task 2: Wire the script into package commands

**Files:**
- Modify: `package.json`

**Step 1: Add npm command**

Add:

- `"verify:live:post-deploy": "node scripts/verify-live-post-deploy.mjs"`

Keep the existing `verify:live` command unchanged.

### Task 3: Verify script content and touched files

**Files:**
- Review: `scripts/verify-live-post-deploy.mjs`
- Review: `package.json`
- Review: `docs/plans/2026-03-27-live-post-deploy-verification-design.md`
- Review: `docs/plans/2026-03-27-live-post-deploy-verification.md`

**Step 1: Run non-ASCII audit on touched files**

Run:

`rg -n "[^\x00-\x7F]" package.json scripts/verify-live-post-deploy.mjs docs/plans/2026-03-27-live-post-deploy-verification-design.md docs/plans/2026-03-27-live-post-deploy-verification.md`

Expected: no matches.

**Step 2: Run the new verifier against current live**

Run:

`npm run verify:live:post-deploy`

Expected: fail before deployment if live still reflects the older sitemap and robots state. That failing baseline is
useful evidence and should be captured in the summary.

### Task 4: Run broader project verification

**Files:**
- Review: touched files

**Step 1: Run project checks**

Run:

`npm run check`

Expected: pass with no new errors.

Run:

`npm run build`

Expected: successful production build.

### Task 5: Commit docs first, then implementation

**Files:**
- Add: `docs/plans/2026-03-27-live-post-deploy-verification-design.md`
- Add: `docs/plans/2026-03-27-live-post-deploy-verification.md`
- Add: `scripts/verify-live-post-deploy.mjs`
- Modify: `package.json`

**Step 1: Commit the design and plan docs**

```bash
git add docs/plans/2026-03-27-live-post-deploy-verification-design.md docs/plans/2026-03-27-live-post-deploy-verification.md
git commit -m "docs: add live post-deploy verification plan"
```

**Step 2: Commit implementation**

```bash
git add scripts/verify-live-post-deploy.mjs package.json
git commit -m "feat: add live post-deploy verification"
```
