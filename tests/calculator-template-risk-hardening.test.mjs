import test from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = new URL("../src/pages/calculators/", import.meta.url);

function walk(dirUrl) {
  const items = [];
  const dirPath = fileURLToPath(dirUrl);
  for (const entry of readdirSync(dirPath, { withFileTypes: true })) {
    const entryUrl = new URL(entry.name, dirUrl);
    if (entry.isDirectory()) items.push(...walk(new URL(`${entry.name}/`, dirUrl)));
    else if (entry.isFile() && entry.name.endsWith(".astro")) items.push(entryUrl);
  }
  return items;
}

function extractStringLiteral(source, identifier, label) {
  const match = source.match(new RegExp(`const\\s+${identifier}\\s*=\\s*([\\s\\S]*?);`));
  assert.ok(match, `expected ${label} to define const ${identifier}`);
  const raw = match[1].trim();
  if (
    (raw.startsWith('"') && raw.endsWith('"')) ||
    (raw.startsWith("'") && raw.endsWith("'")) ||
    (raw.startsWith("`") && raw.endsWith("`"))
  ) {
    return raw.slice(1, -1);
  }
  assert.fail(`could not extract string literal ${identifier} for ${label}`);
}

test("indexable calculator descriptions no longer rely on the Educational use only boilerplate suffix", () => {
  const files = walk(root);
  for (const fileUrl of files) {
    const file = path.relative(process.cwd(), fileURLToPath(fileUrl)).replace(/\\/g, "/");
    const source = readFileSync(fileUrl, "utf8");
    const robotsMatch = source.match(/robots\s*=\s*"([^"]+)"/);
    const robots = robotsMatch ? robotsMatch[1] : "index,follow";
    if (/noindex/i.test(robots)) continue;
    const description = extractStringLiteral(source, "description", file);
    assert.doesNotMatch(
      description,
      /Educational use only\./i,
      `${file} description should not use the educational boilerplate suffix`,
    );
  }
});

test("unit converter page uses unit-specific guidance instead of generic calculator boilerplate", () => {
  const source = readFileSync(new URL("../src/pages/calculators/unit-converter.astro", import.meta.url), "utf8");
  assert.doesNotMatch(source, /<h2 style="margin-top:0">How to get your inputs<\/h2>/);
  assert.doesNotMatch(source, /<h2>Result interpretation<\/h2>/);
  assert.doesNotMatch(source, /<h2>Common mistakes<\/h2>/);
  assert.doesNotMatch(source, /<h2>Validate after changes<\/h2>/);
  assert.match(source, /<h2[^>]*>Where unit mistakes distort cloud bills<\/h2>/);
  assert.match(source, /<h2[^>]*>How to convert throughput into monthly transfer<\/h2>/);
});

test("reserved vs on-demand page uses commitment-specific guidance instead of generic calculator boilerplate", () => {
  const source = readFileSync(
    new URL("../src/pages/calculators/reserved-vs-on-demand-break-even-calculator.astro", import.meta.url),
    "utf8",
  );
  assert.doesNotMatch(source, /<h2 style="margin-top:0">How to get your inputs<\/h2>/);
  assert.doesNotMatch(source, /<h2>Result interpretation<\/h2>/);
  assert.doesNotMatch(source, /<h2>Common mistakes<\/h2>/);
  assert.doesNotMatch(source, /<h2>Validate after changes<\/h2>/);
  assert.match(source, /<h2[^>]*>What a break-even calculator can and cannot tell you<\/h2>/);
  assert.match(source, /<h2[^>]*>Inputs that change the payback story fastest<\/h2>/);
});
