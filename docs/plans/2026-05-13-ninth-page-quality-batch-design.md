# Ninth Page Quality Batch Design

**Problem**

The load balancer and ECS-adjacent pages already have strong role separation, but a few of the visible calculator and support pages can still reinforce their exact job more clearly:

- main load balancer cost model
- LCU/NLCU driver model
- ECS beyond-compute checklist

The opportunity is not to rewrite them. The opportunity is to sharpen the sign-off language so each page more explicitly tells the reader what it owns and what still must be validated elsewhere.

**Decision**

Run a ninth narrow quality batch focused on the load balancer cluster plus the ECS beyond-compute support page.

**Approach**

1. Preserve all existing role-separation wording and routing.
2. Add page-specific validation language that matches the actual modeling risk.
3. Make the "main cost model vs unit-driver model vs total-cost checklist" distinction harder to blur.
4. Keep edits local and avoid section-level rewrites.

**Pages in this batch**

- `src/pages/calculators/aws-load-balancer-cost-calculator.astro`
- `src/pages/calculators/aws-load-balancer-lcu-calculator.astro`
- `src/pages/guides/aws-ecs-cost-model-beyond-compute.astro`

**Expected outcome**

These pages should feel more like specialized decision tools and less like generic support pages, while preserving the existing load balancer and ECS governance.
