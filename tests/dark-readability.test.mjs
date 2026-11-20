import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const css = readFileSync(new URL("../src/styles/global.css", import.meta.url), "utf8");
const hex = (name) => css.match(new RegExp(`--${name}:#([0-9a-f]{6})`))[1];
function luminance(h) {
  const rgb = [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16) / 255)
    .map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4);
  return rgb[0] * .2126 + rgb[1] * .7152 + rgb[2] * .0722;
}
test("opaque reading surfaces support body and secondary text contrast", () => {
  for (const surface of ["bg", "panel", "panel2"]) {
    for (const text of ["text", "muted"]) {
      const a = luminance(hex(text)), b = luminance(hex(surface));
      assert.ok((Math.max(a,b)+.05)/(Math.min(a,b)+.05) >= 4.5, `${text} on ${surface}`);
    }
  }
});
test("long-form text and numbers have scoped readability rules", () => {
  assert.match(css, /\.prose > p\{max-width:78ch\}/);
  assert.match(css, /\.hint\{font-size:13px; line-height:1\.5; color:var\(--muted\)\}/);
  assert.match(css, /\.kpi \.v\{[^}]*font-variant-numeric:tabular-nums/);
});