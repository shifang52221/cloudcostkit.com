# Pre-review risk sample: findings and release gates

## Scope

Read-only audit of production source formulas for throughput conversion, API payload transfer, flat/tiered egress, log ingestion/retention, replication and Kubernetes sizing; secondary inspection of database display units and node compute labels. This is not a full provider pricing certification, security audit or claim about Google's internal rejection cause.

The AdSense UI identifies low-value content, not the URLs below. These are our engineering quality gates, not published Google approval requirements. Do not resubmit merely because a test suite passes.

## Must resolve before our next quality sign-off

### B1: Decimal/binary conversion contracts are inconsistent

- `src/lib/calc/units.ts`: throughput uses Mbps (decimal megabits) but divides MB by 1024 to label GB. Executing production code with 8 Mbps, 100% usage, 24h/day, 30 days yields 2,531.25 GB; the decimal answer is 2,592 GB (2.34375% lower).
- `src/lib/calc/apiTransfer.ts` and its page use KB and GB but divide by 1024 twice. One million responses/day, 1 decimal KB, 30 days yields 28.6102294921875 instead of 30 GB. A binary interpretation requires explicit KiB/GiB, not ambiguous KB/GB labels.
- Related candidates: API Gateway, SES, SNS payload formulas; replication event helper; database GB/TB display and rate helpers. Their presence is verified in source; each consumer and provider-specific unit must be checked before changing formulas. Do not replace every 1024 globally: Kubernetes MiB/GiB and GB/GiB conversion legitimately use binary factors.
- Required fix: document each input/output unit, align formula, labels, page examples and downstream handoffs, preserve URL parameter compatibility, add production-formula boundary tests. Numeric defaults alone are not evidence of official current rates.

### B2: Kubernetes aggregate sizing can imply an impossible placement

`src/lib/calc/k8s.ts` sums CPU/memory then divides by allocatable node resources. For one Pod requesting 8 cores, a 4-core node and 90% allocatable, production code returns three nodes. No number of these nodes can fit that one Pod. Existing page FAQ already says the estimate is a floor and real packing can differ; the missing distinction is an impossible single-Pod fit, not total absence of scheduling disclaimers.

Required fix: explicit per-Pod CPU and memory fit checks, visible unschedulable status and no actionable node recommendation for that case. Also consider indivisible identical-Pod packing before calling a result sufficient. Check all shared consumers and peak cases; do not rewrite the scheduler as a new product.

### B3: Node utilization can be mistaken for a CPU billing discount

`src/components/calculators/KubernetesNodeCost.tsx` still labels a runtime multiplier Utilization (%), unlike the corrected shared compute entry. Required fix: clarify actual running share and prevent double reduction with hours/day. Audit presets for the same semantic intent. Keep saved parameter keys compatible.

## Sample calculations that passed

- Tiered egress: 300 GB; first 100 free, next 100 at $0.10, remaining at $0.05 => $15. Production result $15.
- Log model: 10 GB/day, 30 billing days, 30-day retention, $0.10 ingestion/GB and $0.06 storage/GB-month => $30 ingestion plus $18 steady-state storage = $48. Production result $48. This validates one steady-state example, not provider free allowances or first-month ramp behavior.
- Flat egress and replication production formulas apply nonnegative clamping and volume times input rate. Rate validity, destination storage and extra request charges still require explicit scope.

## Live basic route checks

During this audit, `/`, `/calculators/`, `/guides/`, `/privacy-policy/`, `/cookie-notice/`, `/terms/`, `/contact/`, `/robots.txt`, and `/ads.txt` all returned HTTP 200. This is not a full internal-link crawl or proof of Google crawler accessibility from every location.

## Separate configuration questions

- Initial page-view URL sanitization was verified in a production Chrome network capture. After the owner disabled history page views, changing a calculator input produced no additional analytics request in the observation window; share query parameters remained in the address bar.
- Default analytics consent was still denied; do not interpret observed analytics as complete audience measurement or claim legal compliance. Other enhanced-measurement switches were recommended but their final state was not confirmed.
- No AdSense reapplication, new tracking, index removal or production formula change is made by this audit document.

## Next bounded release

### Local implementation checkpoint (not deployed)

Release validation update: the shared number/boolean/string hooks now render defaults for SSR and first client render, restore URL/storage after mount, and gate persistence until restoration completes. Chrome confirmed URL number/boolean restoration, save, refresh, local restore and reset with no runtime exceptions. Added server/pre-effect render parity regression coverage. Final suite: 337 tests passed; production build passed; hook-change type check had zero errors/warnings and six hints. The formula/UI changes below are ready for bounded release; API Gateway/SES/SNS unit contracts remain open and are not globally replaced. This update supersedes the earlier local hydration hold below; retain that history to explain why publication waited.

Decimal throughput/API payload formulas, replication event helper, database GB/TB helpers and node runtime labels have local fixes. API page example is updated to 912 decimal GB for its defaults. Kubernetes now checks single-Pod fit and identical whole-Pod packing, returns null instead of a numeric recommendation for impossible placement, and displays a reason and next action. Zero-Pod and zero-request cases have tests. Existing URL keys are unchanged. 336 tests pass; type check: 517 files, zero errors/warnings and six hints; production build passes.

Chrome at 1366px and 390px on an independent development server confirms populated API controls, the impossible-Pod message and no page overflow. However, URL scenarios trigger React hydration errors because shared parameter hooks initialize from URL/storage on the first client render whereas SSR uses defaults. This pre-existing shared-hook issue is now directly observed, not resolved by the formula tests. An older concurrently used dev instance also had a React module-loading failure; a fresh instance restored controls. Do not equate an absent `ssr` attribute with successful hydration: validate actual input presence and capture exceptions. Hold release until the shared-hook initialization/read/write ordering is safely corrected and scenario/reset persistence is tested. No production push is made at this checkpoint.

Resolve B1 first with a small central unit contract and explicit compatibility notes, then B2/B3 with tests for impossible placement and runtime labels. Keep homepage and guide layouts stable while repairing these numerical issues. Review and deploy in separate commits; record browser, formula, build and live checks independently. Once these gates close, assess remaining page-level content risks rather than assuming engineering correctness guarantees AdSense approval.