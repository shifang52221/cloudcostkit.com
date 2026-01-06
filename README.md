# CloudCostKit

Cloud cost & capacity calculators (Astro + TypeScript) designed for:

- AdSense compliance (privacy/cookie pages, consent gating, ads.txt)
- Strong SEO (clean URLs, canonical, sitemap, robots, OG)
- Low maintenance (mostly client-side calculators)
- Cloudflare Pages deployment (Astro Cloudflare adapter)

## Local dev

```bash
npm install
npm run dev
```

## Environment variables

Copy `.env.example` to `.env` and set:

- `PUBLIC_SITE_URL` (required for correct canonical + sitemap)
- `PUBLIC_CONTACT_EMAIL`
- AdSense vars (`PUBLIC_ADSENSE_CLIENT`, slots, and optional publisher id)

## Build

```bash
npm run build
npm run preview
```

## Cloudflare Pages

- Build command: `npm run build`
- Build output directory: `dist`
- Add env vars from `.env.example` in Pages project settings.
- Optional (recommended): create a KV namespace and bind it as `SESSION` to match the Cloudflare adapter’s session binding.
