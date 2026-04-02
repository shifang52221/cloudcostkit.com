# EBS Role Separation Design

## Goal

Deepen the AWS EBS guide cluster so the pricing, gp3 sizing, snapshot cost, and optimization pages each perform one clear editorial job instead of revisiting the same storage-cost story from slightly different angles.

Target pages:

- `src/pages/guides/aws-ebs-pricing.astro`
- `src/pages/guides/aws-ebs-gp3-iops-throughput.astro`
- `src/pages/guides/aws-ebs-snapshot-cost.astro`
- `src/pages/guides/aws-ebs-cost-optimization.astro`

## Problem

The current EBS cluster is useful, but the role boundaries are still blurry:

- the pricing page already explains storage, provisioned performance, snapshots, and common waste patterns in one place
- the gp3 sizing page repeats parts of the pricing story because performance add-ons are also a billing driver
- the snapshot page already includes cost-control levers, which makes it drift toward optimization guidance
- the optimization page re-explains the main bill structure instead of staying centered on production actions

That overlap creates the same low-quality risk we have been removing elsewhere:

- the cluster can read like one topic expanded into several similar pages
- users have to infer which page should answer a pricing-boundary question versus a measurement question
- search engines can see four pages that cover the same nouns without enough separation of editorial purpose

## Recommended Approach

Separate the cluster by the natural jobs this topic wants.

### 1. Pricing page = bill-boundary page

This page should answer:

- what belongs inside the EBS bill
- what remains a separate line item inside the broader storage budget
- when storage GB-month, provisioned performance, and snapshots should be modeled as different EBS cost surfaces

This page should feel like the "what exactly belongs in the EBS bill?" page.

### 2. gp3 IOPS and throughput page = performance-measurement page

This page should answer:

- how to size gp3 IOPS and throughput from measured workload behavior
- how to distinguish random-IO pressure from throughput pressure
- how to convert utilization data into a defendable performance configuration

This page should feel like the "show me how to measure before I set gp3 performance" page.

### 3. Snapshot cost page = retained backup-storage modeling page

This page should answer:

- how incremental snapshot storage grows from change rate, retention, and copies
- how to turn churn into a steady-state storage estimate
- how to separate snapshot-storage modeling from live-volume pricing

This page should feel like the "how does retained snapshot storage actually accumulate?" page.

### 4. Optimization page = production intervention page

This page should answer:

- what to change after the dominant EBS cost driver is already known
- how to choose between deleting orphaned volumes, resizing storage, lowering performance settings, and tightening snapshot lifecycle
- how to validate savings without causing performance or restore regressions

This page should feel like the "what production changes do we make now?" page.

## Concrete Content Moves

### Pricing page

- add explicit role-setting language that says this is the EBS bill-boundary page
- add a section that separates live volume charges from retained snapshot storage
- route performance-sizing questions to the gp3 page and snapshot-growth questions to the snapshot page
- reduce optimization-oriented guidance that belongs on the intervention page

### gp3 IOPS and throughput page

- add explicit "performance-measurement page" positioning
- clarify that this page is not the full EBS bill-boundary page
- keep the page centered on workload measurement, IO patterns, and configuration choice
- route production savings actions to the optimization page

### Snapshot cost page

- add explicit "retained backup-storage modeling page" positioning
- clarify that snapshot growth is not the same as live-volume GB-month pricing
- strengthen retention, churn, and copy modeling language
- move action-oriented cleanup framing to the optimization page

### Optimization page

- add explicit "production intervention page" positioning
- add a warning not to optimize until the dominant EBS driver is known
- keep the page action-oriented: orphan cleanup, right-sizing, gp2 to gp3 moves, performance rollback, snapshot lifecycle
- add a measure-change-remeasure loop that validates both cost and workload safety

## Success Criteria

- each page states its role in the EBS cluster clearly
- the pricing, gp3 sizing, snapshot cost, and optimization pages no longer feel interchangeable
- internal links become directional instead of repetitive
- a regression test can detect the new role-separation language
- `npm test`, `npm run check`, and `npm run build` remain green
