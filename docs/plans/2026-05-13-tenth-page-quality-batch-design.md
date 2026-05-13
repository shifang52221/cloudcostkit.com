# Tenth Page Quality Batch Design

**Problem**

The CloudWatch observability pricing cluster already has strong role separation, but three visible bill-boundary pages can still feel a little too generic at the moments that matter most:

- first-screen budget framing
- practical validation language
- page-specific handoff wording

The problem is not factual weakness. The problem is that these pages can still sound like structurally correct templates instead of specialized budget review guides grounded in real charge-ownership decisions.

**Decision**

Run a tenth narrow quality batch focused on the three CloudWatch pricing pages that anchor the observability cluster:

- metrics pricing
- Logs Insights pricing
- alarms pricing

**Approach**

1. Preserve all existing role-separation wording and routing.
2. Strengthen first-screen language so each page makes its bill-boundary job more concrete.
3. Add page-specific validation and handoff language that matches the actual modeling risk on that page.
4. Keep edits local and avoid section rewrites or cluster drift.

**Pages in this batch**

- `src/pages/guides/aws-cloudwatch-metrics-pricing.astro`
- `src/pages/guides/aws-cloudwatch-logs-insights-pricing.astro`
- `src/pages/guides/aws-cloudwatch-alarms-pricing.astro`

**Expected outcome**

These pages should feel less templated and more operationally credible: a reader should understand what belongs in the bill, what commonly gets blended in by mistake, what evidence makes the estimate defendable, and which adjacent page to use next without blurring roles across the observability cluster.
