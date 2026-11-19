# Budget accuracy release: scope and evidence

## Business objective

Keep CloudCostKit a low-maintenance, ad-supported cloud planning resource. Do not turn a small site into a live pricing database or a subscription product merely to address AdSense review. Ownership verification passed; the supplied AdSense screenshot identifies low-value content. Neither AI authorship nor the framework is established as a rejection cause.

## Evidence and limits

- The supplied Search Console export covers 2026-08-16 through 2026-11-15: 131 clicks and 50,643 impressions. These are search figures, not site sessions or advertising revenue.
- Storage is the highest-click page in that export (14 clicks). The small sample justifies a bounded improvement, not a revenue forecast.
- The review screenshot shows a July date, but no column heading establishing its meaning. Local commit dates do not establish what Google reviewed or when production deployed.
- Zero-click pages are not automatically deletion/noindex candidates. Search results and AdSense are separate assessments.

## Changes in this release

1. Shared object-storage calculator: decimal GB-to-TB helper, explicit unit/rate consistency guidance, and a storage-plus-requests subtotal label. Egress and other omitted charges are explicitly excluded.
2. Storage entry page: reproducible illustrative baseline ($164.50) and double-download ($209.50) examples. Rates are not presented as current provider quotes. Two independent calculator islands still do not supply an automatic combined total; this is stated visibly.
3. Shared compute calculator: replace ambiguous Utilization label with running share of scheduled hours. Explain that CPU utilization is not a billing discount and that runtime must not be reduced twice. Existing URL parameter names and numeric behavior are preserved.
4. EC2 metadata: describe actual inputs and exclusions rather than search keyword targeting.
5. ACR FAQ: align the starting charge with the tier daily fee and included storage; do not imply that each image pull necessarily has a per-request fee. No new rate or unverified provider quote is introduced.

Shared components affect other pages too; this is intentional scope clarification, not a change to their stored inputs or pricing formulas.

## Validation

- `node --test`: 324 tests passed after the changes, including production storage/compute formula checks and scope-label regressions.
- Type check: 511 files, zero errors, zero warnings, six hints. Production build passed.
- Chrome desktop (1366px) and mobile (390px): storage islands hydrated, decimal helper and worked example rendered. The existing mobile header expanded layout to 557px; constraining the header container restored a 390px layout. The worked-example table has a keyboard-focusable horizontal-scroll region.
- Chrome interaction: setting compute hours/day to 8 produced $262.66 with the default six instances and $0.18/hour. No assertion is made that every calculator control was browser-tested.
- Post-deploy verification is separate from these local checks.
- No URL, canonical, robots setting, advertising switch, or redirect is changed by this batch.
- Publication review dates are not bumped automatically: this release is not a claim of fresh provider-wide rate verification.

## Next decision, not automatic expansion

Verify real visitor task completion on storage before copying the workflow across clusters. Confirm existing analytics and consent behavior before adding anonymous task events; do not send prices, estimates, credentials, or billing exports to analytics. Prioritize a small number of stable estimation workflows over broad pricing-page production.

AdSense reapplication is a separate action after production verification and wider shared-component review. This batch does not guarantee approval, rankings, or revenue. Do not remove/noindex pages simply because of low clicks.