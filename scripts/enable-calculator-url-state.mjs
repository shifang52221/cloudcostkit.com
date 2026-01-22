import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const calculatorsDir = path.join(root, "src", "components", "calculators");

const numericLiteral = String.raw`(?:\d(?:[\d_]*)(?:\.\d[\d_]*)?|\.\d[\d_]+)(?:e[+-]?\d+)?`;

const stateDeclRe = new RegExp(
  String.raw`const\s+\[(?<name>[A-Za-z_]\w*),\s*(?<setter>[A-Za-z_]\w*)\]\s*=\s*useState\(\s*(?<def>${numericLiteral})\s*\)\s*;`,
  "g",
);

function ensureHookImport(src) {
  if (src.includes('from "./useNumberParamState"')) return src;
  const lines = src.split(/\r?\n/);
  const reactImportIdx = lines.findIndex((l) => l.includes('from "react"'));
  const insertAt = reactImportIdx >= 0 ? reactImportIdx + 1 : 0;
  lines.splice(insertAt, 0, 'import { useNumberParamState } from "./useNumberParamState";');
  return lines.join("\n");
}

function maybeDropUseStateFromReactImport(src) {
  if (src.includes("useState(")) return src;
  return src.replace(
    /import\s+React,\s*\{\s*([^}]+)\s*\}\s+from\s+"react";/g,
    (m, inner) => {
      const next = inner
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .filter((s) => s !== "useState");
      return `import React, { ${next.join(", ")} } from "react";`;
    },
  );
}

function patchFile(src) {
  let out = src;

  if (!out.includes("useNumberParamState")) out = ensureHookImport(out);

  out = out.replace(stateDeclRe, (m, _p1, _p2, _p3, offset, whole, groups) => {
    const { name, setter, def } = groups;
    return `const [${name}, ${setter}] = useNumberParamState("${name}", ${def});`;
  });

  out = maybeDropUseStateFromReactImport(out);
  return out;
}

async function main() {
  const entries = await readdir(calculatorsDir, { withFileTypes: true });
  const files = entries.filter((e) => e.isFile() && e.name.endsWith(".tsx")).map((e) => e.name);

  const touched = [];
  for (const fileName of files) {
    const filePath = path.join(calculatorsDir, fileName);
    const src = await readFile(filePath, "utf8");
    if (!src.includes("useState(")) continue;
    const patched = patchFile(src);
    if (patched !== src) {
      await writeFile(filePath, patched, "utf8");
      touched.push(fileName);
    }
  }

  console.log(`enable-calculator-url-state: updated ${touched.length} files`);
  for (const t of touched) console.log(`- ${t}`);
}

await main();

