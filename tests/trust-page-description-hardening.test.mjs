import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

function read(relativePath) {
  return readFileSync(new URL(`../${relativePath}`, import.meta.url), "utf8");
}

function extractDescription(source, label) {
  const match = source.match(/const\s+description\s*=\s*([\s\S]*?);/);
  assert.ok(match, `expected ${label} to define const description`);
  const raw = match[1].trim();
  if (
    (raw.startsWith('"') && raw.endsWith('"')) ||
    (raw.startsWith("'") && raw.endsWith("'")) ||
    (raw.startsWith("`") && raw.endsWith("`"))
  ) {
    return raw.slice(1, -1);
  }

  assert.fail(`could not extract string literal description for ${label}`);
}

test("trust and policy pages keep richer descriptions without collapsing into boilerplate", () => {
  const cases = [
    ["src/pages/about.astro", 145, /calculators|guides|methodology|editorial/i],
    ["src/pages/contact.astro", 145, /corrections|tool requests|estimate|editorial/i],
    ["src/pages/privacy-policy.astro", 145, /browser-side|storage|ads|analytics|privacy/i],
    ["src/pages/terms.astro", 145, /educational use|provider documentation|quotes|validation/i],
    ["src/pages/sitemap.astro", 145, /calculators|guides|pricing workflows|cloud cost/i],
    ["src/pages/cookie-notice.astro", 145, /consent|cookies|browser storage|ads|analytics/i],
    ["src/pages/editorial-policy.astro", 145, /publication|corrections|thin|template-like|workflow/i],
  ];

  const descriptions = cases.map(([file, minLength, pattern]) => {
    const description = extractDescription(read(file), file);
    assert.ok(
      description.length >= minLength,
      `${file} description should be at least ${minLength} chars, got ${description.length}`,
    );
    assert.match(description, pattern, `${file} description should retain its trust-specific role`);
    return description;
  });

  assert.equal(new Set(descriptions).size, descriptions.length, "trust-page descriptions should remain distinct");
});
