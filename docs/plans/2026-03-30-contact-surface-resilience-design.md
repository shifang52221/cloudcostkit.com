# Contact Surface Resilience Design

## Why this change exists

The contact surface currently depends too heavily on environment-specific behavior:

- the browser must execute JavaScript correctly
- Cloudflare email obfuscation must decode the protected link
- the operating system must have a working `mailto:` handler

When any one of those layers fails, a user can land on a valid trust page and still feel that contact is broken.
That is a trust problem for real users and a quality problem for review systems.

## Scope of this change

This change covers the site's trust-facing contact entry points:

- `src/pages/contact.astro`
- `src/pages/about.astro`
- `src/pages/editorial-policy.astro`
- `src/pages/privacy-policy.astro`
- `src/pages/terms.astro`
- `src/pages/cookie-notice.astro`
- `src/pages/index.astro`

It also adds one reusable component and one small helper module so the behavior stays consistent instead of drifting page
by page.

## Problem pattern

The current pattern is too thin:

- a page says "Email us"
- the user clicks
- success depends on several external systems the site does not control

That means the page fails the "can a normal user still reach us when one layer misbehaves?" test. For trust pages, the
site should provide a visible fallback that still works even if the email client does not launch.

## Options considered

### Option 1: Keep `mailto:` only

Pros:

- simplest code
- no extra UI

Cons:

- still fails when system email handling is broken
- still looks broken to users when Cloudflare or browser behavior differs

### Option 2: Build a reusable contact card with visible email text, mail app action, and copy action

Pros:

- contact remains usable even when `mailto:` does not open
- trust pages become more explicit and more user-friendly
- behavior stays consistent across the site's governance pages

Cons:

- requires a small shared component and supporting styles

### Option 3: Replace email with a hosted contact form

Pros:

- strongest fallback for users
- no dependency on local email clients

Cons:

- requires delivery infrastructure, anti-spam handling, privacy review, and operational monitoring
- too large for the current remediation pass

## Recommended approach

Choose Option 2.

This is the smallest change that materially improves reliability. The site keeps the familiar `mailto:` path for users
who want it, but it also exposes the address as readable text and gives users a copy action that does not rely on the
system mail app.

## Final design

### Reusable contact surface

Add a shared component that renders:

- a small label that explains what the actions are for
- a readable email address in visible text
- an `Open email app` action using `mailto:`
- a `Copy email` action with a simple success state
- fallback helper text that explains the copy path if the email app does not open

The visible text is the real resilience layer. Even if JavaScript fails, the user can still see the address and copy it
manually.

### Content behavior

The component should support compact and full variants:

- full variant for `contact.astro`
- compact variant for secondary trust pages and homepage trust copy

The wording should stay practical and non-promotional. This is a trust utility, not a marketing CTA.

### JavaScript behavior

The copy action should be progressive enhancement only:

- if `navigator.clipboard.writeText` exists, copy the address and show a short success message
- if clipboard support is unavailable, keep the visible email text in place so the user can copy it manually

The component should not require hydration through a framework runtime. A tiny inline script is enough.

### Styling direction

Reuse the current site visual language:

- same card / button family
- no special font or layout reset
- clear spacing so the card reads as operational help, not as an ad unit or promo block

### Verification strategy

Because the repo does not currently ship a test runner, add a minimal Node built-in test for the helper module. That
locks down:

- visible email text generation
- `mailto:` target generation
- compact / full copy strings

Then verify the integrated pages with:

- source scan for shared component usage
- `npm run check`
- `npm run build`

## Success criteria

This change is successful when:

- every trust-facing contact entry point exposes a readable email address, not just a click target
- users still have a copy path even if `mailto:` handling is broken locally
- the homepage and trust pages use one shared component instead of drifting snippets
- touched files remain ASCII-only and the site still passes `check` and `build`
