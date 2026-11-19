# CloudCostKit: site portfolio and workflow audit

## Decision context

The owner intends to run a low-maintenance AdSense site, with domain renewal as the principal cash cost. Preserve useful assets and URLs; do not redesign as SaaS, introduce a live multi-cloud price database, or expand publishing merely to increase page count. Engineering time and pricing verification are the scarce resources.

Confirmed AdSense message: low-value content; ownership verification passed. No evidence establishes AI detection, a framework ban, a minimum traffic threshold, or a specific offending URL. Search performance cannot establish the internal review cause.

## Inventory method and limitations

Inventory all `.astro` files recursively under `src/pages`; classify by the layout actually referenced, not the URL folder alone. Match the supplied Search Console page CSV by pathname, normalizing trailing slashes and summing both variants. Export period: 2026-08-16 through 2026-11-15. The inventory covers source files, not production indexing. Source heuristics are review signals, not quality scores.

| Source layout class | Pages | Matched paths in export | Clicks | Page impressions | Explicit noindex literal |
| --- | ---: | ---: | ---: | ---: | ---: |
| CalculatorLayout | 69 | 51 | 76 | 20,957 | 7 |
| GuideLayout | 196 | 126 | 53 | 28,966 | 3 |
| Other: hubs/information/404 | 24 | 17 | 2 | 2,778 | 7 |
| Total | 289 | 194 | 131 | 52,701 | 17 |

Page-level impressions aggregate differently from the daily property series (50,643); do not substitute the page sum for site impressions. The 196 exported URL strings reduce to 194 matched paths after normalization. Noindex counts inspect explicit literals only, not all rendered/inherited behavior. Source dates, commits, deployments, and provider pricing verification dates are distinct.

30 GuideLayout source files contain no literal external HTTP URL. A layout can add links, and some articles do not require price sources. Review provider-specific assertions rather than declaring those pages untrustworthy. 104 layout pages carry a literal 2026-01-27 update date; batching is not proof of AI authorship or stale pricing. Check actual claims before changing dates.

## Structural findings with direct evidence

### F1: Calculator navigation precedes the calculation

`src/layouts/CalculatorLayout.astro` renders the hero/toolbar, then the Best next steps related-link section, then the main slot. The slot holds calculator inputs/results. This is an observed order; an effect on engagement or review is not established.

Action: pilot a tool-first order on storage and log ingestion, keeping related links after the main task. Avoid removing useful navigation or changing all pages before browser checks. Acceptance: input reachable earlier at 390px and desktop; save/reset/share still work; page retains sources and companion paths.

### F2: Guide opening assistance is automatic and sometimes adjacent, not primary

`src/layouts/GuideLayout.astro` infers topic tools and can place four links before the article slot. For Cloud Run, inferred egress links cannot replace its native CPU/memory/runtime explanation. FAQ follows related guide and calculator grids, potentially burying the answer behind up to twelve recommendations.

Action: audit top guides individually; explicitly disable or curate opening assistance when it does not answer the primary task. Consider FAQ before recommendations where it contains primary answers. Preserve dedicated estimation guidance; do not create a generic provider quote claim. Acceptance: first substantive answer matches the title; related recommendations have a specific reason to be present.

### F3: Homepage prioritizes review claims over the main entry workflows

`src/pages/index.astro` places an extensive Review how this site works section before featured tools. It uses High search demand topic and live search demand to explain navigation. These phrases describe the publisher's acquisition strategy rather than visitor benefit.

Action: lead with a small set of task entry points, using actual visitor outcomes; retain honest maintenance identity, policy/methodology links, and correction contact in a compact visible section. Do not invent a human team, credentials, review history, or testimonials. Homepage changes alone cannot resolve weak landing pages.

### F4: Measurement cannot yet distinguish task use from page arrival

The inspected GA4 component initializes tracking but does not define task-completion events. Calculator values can enter URL query parameters through `useNumberParamState.ts`. Before enabling more tracking, confirm production configuration, consent behavior, and GA4 enhanced measurement settings. Default page location/history tracking may include query inputs; this is a risk to verify, not evidence of an observed data transfer.

Action: design bounded consent-respecting events with tool identifier/action only. Do not send user-entered prices, volumes, full scenario URLs, names, or financial exports. Sanitizing initial location alone would not prove enhanced measurement safe. No analytics change or claim of task completion should ship before this review.

## Priority ledger

| Priority / path | Evidence from export | Decision and next acceptance gate |
| --- | --- | --- |
| P1 storage-pricing calculator | 14 clicks / 4,915 impressions / position 19.44 | Keep URL; first accuracy batch shipped at d204de1. Next verify tool-first route and scenario save/load; do not describe independent calculators as a live combined total. |
| P1 log-ingestion calculator | 8 / 481 / 12.19 | Keep; review unit/rate conversion and sample-to-daily-volume workflow before expanding content. |
| P1 ACR guide | 7 / 5,921 / 9.73 | Keep; FAQ consistency fix shipped. Next validate tier charges and a conditional numerical example against accessible official sources; never invent current rates. |
| P1 Cloud Run guide | 4 / 2,010 / 12.23 | Keep; curate opening links, audit native billing-time model and concurrency assumptions. Do not reduce overlapping requests to sum of latencies without qualification. |
| P2 data-egress calculator | 8 / 2,168 / 43.89 | Keep; review boundary, allowance and tier assumptions. Low ranking is distinct from poor CTR at first-page positions. |
| P2 Kubernetes requests/limits calculator | 8 / 380 / 21.22 | Keep; validate requests versus limits, headroom, bin packing and billable-node interpretation. Small sample, not demand proof. |
| P2 Kubernetes cost calculator | 8 / 865 / 28.25 | Keep; inspect its distinct role relative to sizing tool; shared components alone do not justify merger. |
| P2 EC2 calculator | 2 / 3,374 / 33.65 | Keep; runtime terminology fixed. Test presets and known-rate positioning; no live pricing database proposed. |
| P2 CDN calculator / guide | calculator 3 / 4,350 / 26.82; guide 0 / 2,217 / 47.54 | Keep pending cluster review. Compare which-number-changed workflow against narrow utilities before consolidation. Do not fix only snippets. |
| P3 unobserved or low-exposure pages | 78 sitemap URLs absent from supplied export in prior live comparison | Hold URLs. Absence is not non-indexing or uselessness. Check independent task, links and index report before disposition. |

Paths in the ledger refer to their existing `/calculators/` or `/guides/` canonical routes; no rename is proposed. Priorities are operating choices, not predicted revenue or approval probabilities.

## Release gates

1. Accuracy and mobile foundation: shipped d204de1; local 324 tests, type check, build and Chrome interaction checks; Cloudflare success and live markers confirmed.
2. Task-first navigation pilot: implemented opt-in `nextStepsPlacement` for storage and log ingestion; all other pages retain default ordering. Extracted a shared recommendation component to prevent markup drift. Local 327 tests passed; type check covered 513 files with zero errors/warnings and six hints. Chrome at 1366px and 390px confirmed exactly one recommendation block, pilot ordering, unchanged EC2 ordering, and hydrated tools. Log-ingestion scenario save succeeded. Mobile testing identified intrinsic main-container sizing and a wide log scenario table; fixed container width and isolated table scrolling. Build/deployment status must still be verified for the final commit. Do not generalize the pilot without usage evidence.
3. Source-led guide refresh: ACR/Cloud Run pilot implemented. Official Microsoft SKU limits confirmed included GiB; Azure dynamic price retrieval failed, so the ACR worksheet uses explicitly invented teaching rates, not a current quote. Google pricing and billing-settings pages confirmed allocated resource-time, concurrency sharing and billing-account free-tier aggregation. Added a resource-unit example, not a claim of free allowance availability. Both pages disable inferred opening links; ACR tables scroll independently on mobile. No mass lastUpdated bump or claim of a complete provider-wide review. Local suite: 330 passing tests; check: 514 files, zero errors/warnings, six hints; build passed before final scroll-wrapper change and must be repeated for release.
4. Measurement/privacy review: establish what production actually sends before introducing events. Ask for GA4 settings rather than credentials.
5. AdSense reapplication: separate owner action after production and wider quality review, not automatic after one release. No guarantee of approval or growth.

## Do not do

- No mass noindex/deletion from zero-click counts.
- No framework/theme rewrite to disguise AI assistance.
- No repeated blanket FAQ/meta expansion.
- No paid traffic solely to meet an invented threshold.
- No claim that current changes caused a ranking improvement without comparison data.