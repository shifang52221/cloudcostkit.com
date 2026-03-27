# Thin Page Deploy Checklist

Use this checklist when deploying the thin-page cleanup from the clean release worktree.

## 1. Pre-deploy checks

- Deploy from branch `thin-page-triage`.
- Do not deploy from the dirty local `main` worktree at `F:\www\www.cloudcostkit.com\cloudcostkit`.
- Confirm the release worktree is clean:

```bash
git status --short --branch
```

- Confirm recent local verification passes:

```bash
npm run check
npm run build
```

- Confirm the branch contains the thin-page rollout commits, including:
  - Batch 1 thin hubs and helper estimator demotions
  - Batch 2A duplicate-intent guide cleanup
  - Batch 2B and 2C theme-guide role tightening
  - Batch 3 helper calculator role tightening
  - live post-deploy verification assets

## 2. Cloudflare Pages settings to confirm

- Production deployment source is the intended clean branch or commit set from `thin-page-triage`.
- Build command is `npm run build`.
- Build output directory is `dist`.
- The project is using the Astro Cloudflare adapter.
- `PUBLIC_SITE_URL` is set correctly for the production domain.
- `PUBLIC_CONTACT_EMAIL` is set.
- Review-safe ad posture remains enabled:

```text
PUBLIC_ENABLE_ADS=false
```

- If the project uses the optional session KV binding, confirm the `SESSION` binding is still present in the Cloudflare
  project configuration.

## 3. Post-deploy verification

Run both commands against production after the deployment finishes:

```bash
npm run verify:live
SITE_URL=https://cloudcostkit.com npm run verify:live:post-deploy
```

Expected meaning:

- `npm run verify:live`
  - trust routes return `200`
  - representative pages do not expose unexpected ad scripts or ad containers

- `npm run verify:live:post-deploy`
  - the 12 demoted thin/support pages are absent from the live sitemap
  - those reachable URLs emit `noindex,follow`
  - representative retained pages stay indexable

## 4. How to interpret the result

- If `verify:live` fails, treat the deployment as not review-safe yet. Fix trust or monetization parity first.
- If `verify:live:post-deploy` fails because removed pages are still in the sitemap, the old public index surface is
  still live or the deployment source is wrong.
- If `verify:live:post-deploy` fails because removed pages still show `index,follow`, the rollout is only partially
  live and Google can still treat those pages as part of the public search surface.
- If both commands pass, the production site is materially closer to the intended smaller index surface and is in a
  better position for a future AdSense resubmission.

## 5. Baseline to compare against

Known live baseline before this rollout was fully deployed, checked on March 27, 2026:

- live sitemap routes observed: `285`
- the following 12 URLs were still present live and still indexable:
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

After a correct deployment, those 12 URLs should no longer appear in the live sitemap, and their page-level robots
state should read `noindex,follow`.
