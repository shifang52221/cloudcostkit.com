# Homepage Guide Signal Fix Design

## Why this exists

The homepage still gives prominent guide-card placement to:

- `/guides/azure/`
- `/guides/gcp/`

Both pages were intentionally demoted to `noindex,follow` during the thin-page cleanup. Leaving them in a primary
homepage guide section creates a mixed signal:

- site-wide navigation still treats them like important landing pages
- indexing strategy says they should not be treated like important landing pages
- the homepage loses an opportunity to surface stronger, more specific, indexable guide content

For quality review and AdSense perception, this is not just an SEO issue. It makes the site look less editorially
intentional because a top-level entry point is still routing users into pages we already decided were not strong enough
to index.

## Options considered

### Option 1: Leave the cards in place

Pros:

- zero implementation work

Cons:

- keeps homepage signals inconsistent with sitemap and robots strategy
- wastes premium homepage placement on pages we do not want indexed
- weakens the site's editorial quality posture

### Option 2: Remove the cards and leave fewer guide entries

Pros:

- eliminates the signal conflict
- very small change

Cons:

- makes the homepage guide section feel thinner
- removes useful navigation without replacing it with stronger paths

### Option 3: Replace the two cards with stronger indexable guide pages

Pros:

- resolves the signal conflict cleanly
- improves homepage quality by promoting deeper, more specific content
- aligns with the guide hub's current high-interest guide emphasis

Cons:

- requires small content curation decisions

## Recommended approach

Choose Option 3.

Replace the two demoted provider-hub cards with two concrete guide pages that already fit the site's higher-opportunity
guide strategy:

- `/guides/gcp-cloud-run-pricing/`
- `/guides/azure-container-registry-pricing/`

These targets are stronger because they are:

- indexable
- specific to real pricing questions
- closer to calculator-ready decision making
- less template-like than a generic provider hub

## Final design

### Scope

Only modify:

- `src/pages/index.astro`

Add design and implementation notes under `docs/plans/`.

### Content changes

In the homepage `Guides` card grid:

- replace the Azure provider hub card with an Azure Container Registry pricing card
- replace the GCP provider hub card with a GCP Cloud Run pricing card

### Content style

The new cards should:

- speak in operational or budgeting language
- describe what the page helps estimate or validate
- avoid generic provider-directory phrasing

### Success standard

This fix is successful when:

- the homepage no longer promotes `noindex,follow` guide hubs
- homepage navigation is more aligned with the current indexed guide strategy
- the guide section feels more specific and less template-like
- the page still builds cleanly with no encoding issues
