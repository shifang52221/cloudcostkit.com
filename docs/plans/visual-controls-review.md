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