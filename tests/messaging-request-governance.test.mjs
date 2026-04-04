import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const normalize = (value) => value.replace(/\s+/g, " ").trim();

const messagingGuide = normalize(readFileSync(new URL("../src/pages/guides/messaging-costs.astro", import.meta.url), "utf8"));
const requestGuide = normalize(
  readFileSync(new URL("../src/pages/guides/request-based-pricing.astro", import.meta.url), "utf8"),
);
const requestHub = normalize(readFileSync(new URL("../src/pages/guides/requests-costs.astro", import.meta.url), "utf8"));

test("messaging guide owns the event and delivery budgeting parent role", () => {
  assert.match(messagingGuide, /This is the event and delivery budgeting parent page/i);
  assert.match(
    messagingGuide,
    /move into generic request math only after the event and delivery pattern is clear/i,
  );
});

test("request-based pricing guide owns the generic request-math role", () => {
  assert.match(requestGuide, /This is the generic request-math and billing-unit guide/i);
  assert.match(
    requestGuide,
    /go back to the messaging parent page if the broader event and delivery budget is still unclear/i,
  );
});

test("requests-costs guide owns the lightweight routing hub role", () => {
  assert.match(requestHub, /This is the lightweight request routing hub/i);
  assert.match(requestHub, /Start with/i);
  assert.match(requestHub, /request-based-pricing/i);
  assert.match(requestHub, /full workflow/i);
});
