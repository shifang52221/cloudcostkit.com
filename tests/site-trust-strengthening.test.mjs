import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const siteConfig = readFileSync(new URL("../src/config/site.ts", import.meta.url), "utf8");
const baseLayout = readFileSync(new URL("../src/layouts/BaseLayout.astro", import.meta.url), "utf8");
const homepage = readFileSync(new URL("../src/pages/index.astro", import.meta.url), "utf8");
const aboutPage = readFileSync(new URL("../src/pages/about.astro", import.meta.url), "utf8");
const methodologyPage = readFileSync(new URL("../src/pages/methodology.astro", import.meta.url), "utf8");
const editorialPage = readFileSync(new URL("../src/pages/editorial-policy.astro", import.meta.url), "utf8");
const contactPage = readFileSync(new URL("../src/pages/contact.astro", import.meta.url), "utf8");

test("site config defines richer trust identity metadata", () => {
  assert.match(siteConfig, /sameAs:/);
  assert.match(siteConfig, /contactLabel:/);
  assert.match(siteConfig, /publisherType:/);
});

test("base layout organization schema includes contact and policy identity signals", () => {
  assert.match(baseLayout, /contactPoint/);
  assert.match(baseLayout, /publishingPrinciples/);
  assert.match(baseLayout, /sameAs/);
});

test("homepage explicitly explains who maintains and reviews the site", () => {
  assert.match(homepage, /maintained by the CloudCostKit Editorial Team/i);
  assert.match(homepage, /how pages are reviewed, challenged, and corrected/i);
});

test("about page explains why the site exists and how responsibility is bounded", () => {
  assert.match(aboutPage, /The site exists to make cloud cost reasoning easier to inspect, challenge, and update before spend decisions harden/i);
  assert.match(aboutPage, /That is why the site favors visible assumptions, explicit boundaries, and correction paths over black-box certainty/i);
});

test("methodology page explains how review and source re-checking work", () => {
  assert.match(methodologyPage, /A reviewed page is expected to show its drivers, boundaries, validation path, and escalation point back to provider documentation or billing evidence/i);
  assert.match(methodologyPage, /When a provider rule matters more than the simplified model, the provider rule wins/i);
});

test("editorial policy explains what a material correction can change", () => {
  assert.match(editorialPage, /A correction can change page wording, page scope, internal routing, calculator guidance, or whether a page keeps prominent placement/i);
});

test("contact page asks for source or evidence when a correction depends on provider rules", () => {
  assert.match(contactPage, /If the issue depends on a provider rule, include the provider document or billing evidence you are using if possible/i);
});
