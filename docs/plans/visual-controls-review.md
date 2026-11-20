# Shared control styling review

## Observed and corrected

- Primary link buttons used near-black text over a translucent green surface on a dark background. Screenshot and computed styles confirmed poor legibility. Primary normal state now uses opaque #a3ff12 with #0a0e16 text; hover uses #b6ff45. This is a targeted control contrast change, not a full palette certification.
- Anchor buttons inherited 16px prose typography and underline, whereas native buttons inherited browser 13.333px typography. Contact controls inherited different line heights. Shared controls now use inherited family, 14px font, 1.4 line height, no underline, and retain 44px minimum height and keyboard focus treatment.
- Checkbox inputs inherited 100% width (observed 147px/278px footprints), pushing labels away. Checkbox/radio dimensions are now 18px with non-growing flex basis and a theme accent. This does not claim a 44px checkbox hit target on every existing wrapper.
- Calculator/form grid tracks now have zero minimums; panels and fields can shrink. Primary hero grid rows equalize wrapped button heights.
- Storage's older scenario comparison table overflowed 3px at a 320px viewport. A keyboard-focusable independent scroll region contains it; no global overflow hiding is used.

## Validation scope

Chrome inspected homepage, storage, log ingestion and contact at 1366, 768, 390 and 320px. Button metrics normalize to 14px/19.6px and tested single-line controls measure 44px. Checkboxes measure 18x18px. After the final table fix, storage scroll width equals 320px at 320px. Before/after screenshot reviewed for mobile homepage. 339 automated tests pass and production build succeeds. This is a representative shared-style audit, not a screenshot review of all 289 source pages or every browser/platform.

No calculation logic, URL, indexing or analytics behavior changes in this release.

## Dark reading refinement

Retained dark color scheme and primary green controls; changed the near-black base to #0b1018 and reading cards to opaque #121b28/#162131, reduced decorative gradient opacity, and brightened muted text to #bbc6dc. Prose line height is 1.75, direct paragraphs have a 78ch maximum, hints use 13px/1.5, plain prose tables have readable cells/headers, and KPI numbers use tabular numerals and wrapping. No light-mode switch was introduced.

344 tests passed, including >=4.5:1 contrast checks for text/muted against all three opaque base surfaces (not an exhaustive accessibility certification). Build passed. Chrome checked two guides at desktop/390px and homepage/storage/log/contact at 1366/768/390/320px (16 cases); no document overflow in those cases. Mobile homepage screenshot reviewed. Existing navigation scrolls horizontally on mobile; no claim is made that all pages or all focus/hover states were visually audited.