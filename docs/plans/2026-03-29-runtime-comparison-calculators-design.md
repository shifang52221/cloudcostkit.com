# Runtime Comparison Calculators Depth Cleanup Design

## Why this batch exists

The next weak cluster is the runtime comparison and sizing group. These pages sit close to high-commercial-intent
queries, but several still end with the same repeated "inputs / interpretation / mistakes / validation" structure. That
repetition makes some of the site's most important decision pages feel industrially produced.

## Scope of this batch

This batch covers:

- `src/pages/calculators/aws-fargate-cost-calculator.astro`
- `src/pages/calculators/aws-fargate-vs-ec2-cost-calculator.astro`
- `src/pages/calculators/aws-lambda-vs-fargate-cost-calculator.astro`
- `src/pages/calculators/aws-ecs-ec2-vs-fargate-cost-calculator.astro`
- `src/pages/calculators/aws-ecs-task-sizing-calculator.astro`

## Problem pattern

These pages should feel different because they answer different operational decisions:

- Fargate cost: steady task-hours and right-sized compute footprint
- Fargate vs EC2: idle-capacity tradeoff, packing efficiency, and commitment coverage
- Lambda vs Fargate: event-driven bursts versus always-on capacity
- ECS on EC2 vs ECS on Fargate: orchestration-specific version of the same decision with ECS overhead in mind
- ECS task sizing: not pricing first, but translating CPU and memory demand into safe task count

The current repeated editorial tails flatten these distinctions.

## Options considered

### Option 1: Reword the repeated bottom sections

Pros:

- fast
- reduces exact duplication

Cons:

- keeps the same matrix shape
- does not materially improve originality

### Option 2: Strip the pages down to calculators only

Pros:

- removes repeated prose quickly

Cons:

- weakens high-intent decision pages that need boundary guidance
- makes pages feel thinner during review

### Option 3: Rebuild each page around its true decision boundary

Pros:

- improves usefulness and originality
- better fits AdSense/site-quality remediation goals
- reduces cluster-wide template signals

Cons:

- requires page-specific rewriting

## Recommended approach

Choose Option 3.

Each page should make one decision easier:

- Fargate cost: what drives recurring steady-state spend?
- Fargate vs EC2: are we paying more for idle capacity or more for operational convenience?
- Lambda vs Fargate: is the workload spiky enough to justify execution-based billing?
- ECS on EC2 vs ECS on Fargate: does the ECS operating model change the comparison?
- ECS task sizing: how many tasks are actually required before cost is even modeled?

## Final design

### Shared rule

Keep:

- existing calculator widgets
- page-level FAQs and related links
- scenario tables where they still add value

Replace:

- generic repeated tail sections
- filler checklists that could belong to almost any calculator
- mismatched cost guidance on sizing-first pages

### Page-specific rewrites

#### AWS Fargate Cost Calculator

Replace the generic tail with:

- steady-state task-hours as the main cost frame
- task count versus task size tradeoffs
- adjacent line items that frequently make Fargate bills look higher than compute alone

#### Fargate vs EC2

Replace the generic tail with:

- idle capacity versus utilization efficiency framing
- commitment coverage and packing assumptions
- when compute-only comparisons stop being enough

#### Lambda vs Fargate

Replace the generic tail with:

- burstiness versus always-on workload framing
- request shape, duration, and background traffic boundaries
- when a hybrid baseline-plus-burst model is more realistic than either extreme

#### ECS on EC2 vs ECS on Fargate

Replace the generic tail with:

- ECS-specific capacity and operations framing
- host packing, daemon overhead, and idle headroom on EC2
- where Fargate convenience wins and where EC2 density wins

#### ECS Task Sizing

Replace the generic tail with:

- CPU versus memory as competing constraints
- headroom, deployment overlap, and burst planning
- when sizing errors propagate into every downstream cost model
