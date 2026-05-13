# Seventh Page Quality Batch Design

**Problem**

Some visible entry and comparison pages already have solid structure, but they still leave room for stronger search-to-decision handoff. The weakness is not thin content. The weakness is that a few pages can still do more to tell both the reader and the crawler exactly what decision they help with and what to validate before trusting the result:

- calculator index entry page
- RDS vs Aurora comparison guide
- Fargate vs EC2 comparison calculator

These are valuable because they sit close to commercial or architectural decisions. Improving them should increase perceived specificity and reduce the chance that they read like generic hubs or interchangeable comparison pages.

**Decision**

Run a seventh narrow quality batch focused on stronger entrypoint routing, clearer comparison framing, and more concrete sign-off guidance on three high-visibility pages.

**Approach**

1. Keep existing role-separation language intact.
2. Strengthen first-screen and summary language so each page owns a sharper decision.
3. Add page-specific validation or routing language instead of general boilerplate.
4. Avoid broad rewrites, template churn, or additional sections that do not materially improve trust.

**Pages in this batch**

- `src/pages/calculators/index.astro`
- `src/pages/guides/aws-rds-vs-aurora-cost.astro`
- `src/pages/calculators/aws-fargate-vs-ec2-cost-calculator.astro`

**Expected outcome**

These pages should feel more like decision-ready entrypoints and less like generic utility pages, while preserving the existing database, Fargate, and calculator-hub governance rules.
