# Contact Surface Resilience Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make the site's trust-facing contact entry points usable even when `mailto:` handling or Cloudflare email
obfuscation behavior does not help the user.

**Architecture:** Add one small contact-surface helper and one reusable Astro component, then replace repeated "Email
us" snippets across trust pages with the shared component. Keep visible email text as the resilient fallback and use a
small inline script only for copy-to-clipboard enhancement.

**Tech Stack:** Astro pages and components, small ESM helper module, Node built-in test runner, existing global CSS

---

### Task 1: Record the design and create the helper test

**Files:**
- Create: `docs/plans/2026-03-30-contact-surface-resilience-design.md`
- Create: `docs/plans/2026-03-30-contact-surface-resilience.md`
- Create: `src/lib/contact-surface.js`
- Create: `tests/contact-surface.test.mjs`
- Modify: `package.json`

**Step 1: Write the failing test**

Create a Node built-in test that expects a helper to return:

- the visible email text
- the `mailto:` href
- variant-specific helper copy for compact and full contact surfaces

**Step 2: Run test to verify it fails**

Run: `node --test tests/contact-surface.test.mjs`
Expected: FAIL because `src/lib/contact-surface.js` does not exist yet.

**Step 3: Write minimal helper implementation**

Add `buildContactSurface(email, options)` that returns the exact display data the Astro component needs.

**Step 4: Run test to verify it passes**

Run: `node --test tests/contact-surface.test.mjs`
Expected: PASS

**Step 5: Add project test script**

Add a minimal `test` script in `package.json` so the helper test can be rerun consistently.

### Task 2: Build the shared contact component

**Files:**
- Create: `src/components/ContactSurface.astro`
- Modify: `src/styles/global.css`

**Step 1: Render the resilient contact card**

Use the helper output to render:

- visible email text
- `Open email app` button
- `Copy email` button
- compact / full helper text

**Step 2: Add progressive enhancement copy behavior**

Use a tiny inline script that:

- listens only inside the rendered component
- copies the visible email value when possible
- updates a local status message without changing layout drastically

**Step 3: Style the component**

Add styles that fit the existing trust-page visual language and remain readable on mobile.

### Task 3: Replace repeated trust-page contact snippets

**Files:**
- Modify: `src/pages/contact.astro`
- Modify: `src/pages/about.astro`
- Modify: `src/pages/editorial-policy.astro`
- Modify: `src/pages/privacy-policy.astro`
- Modify: `src/pages/terms.astro`
- Modify: `src/pages/cookie-notice.astro`
- Modify: `src/pages/index.astro`

**Step 1: Replace ad-hoc contact links with the shared component**

Use the full variant on `contact.astro` and the compact variant on the other trust-facing pages.

**Step 2: Keep surrounding copy page-specific**

Do not flatten all trust pages into one repeated sentence. Preserve each page's context around the contact module.

### Task 4: Verify and commit cleanly

**Files:**
- Review: `docs/plans/2026-03-30-contact-surface-resilience-design.md`
- Review: `docs/plans/2026-03-30-contact-surface-resilience.md`
- Review: `src/lib/contact-surface.js`
- Review: `tests/contact-surface.test.mjs`
- Review: `src/components/ContactSurface.astro`
- Review: `src/styles/global.css`
- Review: `src/pages/contact.astro`
- Review: `src/pages/about.astro`
- Review: `src/pages/editorial-policy.astro`
- Review: `src/pages/privacy-policy.astro`
- Review: `src/pages/terms.astro`
- Review: `src/pages/cookie-notice.astro`
- Review: `src/pages/index.astro`
- Review: `package.json`

**Step 1: Run source and ASCII audits**

Run:

- `rg -n "Email us" src/pages/contact.astro src/pages/about.astro src/pages/editorial-policy.astro src/pages/privacy-policy.astro src/pages/terms.astro src/pages/cookie-notice.astro src/pages/index.astro src/components/ContactSurface.astro`
- `rg -n "[^\x00-\x7F]" src/lib/contact-surface.js tests/contact-surface.test.mjs src/components/ContactSurface.astro src/styles/global.css docs/plans/2026-03-30-contact-surface-resilience-design.md docs/plans/2026-03-30-contact-surface-resilience.md`

**Step 2: Run project verification**

Run:

- `npm test`
- `npm run check`
- `npm run build`

**Step 3: Commit cleanly**

Commit docs separately from implementation, push `thin-page-triage`, open the compare URL, then verify `origin/main`
and live trust pages after merge.
