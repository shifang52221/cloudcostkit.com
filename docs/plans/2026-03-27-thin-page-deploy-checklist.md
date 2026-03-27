# Thin Page Deploy Checklist Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add an operations document that tells the team exactly how to deploy the `thin-page-triage` release candidate
and verify that the live search-surface cleanup actually took effect.

**Architecture:** Keep the implementation lightweight and documentation-first. Record the known deployment model from the
repo, point operators at the clean release branch instead of the dirty local `main` worktree, and define explicit
post-deploy verification using the two existing live commands.

**Tech Stack:** Markdown docs, existing npm verification commands, Cloudflare Pages deployment conventions

---

### Task 1: Create the operations checklist document

**Files:**
- Create: `docs/operations/thin-page-deploy-checklist.md`

**Step 1: Add pre-deploy guardrails**

Document:

- the release branch name: `thin-page-triage`
- why the dirty local `main` worktree should not be used
- the local commands already expected before release:
  - `npm run check`
  - `npm run build`

**Step 2: Add Cloudflare Pages settings checks**

Document:

- build command: `npm run build`
- output directory: `dist`
- production deployment source must match the intended clean branch
- required environment variables to confirm
- ad review-safe flag posture

**Step 3: Add post-deploy verification**

Document:

- `npm run verify:live`
- `npm run verify:live:post-deploy`

Explain what each command validates and what failure means.

**Step 4: Add the current baseline note**

Document the known live pre-deploy baseline:

- live sitemap count of `285`
- the 12 thin-page URLs still present live before deployment

### Task 2: Link the checklist from general docs if needed

**Files:**
- Review: `README.md`

**Step 1: Decide whether README needs a pointer**

If the README already describes the verification commands clearly enough, keep it unchanged.

If not, add a short pointer to `docs/operations/thin-page-deploy-checklist.md`.

### Task 3: Verify touched docs

**Files:**
- Review: `docs/operations/thin-page-deploy-checklist.md`
- Review: `docs/plans/2026-03-27-thin-page-deploy-checklist-design.md`
- Review: `docs/plans/2026-03-27-thin-page-deploy-checklist.md`
- Review: `README.md` if touched

**Step 1: Run non-ASCII audit**

Run:

`rg -n "[^\x00-\x7F]" docs/operations/thin-page-deploy-checklist.md docs/plans/2026-03-27-thin-page-deploy-checklist-design.md docs/plans/2026-03-27-thin-page-deploy-checklist.md README.md`

Expected: no matches.

**Step 2: Review diff**

Run:

`git diff -- docs/operations/thin-page-deploy-checklist.md docs/plans/2026-03-27-thin-page-deploy-checklist-design.md docs/plans/2026-03-27-thin-page-deploy-checklist.md README.md`

Expected: only documentation changes for the deployment checklist flow.

### Task 4: Commit docs

**Files:**
- Add: `docs/operations/thin-page-deploy-checklist.md`
- Add: `docs/plans/2026-03-27-thin-page-deploy-checklist-design.md`
- Add: `docs/plans/2026-03-27-thin-page-deploy-checklist.md`
- Modify: `README.md` only if needed

**Step 1: Commit the deployment checklist docs**

```bash
git add docs/operations/thin-page-deploy-checklist.md docs/plans/2026-03-27-thin-page-deploy-checklist-design.md docs/plans/2026-03-27-thin-page-deploy-checklist.md README.md
git commit -m "docs: add thin-page deployment checklist"
```
