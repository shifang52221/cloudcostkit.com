# Live Post-Deploy Verification Design

## Why this exists

The thin-page triage work is intentionally changing the public search surface of the site.

That means local build success is not enough. We also need a repeatable way to confirm that a production deployment
actually picked up the intended search-surface changes:

- thin or support-only pages should disappear from the live sitemap
- those same URLs should return `noindex,follow` if they remain accessible
- representative kept pages should remain indexable

Without that check, the team can easily think the cleanup is live while Google still sees the older indexable surface.

## Options considered

### Option 1: Extend the existing `verify-live-site` script

Pros:

- one fewer command to remember
- reuses the existing live fetch utility

Cons:

- mixes baseline trust/ad checks with rollout-specific SEO assertions
- becomes harder to interpret when one class of check fails and the other passes
- encourages a monolithic verifier that keeps growing

### Option 2: Add a dedicated post-deploy thin-page verifier

Pros:

- keeps responsibilities clear
- maps directly to this rollout's SEO quality objective
- can be run after every deployment without conflating results with unrelated live checks

Cons:

- adds one more small script

### Option 3: Document the checks as a manual checklist only

Pros:

- lowest implementation cost

Cons:

- too easy to skip or perform inconsistently
- slower to rerun after deployment
- weak evidence when comparing pre-deploy and post-deploy status

## Recommended approach

Choose Option 2: create a dedicated post-deploy verification script for the thin-page triage rollout.

This keeps the existing `verify-live-site` command focused on broad trust and monetization safety, while the new script
acts as a deployment acceptance gate for the search-surface cleanup.

## Final design

### Script

Add `scripts/verify-live-post-deploy.mjs`.

The script should:

- read `SITE_URL` or `PUBLIC_SITE_URL`, defaulting to `https://cloudcostkit.com`
- fetch live `robots.txt`
- fetch the live sitemap index and all child sitemap files
- build a live URL set from sitemap entries

### Removed-surface checks

The script should verify that all 12 URLs removed by the thin-page triage batches are absent from the live sitemap set:

- `/calculators/aws-api-gateway-request-estimator/`
- `/calculators/aws-kms-request-estimator/`
- `/calculators/aws-sns-delivery-estimator/`
- `/calculators/aws-sqs-request-estimator/`
- `/calculators/aws-waf-request-estimator/`
- `/calculators/compute-instance-cost-calculator/`
- `/calculators/rps-to-monthly-requests-calculator/`
- `/guides/azure/`
- `/guides/backups-and-snapshots-costs/`
- `/guides/gcp/`
- `/guides/kubernetes-cost-calculator/`
- `/guides/requests-costs/`

### Page-level robots checks

For those same removed URLs, the script should fetch the live page and verify:

- HTTP status is successful
- the HTML contains a robots directive with `noindex,follow`

The goal is not to force these pages offline. The goal is to confirm that, if they remain reachable, they are clearly
demoted from the indexed search surface.

### Kept-page checks

The script should also verify a small set of representative retained URLs remain indexable and available. This prevents
cleanup work from accidentally overshooting and damaging stronger pages.

Recommended retained checks:

- `/guides/request-based-pricing/`
- `/guides/load-balancing-costs/`
- `/guides/metrics-costs/`
- `/calculators/api-request-cost-calculator/`
- `/calculators/cdn-origin-egress-calculator/`

For these pages, the script should verify:

- HTTP status is successful
- robots does not contain `noindex`

### Output and failure mode

The script should print plain `OK` or `BAD` lines similar to the existing live verifier so it is easy to scan in the
terminal and compare across deploys.

If any required check fails, exit with status code `1`.

### Package wiring

Add an npm script:

- `verify:live:post-deploy`

This gives the deployment review workflow a stable command alongside the existing `verify:live`.

## Success standard

This design is successful when:

- we can run one command after deployment and immediately see whether the live search surface matches local intent
- removed thin pages are absent from the live sitemap and return `noindex,follow`
- representative strong pages remain indexable
- the output is stable enough to serve as evidence during rollout review and re-checks
