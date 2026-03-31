# Provider Guide Hub Hardening Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Strengthen the provider guide hub pages so they read like curated routing pages instead of thin directories, while aligning crawl posture across AWS, Azure, and GCP guide hubs.

**Architecture:** Keep the change local to the three provider guide hub pages plus one regression test. Use the existing `GUIDES` metadata to group and route users more intentionally rather than expanding the content system.

**Tech Stack:** Astro, TypeScript, Node test runner

---

### Task 1: Lock the new expectations with a failing test

**Files:**
- Create: `tests/provider-guide-hub-hardening.test.mjs`
- Modify: none

**Step 1: Write the failing test**

Add assertions that verify:

- `src/pages/guides/aws.astro` contains stronger routing language and `robots="noindex,follow"`
- `src/pages/guides/azure.astro` contains Azure-specific boundary guidance and a stronger statement about when to use the hub
- `src/pages/guides/gcp.astro` contains GCP-specific boundary guidance and stronger routing language

**Step 2: Run test to verify it fails**

Run: `node --test .\tests\provider-guide-hub-hardening.test.mjs`

Expected: FAIL because the new routing/governance copy is not present yet and AWS is still indexable.

**Step 3: Commit**

Do not commit yet. Move directly to implementation after confirming the red state.

### Task 2: Harden the AWS provider guide hub

**Files:**
- Modify: `src/pages/guides/aws.astro`

**Step 1: Replace directory-style behavior**

- add `robots="noindex,follow"`
- remove the current long hand-maintained card dump
- derive AWS guide groups from `GUIDES`

**Step 2: Add editorial routing sections**

- add a clear explanation of what the hub is for
- add “start by billing shape” guidance
- add AWS-specific budgeting traps
- add grouped guide sections such as networking/delivery, compute/runtime, storage/data, observability, and messaging/security

**Step 3: Keep strong next-step routing**

- preserve routes into calculators and key guides
- ensure the page still supports users navigating deeper into service-specific workflows

### Task 3: Harden the Azure and GCP provider guide hubs

**Files:**
- Modify: `src/pages/guides/azure.astro`
- Modify: `src/pages/guides/gcp.astro`

**Step 1: Strengthen intro and purpose**

- make each page say when it is the right starting point
- make each page say what kind of provider-specific boundary mistakes it helps prevent

**Step 2: Add stronger provider-specific routing**

- Azure: egress vs backbone/private path vs premium SKU boundaries
- GCP: inter-zone transfer, serverless retries, logging growth, and regional boundary issues

**Step 3: Keep consistent crawl posture**

- preserve `robots="noindex,follow"` on both pages
- align the AWS page to the same rule

### Task 4: Verify green and run full checks

**Files:**
- Test: `tests/provider-guide-hub-hardening.test.mjs`

**Step 1: Run focused test**

Run: `node --test .\tests\provider-guide-hub-hardening.test.mjs`

Expected: PASS

**Step 2: Run full test suite**

Run: `npm test`

Expected: PASS

**Step 3: Run Astro checks**

Run: `npm run check`

Expected: PASS with no new errors

**Step 4: Run build**

Run: `npm run build`

Expected: PASS

### Task 5: Commit and prepare merge

**Files:**
- Modify: the three provider guide hub pages
- Create: `tests/provider-guide-hub-hardening.test.mjs`

**Step 1: Commit**

```bash
git add src/pages/guides/aws.astro src/pages/guides/azure.astro src/pages/guides/gcp.astro tests/provider-guide-hub-hardening.test.mjs
git commit -m "feat: harden provider guide hubs"
```

**Step 2: Push**

```bash
git push origin thin-page-triage
```

**Step 3: Open compare URL**

```bash
Start-Process 'https://github.com/shifang52221/cloudcostkit.com/compare/main...thin-page-triage?expand=1'
```
