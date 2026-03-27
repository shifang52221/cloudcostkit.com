# Thin Page Triage Shortlist

Date: 2026-03-27

## Scope

This shortlist identifies the twenty highest-risk standalone pages from a site-quality and AdSense-review perspective.

The ranking used:

- local structural signals such as low content depth, low internal-link context, and helper-like page shape
- direct file review of the riskiest guides and calculators
- guide-cluster and calculator-cluster audit passes
- overlap checks against stronger parent, sibling, or provider-specific pages

The goal is not to call these pages "bad." The goal is to decide whether each page truly earns standalone indexable prominence.

## Disposition labels

- `Keep and deepen`
- `Merge into parent`
- `Reduce internal prominence`
- `Noindex`
- `Watch for now`

## Ranked shortlist

| Rank | Page | Cluster | Why risky | Stronger overlap | Disposition | Priority |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `src/pages/guides/gcp.astro` | Guides | Very thin provider hub that behaves more like a taxonomy route than an editorial destination. | `guides/index`, `gcp-cloud-run-pricing`, `gcp-cloud-storage-pricing`, `gcp-vpc-egress-costs` | `Noindex` | P0 |
| 2 | `src/pages/guides/azure.astro` | Guides | Same structural weakness as the GCP hub: useful for navigation, weak as an indexable standalone result. | `guides/index`, `azure-cdn-pricing`, `azure-functions-pricing`, `azure-bandwidth-egress-costs` | `Noindex` | P0 |
| 3 | `src/pages/calculators/aws-api-gateway-request-estimator.astro` | Calculators | Extremely narrow helper page that mainly feeds a stronger pricing workflow. | `aws-api-gateway-cost-calculator`, `aws-api-gateway-estimate-requests`, `aws-api-gateway-pricing` | `Noindex` | P0 |
| 4 | `src/pages/calculators/aws-kms-request-estimator.astro` | Calculators | Support-only estimator with weak standalone search value. | `aws-kms-cost-calculator`, `aws-kms-estimate-requests`, `aws-kms-pricing` | `Noindex` | P0 |
| 5 | `src/pages/calculators/aws-sns-delivery-estimator.astro` | Calculators | Very slight helper tool that adds to the utility matrix without enough independent destination value. | `aws-sns-cost-calculator`, `aws-sns-estimate-deliveries`, `aws-sns-pricing` | `Noindex` | P0 |
| 6 | `src/pages/calculators/aws-sqs-request-estimator.astro` | Calculators | Another narrow support calculator that is better as part of an SQS pricing workflow than a search landing page. | `aws-sqs-cost-calculator`, `aws-sqs-estimate-requests`, `aws-sqs-pricing` | `Noindex` | P0 |
| 7 | `src/pages/calculators/aws-waf-request-estimator.astro` | Calculators | Useful in workflow, but too narrow and too helper-like to strongly justify its own indexable slot. | `aws-waf-cost-calculator`, `aws-waf-estimate-requests`, `aws-waf-pricing` | `Noindex` | P0 |
| 8 | `src/pages/guides/requests-costs.astro` | Guides | Heavy conceptual overlap with request-based pricing plus many service-specific request pages. | `request-based-pricing`, `aws-api-gateway-pricing`, `cdn-request-pricing`, `messaging-costs` | `Merge into parent` | P1 |
| 9 | `src/pages/guides/kubernetes-cost-calculator.astro` | Guides | Duplicate-intent risk against the actual calculator route and broader Kubernetes parent guides. | `calculators/kubernetes-cost-calculator`, `kubernetes-costs`, `eks-vs-gke-vs-aks-cost` | `Merge into parent` | P1 |
| 10 | `src/pages/guides/metrics-costs.astro` | Guides | Short topic parent with weak standalone authority relative to stronger observability and provider-specific metrics pages. | `observability-costs`, `aws-cloudwatch-metrics-pricing`, `azure-monitor-metrics-pricing`, `gcp-cloud-monitoring-metrics-pricing` | `Reduce internal prominence` | P1 |
| 11 | `src/pages/guides/serverless-costs.astro` | Guides | Generic umbrella page whose current role is more connective than decision-owning. | `aws-lambda-pricing`, `azure-functions-pricing`, `gcp-cloud-run-pricing`, `aws-fargate-pricing` | `Reduce internal prominence` | P1 |
| 12 | `src/pages/guides/load-balancing-costs.astro` | Guides | Thin broad explainer with weaker value than provider-specific and comparison pages. | `aws-load-balancer-cost`, `aws-alb-vs-nlb-cost`, `azure-load-balancer-pricing`, `gcp-load-balancing-pricing` | `Reduce internal prominence` | P1 |
| 13 | `src/pages/guides/backups-and-snapshots-costs.astro` | Guides | Generic topic page that risks existing mainly to multiply topic coverage rather than own a distinct workflow. | `aws-rds-backups-and-snapshots`, `aws-ebs-snapshot-cost`, `aws-rds-snapshot-retention-policy-cost`, `storage-costs` | `Reduce internal prominence` | P1 |
| 14 | `src/pages/calculators/api-response-size-transfer-calculator.astro` | Calculators | Real utility, but still behaves more like a support calculator than a primary destination. | `data-egress-cost-calculator`, `cdn-bandwidth-cost-calculator`, `cdn-origin-egress-calculator` | `Reduce internal prominence` | P1 |
| 15 | `src/pages/calculators/rps-to-monthly-requests-calculator.astro` | Calculators | Generic helper with utility, but weak differentiation as a standalone SEO target in a large calculator library. | `api-request-cost-calculator`, request-estimator pages, `request-based-pricing` | `Reduce internal prominence` | P1 |
| 16 | `src/pages/calculators/compute-instance-cost-calculator.astro` | Calculators | Generic compute helper that competes awkwardly with stronger provider-specific tools and broader compute guides. | `ec2-cost-calculator`, `compute-costs`, provider-specific compute pages | `Reduce internal prominence` | P1 |
| 17 | `src/pages/calculators/cdn-origin-egress-calculator.astro` | Calculators | Narrow transfer helper that reinforces the “many small utility pages” pattern. | `cdn-cost-calculator`, `cdn-bandwidth-cost-calculator`, `data-egress-cost-calculator` | `Reduce internal prominence` | P1 |
| 18 | `src/pages/guides/compute-costs.astro` | Guides | Broad topic page with limited unique framework relative to stronger provider and workload pages. | `aws-ec2-cost-estimation`, `aws-fargate-pricing`, `aws-lambda-pricing`, `kubernetes-costs` | `Keep and deepen` | P2 |
| 19 | `src/pages/guides/observability-costs.astro` | Guides | Broad cluster hub that still needs sharper cross-signal workflow ownership. | `log-costs`, `metrics-costs`, `aws-cloudwatch-logs-pricing`, `aws-cloudwatch-metrics-pricing` | `Keep and deepen` | P2 |
| 20 | `src/pages/calculators/api-request-cost-calculator.astro` | Calculators | Stronger than the tiny helper pages, but still generic unless its role is sharpened against provider-specific request calculators. | `aws-api-gateway-cost-calculator`, `request-based-pricing`, `rps-to-monthly-requests-calculator` | `Keep and deepen` | P2 |

## Pattern summary

The highest-risk pages fall into four buckets:

1. Thin provider hubs
   - `gcp.astro`
   - `azure.astro`

2. Helper-only estimator calculators
   - API Gateway request estimator
   - KMS request estimator
   - SNS delivery estimator
   - SQS request estimator
   - WAF request estimator

3. Generic thematic parents that are too light for the prominence they imply
   - `metrics-costs`
   - `serverless-costs`
   - `load-balancing-costs`
   - `backups-and-snapshots-costs`

4. Duplicate-intent pages that blur roles
   - `requests-costs`
   - `kubernetes-cost-calculator`
   - some generic helper calculators

## Recommended first remediation batch

The best first batch is the highest-confidence structural set:

- `src/pages/guides/gcp.astro` -> `Noindex`
- `src/pages/guides/azure.astro` -> `Noindex`
- `src/pages/calculators/aws-api-gateway-request-estimator.astro` -> `Noindex`
- `src/pages/calculators/aws-kms-request-estimator.astro` -> `Noindex`
- `src/pages/calculators/aws-sns-delivery-estimator.astro` -> `Noindex`
- `src/pages/calculators/aws-sqs-request-estimator.astro` -> `Noindex`
- `src/pages/calculators/aws-waf-request-estimator.astro` -> `Noindex`

Why this batch first:

- highest confidence in the disposition
- strong site-shape improvement without heavy content surgery
- removes a visible chunk of “thin standalone utility/taxonomy” risk quickly

## Second-batch candidates

After the first batch, the strongest next group is:

- `requests-costs.astro`
- `kubernetes-cost-calculator.astro`
- `metrics-costs.astro`
- `serverless-costs.astro`
- `compute-instance-cost-calculator.astro`
- `rps-to-monthly-requests-calculator.astro`

That second batch needs more content and internal-link strategy judgment than the first batch.
