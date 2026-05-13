# Eleventh Page Quality Batch Design

**Problem**

The CloudWatch estimate-page cluster already has good workflow separation, but the three estimate pages still have a small amount of "correct but generic" tone in the places where readers need the most confidence:

- what evidence makes the estimate defendable
- how to separate baseline behavior from exceptional behavior
- when the model is mature enough to hand off to pricing or optimization

The opportunity is not to restructure the pages. The opportunity is to make the evidence pack, validation posture, and next-step routing sound more like a real measurement workflow and less like a reusable estimate template.

**Decision**

Run an eleventh narrow quality batch focused on the three CloudWatch estimate pages:

- custom metrics time-series estimation
- Logs Insights scanned-GB estimation
- alarm-count estimation

**Approach**

1. Preserve all existing estimate-page role-separation wording.
2. Strengthen evidence-pack and validation language with more operationally credible phrasing.
3. Make the handoff to pricing or optimization feel more explicit and page-specific.
4. Keep edits local, with only very light opening adjustments where they improve realism.

**Pages in this batch**

- `src/pages/guides/aws-cloudwatch-metrics-estimate-custom-metrics.astro`
- `src/pages/guides/aws-cloudwatch-logs-insights-estimate-scanned-gb.astro`
- `src/pages/guides/aws-cloudwatch-alarms-estimate-alarm-count.astro`

**Expected outcome**

These estimate pages should feel less templated and more like specialized evidence-building workflows. A reader should come away knowing what data to gather, how to avoid blending normal and exceptional behavior, and when the estimate is good enough to route back to pricing or forward to optimization without weakening the existing observability cluster roles.
