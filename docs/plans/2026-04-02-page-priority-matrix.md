# Page Priority Matrix

This matrix is the operating backlog for governed remediation. It converts the governance design into a practical queue so each round starts from risk and upside, not intuition.

Scope notes:

- the site currently exposes about `200` guide pages and `79` calculator pages
- recent deep-remediation work already strengthened several AWS, CDN, and Kubernetes clusters
- this matrix focuses on the remaining pages and clusters most likely to affect review risk, search upside, trust, or routing quality

Selection fields:

- `Page or cluster`: the URL or small group that should be evaluated together
- `Page type`: review-risk page, parent guide, support guide, calculator, trust page, or routing page
- `Main risk`: why the page can still hurt quality or clarity
- `Main upside`: what improves if we fix it
- `Layer`: A, B, C, or D from the governance model
- `Urgency`: High, Medium, or Low for the next few rounds

## Layer A - Review-risk Pages

These are the pages most likely to reinforce a "low quality" or over-multiplied-site impression if left untouched.

| Page or cluster | Page type | Main risk | Main upside | Layer | Urgency |
| --- | --- | --- | --- | --- | --- |
| `src/pages/guides/requests-costs.astro` + `src/pages/guides/request-based-pricing.astro` | overlapping parent + support guide | Topic overlap is still high; the parent can read like a lighter restatement of the support page | One stronger role split removes duplication and sharpens intent | A | High |
| `src/pages/guides/network-transfer-costs.astro` + `src/pages/guides/egress-costs.astro` | overlapping boundary guides | Both can read as broad transfer explainers without enough directional separation | Stronger role split would reduce overlap and improve cluster coherence | A | High |
| `src/pages/guides/serverless-costs.astro` + provider serverless guides | broad topic parent | The parent is broad enough to look generic unless its routing job is explicit | Clear parent-page routing can preserve value without feeling template-like | A | High |
| `src/pages/guides/compute-costs.astro` + `src/pages/guides/storage-costs.astro` + `src/pages/guides/database-costs.astro` + `src/pages/guides/messaging-costs.astro` | topic parent guides | Several topic parents are still short enough to feel like multiplied category pages rather than strong landing pages | Tightening parent roles can prevent thin-category impressions across the site | A | High |
| `src/pages/guides/observability-costs.astro` + `src/pages/guides/metrics-costs.astro` + `src/pages/guides/log-costs.astro` | parent + subtopic guides | Parent/subtopic hierarchy is not yet strong enough; risk of repetitive observability framing | Better routing would make these pages feel like a system, not duplicates | A | Medium |
| `src/pages/guides/load-balancing-costs.astro` + `src/pages/guides/backups-and-snapshots-costs.astro` | narrow parent guides | Standalone value is still borderline for broad search visibility | Decide whether to deepen, de-emphasize, or merge value into stronger nearby parents | A | Medium |
| `src/pages/guides/aws-cloudwatch-dashboards-pricing.astro` | support guide | Short and narrow enough to feel lightweight unless connected to a stronger observability workflow | Could become a precise support page or be reduced in prominence | A | Medium |
| request-estimator calculator cluster: `aws-sns-delivery-estimator`, `aws-sqs-request-estimator`, `aws-kms-request-estimator`, `aws-api-gateway-request-estimator`, `aws-waf-request-estimator` | support calculators | These are useful helpers but are extremely slight as standalone indexed utilities | Clarifying whether they are primary URLs or support helpers will reduce low-value utility risk | A | High |
| ultra-short utility calculator cluster: `rps-to-monthly-requests-calculator`, `compute-instance-cost-calculator`, `api-request-cost-calculator`, `api-response-size-transfer-calculator`, `cdn-request-cost-calculator` | support calculators | Their utility is real, but on a large site they can still look mass-produced without stronger routing or reduced prominence | Cluster-level policy for deepen vs de-emphasize vs noindex would materially reduce review risk | A | High |

## Layer B - Traffic-opportunity Pages

These pages are worth improving because they can capture more search value once role, CTR, or first-screen clarity is stronger.

| Page or cluster | Page type | Main risk | Main upside | Layer | Urgency |
| --- | --- | --- | --- | --- | --- |
| `src/pages/guides/egress-costs.astro` | high-opportunity parent guide | Strong topic, but broad framing can still undersell its decision value | Sharper first-screen promise and stronger routing can lift CTR and depth | B | High |
| `src/pages/guides/storage-costs.astro` | parent guide | Useful breadth, but parent intent can still blur into sub-guides | Better checklist framing could turn it into a stronger entry page | B | Medium |
| `src/pages/guides/cloudfront-vs-cloudflare-cdn-cost.astro` | comparison guide | Good search demand, but depends on stronger comparison-page differentiation | Better comparison framing can convert impressions into clicks | B | Medium |
| `src/pages/guides/gcp-cloud-run-pricing.astro` + `src/pages/guides/azure-container-registry-pricing.astro` + `src/pages/guides/azure-event-hubs-pricing.astro` | provider pricing guides | These pages already showed opportunity in Search Console planning, but can still improve first-screen promise and cluster routing | Strong near-win candidates for traffic growth after role hardening | B | Medium |
| `src/pages/guides/aws-ec2-cost-estimation.astro` | core workflow guide | Valuable topic, but broader compute cluster routing can still be improved | Strong candidate for growth once adjacent parent pages are cleaner | B | Medium |
| `src/pages/calculators/ec2-cost-calculator.astro` + `src/pages/calculators/data-egress-cost-calculator.astro` + `src/pages/calculators/storage-replication-cost-calculator.astro` | high-opportunity calculators | High-value tools, but growth can stall if surrounding guide paths remain weak | Improve surrounding content paths to raise tool conversion and return visits | B | Medium |
| `src/pages/calculators/aws-ecs-task-sizing-calculator.astro` | workflow calculator | Useful tool with a good search angle, but its role can still be framed more clearly | Strong candidate for CTR and on-page conversion improvement | B | Medium |

## Layer C - Trust and Governance Pages

These pages do not need constant rewriting, but they do need explicit upkeep because trust drift can block both approval and SEO confidence.

| Page or cluster | Page type | Main risk | Main upside | Layer | Urgency |
| --- | --- | --- | --- | --- | --- |
| `src/pages/about.astro` + `src/pages/contact.astro` + `src/pages/editorial-policy.astro` | trust pages | These pages are already stronger, but they need to stay aligned with live behavior, correction flow, and review claims | Stable trust language reduces approval risk and strengthens site legitimacy | C | High |
| `src/pages/methodology.astro` | governance page | If reviewed semantics drift or become vague, site-wide trust weakens | Keeps estimates, caveats, and editorial standards defensible | C | High |
| `src/pages/privacy-policy.astro` + `src/pages/terms.astro` + `src/pages/cookie-notice.astro` | legal and policy pages | Lower editorial priority, but broken or stale presentation harms trust parity | Keeps the trust layer complete and consistent | C | Low |
| `src/pages/guides/cloud-cost-estimation-checklist.astro` | support trust page | Useful as a quality gate, but could do more to reinforce how to validate estimates before acting | Can become a visible "how to trust this site" support asset | C | Medium |

## Layer D - Growth-routing Pages

These pages influence crawl paths, cluster coherence, and where users land before they discover the stronger guides and calculators.

| Page or cluster | Page type | Main risk | Main upside | Layer | Urgency |
| --- | --- | --- | --- | --- | --- |
| `src/pages/index.astro` | site entry page | If entry paths are too generic, stronger pages stay under-discovered | Stronger directional routing improves both crawl efficiency and user progression | D | High |
| `src/pages/guides/index.astro` + `src/pages/calculators/index.astro` | content hubs | Hub pages can become generic lists unless they explain how to choose the right page type | Better routing language strengthens the entire site graph | D | High |
| `src/pages/guides/aws.astro` + `src/pages/guides/azure.astro` + `src/pages/guides/gcp.astro` | provider hubs | Provider hubs are useful but still vulnerable to feeling too light for their prominence | Sharper provider routing reduces thin-hub risk while preserving discovery value | D | Medium |
| `src/pages/guides/networking-costs.astro` + `src/pages/guides/security-costs.astro` | topic hubs | These are both category pages and routing surfaces, which means weak framing hurts two layers at once | A stronger hub model can reduce category-page fragility | D | Medium |
| `src/pages/sitemap.astro` | support routing page | Lower user-facing importance, but still part of site-shape hygiene | Keep routing and index discovery consistent as the site is consolidated | D | Low |

## Immediate operating order

Use this matrix for the next three governed decisions:

1. Choose the first Layer A batch from the broad parent or support-guide overlaps that still create the strongest low-quality impression.
2. Choose the next Layer D batch only after that Layer A round lands, so improved parents and hubs can route into cleaner clusters.
3. Pull Layer B pages forward only when their nearby Layer A risks are already under control.

## Current recommendation for the next round

The strongest next governed round is:

- `requests-costs`
- `request-based-pricing`
- `network-transfer-costs`
- `egress-costs`

Reason:

- this cluster sits directly on the overlap problem identified in the audit
- the pages are broad enough to influence site-wide quality perception
- the round is still small enough to keep one-merge discipline
