# CDN Role Separation Design

## Goal

Deepen the generic CDN delivery-cost cluster so the bill-boundary page, provider comparison page, bandwidth-rate page, request-fee page, bandwidth-measurement page, and edge-vs-origin concept page each perform one clear editorial job instead of revisiting the same CDN cost story from slightly different angles.

Target pages:

- `src/pages/guides/cdn-costs.astro`
- `src/pages/guides/cdn-cost-comparison.astro`
- `src/pages/guides/cdn-cost-per-gigabyte.astro`
- `src/pages/guides/cdn-request-pricing.astro`
- `src/pages/guides/estimate-cdn-bandwidth-gb-per-month.astro`
- `src/pages/guides/origin-egress-vs-cdn-bandwidth.astro`

## Problem

The current CDN cluster is already useful, but the role boundaries are still blurry:

- `cdn-costs` already mixes bill boundaries, calculator routing, provider comparison hints, bandwidth inputs, request fees, and origin egress in one page
- `cdn-cost-comparison` is a valid provider comparison page, but it still re-explains broad CDN inputs that overlap with the bill-boundary page
- `cdn-cost-per-gigabyte` explains blended bandwidth pricing well, but it still risks feeling like a narrower version of the main CDN cost page
- `cdn-request-pricing` teaches request fees, yet it still needs stronger role-setting so it does not feel like another "CDN costs explained" page
- `estimate-cdn-bandwidth-gb-per-month` is a measurement workflow page, but it still needs stronger positioning as a unit-conversion and evidence page instead of a second pricing page
- `origin-egress-vs-cdn-bandwidth` explains an important distinction, but it still risks reading like a lightweight total-cost page instead of a concept clarifier

That overlap creates the same low-quality risk we have been removing elsewhere:

- several pages repeat bandwidth, requests, origin egress, cache hit rate, and $/GB without a strong reason for why this page exists
- users have to infer whether they are on the bill-boundary page, the provider comparison page, the rate page, the request-fee page, the measurement page, or the concept clarifier
- search engines can read the cluster as topic expansion without enough editorial separation

## Recommended Approach

Separate the cluster by the natural jobs this topic wants.

### 1. `cdn-costs` = CDN bill-boundary page

This page should answer:

- what belongs inside a realistic CDN delivery-cost model
- how edge bandwidth, request fees, and origin egress should stay as separate cost surfaces
- where users should go next if their real question is provider choice, bandwidth-rate math, request pricing, traffic measurement, or concept clarification

This page should feel like the "what exactly belongs inside the CDN delivery bill?" page.

### 2. `cdn-cost-comparison` = provider comparison page

This page should answer:

- how to compare two or more CDN providers with one normalized traffic profile
- what assumptions must stay constant before comparing totals
- when users should return to the bill-boundary page or the specialized rate/measurement pages

This page should feel like the "which CDN is cheaper for the same workload?" page.

### 3. `cdn-cost-per-gigabyte` = bandwidth-rate page

This page should answer:

- how to form a defensible blended $/GB rate from region mix, tiering, and discounts
- when per-GB is a good approximation and when it stops being enough
- when users should route to full comparison or request-fee pages

This page should feel like the "how do I model CDN bandwidth pricing per GB?" page.

### 4. `cdn-request-pricing` = request-fee page

This page should answer:

- how to define billable requests and convert monthly request volume into request fees
- when request pricing dominates the bill
- when users should route back to the bill-boundary page or bandwidth-measurement page

This page should feel like the "how do I model CDN request charges correctly?" page.

### 5. `estimate-cdn-bandwidth-gb-per-month` = bandwidth-measurement page

This page should answer:

- how to turn analytics, RPS plus response size, or Mbps into defensible monthly GB
- what unit mistakes break CDN estimates
- when users should route back to pricing pages after the traffic measurement is known

This page should feel like the "how do I measure CDN bandwidth in GB/month?" page.

### 6. `origin-egress-vs-cdn-bandwidth` = concept clarifier page

This page should answer:

- why origin egress and edge bandwidth are related but different cost surfaces
- how teams double-count or misclassify them
- when users should route back to the bill-boundary page or the bandwidth-measurement page

This page should feel like the "what is the difference between origin egress and CDN bandwidth?" page.

## Concrete Content Moves

### `cdn-costs`

- add explicit role-setting language that says this is the CDN bill-boundary page
- add a section that separates edge bandwidth, request fees, and origin egress as distinct cost surfaces
- route provider-choice questions to comparison, blended-rate questions to per-GB, request-fee questions to request pricing, traffic-measurement questions to the bandwidth estimator, and concept confusion to the edge-vs-origin clarifier

### `cdn-cost-comparison`

- add explicit "provider comparison page" positioning
- clarify that provider-specific comparison assumes the bill boundary is already understood
- route rate math to per-GB and request math to request pricing instead of reteaching them here

### `cdn-cost-per-gigabyte`

- add explicit "bandwidth-rate page" positioning
- clarify that this page does not cover request fees or the full delivery bill
- route full-model questions back to `cdn-costs`

### `cdn-request-pricing`

- add explicit "request-fee page" positioning
- clarify that this page does not replace bandwidth or origin-egress modeling
- route monthly request measurement helpers clearly

### `estimate-cdn-bandwidth-gb-per-month`

- add explicit "bandwidth-measurement page" positioning
- clarify that this page is for GB evidence, not full CDN pricing
- route bill-boundary and request-fee questions back to their dedicated pages

### `origin-egress-vs-cdn-bandwidth`

- add explicit "concept clarifier page" positioning
- clarify that this page is not the full CDN bill page
- route traffic-measurement questions to the estimator and total-model questions back to `cdn-costs`

## Success Criteria

- each page states its role in the CDN cluster clearly
- the six pages no longer feel interchangeable
- internal links become directional instead of repetitive
- a regression test can detect the new role-separation language
- `npm test`, `npm run check`, and `npm run build` remain green
