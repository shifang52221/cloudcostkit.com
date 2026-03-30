import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const homepage = readFileSync(new URL("../src/pages/index.astro", import.meta.url), "utf8");
const aboutPage = readFileSync(new URL("../src/pages/about.astro", import.meta.url), "utf8");
const editorialPage = readFileSync(new URL("../src/pages/editorial-policy.astro", import.meta.url), "utf8");
const methodologyPage = readFileSync(new URL("../src/pages/methodology.astro", import.meta.url), "utf8");
const contactPage = readFileSync(new URL("../src/pages/contact.astro", import.meta.url), "utf8");
const baseLayout = readFileSync(new URL("../src/layouts/BaseLayout.astro", import.meta.url), "utf8");

test("homepage exposes a visible trust path", () => {
  assert.match(homepage, /Review how this site works/i);
  assert.match(homepage, /Editorial standards/i);
  assert.match(homepage, /Report a correction/i);
});

test("about page states what the site does not replace", () => {
  assert.match(aboutPage, /does not replace provider billing exports, negotiated contract pricing, procurement review, or financial sign-off/i);
});

test("editorial policy includes explicit consolidation and removal language", () => {
  assert.match(editorialPage, /consolidated or removed when its job is already handled better elsewhere/i);
});

test("methodology explains when not to trust the estimate yet", () => {
  assert.match(methodologyPage, /When not to trust the estimate yet/i);
});

test("contact page sets clearer correction intake and response expectations", () => {
  assert.match(contactPage, /For correction requests, include:/i);
  assert.match(contactPage, /aim to review clear correction or bug reports within a few business days/i);
});

test("base layout footer states stronger independence and boundary language", () => {
  assert.match(baseLayout, /Not a substitute for provider billing exports, contract pricing, sales quotes, or formal financial advice/i);
});
