# Fourth Page Quality Batch Design

**Problem**

The current site already has stronger trust signals and better first-screen framing on several near-page-one guides, but a few calculator and support pages still read more like generic tools than sharp entry pages even though they already have meaningful impressions:

- Object storage cost calculator
- Log cost calculator
- Storage replication cost calculator
- AWS S3 Glacier pricing

These pages are not weak, but their meta descriptions and opening framing can still be improved so searchers understand the bill-shape decision faster and so the pages feel less templated in snippets.

**Decision**

Run a fourth narrow page-quality batch focused on calculator/support entry quality rather than broader guide rewrites.

**Approach**

1. Keep each page's current role intact.
2. Strengthen descriptions and first-screen framing so each page names the main bill-shape split earlier.
3. Focus on pages that already have impressions and can benefit from better snippet clarity.
4. Avoid broad structural rewrites or feature additions.

**Pages in this batch**

- `src/pages/calculators/object-storage-cost-calculator.astro`
- `src/pages/calculators/log-cost-calculator.astro`
- `src/pages/calculators/storage-replication-cost-calculator.astro`
- `src/pages/guides/aws-s3-glacier-pricing.astro`

**Expected outcome**

These pages should present a clearer “what kind of bill is this really?” signal in both search snippets and the first screen, while preserving the calculator/guide roles already supported by the site architecture.
