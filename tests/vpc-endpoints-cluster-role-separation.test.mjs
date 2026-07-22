import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const normalize = (value) => value.replace(/\s+/g, " ").trim();

const pricingPage = normalize(readFileSync(new URL("../src/pages/guides/aws-vpc-endpoints-pricing.astro", import.meta.url), "utf8"));
const estimatePage = normalize(
  readFileSync(new URL("../src/pages/guides/aws-vpc-endpoints-estimate-hours-and-gb.astro", import.meta.url), "utf8"),
);
const optimizationPage = normalize(
  readFileSync(new URL("../src/pages/guides/aws-vpc-endpoints-cost-optimization.astro", import.meta.url), "utf8"),
);
const privateLinkPricingPage = normalize(
  readFileSync(new URL("../src/pages/guides/aws-privatelink-pricing.astro", import.meta.url), "utf8"),
);
const interfaceCalculatorPage = normalize(
  readFileSync(new URL("../src/pages/calculators/aws-vpc-interface-endpoint-cost-calculator.astro", import.meta.url), "utf8"),
);
const interfaceCalculatorComponent = normalize(
  readFileSync(new URL("../src/components/calculators/AwsVpcInterfaceEndpointCost.tsx", import.meta.url), "utf8"),
);

test("pricing page is framed as the bill-boundary page", () => {
  assert.match(
    pricingPage,
    /Use this page when you need to decide what belongs inside the endpoint bill model before you argue about optimization/i,
  );
  assert.match(
    pricingPage,
    /This guide is about bill boundaries: endpoint-hours, GB processed, endpoint type, and the transfer or architecture costs that should be tracked beside endpoints rather than confused with them/i,
  );
});

test("estimate page is framed as the input-measurement workflow page", () => {
  assert.match(
    estimatePage,
    /This page is the input-measurement workflow, not the bill-boundary page: the goal is to turn endpoint inventory, AZ coverage, hours, and GB into a defendable model/i,
  );
  assert.match(
    estimatePage,
    /If you still are not sure which charges belong inside the endpoint bill, go back to the pricing guide first/i,
  );
});

test("optimization page is framed as the production intervention page", () => {
  assert.match(
    optimizationPage,
    /Optimization starts only after the endpoint-hours and GB model is believable; otherwise teams cut the wrong endpoint or AZ and keep the real cost driver/i,
  );
  assert.match(
    optimizationPage,
    /This page is for production intervention: endpoint consolidation, AZ right-sizing, traffic reduction, and locality fixes/i,
  );
});

test("PrivateLink pricing is framed as the consumer-versus-provider bill-shape page", () => {
  assert.match(
    privateLinkPricingPage,
    /This page is the consumer-versus-provider bill-shape guide in the endpoint cluster: use it when the main question is how interface endpoint usage differs from provider-side load balancer, service, and transfer exposure/i,
  );
  assert.match(
    privateLinkPricingPage,
    /It is not the first page for endpoint bill boundaries or input measurement; use VPC endpoints pricing for line-item scope and the estimate guide for endpoint-hours and GB modeling/i,
  );
});

test("interface endpoint calculator is framed as the bill-conversion calculator", () => {
  assert.match(
    interfaceCalculatorPage,
    /This calculator is the bill-conversion page of the endpoint cluster: use it after endpoint count, AZ coverage, runtime, and processed GB are believable enough to translate into endpoint-hours and per-GB processing charges/i,
  );
  assert.match(
    interfaceCalculatorPage,
    /The built-in Mbps helper is only a quick throughput-to-GB convenience, not a defendable endpoint-traffic measurement workflow; use the estimate guide when inventory, AZ scope, NAT displacement, or GB sources still need evidence/i,
  );
  assert.match(interfaceCalculatorComponent, /Avg Mbps/i);
  assert.match(interfaceCalculatorComponent, /Use estimate/i);
});
