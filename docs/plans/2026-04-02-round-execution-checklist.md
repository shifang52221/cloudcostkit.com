# Governed Round Execution Checklist

Use this checklist before, during, and after every remediation round. The goal is not to create ceremony. The goal is to keep each round bounded, review-safe, and easy to verify.

## 1. Pre-Edit Gate

Answer these questions before editing anything:

- What layer does this batch belong to: `A`, `B`, `C`, or `D`?
- Why is this batch being worked now instead of the next candidate in the matrix?
- Is the batch limited to one topic group or one tightly related cluster?
- Is the target round size still within `4` to `6` pages?
- Are the target pages stable enough in search intent that we are improving them rather than re-positioning them again?

Do not start the round if the answers are vague.

## 2. Scope Gate

Write the batch purpose in one sentence.

Good examples:

- clarify the role split between an overlapping parent page and support page
- reduce thin-page risk in a small estimator cluster
- strengthen routing from a provider hub into deeper pages

Bad examples:

- improve several unrelated pages
- clean up a few things while we are there
- do another quality pass

If the purpose cannot fit in one sentence, the batch is too broad.

## 3. Edit-Time Review

Check each page for the following while editing:

- `Role clarity`: the page says what job it does and what job it does not do
- `Non-template differentiation`: the page has a reason to exist beyond a nearby sibling
- `Directional internal links`: links route to next-step pages instead of padding the layout
- `Copy hygiene`: no encoding issues, broken phrasing, empty promises, or filler transitions
- `Trust consistency`: language does not conflict with About, Contact, Methodology, or Editorial Policy

If a page still feels interchangeable with a sibling after editing, the round is not done.

## 4. Required Verification Before Commit

Run the narrowest useful verification first, then the full project checks.

### Batch-specific verification

- Run the targeted regression test for the batch if one exists
- If the batch adds a new regression test, confirm the test failed before the implementation and passes after the implementation

### Project-wide verification

Use the project's real commands, not assumed defaults:

- If this branch contains a project-wide `npm test` script, run `npm test`
- If there is no `npm test` script, run the batch-specific test command plus:
  - `npm run check`
  - `npm run build`

Current repository note:

- this repo does **not** currently define a global `npm test` script on `main`
- `npm run check` and `npm run build` are the baseline release gates

### Cleanliness checks

- `git diff --check`
- `rg -n "[^\\x00-\\x7F]" <touched-files>` for content and docs touched in the round

Do not commit if verification was skipped or inferred.

## 5. Commit Structure

Prefer two commits when the round includes new planning docs:

- docs commit
- feature or content commit

Keep commit messages explicit about the batch purpose.

Examples:

- `docs: plan request-boundary remediation batch`
- `feat: separate request boundary guide roles`

## 6. Compare and Merge Flow

Before asking for merge:

- push the branch
- open the compare URL
- verify the diff only contains the intended files
- make sure no setup noise or generated drift is included

If unrelated files appear, stop and clean the branch first.

## 7. Post-Merge Verification

After the user confirms merge:

- `git fetch origin`
- `git log --oneline --decorate -n 12 origin/main`
- `git branch -r --contains <feature-commit>`

Confirm the merged commit is actually on `origin/main`.

Then verify the live site:

- fetch each changed URL from the live domain
- search for the distinctive new phrase added in the round
- confirm the changed wording is in the deployed HTML, not just in the repo

Do not mark the round complete until both repository merge and live deployment are verified.

## 8. Feedback Loop

After live verification:

- update the page-priority matrix if the solved risk drops in urgency
- record what was learned from the round
- decide whether the next batch should stay in the same layer or move to the next layer

This prevents the queue from drifting away from the actual site state.

## 9. Stop Conditions

Pause the round and re-scope if any of these happen:

- the batch grows beyond one topic group
- a target page still does not have a clear role after editing
- verification introduces unrelated failures
- live output does not match merged code
- the work starts changing page intent instead of clarifying it

When a stop condition appears, do not "just finish this batch anyway."
