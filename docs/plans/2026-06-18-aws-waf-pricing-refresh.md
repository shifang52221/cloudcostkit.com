# AWS WAF Pricing Refresh Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Strengthen the AWS WAF pricing guide so it answers WAF pricing intent earlier and more credibly while preserving the page's AWS WAF bill-boundary role.

**Architecture:** Keep the current WAF bill-boundary structure, but add a pricing-first opening that explains the actual AWS WAF billing shape before the estimate workflow begins. Surface Web ACL baselines, rule and rule-group exposure, evaluated requests, optional intelligent security add-ons, and downstream logging separation early so the page behaves more like a canonical AWS pricing guide.

**Tech Stack:** Astro guide page, node:test, generated guide metadata, official AWS WAF pricing and logging documentation.

---

### Task 1: Add failing WAF pricing-cue coverage

**Files:**
- Modify: `tests/high-opportunity-page-review.test.mjs`
- Modify: `tests/thirteenth-ctr-rescue-batch.test.mjs`

**Step 1: Write the failing test**

Add assertions that the WAF pricing page now includes:

- a sharper pricing-intent title
- a `Quick pricing read` section
- explicit Web ACL / rule-group / evaluated-request separation
- mention of optional managed add-ons or advanced controls
- downstream logging or SIEM separation
- updated "updated on" wording

**Step 2: Run test to verify it fails**

Run: `node --test tests/high-opportunity-page-review.test.mjs tests/thirteenth-ctr-rescue-batch.test.mjs`

Expected: FAIL because the current page does not yet surface the new pricing-first snapshot or revised title wording.

### Task 2: Refresh the AWS WAF pricing page

**Files:**
- Modify: `src/pages/guides/aws-waf-pricing.astro`

**Step 1: Write minimal implementation**

Update the page so it:

- upgrades the title and description for AWS pricing intent
- adds a `Quick pricing read` section
- explains Web ACLs, rules or rule groups, evaluated requests, blocked traffic, and optional managed add-ons earlier
- keeps logging, storage, search, and SIEM spend beside the WAF bill
- preserves the current estimate, evidence path, pitfalls, validation, and cluster handoff sections

**Step 2: Keep editorial boundaries intact**

Preserve the page as the AWS WAF bill-boundary page rather than broadening it into the measurement workflow, attack-spike explainer, or security parent guide.

### Task 3: Regenerate metadata and verify green

**Files:**
- Modify: `src/lib/guides.generated.ts`

**Step 1: Regenerate guide metadata**

Run: `npm run generate:guides`

Expected: `src/lib/guides.generated.ts` updates to the new WAF title and description.

**Step 2: Run targeted tests to verify they pass**

Run: `node --test tests/high-opportunity-page-review.test.mjs tests/thirteenth-ctr-rescue-batch.test.mjs tests/waf-cluster-role-separation.test.mjs tests/security-role-separation.test.mjs`

Expected: PASS

**Step 3: Run full verification**

Run: `npm run check`

Expected: exit 0 with no errors.

**Step 4: Commit**

```bash
git add docs/plans/2026-06-18-aws-waf-pricing-refresh-design.md docs/plans/2026-06-18-aws-waf-pricing-refresh.md tests/high-opportunity-page-review.test.mjs tests/thirteenth-ctr-rescue-batch.test.mjs src/pages/guides/aws-waf-pricing.astro src/lib/guides.generated.ts
git commit -m "feat: sharpen aws waf pricing guide"
```
