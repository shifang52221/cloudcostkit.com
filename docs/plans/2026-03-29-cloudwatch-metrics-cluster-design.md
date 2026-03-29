# CloudWatch and Metrics Calculator Cluster Depth Cleanup Design

## Why this batch exists

The next remaining template-heavy cluster is the CloudWatch and metrics group. These pages target high-intent
operational queries, but several still use repeated bottom sections about inputs, interpretation, mistakes, and
validation. That repetition weakens originality in a topic area where cost drivers are highly product-specific.

## Scope of this batch

This batch covers:

- `src/pages/calculators/cloudwatch-log-cost-calculator.astro`
- `src/pages/calculators/cloudwatch-metrics-cost-calculator.astro`
- `src/pages/calculators/metrics-timeseries-cost-calculator.astro`
- `src/pages/calculators/aws-cloudwatch-alarms-cost-calculator.astro`

## Problem pattern

These pages should not feel interchangeable because they answer different monitoring cost questions:

- CloudWatch log cost: ingestion, retention, and Insights in one AWS-specific logging surface
- CloudWatch metrics cost: custom metrics, dashboards, API polling, and related AWS monitoring activity
- Metrics timeseries cost: generic high-cardinality series growth and polling economics
- CloudWatch alarms cost: inventory sprawl, high-resolution alarms, and composite alarms

The current tails flatten these distinctions into one reusable calculator pattern.

## Options considered

### Option 1: Reword the repeated tails

Pros:

- quick
- lowers exact duplication

Cons:

- keeps the same matrix structure
- still reads like a repeated template

### Option 2: Strip prose down to minimum

Pros:

- removes obvious repetition quickly

Cons:

- weakens pages that need product-specific guidance
- risks making monitoring pages too shallow

### Option 3: Rebuild each page around its true cost driver

Pros:

- improves originality and usefulness
- better reflects how monitoring bills actually grow
- supports site-quality and AdSense remediation goals

Cons:

- requires page-specific rewriting

## Recommended approach

Choose Option 3.

Each page should clarify one product boundary:

- CloudWatch log cost: one AWS logging bill composed of ingestion, retention, and Insights behavior
- CloudWatch metrics cost: metrics count, dashboards, alarms, and API requests as one AWS monitoring stack
- Metrics timeseries cost: generic active-series and cardinality growth
- CloudWatch alarms cost: alarm inventory sprawl, high-res premium, and ownership drift

## Final design

### Shared rule

Keep:

- existing calculator widgets
- FAQs and related links
- scenario tables where they still add value

Replace:

- repeated bottom-of-page boilerplate
- generic validation language
- checklist content that could belong to almost any calculator

### Page-specific rewrites

#### CloudWatch Log Cost

Replace the generic tail with:

- CloudWatch-specific mix of ingestion, retention, and Logs Insights scans
- per-log-group retention drift
- dashboard and Insights behavior as AWS-specific scan drivers

#### CloudWatch Metrics Cost

Replace the generic tail with:

- custom metrics, dashboards, alarms, and polling as a single AWS metrics surface
- namespace and account sprawl
- dashboard refresh and API request habits

#### Metrics Timeseries Cost

Replace the generic tail with:

- active-series and label-cardinality framing
- autoscaling churn, new dimensions, and polling
- generic timeseries behavior beyond one vendor

#### CloudWatch Alarms Cost

Replace the generic tail with:

- standard vs high-resolution vs composite alarm inventory
- ownership drift and duplicated alarms after migrations
- alarm sprawl as the main driver rather than unit price changes
