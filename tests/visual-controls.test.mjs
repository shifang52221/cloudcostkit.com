import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const css = readFileSync(new URL("../src/styles/global.css", import.meta.url), "utf8");
test("primary controls have an opaque background and consistent link/button typography", () => {
  assert.match(css, /\.btn-primary\{[^}]*background:var\(--brand\);[^}]*color:#0a0e16;/s);
  assert.match(css, /\.btn\{[^}]*font-family:inherit;[^}]*font-size:14px;[^}]*line-height:1\.4;[^}]*text-decoration:none;/s);
});
test("checkboxes do not inherit full-width input layout and grids can shrink", () => {
  assert.match(css, /input\[type="checkbox"\], input\[type="radio"\]\{[^}]*width:18px;[^}]*flex:0 0 18px;/s);
  assert.match(css, /grid-template-columns: minmax\(0, 1\.1fr\) minmax\(0, \.9fr\)/);
});