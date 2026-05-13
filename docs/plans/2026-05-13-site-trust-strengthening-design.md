# Site Trust Strengthening Design

**Problem**

CloudCostKit already has a real trust surface, but the current site-level signals are still lighter than they should be for a carefully reviewed estimation site. The human-readable trust pages exist, yet the machine-readable organization layer and the explicit "who / how / why" framing can still be strengthened.

Google's official guidance is most useful here when interpreted narrowly:

- helpful content guidance emphasizes making it clear who created the content, how it was created, and why it exists
- organization structured data guidance recommends exposing as much valid organization detail as is appropriate so Search can understand site identity and maintenance responsibility

**Decision**

Strengthen the site's trust skeleton before more page-by-page SEO work. This batch will focus on organization identity, homepage trust routing, methodology/editorial clarity, and correction responsibility.

**Scope**

- `src/config/site.ts`
- `src/layouts/BaseLayout.astro`
- `src/pages/index.astro`
- `src/pages/about.astro`
- `src/pages/methodology.astro`
- `src/pages/editorial-policy.astro`
- `src/pages/contact.astro`
- new regression tests for site trust signals

**What this batch should improve**

1. Stronger organization-level structured data and site identity.
2. Clearer homepage explanation of who maintains the site, how pages are reviewed, and why the workflows exist.
3. More explicit maintenance and correction standards on trust pages.
4. A tighter trust path that feels like an operating standard, not a vague SEO reassurance layer.

**What this batch should avoid**

- generic "we are trustworthy" filler
- unsupported authority claims
- fake expert bios or invented credentials
- overloading every page with repeated trust boilerplate

**Expected outcome**

After this batch, the site should present a clearer, more reviewable identity to both users and search systems, while preserving the site's existing "independent estimation workflow" voice.
