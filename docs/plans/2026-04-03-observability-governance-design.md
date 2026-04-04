# Observability Governance Design

## Problem

The observability guide cluster still has one of the clearest remaining risks for low-quality overlap:

- `src/pages/guides/observability-costs.astro` already behaves like a parent page, but its parent role is not explicit enough
- `src/pages/guides/metrics-costs.astro` is fairly strong, yet it can still be tightened so it reads like a metrics-specific page rather than a partial observability rewrite
- `src/pages/guides/log-costs.astro` still reads like an older generic explainer and is the weakest fit in the cluster

Without a stricter split, Google can read these pages as adjacent variations on the same "monitoring cost" topic instead of a deliberate parent-plus-child editorial system.

## Approved Direction

Use a parent-plus-specialist split:

- `observability-costs` becomes the observability system budgeting parent page
- `metrics-costs` becomes the metrics cardinality and monitoring economics page
- `log-costs` becomes the log ingestion, retention, and scan economics page

The parent page should own the cross-signal budgeting question:

- how logs, metrics, and traces behave differently
- how incident amplification distorts calm-month assumptions
- how to decide which signal family is actually driving the bill
- when to move from the parent page into a narrower specialist workflow

The specialist pages should own their narrower cost questions:

- `metrics-costs`: series growth, label cardinality, resolution, dashboards, alerts
- `log-costs`: ingestion, retention, search or scan behavior, noisy logging classes, incident-time query spikes

## Role Split

### `observability-costs`

This page should explicitly identify itself as the observability system budgeting parent page.

Its job is to:

- frame observability as a multi-signal system instead of one blended line item
- teach readers how to separate logs, metrics, traces, and incident amplification before budgeting
- route readers into `metrics-costs` or `log-costs` only after the broader observability picture is clear

It should not collapse into a deep metrics tutorial or a log retention tutorial.

### `metrics-costs`

This page should explicitly identify itself as the metrics cardinality and monitoring economics page.

Its job is to:

- explain series growth and label multiplication clearly
- keep the reader focused on metrics-specific spend drivers
- route the reader back to `observability-costs` when the unresolved question is still "which signal family is actually driving the bill?"

It should not re-teach the whole observability system model.

### `log-costs`

This page should explicitly identify itself as the log ingestion, retention, and scan economics page.

Its job is to:

- explain log volume, retention tiers, and search or scan behavior as a log-specific workflow
- show how noisy logging classes and incident habits change log spend
- route the reader back to `observability-costs` when the broader signal split is still unclear

It should not read like a generic observability overview.

## Content Strategy

This round should apply the same governance pattern across all three pages:

1. add a first-screen role statement
2. add or tighten routing language about when this page is the correct entry point
3. reinforce the biggest budgeting mistake for that page's role
4. reduce cross-page overlap by keeping the parent broad and the specialist pages intentionally narrower

The goal is not more text for its own sake. The goal is a clearer editorial hierarchy, less topic cannibalization, and less template-like duplication.

## Regression Guard

Add a targeted regression test that verifies:

- `observability-costs` declares itself as the observability system budgeting parent page
- `metrics-costs` declares itself as the metrics cardinality and monitoring economics page
- `log-costs` declares itself as the log ingestion, retention, and scan economics page
- both specialist pages route readers back to `observability-costs` when the broader signal split is still unclear

The test should protect role separation rather than enforce a brittle full-paragraph match.

## Scope

Keep this round limited to:

- `src/pages/guides/observability-costs.astro`
- `src/pages/guides/metrics-costs.astro`
- `src/pages/guides/log-costs.astro`
- `tests/observability-role-separation.test.mjs`

Do not expand this batch into provider pricing pages, calculators, or traces pages unless verification shows a direct blocker.

## Success Standard

This round is successful when:

- the parent page clearly owns cross-signal observability budgeting
- the metrics and log pages feel narrower and more intentional
- the cluster no longer reads like several interchangeable monitoring explainers
- the regression test passes
- `npm run check` and `npm run build` still pass with only the accepted existing hints
