# Security Governance Design

## Problem

The security guide cluster still has one of the clearest remaining parent-child consistency gaps:

- `src/pages/guides/security-costs.astro` is useful, but it still reads like an older link hub instead of a strong parent page
- `src/pages/guides/aws-waf-pricing.astro`
- `src/pages/guides/aws-kms-pricing.astro`
- `src/pages/guides/aws-secrets-manager-pricing.astro`

The specialist pages are reasonably detailed, but the cluster does not yet read like one deliberate editorial system. That creates two quality risks:

- the parent page feels thin compared with the children
- the child pages do not all route readers back to the parent when the broader security cost question is still unresolved

## Approved Direction

Use a parent-plus-specialist split:

- `security-costs` becomes the security system budgeting parent page
- `aws-waf-pricing` becomes the WAF bill-boundary page
- `aws-kms-pricing` becomes the KMS request and key-boundary page
- `aws-secrets-manager-pricing` becomes the Secrets Manager bill-boundary page

The parent page should own the cross-security budgeting question:

- how request-driven security spend differs across WAF, KMS, secrets, and audit logging
- how bot traffic, retries, and incident behavior amplify multiple security line items at once
- how to decide which security subsystem is actually driving the bill before optimizing the wrong one

The specialist pages should own their narrower bill-boundary questions:

- WAF: ACLs, rules, evaluated requests, and adjacent logging
- KMS: key-months, request volume, caller behavior, and adjacent service bills
- Secrets Manager: secret-months, API requests, runtime fetch behavior, and adjacent rotation or incident-side systems

## Role Split

### `security-costs`

This page should explicitly identify itself as the security system budgeting parent page.

Its job is to:

- separate WAF, key management, secrets access, and audit logging into distinct cost surfaces
- teach readers how request-driven security bills expand during attack windows or unstable releases
- route readers into WAF, KMS, or Secrets Manager pricing pages only after the broader security cost shape is clear

It should not stay as a thin hub or collapse into a single-provider pricing page.

### `aws-waf-pricing`

This page should explicitly identify itself as the AWS WAF bill-boundary page.

Its job is to:

- define what belongs inside the WAF bill
- define what sits beside the WAF bill, especially logs and SIEM analysis
- route readers back to the security parent page when the broader security spike question is still unresolved

### `aws-kms-pricing`

This page should explicitly identify itself as the AWS KMS request and key-boundary page.

Its job is to:

- keep the reader focused on key-months, requests, and caller behavior
- separate KMS charges from the adjacent storage, compute, or secret-management workflows that trigger them
- route readers back to the security parent page when the broader security spend diagnosis is still unclear

### `aws-secrets-manager-pricing`

This page should explicitly identify itself as the Secrets Manager bill-boundary page.

Its job is to:

- define the secret-month and API request boundaries clearly
- separate Secrets Manager from rotation helpers, Lambda side effects, and incident-side restart storms
- route readers back to the security parent page when the unresolved question is still the wider security system budget

## Content Strategy

This round should apply the same governance pattern across all four pages:

1. add a first-screen role statement
2. add routing language about when this page is the right entry point
3. reinforce the biggest budgeting mistake for that page's role
4. reduce overlap so the parent page feels broader and the specialist pages feel narrower

The goal is not simply more copy. The goal is better hierarchy, less template-like repetition, and a clearer path for Google and users to understand why each page exists.

## Regression Guard

Add a targeted regression test that verifies:

- `security-costs` declares itself as the security system budgeting parent page
- `aws-waf-pricing` declares itself as the AWS WAF bill-boundary page
- `aws-kms-pricing` declares itself as the AWS KMS request and key-boundary page
- `aws-secrets-manager-pricing` declares itself as the Secrets Manager bill-boundary page
- the three specialist pages route readers back to `security-costs` when the broader system question is still unclear

The test should protect role separation rather than exact paragraph wording.

## Scope

Keep this round limited to:

- `src/pages/guides/security-costs.astro`
- `src/pages/guides/aws-waf-pricing.astro`
- `src/pages/guides/aws-kms-pricing.astro`
- `src/pages/guides/aws-secrets-manager-pricing.astro`
- `tests/security-role-separation.test.mjs`

Do not expand this batch into optimization guides, estimate guides, or non-AWS security pages unless a direct blocker appears.

## Success Standard

This round is successful when:

- the security parent page clearly owns cross-system security budgeting
- the three specialist pages feel narrower and more intentional
- the cluster no longer reads like a loose collection of adjacent security explainers
- the regression test passes
- `npm run check` and `npm run build` still pass with only the accepted existing hints
