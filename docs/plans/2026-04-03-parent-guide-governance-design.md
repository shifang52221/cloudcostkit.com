# Parent Guide Governance Design

## Problem

The parent-guide layer is stronger than the thin helper layer, but several broad topic guides can still read like multiplied category pages instead of editorial anchors.

The current risk is not that these pages are empty. The risk is that they remain broad in a similar way:

- `compute-costs` explains runtime budgeting
- `storage-costs` explains stored capacity plus activity
- `database-costs` explains managed database budgeting
- `messaging-costs` explains request and delivery budgeting

Each page is useful, but the four together still need clearer role separation so they feel like intentional entry pages for different system cost surfaces rather than a batch of generic overviews.

## Approved Direction

Treat these four pages as a single "site skeleton" batch.

The goal is not to make them all longer just for appearance. The goal is to make each page own a different budgeting question:

- compute = runtime capacity and utilization
- storage = capacity, copies, and lifecycle behavior
- database = stateful service baseline, growth, retention, and replication
- messaging = event volume, deliveries, retries, fan-out, and payload amplification

That role split should be visible from the first screen and reinforced by routing language deeper in each page.

## Page Roles

### `compute-costs`

This page should be the runtime budgeting parent guide.

It owns:

- compute time, instance-hours, vCPU and memory time
- baseline versus peak headroom
- utilization and idle waste
- adjacent costs that often sit next to compute

It should not drift into a generic "all infrastructure cost" page.

### `storage-costs`

This page should be the capacity and data-retention parent guide.

It owns:

- GB-month and storage growth
- request activity on stored data
- copies such as replication and backup
- retrieval and lifecycle transitions
- transfer that occurs when data leaves the storage boundary

It should not read like a lighter database page.

### `database-costs`

This page should be the stateful service budgeting parent guide.

It owns:

- database compute baseline
- storage growth for stateful systems
- backups, snapshots, and retention
- replication and private connectivity patterns
- database-specific validation rules

It should feel distinct from the more general storage page by centering operational statefulness and managed database behavior.

### `messaging-costs`

This page should be the event and delivery budgeting parent guide.

It owns:

- publish versus delivery units
- retries, redrives, and replay behavior
- fan-out multiplication
- payload size as a hidden multiplier
- downstream amplification into transfer and logging

It should not collapse into generic request-pricing language.

## Content Strategy

Each page should gain the same structural improvement pattern:

1. a stronger hero paragraph that declares the page's role
2. a short "start here" or routing section that says when to use the parent page first
3. one reinforced section about the most common budgeting mistake for that topic
4. slightly stronger links to adjacent guides and tools, but only where they support the page's role

The copy should stay practical and plainspoken. The goal is not "marketing polish." The goal is to make the editorial boundary unmistakable.

## Regression Guard

Add one targeted regression test that loads the four guide files and verifies:

- `compute-costs` declares itself as the runtime budgeting parent
- `storage-costs` declares itself as the capacity and lifecycle parent
- `database-costs` declares itself as the stateful service budgeting parent
- `messaging-costs` declares itself as the event and delivery budgeting parent

The test should focus on role separation and routing language, not exact brittle sentences.

## Scope

Keep this round limited to the four guide pages plus the regression test.

Do not expand into calculators in this batch unless a blocker appears that cannot be solved inside the guides.

This keeps the round small enough for one-merge discipline while still improving a meaningful part of the site's quality posture.

## Success Standard

This round is successful when:

- the four parent guides feel editorially distinct on first read
- each page clearly owns a different budgeting question
- a regression test protects that role split
- `npm run check` and `npm run build` continue to pass with the accepted existing hints only
