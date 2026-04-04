# Compute Governance Design

## Problem

The compute guide family already has useful content, but the hierarchy is still softer than the stronger governance
batches we finished for networking, storage, messaging, and databases.

Current shape:

- `src/pages/guides/compute-costs.astro` already behaves like a runtime budgeting parent, but it still needs a sharper
  role boundary around when readers should stay on the parent versus when they should move into a narrower compute
  path
- `src/pages/guides/aws-ec2-cost-estimation.astro` is helpful for EC2 calculator intent, but it still reads more like a
  generic estimator than a clearly governed VM and instance-fleet estimation page inside the broader compute hierarchy
- `src/pages/guides/serverless-costs.astro` already has a strong cross-provider parent role, but it should be anchored
  more explicitly as a compute sub-path rather than a stand-alone top-level budgeting model
- `src/pages/guides/kubernetes-costs.astro` already has a strong Kubernetes parent role, but it should also route more
  clearly as one specialized path inside the broader compute system map

This creates two quality risks:

- the compute parent can still overlap with the EC2, serverless, and Kubernetes paths instead of acting as the
  deliberate entry point for runtime-model selection
- Google can still read parts of this cluster as nearby variations on "compute cost" instead of a governed parent plus
  distinct specialist jobs

## Approved Direction

Use a parent-plus-subpath split:

- `compute-costs` becomes the runtime-model governance parent for the whole compute family
- `aws-ec2-cost-estimation` becomes the VM and instance-fleet estimation page
- `serverless-costs` stays the cross-provider serverless architecture budgeting parent, but explicitly inside the
  broader compute model
- `kubernetes-costs` stays the Kubernetes system budgeting parent, but explicitly inside the broader compute model

The parent should own the broad runtime budgeting question:

- how to separate baseline capacity, peak headroom, idle waste, and adjacent spend before picking a runtime path
- when the next question is VM estimation, serverless architecture budgeting, or Kubernetes system budgeting
- why the first compute decision is workload and billing shape, not provider or product name

The specialist pages should each own one narrower question:

- `aws-ec2-cost-estimation`: how to estimate a known EC2 or VM fleet without pretending the whole compute hierarchy is
  an EC2 calculator
- `serverless-costs`: how to budget cross-provider serverless architectures after the broader compute frame is clear
- `kubernetes-costs`: how to budget Kubernetes systems after the broader compute frame is clear

## Role Split

### `compute-costs`

This page should explicitly identify itself as the compute runtime budgeting parent page.

Its job is to:

- frame compute as a choice among runtime models before provider-specific cost math starts
- route readers into VM estimation, serverless architecture budgeting, or Kubernetes system budgeting only after the
  workload shape is clear
- stay broader than any one product, provider, or operating model

### `aws-ec2-cost-estimation`

This page should explicitly identify itself as the VM and instance-fleet estimation page inside the broader compute
hierarchy.

Its job is to:

- focus on estimating a known EC2-style fleet using instance-hours, blended rates, and adjacent AWS line items
- stay narrower than the compute parent and avoid reteaching the entire runtime selection problem
- route broader runtime-model questions back to `compute-costs`

### `serverless-costs`

This page should keep its role as the cross-provider serverless architecture budgeting parent page inside the broader
compute hierarchy.

Its job is to:

- own the serverless architecture layer after the reader already knows that serverless is the relevant compute path
- stay narrower than the compute parent while remaining broader than provider-specific serverless pricing pages
- route broader runtime-model questions back to `compute-costs`

### `kubernetes-costs`

This page should keep its role as the Kubernetes system budgeting parent page inside the broader compute hierarchy.

Its job is to:

- own the Kubernetes system layer after the reader already knows that Kubernetes is the relevant compute path
- stay narrower than the compute parent while remaining broader than Kubernetes sizing or comparison pages
- route broader runtime-model questions back to `compute-costs`

## Content Strategy

This round should apply the same governance pattern across all four pages:

1. strengthen the first-screen role statement so the hierarchy is visible immediately
2. clarify when readers should stay on the compute parent and when they should move into one narrower path
3. make the EC2 page visibly narrower and more specific so it does not compete with the compute parent
4. reinforce that serverless and Kubernetes are subpaths under compute, not isolated top-level budgeting systems

The goal is not more text. The goal is cleaner hierarchy, less topic cannibalization, and stronger editorial
originality.

## Regression Guard

Add a targeted regression test that verifies:

- `compute-costs` declares itself as the compute runtime budgeting parent page
- `compute-costs` routes readers into VM estimation, serverless architecture, and Kubernetes system budgeting only after
  the workload shape is clear
- `aws-ec2-cost-estimation` declares itself as the VM and instance-fleet estimation page
- `aws-ec2-cost-estimation` routes broader runtime-model questions back to `compute-costs`
- `serverless-costs` still declares itself as the cross-provider serverless architecture budgeting parent page inside
  the broader compute hierarchy
- `serverless-costs` routes broader runtime-model questions back to `compute-costs`
- `kubernetes-costs` still declares itself as the Kubernetes system budgeting parent page inside the broader compute
  hierarchy
- `kubernetes-costs` routes broader runtime-model questions back to `compute-costs`

The test should protect role separation rather than exact paragraph wording.

## Scope

Keep this round limited to:

- `src/pages/guides/compute-costs.astro`
- `src/pages/guides/aws-ec2-cost-estimation.astro`
- `src/pages/guides/serverless-costs.astro`
- `src/pages/guides/kubernetes-costs.astro`
- `tests/compute-parent-governance.test.mjs`

Do not expand this batch into Fargate comparison pages, Lambda pricing pages, or Kubernetes sizing/comparison pages
unless a direct blocker appears.

## Success Standard

This round is successful when:

- `compute-costs` clearly owns the compute runtime-governance parent role
- `aws-ec2-cost-estimation` clearly owns a narrower VM and instance-fleet estimation role
- `serverless-costs` and `kubernetes-costs` clearly sit underneath the compute parent rather than floating beside it
- the regression test passes
- `npm run check` and `npm run build` still pass with only the accepted existing hints
