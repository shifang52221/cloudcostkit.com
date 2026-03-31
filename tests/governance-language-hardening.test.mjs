import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const aboutPage = readFileSync(new URL("../src/pages/about.astro", import.meta.url), "utf8");
const editorialPage = readFileSync(new URL("../src/pages/editorial-policy.astro", import.meta.url), "utf8");
const methodologyPage = readFileSync(new URL("../src/pages/methodology.astro", import.meta.url), "utf8");
const contactPage = readFileSync(new URL("../src/pages/contact.astro", import.meta.url), "utf8");

test("about page states that weak pages can lose strong placement before removal", () => {
  assert.match(aboutPage, /A weak page can stay live for reference and still lose strong placement in navigation, hub recommendations, and suggested next steps/i);
});

test("editorial policy distinguishes survival from recommendation", () => {
  assert.match(editorialPage, /Survival is not the same thing as recommendation: a page can continue to exist without continuing to deserve prominent routing/i);
});

test("methodology states that reviewed does not mean universally safe", () => {
  assert.match(methodologyPage, /Reviewed does not mean universally safe, complete for every workload, or ready to replace provider-specific review/i);
});

test("contact page states action limits for vague reports and non-automatic adoption", () => {
  assert.match(contactPage, /Reports without a page URL, a concrete broken step, or a clear boundary problem are harder to action well/i);
  assert.match(contactPage, /Review does not guarantee that every suggestion will be adopted exactly as submitted/i);
});
