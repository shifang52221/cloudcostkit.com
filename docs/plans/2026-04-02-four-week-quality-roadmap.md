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

## Week 2: Reduce residual thin-page and parent-page fragility

- Target layer: `Layer A`, then selective `Layer B`
- Expected number of rounds: `2`
- Expected page clusters:
  - generic topic-parent guide cluster
    - likely first slice:
      - `src/pages/guides/serverless-costs.astro`
      - `src/pages/guides/compute-costs.astro`
      - `src/pages/guides/messaging-costs.astro`
      - `src/pages/guides/database-costs.astro`
  - short utility calculator cluster
    - likely first slice:
      - `src/pages/calculators/rps-to-monthly-requests-calculator.astro`
      - `src/pages/calculators/compute-instance-cost-calculator.astro`
      - `src/pages/calculators/api-request-cost-calculator.astro`
      - `src/pages/calculators/api-response-size-transfer-calculator.astro`
- Why this week second:
  - after the broadest guide overlaps are reduced, the next approval risk is the impression of too many slight parent or helper URLs
  - this week should decide which pages deserve independent prominence and which should become support utilities
  - this is the week where "deepen vs de-emphasize vs noindex" decisions become explicit
- Expected verification output:
  - diff review proving the round stayed within one topic group
  - `git diff --check`
  - non-ASCII audit on touched files
  - `npm run check`
  - `npm run build`

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
    - `src/pages/guides/cdn-costs.astro`
    - `src/pages/guides/egress-costs.astro`
    - `src/pages/guides/gcp-cloud-run-pricing.astro`
    - `src/pages/guides/azure-container-registry-pricing.astro`
    - optional calculator companions if the batch still stays bounded
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
