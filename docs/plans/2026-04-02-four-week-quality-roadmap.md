# Four-Week Quality Roadmap

This roadmap turns the priority matrix into a weekly operating sequence.

It uses three evidence sources:

- the March 27 AdSense root-cause audit
- the governed page-priority matrix
- the March 12 and March 23 Search Console planning notes already saved in the repo

Important note:

- the original `cloudcostkit.com` Search Console CSV exports were not present in the current filesystem during roadmap creation
- this roadmap therefore uses the already-documented Search Console findings captured in the existing March planning docs rather than re-reading the raw export files directly

That limitation is acceptable for weekly sequencing because the main decisions are cluster-level, not single-query micro-adjustments.

## Week 1: Remove the strongest remaining overlap risk

- Target layer: `Layer A`
- Expected number of rounds: `2`
- Expected page clusters:
  - request-boundary overlap cluster
    - `src/pages/guides/requests-costs.astro`
    - `src/pages/guides/request-based-pricing.astro`
    - supporting request helpers only if needed for routing clarity
  - transfer-boundary overlap cluster
    - `src/pages/guides/network-transfer-costs.astro`
    - `src/pages/guides/egress-costs.astro`
    - only the most relevant adjacent calculator pages if the role split depends on them
- Why this week first:
  - these pages sit closest to the remaining "broad, overlapping, low-quality impression" problem
  - they influence how the site explains two major commercial topics: requests and transfer
  - they are small enough to preserve one-round, one-merge discipline
- Expected verification output:
  - one targeted regression test per round if role separation is being introduced
  - `npm run check`
  - `npm run build`
  - live phrase verification on the changed pages after merge

## Week 2: Re-audit pages that were improved once but still need a stronger second pass

- Target layer: `Layer B`
- Expected number of rounds: `2`
- Expected page clusters:
  - storage and replication re-audit cluster
    - `src/pages/guides/storage-costs.astro`
    - `src/pages/guides/s3-pricing-explained.astro`
    - `src/pages/guides/s3-replication-cost.astro`
    - `src/pages/calculators/storage-replication-cost-calculator.astro`
  - compute and runtime re-audit cluster
    - `src/pages/guides/aws-ec2-cost-estimation.astro`
    - `src/pages/calculators/ec2-cost-calculator.astro`
    - `src/pages/calculators/aws-ecs-task-sizing-calculator.astro`
    - one adjacent runtime guide such as `src/pages/guides/aws-fargate-pricing.astro`
- Why this week second:
  - the plan for Week 2 is not another first-pass cleanup; it is a second-pass re-audit of pages that already received attention but may still have overlap, weak first-screen framing, or weak routing
  - these clusters sit close to commercial intent and can improve materially once the most obvious overlap risks are reduced in Week 1
  - this is the point where "good enough" pages become clearly stronger pages instead of just surviving review
- Expected verification output:
  - one short written checklist per round stating what remained weak after the first pass and what the second pass corrected
  - `git diff --check`
  - `npm run check`
  - `npm run build`
  - live phrase verification on the pages whose first-screen promise was changed

## Week 3: Strengthen routing and discovery once the weak edges are cleaner

- Target layer: `Layer D`
- Expected number of rounds: `2`
- Expected page clusters:
  - site entry layer
    - `src/pages/index.astro`
    - `src/pages/guides/index.astro`
    - `src/pages/calculators/index.astro`
  - provider and calculator routing layer
    - `src/pages/guides/aws.astro`
    - `src/pages/guides/azure.astro`
    - `src/pages/guides/gcp.astro`
    - one calculator-hub slice such as `networking.astro` or `storage.astro`
- Why this week third:
  - stronger routing works best after the weakest destination pages have already been clarified
  - this week should improve crawl paths, first-click paths, and cluster understanding
  - it also creates better support for the higher-opportunity pages scheduled later
- Expected verification output:
  - targeted routing or trust-surface regression tests if the round changes strong directional language
  - `npm run check`
  - `npm run build`
  - post-merge live verification on homepage and hub pages

## Week 4: Re-review preparation and opportunity capture

- Target layer: `Layer C` first, then `Layer B`
- Expected number of rounds: `2`
- Expected page clusters:
  - core trust surface refresh
    - `src/pages/about.astro`
    - `src/pages/contact.astro`
    - `src/pages/editorial-policy.astro`
    - `src/pages/methodology.astro`
  - high-opportunity search cluster
    - default priority slice:
      - `src/pages/guides/cdn-costs.astro`
      - `src/pages/guides/egress-costs.astro`
      - `src/pages/guides/gcp-cloud-run-pricing.astro`
      - `src/pages/guides/azure-container-registry-pricing.astro`
    - optional calculator companions only if the round still stays bounded
- Why this week fourth:
  - trust parity should be strongest immediately before any re-review attempt
  - the final week can then safely re-activate the best search opportunities after the site-quality posture is cleaner
  - this aligns with the March Search Console evidence that CDN, egress, and near-win pricing guides remain the best upside cluster
- Expected verification output:
  - trust-route live verification after merge
  - `origin/main` merge confirmation
  - live phrase checks for trust pages and opportunity pages
  - refreshed priority matrix with any resolved risks downgraded

## Weekly operating rules

Apply these rules every week:

- do not run more than one topic group per round
- keep normal round size between `4` and `6` pages
- do not promote a `Layer B` traffic round if its adjacent `Layer A` risk is still unresolved
- require live verification after each merge, not only repo verification
- update the matrix after each completed round so the roadmap can change if evidence changes

## Success standard after four weeks

At the end of this roadmap, the site should be in a materially safer position if all four weeks land cleanly:

- the strongest remaining overlap clusters are no longer untreated
- thin parent pages and short helper utilities have explicit governance decisions
- routing pages behave more like a curated system than a page catalog
- trust pages are aligned, current, and easy to verify live
- the next AdSense re-review can be approached as a deliberate checkpoint instead of a hopeful retry
