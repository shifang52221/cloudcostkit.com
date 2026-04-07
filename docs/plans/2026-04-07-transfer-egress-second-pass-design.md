# Transfer Egress Second Pass Design

## Why this round exists

The first transfer-boundary round already introduced explicit role labels:

- `network-transfer-costs` says it is the transfer boundary page
- `egress-costs` says it is the egress decision and billing page

That was a necessary first step, but the live pages still overlap too much in the reader experience.

The current online risk is not "missing role statements." The current online risk is:

- both pages still repeat the same transfer taxonomy too heavily
- both pages still feel too calculator-forward in the first screen
- both pages still make the reader work too hard to understand which page should be read first
- both pages still route to very similar next-step tools and adjacent guides

For review quality, search quality, and user experience, this second pass needs to reduce live overlap rather than merely add more wording.

## Review method for this round

This round is based on the live site, not only local source files.

The pair was compared online by:

- title and H1
- first-screen promise
- first CTA block
- first three major sections
- related guides and related calculators blocks

The resulting conclusion is:

- `network-transfer-costs` should become more clearly navigational and classification-oriented
- `egress-costs` should become more clearly diagnostic and AWS-billing-oriented
- the shared guide-layout calculator assist is currently making the first screen feel more similar than the page bodies alone would suggest

## Intended user experience

### `network-transfer-costs`

This page should feel like:

- the first stop when the reader still needs to classify the transfer boundary
- a broad but practical map that helps the reader avoid choosing the wrong rate model
- a routing page that points readers toward the right next guide or calculator after classification

It should not feel like a second AWS egress estimator article.

### `egress-costs`

This page should feel like:

- the first stop when the reader already suspects the bill is an AWS outbound transfer charge
- a decision page for understanding which AWS egress line item is actually being modeled
- a diagnostic page for pricing interpretation, billing usage type checks, and spike investigation

It should not repeat the full transfer-boundary taxonomy in the same broad structure as the parent page.

## Design direction

Choose a sharper split:

- `network-transfer-costs` owns classification, routing, and transfer-path framing
- `egress-costs` owns AWS egress diagnosis, pricing interpretation, and next-step billing decisions

This round therefore needs one small layout-level capability:

- allow guide pages to override or disable the default calculator-first opening assist without changing the experience for the rest of the site

## Specific content adjustments

### Changes for `network-transfer-costs`

Strengthen the first-screen experience so it says:

- this page is for classification before pricing
- use it when the transfer path is still unclear
- after the path is identified, move to the narrowest relevant calculator or guide

Reduce the calculator-first feel by disabling the shared top-of-page calculator assist for this page and replacing it with a clearer "pick your path first" flow inside the page content.

Add a short directional section that groups next steps by boundary:

- internet egress
- CDN edge versus origin
- cross-region
- cross-AZ

This makes the parent page more useful as a route selector and less like a second pricing explainer.

### Changes for `egress-costs`

Tighten the opening experience so it says:

- this page is for AWS outbound transfer charges once the reader already suspects egress is involved
- the real task is to identify which AWS bill surface is in play
- if the reader cannot tell whether the path is internet, cross-AZ, cross-region, or origin-to-CDN, the reader should return to the boundary guide first

Replace some of the repeated taxonomy structure with more AWS-specific decision support:

- what to check in billing usage types or charge categories
- how to separate internet egress from cross-AZ and cross-region billing paths
- how to investigate spikes

Keep the top-of-page assist on this page, but make it more AWS-specific so it feels like a billing-decision shortcut rather than a generic calculator block.

This should make the page feel more operational and less like a broad taxonomy page.

## Test strategy

The existing regression test already proves first-pass role statements.

This round should extend the same test so it checks live-intent-oriented differentiation:

- `GuideLayout` supports a page-level override for the calculator-first opening assist
- `network-transfer-costs` disables the shared top-of-page calculator assist
- `network-transfer-costs` explicitly positions itself as the page to use before pricing when the path is unclear
- `network-transfer-costs` groups next steps by transfer boundary
- `egress-costs` explicitly positions itself as the page for AWS egress pricing or billing decisions
- `egress-costs` includes AWS-specific diagnosis language such as billing usage type checks or spike investigation

The test should still avoid brittle exact-copy matching where possible.

## Success standard

This round is successful when a live reader can tell within the first screen:

- which page to read first
- when to move to the other page
- what specific next action to take

It is also successful when the middle sections stop feeling like two versions of the same article.
