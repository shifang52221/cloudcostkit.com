import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const normalize = (value) => value.replace(/\s+/g, " ").trim();

const pricingPage = normalize(readFileSync(new URL("../src/pages/guides/aws-load-balancer-cost.astro", import.meta.url), "utf8"));
const estimatePage = normalize(
  readFileSync(new URL("../src/pages/guides/aws-load-balancer-estimate-lcu.astro", import.meta.url), "utf8"),
);
const optimizationPage = normalize(
  readFileSync(
    new URL("../src/pages/guides/aws-load-balancer-cost-optimization.astro", import.meta.url),
    "utf8",
  ),
);
const explainerPage = normalize(
  readFileSync(new URL("../src/pages/guides/aws-load-balancer-lcu-explained.astro", import.meta.url), "utf8"),
);

test("pricing page is framed as the load balancer bill-boundary page", () => {
  assert.match(
    pricingPage,
    /Use this page when you need to decide what belongs inside the load balancer bill before you debate connection tuning, CDN offload, or retry behavior/i,
  );
  assert.match(
    pricingPage,
    /This guide is about bill boundaries: load balancer-hours, LCU or NLCU unit-hours, and the adjacent CDN, cross-AZ transfer, WAF, NAT, and downstream costs that should be tracked beside the load balancer bill rather than blended into it/i,
  );
});

test("estimate page is framed as the measurement workflow page", () => {
  assert.match(
    estimatePage,
    /This page is the measurement workflow, not the bill-boundary page: the goal is to turn CloudWatch metrics for new connections, active connections, processed bytes, and rule activity into a defendable units-per-hour model/i,
  );
  assert.match(
    estimatePage,
    /If you still are not sure which costs belong inside the load balancer bill versus beside it, go back to the pricing guide first/i,
  );
});

test("optimization page is framed as the production intervention page", () => {
  assert.match(
    optimizationPage,
    /Optimization starts only after you know whether load balancer-hours, unit-hours, bytes processed, connection churn, or retry-driven spikes are the real cost driver; otherwise teams consolidate, compress, or tune the wrong path/i,
  );
  assert.match(
    optimizationPage,
    /This page is for production intervention: load balancer consolidation, connection-pattern cleanup, byte reduction, rule simplification, and retry control/i,
  );
});

test("explainer page is framed as the support explainer page", () => {
  assert.match(
    explainerPage,
    /This page is the support explainer for the load balancer cluster, not the bill-boundary page and not the measurement workflow page: it exists to make LCU and NLCU unit logic easier to reason about once you know which page job you actually need/i,
  );
  assert.match(
    explainerPage,
    /If you need to decide what belongs inside the load balancer bill, go back to the pricing guide first; if you need to turn metrics into a defendable units-per-hour model, use the estimate guide/i,
  );
});
