import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const normalize = (value) => value.replace(/\s+/g, " ").trim();

const serverlessGuide = normalize(
  readFileSync(new URL("../src/pages/guides/serverless-costs.astro", import.meta.url), "utf8"),
);
const lambdaGuide = normalize(
  readFileSync(new URL("../src/pages/guides/aws-lambda-pricing.astro", import.meta.url), "utf8"),
);
const azureFunctionsGuide = normalize(
  readFileSync(new URL("../src/pages/guides/azure-functions-pricing.astro", import.meta.url), "utf8"),
);
const cloudRunGuide = normalize(
  readFileSync(new URL("../src/pages/guides/gcp-cloud-run-pricing.astro", import.meta.url), "utf8"),
);

test("serverless parent guide owns the cross-provider architecture budgeting role", () => {
  assert.match(serverlessGuide, /This is the cross-provider serverless architecture budgeting parent page/i);
  assert.match(serverlessGuide, /route into provider-specific pricing pages only after the workload shape is clear/i);
});

test("Lambda guide owns the Lambda bill-boundary role", () => {
  assert.match(lambdaGuide, /This is the AWS Lambda bill-boundary page/i);
  assert.match(lambdaGuide, /go back to the serverless parent guide if the broader system model is still unclear/i);
});

test("Azure Functions guide owns the execution and pricing boundary role", () => {
  assert.match(azureFunctionsGuide, /This is the Azure Functions execution and pricing boundary page/i);
  assert.match(azureFunctionsGuide, /go back to the serverless parent guide if the event-system model is still unclear/i);
});

test("Cloud Run guide owns the service behavior and pricing decision role", () => {
  assert.match(cloudRunGuide, /This is the Cloud Run service behavior and pricing decision page/i);
  assert.match(cloudRunGuide, /go back to the serverless parent guide if the broader architecture model is still unclear/i);
});
