import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const normalize = (value) => value.replace(/\s+/g, " ").trim();

const pricingPage = normalize(readFileSync(new URL("../src/pages/guides/aws-nat-gateway-cost.astro", import.meta.url), "utf8"));
const estimatePage = normalize(
  readFileSync(new URL("../src/pages/guides/aws-nat-gateway-estimate-gb-processed.astro", import.meta.url), "utf8"),
);
const optimizationPage = normalize(
  readFileSync(new URL("../src/pages/guides/aws-nat-gateway-cost-optimization.astro", import.meta.url), "utf8"),
);
const calculatorPage = normalize(
  readFileSync(new URL("../src/pages/calculators/aws-nat-gateway-cost-calculator.astro", import.meta.url), "utf8"),
);
const calculatorComponent = normalize(
  readFileSync(new URL("../src/components/calculators/AwsNatGatewayCost.tsx", import.meta.url), "utf8"),
);
const comparisonPage = normalize(
  readFileSync(new URL("../src/pages/guides/aws-nat-gateway-vs-vpc-endpoints-cost.astro", import.meta.url), "utf8"),
);

test("pricing page is framed as the NAT Gateway bill-boundary page", () => {
  assert.match(
    pricingPage,
    /Use this page when you need to decide what belongs inside the NAT Gateway bill before you debate endpoints, retries, or traffic-shape fixes/i,
  );
  assert.match(
    pricingPage,
    /This guide is about bill boundaries: gateway-hours, processed-GB charges, and the adjacent cross-AZ transfer, internet egress, private-connectivity, and downstream traffic costs that should be tracked beside NAT Gateway rather than blended into it/i,
  );
});

test("estimate page is framed as the processed-GB measurement workflow page", () => {
  assert.match(
    estimatePage,
    /This page is the processed-GB measurement workflow, not the bill-boundary page: the goal is to turn NAT metrics, flow logs, throughput charts, and traffic-source evidence into a defendable GB-per-month model/i,
  );
  assert.match(
    estimatePage,
    /If you still are not sure which costs belong inside the NAT Gateway bill versus beside it, go back to the pricing guide first/i,
  );
});

test("optimization page is framed as the production intervention page", () => {
  assert.match(
    optimizationPage,
    /Optimization starts only after you know whether gateway-hours, processed GB, download storms, external API traffic, or retry-driven spikes are the real NAT Gateway cost driver; otherwise teams privatize, cache, or schedule the wrong path/i,
  );
  assert.match(
    optimizationPage,
    /This page is for production intervention: private-path adoption, download control, retry cleanup, non-prod scheduling, and validation of what actually moved off NAT/i,
  );
});

test("calculator is framed as the NAT Gateway bill-conversion calculator", () => {
  assert.match(
    calculatorPage,
    /This calculator is the bill-conversion page of the NAT Gateway cluster: use it after gateway count, runtime, and processed GB are believable enough to translate into hourly and per-GB processing charges/i,
  );
  assert.match(
    calculatorPage,
    /The built-in Mbps helper is only a quick throughput-to-GB convenience, not a defendable traffic attribution workflow; use the processed-GB estimate guide when metrics, flow logs, destinations, or incident windows still need evidence/i,
  );
  assert.match(calculatorComponent, /Use estimate/i);
});

test("NAT versus endpoints page is framed as the migration economics comparison page", () => {
  assert.match(
    comparisonPage,
    /This page is the migration economics comparison in the NAT Gateway cluster: use it only after the NAT bill boundary and processed-GB baseline are clear enough to compare the current NAT path against endpoint-hours, endpoint GB, and residual traffic/i,
  );
  assert.match(
    comparisonPage,
    /It is not the first page for discovering NAT processed GB and it is not the optimization playbook for rollout changes; use the estimate guide or optimization guide when those jobs are still unresolved/i,
  );
});
