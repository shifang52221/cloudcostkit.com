# SEO-Safe Growth Governance Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Turn the site's ongoing deep-remediation work into a controlled operating system that protects SEO stability while continuing to improve quality, trust, and AdSense readiness.

**Architecture:** Build three planning assets first: a master page-priority matrix, a round execution checklist, and a four-week roadmap. Then use those assets to choose and execute the next remediation rounds instead of selecting pages informally.

**Tech Stack:** Astro content repo, Markdown planning docs, local shell analysis, Git, Search Console exports, npm verification scripts

---

### Task 1: Build the master page-priority matrix

**Files:**
- Review: `src/pages/guides/`
- Review: `src/pages/calculators/`
- Review: `docs/plans/2026-03-27-thin-page-triage.md`
- Review: `docs/plans/2026-03-27-adsense-root-cause-audit.md`
- Create: `docs/plans/2026-04-02-page-priority-matrix.md`

**Step 1: Assemble the candidate pool**

Review the remaining guides, calculators, and routing pages that are not yet clearly covered by the deep-remediation test suite and recent merged batches.

Group them by:

- review-risk pages
- traffic-opportunity pages
- trust pages
- routing pages

**Step 2: Rank each candidate**

For each page or cluster, record:

- page path
- page type
- main risk
- main upside
- recommended layer
- recommended urgency

**Step 3: Save the matrix**

Create `docs/plans/2026-04-02-page-priority-matrix.md` with:

- `Layer A`
- `Layer B`
- `Layer C`
- `Layer D`

and short notes for why each item belongs there.

**Step 4: Commit the matrix**

```bash
git add docs/plans/2026-04-02-page-priority-matrix.md
git commit -m "docs: add page priority matrix"
```

### Task 2: Define the round execution checklist

**Files:**
- Review: `docs/plans/2026-04-02-seo-safe-growth-governance-design.md`
- Review: `docs/plans/2026-03-12-weekly-growth-operating-system.md`
- Create: `docs/plans/2026-04-02-round-execution-checklist.md`

**Step 1: Write the pre-edit checks**

Document the required questions before any new round starts:

- why this batch now
- what layer it belongs to
- whether the pages have stable intent
- whether the round is bounded to one topic group

**Step 2: Write the edit-time checks**

Document what must be reviewed while editing:

- role clarity
- non-template differentiation
- internal-link direction
- encoding and copy cleanliness
- trust and policy consistency

**Step 3: Write the release checks**

Document the required pre-merge and post-merge checks:

- local targeted tests
- `npm test`
- `npm run check`
- `npm run build`
- compare URL review
- `origin/main` verification after merge
- live-site phrase verification after deployment

**Step 4: Commit the checklist**

```bash
git add docs/plans/2026-04-02-round-execution-checklist.md
git commit -m "docs: add round execution checklist"
```

### Task 3: Create the four-week roadmap

**Files:**
- Review: `docs/plans/2026-04-02-page-priority-matrix.md`
- Review: `docs/plans/2026-04-02-round-execution-checklist.md`
- Review: Search Console exports under the user-provided report folders
- Create: `docs/plans/2026-04-02-four-week-quality-roadmap.md`

**Step 1: Define the weekly sequence**

Week 1 should prioritize the highest-risk remaining guide clusters.

Week 2 should prioritize second-pass re-audits for previously improved pages that still show overlap, weak first-screen framing, or weak routing.

Week 3 should prioritize routing and hub reinforcement.

Week 4 should prioritize re-review preparation and residual trust cleanup.

**Step 2: Assign expected outputs**

For each week, list:

- target layer
- expected number of rounds
- expected page clusters
- expected verification output

**Step 3: Save the roadmap**

Create `docs/plans/2026-04-02-four-week-quality-roadmap.md` with clear weekly goals and batch selection logic.

**Step 4: Commit the roadmap**

```bash
git add docs/plans/2026-04-02-four-week-quality-roadmap.md
git commit -m "docs: add four week quality roadmap"
```

### Task 4: Select the next implementation round from the matrix

**Files:**
- Review: `docs/plans/2026-04-02-page-priority-matrix.md`
- Review: `docs/plans/2026-04-02-four-week-quality-roadmap.md`
- Create: next batch design and plan docs under `docs/plans/`

**Step 1: Choose one bounded cluster**

Pick one cluster only.

Prefer:

- high review risk
- weak standalone differentiation
- strong chance of quality improvement in one pass
- limited dependency on unresolved site-wide decisions

**Step 2: Write the next batch design**

Create a design doc for that cluster explaining:

- why this cluster is next
- what page roles should be
- what low-quality risks are being removed

**Step 3: Write the next batch implementation plan**

Use the established round checklist and define:

- exact files
- tests to add first
- minimal content changes to make
- verification commands

**Step 4: Commit the batch docs**

```bash
git add docs/plans/<next-batch-design>.md docs/plans/<next-batch-plan>.md
git commit -m "docs: plan next governed remediation batch"
```

### Task 5: Execute the next round under governance

**Files:**
- Modify: files named in the next batch plan
- Test: targeted regression test file for that cluster
- Review: `docs/plans/2026-04-02-round-execution-checklist.md`

**Step 1: Write the failing test first**

Create or extend a targeted regression test that proves the batch has introduced clearer role separation, stronger routing, or stronger trust language.

**Step 2: Run the test to verify red**

Run the exact targeted command from the batch plan.

Expected: FAIL for the intended missing behavior.

**Step 3: Implement the minimal content changes**

Apply only the changes required to satisfy the batch goal.

Do not let the round expand into unrelated copy editing.

**Step 4: Run full verification**

Run:

```bash
npm test
npm run check
npm run build
```

Expected:

- tests pass
- no new Astro check errors
- build succeeds

**Step 5: Commit the docs and feature work**

```bash
git add <batch-docs> <tests> <content-files>
git commit -m "feat: execute governed remediation batch"
```

### Task 6: Verify after merge and feed the next cycle

**Files:**
- Review: merged commit on `origin/main`
- Review: live site URLs changed in the round
- Update: `docs/plans/2026-04-02-page-priority-matrix.md`

**Step 1: Verify merge**

Run:

```bash
git fetch origin
git log --oneline --decorate -n 12 origin/main
git branch -r --contains <feature-commit>
```

Expected: the new feature commit is present on `origin/main`.

**Step 2: Verify live deployment**

Fetch the changed pages from the live site and confirm the distinctive new phrasing is present in the deployed HTML.

Expected: all changed pages match the intended live content.

**Step 3: Feed results back into the matrix**

Update `docs/plans/2026-04-02-page-priority-matrix.md` by:

- marking the completed cluster
- downgrading resolved risk
- promoting the next cluster if needed

**Step 4: Commit the matrix refresh**

```bash
git add docs/plans/2026-04-02-page-priority-matrix.md
git commit -m "docs: refresh page priority matrix after governed batch"
```
