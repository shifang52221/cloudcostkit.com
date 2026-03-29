# Kubernetes Calculator Cluster Depth Cleanup Design

## Why this batch exists

The Kubernetes calculator cluster is one of the largest remaining groups with repeated editorial tails. These pages are
useful, but several still end with the same generic inputs, interpretation, mistakes, and validation sections. That
repetition weakens originality in a cluster where users expect opinionated, operationally specific guidance.

## Scope of this batch

This batch covers:

- `src/pages/calculators/kubernetes-cost-calculator.astro`
- `src/pages/calculators/eks-cost-calculator.astro`
- `src/pages/calculators/kubernetes-node-cost-calculator.astro`
- `src/pages/calculators/kubernetes-requests-limits-calculator.astro`
- `src/pages/calculators/kubernetes-observability-cost-calculator.astro`

## Problem pattern

These pages should feel different because they answer different questions:

- Kubernetes cost: the full node-first cluster cost frame
- EKS cost: managed-cluster variant with control plane and AWS-specific boundaries
- Kubernetes node cost: node-hours and instance mix only
- Requests and limits: scheduling and headroom before cost
- Kubernetes observability: logs and metrics as a second bill beyond nodes

The current tails flatten those distinctions into boilerplate.

## Options considered

### Option 1: Light rewording of the repeated sections

Pros:

- fast
- lowers exact duplication

Cons:

- keeps the same matrix architecture
- still feels templated to reviewers

### Option 2: Remove most supporting prose

Pros:

- reduces obvious repetition quickly

Cons:

- makes complex Kubernetes topics too shallow
- removes helpful boundary guidance users actually need

### Option 3: Rebuild each page around its operational boundary

Pros:

- improves usefulness and originality
- matches the real cost and sizing workflow
- better supports AdSense/site-quality remediation

Cons:

- requires page-specific rewriting

## Recommended approach

Choose Option 3.

Each page should lead with a different operational truth:

- Kubernetes cost: nodes are only the first bill
- EKS cost: managed control plane and AWS add-ons change the model
- Kubernetes node cost: node-hours, instance shape, and autoscaler behavior dominate
- Requests and limits: wrong sizing upstream poisons every downstream estimate
- Observability: logs and metrics often become the hidden second cluster bill

## Final design

### Shared rule

Keep:

- existing calculator widgets
- FAQs and related links
- scenario tables where they still add value

Replace:

- repeated bottom-of-page boilerplate
- generic validation language that does not match Kubernetes workflows
- cost language on sizing-first pages where sizing should come first

### Page-specific rewrites

#### Kubernetes Cost Calculator

Replace the generic tail with:

- nodes as the baseline but not the whole bill
- pod density, node count, add-ons, storage, and network as separate layers
- when generic Kubernetes cost models stop being enough

#### EKS Cost Calculator

Replace the generic tail with:

- managed control plane, node cost, and add-on framing
- max pods per node and AWS-specific overhead
- where EKS differs from generic Kubernetes math

#### Kubernetes Node Cost Calculator

Replace the generic tail with:

- node-hours and instance mix
- autoscaler behavior, buffer nodes, and system overhead
- difference between node uptime and pod utilization

#### Kubernetes Requests & Limits Calculator

Replace the generic tail with:

- requests as the scheduler input
- limits as a burst and OOM boundary
- CPU versus memory bottlenecks and pod-cap effects

#### Kubernetes Observability Cost Calculator

Replace the generic tail with:

- logs versus metrics as separate cost drivers
- cardinality, retention, and incident spikes
- why observability becomes the second bill after cluster compute
