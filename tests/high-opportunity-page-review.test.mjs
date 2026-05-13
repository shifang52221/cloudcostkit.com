import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const normalize = (value) => value.replace(/\s+/g, " ").trim();

const acrGuide = normalize(
  readFileSync(new URL("../src/pages/guides/azure-container-registry-pricing.astro", import.meta.url), "utf8"),
);
const eventHubsGuide = normalize(
  readFileSync(new URL("../src/pages/guides/azure-event-hubs-pricing.astro", import.meta.url), "utf8"),
);
const cloudRunGuide = normalize(
  readFileSync(new URL("../src/pages/guides/gcp-cloud-run-pricing.astro", import.meta.url), "utf8"),
);
const secretsGuide = normalize(
  readFileSync(new URL("../src/pages/guides/aws-secrets-manager-pricing.astro", import.meta.url), "utf8"),
);

test("ACR guide opens with a tier-choice and pull-topology budgeting decision", () => {
  assert.match(
    acrGuide,
    /The real budgeting decision is usually whether your registry problem is storage growth, pull pressure, or cross-region delivery/i,
  );
});

test("Event Hubs guide opens with replay-aware budgeting framing", () => {
  assert.match(
    eventHubsGuide,
    /The budgeting decision is not just how much data enters Event Hubs, but how retention and rereads change the total stream cost shape/i,
  );
});

test("Cloud Run guide opens with clearer service-shape budgeting framing", () => {
  assert.match(
    cloudRunGuide,
    /Use this page when you need to decide whether Cloud Run cost is mainly being driven by request scale, slow execution, large responses, or logging overhead/i,
  );
});

test("Secrets Manager guide surfaces the main bill-shape question earlier", () => {
  assert.match(
    secretsGuide,
    /The first budgeting question is whether the bill is mostly a secret inventory problem or a request-pattern problem/i,
  );
});
