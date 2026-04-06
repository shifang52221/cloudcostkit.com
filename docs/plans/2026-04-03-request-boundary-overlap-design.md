# Request Boundary Overlap Design

## Why this batch exists

- The largest remaining “review-risk” cluster per the page priority matrix is the request-boundary overlap: a parent guide (`requests-costs`), a support guide (`request-based-pricing`), and two tiny calculators (`api-request-cost-calculator`, `rps-to-monthly-requests-calculator`).
- These URLs live in Layer A, and their thin, overlapping storytelling still helps the site look mass-produced even though other clusters have been strengthened.
- This batch governs their future: either the parent guide keeps the role, the support guide becomes the calculator router, or the helpers are de-emphasized/noindexed. The batch must be bounded (4 pages) so we can merge one topical set per governance checklist.

## Batch goal

Perform a deep role split between the request parent guide and the support guide, then clarify how the calculators tie into that split. Each page must say exactly what job it does:

1. `requests-costs`: define the full request boundary, explain what counts as billable requests, and route to the calculators for precise counting.
2. `request-based-pricing`: focus on converting request counts into pricing, with explicit callouts to units (per-10k, per-1M) and a checklist for when to price requests.
3. `api-request-cost-calculator`: keep it as the quick unit mapper that turns RPC patterns into monthly request counts, but only link up to the parent guide’s boundary definition afterward.
4. `rps-to-monthly-requests-calculator`: remain the latency-to-volume helper, but surface the clarifying assumption that this feeds into `api-request-cost-calculator` and only the parent guide touches the actual billing story.

## Risk removed

- Overlap risk: two guides currently repeat the same request math, confusing users and reviewers.
- Thin-utility risk: standalone calculators could be seen as template multiplication if they lack directional routing to the parent boundary.
- Governance risk: not having a batch-level plan would leave the working set feeling random; this design spells out the actions.

## Next round scope

- No more than four files: the two guides plus the two calculators. No site-wide patterns or unrelated hubs change in this round.
- Updates include: clarified role statements, directional internal links, and explicit handoffs between the boundary guide, the pricing guide, and the helper calculators.
