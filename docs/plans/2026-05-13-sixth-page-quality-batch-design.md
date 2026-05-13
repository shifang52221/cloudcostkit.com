# Sixth Page Quality Batch Design

**Problem**

A few high-impression pages are already useful, but their first-screen language still leaves room for stronger decision framing and more page-specific sign-off guidance. The common pattern is not thin content. It is that some visible pages still read like solid utility pages instead of sharp decision pages:

- `ec2-cost-calculator`
- `data-egress-cost-calculator`
- `egress-costs`
- `aws-ecs-ec2-vs-fargate-cost`

These pages are already doing real work. The next improvement is to make the opening promise and the final validation language more specific to the exact budgeting decision each page owns.

**Decision**

Run a sixth narrow quality batch focused on strengthening first-screen decision framing, de-templating comparison language, and adding page-specific sign-off guidance on four high-impression compute and network pages.

**Approach**

1. Keep each page's role and routing intact.
2. Strengthen page-specific promise language instead of expanding page length for its own sake.
3. Add precise regression coverage for the new decision framing.
4. Avoid structural rewrites unless a small local addition materially improves trust and clarity.

**Pages in this batch**

- `src/pages/calculators/ec2-cost-calculator.astro`
- `src/pages/calculators/data-egress-cost-calculator.astro`
- `src/pages/guides/egress-costs.astro`
- `src/pages/guides/aws-ecs-ec2-vs-fargate-cost.astro`

**Expected outcome**

These pages should feel more original, more finance-review-ready, and more aligned with the specific decision each page is meant to support, without weakening the existing compute and transfer role separation.
