# Trust Parity And Ad Density Remediation Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Reduce AdSense review risk by making ads opt-in, tightening live trust-route verification, and documenting the safer deployment workflow.

**Architecture:** Keep the current Astro layouts and ad components, but move ad activation behind explicit environment flags and add a live verification script that checks trust routes and representative page monetization exposure after deployment. Update docs and env examples so review-safe behavior is the default path.

**Tech Stack:** Astro, TypeScript/ESM scripts, Cloudflare Pages deployment

---

### Task 1: Add explicit ad gating in config and components

**Files:**
- Modify: `src/config/site.ts`
- Modify: `src/components/AdSenseScript.astro`
- Modify: `src/components/FundingChoicesScript.astro`
- Modify: `src/pages/ads.txt.ts`

**Step 1: Make ads opt-in**

Add explicit flags so ads do not load just because client or slot ids exist.

**Step 2: Keep publisher output honest**

Stop using a misleading fallback publisher id when no real AdSense identity is configured.

### Task 2: Add live verification workflow

**Files:**
- Create: `scripts/verify-live-site.mjs`
- Modify: `package.json`

**Step 1: Verify trust routes**

Check live status codes for homepage and trust pages.

**Step 2: Verify monetization exposure**

Check representative pages for AdSense script and ad container presence so review-safe expectations can be enforced.

### Task 3: Document safer deployment defaults

**Files:**
- Modify: `README.md`
- Modify: `.env.example`
- Modify: `docs/plans/2026-03-27-trust-parity-ad-density-remediation-design.md`
- Modify: `docs/plans/2026-03-27-trust-parity-ad-density-remediation.md`

**Step 1: Document ad review mode**

Explain that review-safe operation keeps ads disabled until explicitly enabled.

**Step 2: Document live verification**

Add the command operators should run after deployment to catch route drift and unwanted ad exposure.

### Task 4: Re-audit and verify

**Files:**
- Modify: `src/config/site.ts`
- Modify: `src/components/AdSenseScript.astro`
- Modify: `src/components/FundingChoicesScript.astro`
- Modify: `src/pages/ads.txt.ts`
- Create: `scripts/verify-live-site.mjs`
- Modify: `package.json`
- Modify: `README.md`
- Modify: `.env.example`

**Step 1: Re-audit encoding**

Run:

`rg -n "[^\x00-\x7F]" src/config/site.ts src/components/AdSenseScript.astro src/components/FundingChoicesScript.astro src/pages/ads.txt.ts scripts/verify-live-site.mjs README.md .env.example docs/plans/2026-03-27-trust-parity-ad-density-remediation-design.md docs/plans/2026-03-27-trust-parity-ad-density-remediation.md`

Expected: no matches.

**Step 2: Run full project verification**

Run: `npm run check`
Expected: pass with no new errors.

Run: `npm run build`
Expected: successful production build.
