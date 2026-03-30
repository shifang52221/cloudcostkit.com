import test from "node:test";
import assert from "node:assert/strict";

import { buildContactSurface } from "../src/lib/contact-surface.js";

test("buildContactSurface returns visible email and mailto target for full variant", () => {
  const surface = buildContactSurface("admin@cloudcostkit.com");

  assert.equal(surface.email, "admin@cloudcostkit.com");
  assert.equal(surface.mailtoHref, "mailto:admin@cloudcostkit.com");
  assert.equal(surface.variant, "full");
  assert.match(surface.helperText, /copy the address manually/i);
  assert.equal(surface.openLabel, "Open email app");
  assert.equal(surface.copyLabel, "Copy email");
});

test("buildContactSurface returns compact helper copy when requested", () => {
  const surface = buildContactSurface("team@cloudcostkit.com", { variant: "compact" });

  assert.equal(surface.variant, "compact");
  assert.match(surface.helperText, /copy the address below/i);
  assert.equal(surface.statusIdle, "Copy email if the button above does not open your mail app.");
  assert.equal(surface.statusSuccess, "Email copied.");
});
