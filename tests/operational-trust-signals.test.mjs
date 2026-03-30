import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const aboutPage = readFileSync(new URL("../src/pages/about.astro", import.meta.url), "utf8");
const editorialPage = readFileSync(new URL("../src/pages/editorial-policy.astro", import.meta.url), "utf8");
const methodologyPage = readFileSync(new URL("../src/pages/methodology.astro", import.meta.url), "utf8");
const contactPage = readFileSync(new URL("../src/pages/contact.astro", import.meta.url), "utf8");

test("about page explains review priorities and downgrade triggers", () => {
  assert.match(aboutPage, /Pages that affect the largest planning decisions are reviewed first/i);
  assert.match(aboutPage, /A page is no longer considered strong enough when it repeats another page's job, hides a key boundary, or keeps causing avoidable user confusion/i);
});

test("editorial policy explains post-submission handling and material revision meaning", () => {
  assert.match(editorialPage, /After a correction is submitted, the first step is to classify the problem/i);
  assert.match(editorialPage, /A material revision means the page's scope, estimate logic, validation path, or interpretation guidance changed in a way that affects how the page should be used/i);
  assert.match(editorialPage, /A page can remain live but lose prominence when it still has reference value but no longer deserves strong navigation or recommendation placement/i);
});

test("methodology defines reviewed semantics and stop-using conditions", () => {
  assert.match(methodologyPage, /On this site, reviewed means the page's visible scope, assumptions, and validation path were checked again against the job the page is supposed to do/i);
  assert.match(methodologyPage, /`Last updated` does not mean every provider document changed that day or that the estimate is universally safe in every scenario/i);
  assert.match(methodologyPage, /Stop using a calculator as your main decision tool when the estimate depends more on missing contract terms, hidden bundled allowances, or unmodeled adjacent services than on the page's visible drivers/i);
});

test("contact page explains triage and how a strong report can change a page", () => {
  assert.match(contactPage, /Requests are triaged by type first: correction, calculator bug, estimate help, new topic request, or general site issue/i);
  assert.match(contactPage, /A strong report can lead to a direct correction, a clearer boundary explanation, a workflow rewrite, or lower prominence for a page that is no longer carrying its job well/i);
});
