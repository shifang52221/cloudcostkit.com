# Security Governance Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Strengthen the security guide cluster so the parent page owns cross-system budgeting while the WAF, KMS, and Secrets Manager pages own their narrower bill boundaries.

**Architecture:** Treat the security parent plus three specialist guides as one bounded batch. Add a targeted regression test for role separation, then make minimal but explicit first-screen and routing changes so the parent page stays broad and the specialist pages stay intentionally narrower.

**Tech Stack:** Astro guide pages, Node test runner, Markdown planning docs, verification through `npm run check` and `npm run build`.

---

### Task 1: Write the failing regression test

**Files:**
- Create: `tests/security-role-separation.test.mjs`
- Read: `src/pages/guides/security-costs.astro`
- Read: `src/pages/guides/aws-waf-pricing.astro`
- Read: `src/pages/guides/aws-kms-pricing.astro`
- Read: `src/pages/guides/aws-secrets-manager-pricing.astro`

**Step 1:** Write a test that loads the four guide files, normalizes whitespace, and asserts:

- `security-costs` declares itself as the security system budgeting parent page
- `aws-waf-pricing` declares itself as the AWS WAF bill-boundary page
- `aws-kms-pricing` declares itself as the AWS KMS request and key-boundary page
- `aws-secrets-manager-pricing` declares itself as the Secrets Manager bill-boundary page
- the three specialist pages route readers back to `security-costs` when the broader system question is still unclear

**Step 2:** Run `node --test tests/security-role-separation.test.mjs`.

Expected: FAIL because the explicit role statements do not yet exist.

### Task 2: Implement the role split

**Files:**
- Modify: `src/pages/guides/security-costs.astro`
- Modify: `src/pages/guides/aws-waf-pricing.astro`
- Modify: `src/pages/guides/aws-kms-pricing.astro`
- Modify: `src/pages/guides/aws-secrets-manager-pricing.astro`

**Step 1:** In `security-costs.astro`, add a first-screen role statement that explicitly frames the page as the security system budgeting parent page.

**Step 2:** In `security-costs.astro`, tighten the routing language so it clearly sends readers into WAF, KMS, or Secrets Manager pages only after the broader security cost shape is clear.

**Step 3:** In `aws-waf-pricing.astro`, add a role statement that frames the page as the AWS WAF bill-boundary page and points unresolved cross-security questions back to `security-costs`.

**Step 4:** In `aws-kms-pricing.astro`, add a role statement that frames the page as the AWS KMS request and key-boundary page and points unresolved cross-security questions back to `security-costs`.

**Step 5:** In `aws-secrets-manager-pricing.astro`, add a role statement that frames the page as the Secrets Manager bill-boundary page and points unresolved cross-security questions back to `security-costs`.

**Step 6:** Keep the batch limited to these four guides unless a blocker forces a scope change.

### Task 3: Run verification

**Files:**
- Tests and guides from Tasks 1-2

**Step 1:** Run `node --test tests/security-role-separation.test.mjs`.

Expected: PASS.

**Step 2:** Run `npm run check`.

Expected: `0 errors`, `0 warnings`, and only the accepted existing hints.

**Step 3:** Run `npm run build`.

Expected: success.

### Task 4: Commit

**Files:** the four guides, generated guides index if needed, and the new regression test

**Step:** `git add tests/security-role-separation.test.mjs src/pages/guides/security-costs.astro src/pages/guides/aws-waf-pricing.astro src/pages/guides/aws-kms-pricing.astro src/pages/guides/aws-secrets-manager-pricing.astro src/lib/guides.generated.ts`

`git commit -m "feat: strengthen security guide roles"`
