# Support Estimator Role Separation Design

**Goal:** Make the noindex support estimator layer read like a deliberate workflow layer rather than a batch of thin calculator clones.

**Architecture:** Keep KMS, SNS, SQS, and WAF estimator pages as `noindex,follow` support tools. Strengthen their first-screen role language and handoffs so each page owns only its measurement job before sending users to the main calculator or service guide for bill conversion and pricing boundaries.

**Tech Stack:** Astro calculator pages, existing React calculator components, Node test runner, existing noindex helper policy.

---

### Scope

- `src/pages/calculators/aws-kms-request-estimator.astro`: crypto-call-density estimator.
- `src/pages/calculators/aws-sns-delivery-estimator.astro`: publish-to-delivery fan-out estimator.
- `src/pages/calculators/aws-sqs-request-estimator.astro`: message-lifecycle request estimator.
- `src/pages/calculators/aws-waf-request-estimator.astro`: evaluated-request and attack-window estimator.

### Options Considered

1. **Leave them alone because they are noindex.**
   This is fast, but it lets the support layer keep a template smell. `noindex` reduces search exposure, but AdSense-style quality review can still crawl and evaluate these URLs.

2. **Promote them into indexable standalone pages.**
   This would add search surface, but it is the wrong move right now. These pages are intentionally narrow helpers and could compete with stronger service calculators and guides.

3. **Keep them noindex, but sharpen their support roles.**
   This is the safest path. It preserves useful tools, avoids deleting pages, and makes the crawlable support layer look curated instead of generated.

### Recommended Design

Use option 3. Add explicit role statements near the top of each page:

- KMS: request-volume workflow for crypto-call density, not key-month pricing or full KMS bill conversion.
- SNS: delivery-volume workflow for matched fan-out and retries, not SNS pricing or downstream system cost.
- SQS: request-volume workflow for message lifecycle amplification, not queue pricing or consumer compute.
- WAF: evaluated-request workflow for baseline plus attack windows, not Web ACL/rule pricing or security logging.

### Guardrails

- Preserve `robots="noindex,follow"`.
- Preserve all existing calculator components and inputs.
- Avoid generic boilerplate such as "educational use only" or repeated "estimate monthly cost" phrasing.
- Keep each page tied to a concrete measurement problem and a concrete next-step page.

### Success Criteria

- A new regression test fails before the copy changes and passes after.
- The noindex helper description test still passes.
- Existing meta-description hardening tests for KMS, SNS, and SQS still pass.
- Full test, check, build, push, and live verification complete before the batch is reported as finished.
