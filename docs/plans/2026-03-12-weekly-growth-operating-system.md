# Weekly Growth Operating System Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Create a reusable weekly operating system for Search Console-driven growth work so future optimization batches are consistent, small, and easy to execute.

**Architecture:** This pass adds operational docs rather than product code. We will create a lightweight weekly checklist and a reusable weekly review template that fit the site's current markdown-based planning workflow.

**Tech Stack:** Markdown docs in the repo, Search Console export workflow, existing Astro verification commands

---

### Task 1: Document the Weekly Operating-System Design

**Files:**
- Create: `docs/plans/2026-03-12-weekly-growth-operating-system-design.md`
- Create: `docs/plans/2026-03-12-weekly-growth-operating-system.md`

**Step 1: Capture the operating-system scope**

Document the weekly workflow goals:

- export data
- refresh page lists
- choose a batch
- execute and verify
- log the result

Expected: A design document and implementation plan that clearly explain the new weekly system.

**Step 2: Review for scope control**

Confirm the docs prefer a lightweight checklist and template rather than a heavy reporting system.

Expected: The docs stay operational and reuse-friendly.

**Step 3: Commit**

```bash
git add docs/plans/2026-03-12-weekly-growth-operating-system-design.md docs/plans/2026-03-12-weekly-growth-operating-system.md
git commit -m "docs: add weekly growth operating system plan"
```

### Task 2: Create the Weekly Checklist

**Files:**
- Create: `docs/operations/search-console-weekly-checklist.md`

**Step 1: Define the weekly sequence**

Include:

- data export steps
- update list steps
- batch selection rules
- verification steps
- post-ship logging steps

Expected: A short, practical checklist that can be reused every week.

**Step 2: Review for friction**

Confirm the checklist is short enough to use repeatedly and specific enough to prevent ambiguity.

Expected: The checklist reads like an actual weekly operating playbook.

**Step 3: Commit**

```bash
git add docs/operations/search-console-weekly-checklist.md
git commit -m "docs: add weekly search console checklist"
```

### Task 3: Create the Weekly Review Template

**Files:**
- Create: `docs/operations/search-console-weekly-review-template.md`

**Step 1: Define the reusable template sections**

Include:

- date and data window
- site totals
- list refresh
- chosen batch
- shipped changes
- verification
- next-week candidates

Expected: A template that can be copied into a dated weekly note with minimal editing.

**Step 2: Review for completeness**

Confirm a teammate with no context could use the template to run and log a weekly batch.

Expected: The template is self-explanatory and operationally complete.

**Step 3: Commit**

```bash
git add docs/operations/search-console-weekly-review-template.md
git commit -m "docs: add weekly search console review template"
```

### Task 4: Final Review and Commit

**Files:**
- Modify: all files from Tasks 1-3

**Step 1: Review git status**

Run:

- `git status --short`

Expected:

- only the intended docs are staged or committed
- no unrelated changes appear

**Step 2: Review against the goal**

Confirm all of the following are true:

- the weekly operating system is documented
- the checklist is reusable
- the review template is practical
- the process matches the site's Search Console-driven strategy

**Step 3: Final commit**

```bash
git add .
git commit -m "docs: add weekly growth operating assets"
```
