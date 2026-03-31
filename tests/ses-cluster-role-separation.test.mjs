import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const pricingPage = readFileSync(new URL("../src/pages/guides/aws-ses-pricing.astro", import.meta.url), "utf8");
const estimatePage = readFileSync(new URL("../src/pages/guides/aws-ses-estimate-email-volume.astro", import.meta.url), "utf8");
const optimizationPage = readFileSync(new URL("../src/pages/guides/aws-ses-cost-optimization.astro", import.meta.url), "utf8");

test("pricing page is framed as the bill-boundary page", () => {
  assert.match(
    pricingPage,
    /Use this page when you need to decide what belongs inside the SES bill model before you argue about optimization/i,
  );
  assert.match(
    pricingPage,
    /This guide is about bill boundaries: send volume, payload-sensitive line items, dedicated IP or add-on charges, and the downstream workflow costs that should be tracked beside SES rather than confused with it/i,
  );
});

test("estimate page is framed as the send-measurement workflow page", () => {
  assert.match(
    estimatePage,
    /This page is the send-measurement workflow, not the bill-boundary page: the goal is to turn product events, campaign calendars, recipient counts, and resend behavior into a defendable email-volume model/i,
  );
  assert.match(
    estimatePage,
    /If you still are not sure which costs and traffic belong inside the SES bill, go back to the pricing guide first/i,
  );
});

test("optimization page is framed as the production intervention page", () => {
  assert.match(
    optimizationPage,
    /Optimization starts only after the SES send model is believable; otherwise teams suppress the wrong emails and keep the real retry or duplicate driver/i,
  );
  assert.match(
    optimizationPage,
    /This page is for production intervention: dedupe, retry control, non-prod suppression, batching, and preference controls/i,
  );
});
