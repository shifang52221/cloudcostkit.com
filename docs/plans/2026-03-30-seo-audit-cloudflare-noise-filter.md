# SEO Audit Cloudflare Noise Filter Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Remove the remaining Cloudflare email-protection false positive from the SEO audit without weakening the rest
of the crawler.

**Architecture:** Extract internal-link helper logic from `scripts/seo-audit.mjs` into a small testable module, then
add a targeted rule that ignores `/cdn-cgi/` infrastructure paths during same-site link extraction.

**Tech Stack:** Node ESM, existing SEO audit script, Node built-in test runner

---

### Task 1: Record the design and add the failing regression test

**Files:**
- Create: `docs/plans/2026-03-30-seo-audit-cloudflare-noise-filter-design.md`
- Create: `docs/plans/2026-03-30-seo-audit-cloudflare-noise-filter.md`
- Create: `tests/seo-audit-links.test.mjs`

**Step 1: Write the failing test**

Create a Node built-in test that expects internal-link extraction to ignore:

- fragment links
- `mailto:` links
- Cloudflare `/cdn-cgi/l/email-protection` links

while still keeping normal same-site page links.

**Step 2: Run test to verify it fails**

Run: `node --test tests/seo-audit-links.test.mjs`
Expected: FAIL because the helper module does not exist yet or still includes `/cdn-cgi/` links.

### Task 2: Extract the helper and implement the minimal filter

**Files:**
- Create: `scripts/lib/seo-audit-links.mjs`
- Modify: `scripts/seo-audit.mjs`

**Step 1: Move link helper logic into a small module**

Extract the URL normalization, same-site check, and internal link extraction logic into a helper file that the test can
import directly.

**Step 2: Add the Cloudflare filter**

Ignore normalized same-site URLs whose pathname starts with `/cdn-cgi/`.

**Step 3: Keep the rest of the crawler behavior unchanged**

Do not broaden the ignore rules beyond the current evidence.

### Task 3: Verify the audit is clean

**Files:**
- Review: `scripts/lib/seo-audit-links.mjs`
- Review: `scripts/seo-audit.mjs`
- Review: `tests/seo-audit-links.test.mjs`
- Review: `docs/plans/2026-03-30-seo-audit-cloudflare-noise-filter-design.md`
- Review: `docs/plans/2026-03-30-seo-audit-cloudflare-noise-filter.md`

**Step 1: Run the focused regression test**

Run: `node --test tests/seo-audit-links.test.mjs`
Expected: PASS

**Step 2: Run full repo test coverage**

Run: `npm test`

**Step 3: Run the live SEO audit**

Run: `npm run audit:seo`
Expected: the newest summary shows `Issues: 0`

**Step 4: Commit cleanly**

Commit docs separately from implementation, push `thin-page-triage`, open the compare URL, then verify `origin/main`
and the fresh audit output after merge.
