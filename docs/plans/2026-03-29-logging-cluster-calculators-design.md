# Logging Calculator Cluster Depth Cleanup Design

## Why this batch exists

The logging cost cluster is one of the highest-risk remaining groups for site-quality perception. These pages target
valuable operational queries, but several still use repeated bottom-of-page sections about inputs, interpretation,
mistakes, and validation. That repetition makes an important topic cluster feel templated instead of operationally
authored.

## Scope of this batch

This batch covers:

- `src/pages/calculators/log-cost-calculator.astro`
- `src/pages/calculators/log-ingestion-cost-calculator.astro`
- `src/pages/calculators/log-storage-cost-calculator.astro`
- `src/pages/calculators/log-search-scan-cost-calculator.astro`
- `src/pages/calculators/cloudwatch-logs-insights-cost-calculator.astro`

## Problem pattern

These pages should feel different because they answer different cost questions:

- Log cost: the combined frame of ingestion, retention, and scans
- Log ingestion: event rate and bytes per event as the first bill
- Log storage: hot and cold retention policy economics
- Log search / scan: dashboards, queries, and incident-driven scanned GB
- CloudWatch Logs Insights: CloudWatch-specific query and scan behavior

The current repeated tail pattern flattens those differences.

## Options considered

### Option 1: Reword the repeated tail sections

Pros:

- fast
- reduces exact duplication

Cons:

- keeps the same matrix shape
- still feels mechanically generated

### Option 2: Strip supporting prose down to minimum

Pros:

- removes obvious repetition quickly

Cons:

- weakens operational guidance on a topic where cost drivers are often misunderstood
- risks making the pages too thin

### Option 3: Rebuild each page around its true log-cost driver

Pros:

- improves originality and usefulness
- aligns with real FinOps and logging workflows
- better supports AdSense/site-quality remediation

Cons:

- requires page-specific rewriting

## Recommended approach

Choose Option 3.

Each page should make one cost boundary clearer:

- Log cost: logging is a chain, not one number
- Ingestion: noisy producers and bytes/event growth drive the first bill
- Storage: hot days, cold days, and archive policy shape retained cost
- Search/scan: query behavior and dashboard refresh can exceed ingestion intuition
- Logs Insights: CloudWatch query scope and scan cadence create their own bill

## Final design

### Shared rule

Keep:

- existing calculator widgets
- FAQs and related links
- scenario tables where they still help

Replace:

- repeated generic tail sections
- checklists that could belong to any calculator
- generalized validation language that misses logging-specific drift

### Page-specific rewrites

#### Log Cost Calculator

Replace the generic tail with:

- ingestion, retention, and scan as a single cost chain
- policy and query behavior as the two main leverage points
- class-based logging decisions instead of one blended average

#### Log Ingestion Cost Calculator

Replace the generic tail with:

- event rate times bytes per event framing
- retries, verbose modes, and incident expansion
- source-by-source attribution instead of blended GB/day

#### Log Storage Cost Calculator

Replace the generic tail with:

- hot versus cold storage framing
- archive fraction, retrieval, and policy design
- why retention is a policy problem, not just a GB problem

#### Log Search / Scan Cost Calculator

Replace the generic tail with:

- dashboard cadence, query scope, and incident investigations
- search cost as a behavior-driven line item
- separate automated scans from ad hoc debugging

#### CloudWatch Logs Insights Cost Calculator

Replace the generic tail with:

- CloudWatch-specific query scan framing
- dashboard refresh and query-window costs
- distinction between CloudWatch ingestion/retention and Insights scan behavior
