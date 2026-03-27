# Thin Page Triage Shortlist

Date: 2026-03-27

## Scope

This shortlist ranks the twenty highest-risk standalone pages from a site-quality and AdSense review perspective.

The ranking does **not** assume the pages are broken or unreadable. The issue is whether they are strong enough to keep earning standalone indexable prominence on a still-young site with a large URL footprint.

## Disposition labels

- `Keep and deepen`
- `Merge into parent`
- `Reduce internal prominence`
- `Noindex`
- `Watch for now`

## Ranked shortlist

| Rank | File path | Cluster | Why risky | Stronger overlapping page(s) | Recommended disposition | Priority |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `src/pages/calculators/aws-api-gateway-request-estimator.astro` | calculators / request estimators | Extremely narrow helper page. Useful inside a workflow, but weak as a primary landing page and heavily overlapped by the full API Gateway calculator and paired guide. | `/calculators/aws-api-gateway-cost-calculator/`, `/guides/aws-api-gateway-estimate-requests/`, `/guides/aws-api-gateway-pricing/` | `Noindex` | P0 |
| 2 | `src/pages/calculators/aws-kms-request-estimator.astro` | calculators / request estimators | Same pattern: thin helper utility, low standalone value, strong overlap with pricing and guide workflow. | `/calculators/aws-kms-cost-calculator/`, `/guides/aws-kms-estimate-requests/`, `/guides/aws-kms-pricing/` | `Noindex` | P0 |
| 3 | `src/pages/calculators/aws-sns-delivery-estimator.astro` | calculators / request estimators | Too slight as an independent search result. Better as a support tool under SNS pricing/delivery workflow. | `/calculators/aws-sns-cost-calculator/`, `/guides/aws-sns-estimate-deliveries/`, `/guides/aws-sns-pricing/` | `Noindex` | P0 |
| 4 | `src/pages/calculators/aws-sqs-request-estimator.astro` | calculators / request estimators | Utility helper with little independent defensibility. Feels like one more matrix page rather than a clear destination. | `/calculators/aws-sqs-cost-calculator/`, `/guides/aws-sqs-estimate-requests/`, `/guides/aws-sqs-pricing/` | `Noindex` | P0 |
| 5 | `src/pages/calculators/aws-waf-request-estimator.astro` | calculators / request estimators | Very narrow helper page. Useful for internal workflow, weak as a standalone public landing page. | `/calculators/aws-waf-cost-calculator/`, `/guides/aws-waf-estimate-requests/`, `/guides/aws-waf-pricing/` | `Noindex` | P0 |
| 6 | `src/pages/guides/backups-and-snapshots-costs.astro` | guides / thin topic parents | Very thin generic parent page with weak standalone value and broad overlap with stronger storage and RDS backup/snapshot pages. | `/guides/storage-costs/`, `/guides/aws-rds-backups-and-snapshots/`, `/guides/aws-ebs-snapshot-cost/` | `Merge into parent` | P0 |
| 7 | `src/pages/guides/requests-costs.astro` | guides / thin topic parents | Generic request-cost hub with weak differentiation from request-based pricing and multiple specific request guides/calculators. | `/guides/request-based-pricing/`, `/guides/messaging-costs/`, `/guides/aws-api-gateway-pricing/` | `Merge into parent` | P0 |
| 8 | `src/pages/guides/metrics-costs.astro` | guides / thin topic parents | Too thin to justify standalone prominence. Reads more like a subsection of observability than a strong independent page. | `/guides/observability-costs/`, `/guides/gcp-cloud-monitoring-metrics-pricing/`, `/guides/aws-cloudwatch-metrics-pricing/` | `Merge into parent` | P0 |
| 9 | `src/pages/guides/observability-costs.astro` | guides / strategic parent pages | Strategic topic, but still too lightweight for how central the topic is. At current depth it risks looking like a routing page rather than a real parent resource. | `/guides/log-costs/`, `/guides/metrics-costs/`, provider-specific observability guides | `Keep and deepen` | P1 |
| 10 | `src/pages/guides/compute-costs.astro` | guides / strategic parent pages | Important topic, but current version still behaves more like a light hub than a definitive cross-provider compute parent page. | `/guides/aws-ec2-cost-estimation/`, `/guides/serverless-costs/`, `/guides/kubernetes-costs/` | `Keep and deepen` | P1 |
| 11 | `src/pages/guides/load-balancing-costs.astro` | guides / strategic parent pages | Clear role in theory, but still not deep enough to justify a strong generic query target versus provider-specific pages. | `/guides/aws-load-balancer-cost/`, `/guides/gcp-load-balancing-pricing/`, `/guides/azure-load-balancer-pricing/` | `Keep and deepen` | P1 |
| 12 | `src/pages/guides/messaging-costs.astro` | guides / strategic parent pages | Useful cross-provider parent, but still vulnerable to reading like a light route page. Needs stronger framing and clearer ownership over retries, fan-out, and payload economics. | `/guides/aws-sns-pricing/`, `/guides/aws-sqs-pricing/`, `/guides/gcp-pubsub-pricing/`, `/guides/azure-service-bus-pricing/` | `Keep and deepen` | P1 |
| 13 | `src/pages/guides/azure.astro` | guides / provider hubs | Provider hub is strategically valid, but current page is too thin for strong search prominence and mostly behaves as a directory. | `/guides/index/`, Azure guide detail pages, `/guides/azure-bandwidth-egress-costs/` | `Keep and deepen` | P1 |
| 14 | `src/pages/guides/gcp.astro` | guides / provider hubs | Same issue as the Azure hub: useful for navigation, but too thin to feel like a destination page on its own. | `/guides/index/`, GCP guide detail pages, `/guides/gcp-cloud-run-pricing/` | `Keep and deepen` | P1 |
| 15 | `src/pages/calculators/api-response-size-transfer-calculator.astro` | calculators / generic helpers | Better than the request-estimator pages, but still more like a support tool than a clear primary landing page. Heavy overlap with egress/CDN bandwidth tools. | `/calculators/data-egress-cost-calculator/`, `/calculators/cdn-bandwidth-cost-calculator/`, `/calculators/cdn-origin-egress-calculator/` | `Reduce internal prominence` | P1 |
| 16 | `src/pages/calculators/rps-to-monthly-requests-calculator.astro` | calculators / generic helpers | Generic utility with real usefulness, but weak differentiation as an SEO landing page inside a very large calculator set. | `/calculators/api-request-cost-calculator/`, request-estimator calculators, `/guides/request-based-pricing/` | `Reduce internal prominence` | P1 |
| 17 | `src/pages/calculators/compute-instance-cost-calculator.astro` | calculators / generic helpers | Generic compute helper page competes awkwardly with stronger provider-specific calculators and cross-provider compute guidance. | `/calculators/ec2-cost-calculator/`, `/guides/compute-costs/`, provider-specific compute guides | `Reduce internal prominence` | P1 |
| 18 | `src/pages/guides/database-costs.astro` | guides / thin topic parents | Broad parent topic with weak current depth. Reads more like a doorway into stronger provider-specific database pages. | `/guides/aws-rds-pricing/`, `/guides/aws-aurora-pricing/`, `/guides/azure-sql-database-pricing/`, `/guides/gcp-cloud-sql-pricing/` | `Keep and deepen` | P2 |
| 19 | `src/pages/guides/serverless-costs.astro` | guides / thin topic parents | Strategic topic, but current page is too shallow relative to the number of stronger serverless provider pages it points toward. | `/guides/aws-lambda-pricing/`, `/guides/azure-functions-pricing/`, `/guides/gcp-cloud-functions-pricing/`, `/guides/gcp-cloud-run-pricing/` | `Keep and deepen` | P2 |
| 20 | `src/pages/calculators/api-request-cost-calculator.astro` | calculators / generic helpers | Stronger than the tiny helper pages, but still generic and partly redundant unless its role is sharpened against provider-specific request calculators and pricing guides. | `/calculators/aws-api-gateway-cost-calculator/`, `/guides/request-based-pricing/`, `/calculators/rps-to-monthly-requests-calculator/` | `Keep and deepen` | P2 |

## Immediate conclusions

### Pages most suitable for first structural reduction batch

- the five AWS request-estimator helper calculators
- `src/pages/guides/backups-and-snapshots-costs.astro`
- `src/pages/guides/requests-costs.astro`
- `src/pages/guides/metrics-costs.astro`

These pages have the clearest low-risk structural action:

- `Noindex` for helper calculators that remain useful inside a workflow
- `Merge into parent` for thin guide pages whose roles are already better served elsewhere

### Pages that should not be cut blindly

- `src/pages/guides/azure.astro`
- `src/pages/guides/gcp.astro`
- `src/pages/guides/compute-costs.astro`
- `src/pages/guides/observability-costs.astro`
- `src/pages/guides/load-balancing-costs.astro`
- `src/pages/guides/messaging-costs.astro`

These are strategically valid parent pages, but they need deeper ownership rather than automatic removal.
