# CloudCostKit

Cloud cost & capacity calculators (Astro + TypeScript) designed for:

- AdSense compliance (privacy/cookie pages, consent gating, ads.txt)
- Strong SEO (clean URLs, canonical, sitemap, robots, OG)
- Low maintenance (mostly client-side calculators)
- Cloudflare Pages deployment (Astro Cloudflare adapter)
- Review-safe monetization defaults (ads stay off until explicitly enabled)

## Local dev

```bash
npm install
npm run dev
```

## Environment variables

Copy `.env.example` to `.env` and set:

- `PUBLIC_SITE_URL` (required for correct canonical + sitemap)
- `PUBLIC_CONTACT_EMAIL`
- AdSense vars (`PUBLIC_ENABLE_ADS`, client, per-placement flags, slots, and optional publisher id)

## Ad review-safe defaults

Ads are opt-in.

- `PUBLIC_ENABLE_ADS=false` keeps AdSense and Funding Choices scripts off.
- Each placement also has its own flag such as `PUBLIC_ENABLE_ADS_HOME_MID=false`.
- This is the recommended posture while the site is still being prepared for AdSense review.

To enable ads later, set:

- `PUBLIC_ENABLE_ADS=true`
- the placement flag you want to render
- the matching slot id

## Build

```bash
npm run build
npm run preview
```

## Cloudflare Pages

- Build command: `npm run build`
- Build output directory: `dist`
- Add env vars from `.env.example` in Pages project settings.
- Optional (recommended): create a KV namespace and bind it as `SESSION` to match the Cloudflare adapter's session binding.

## Post-deploy verification

Run this after deployment:

```bash
npm run verify:live
```

Default behavior checks:

- homepage and trust routes return `200`
- representative pages do not expose AdSense script or ad containers

Useful overrides:

```bash
SITE_URL=https://cloudcostkit.com npm run verify:live
EXPECT_NO_ADS=false SITE_URL=https://cloudcostkit.com npm run verify:live
```
