import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import React from "react";
import { renderToString } from "react-dom/server";
import ts from "typescript";
import vm from "node:vm";

test("all parameter hooks render defaults on server and before client effects", () => {
  const source = readFileSync(new URL("../src/components/calculators/useNumberParamState.ts", import.meta.url), "utf8");
  const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  const exports = {};
  const context = vm.createContext({ exports, require: () => React });
  vm.runInContext(js, context);
  function Probe() {
    const [number] = exports.useNumberParamState("test.number", 5);
    const [boolean] = exports.useBooleanParamState("test.boolean", false);
    const [string] = exports.useStringParamState("test.string", "flat", ["flat", "tiered"]);
    return React.createElement("span", null, `${number}/${boolean}/${string}`);
  }
  const server = renderToString(React.createElement(Probe));
  context.window = { location: { href: "https://example.com/?test_number=99&test_boolean=1&test_string=tiered" },
    localStorage: { getItem: () => "88" } };
  context.URL = URL;
  assert.equal(renderToString(React.createElement(Probe)), server);
  assert.equal(server, "<span>5/false/flat</span>");
  assert.equal((source.match(/\|\| !restored/g) || []).length, 3);
});