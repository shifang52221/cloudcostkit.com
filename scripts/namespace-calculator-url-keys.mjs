import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const calculatorsDir = path.join(root, "src", "components", "calculators");

function patchSource(src, base) {
  return src
    .replace(/useNumberParamState\("([^"]+)",/g, (m, key) => {
      if (key.includes(".") || key.includes(":")) return m;
      return `useNumberParamState("${base}.${key}",`;
    })
    .replace(/useBooleanParamState\("([^"]+)",/g, (m, key) => {
      if (key.includes(".") || key.includes(":")) return m;
      return `useBooleanParamState("${base}.${key}",`;
    });
}

async function main() {
  const entries = await readdir(calculatorsDir, { withFileTypes: true });
  const files = entries.filter((e) => e.isFile() && e.name.endsWith(".tsx")).map((e) => e.name);

  const touched = [];
  for (const fileName of files) {
    const base = fileName.replace(/\.tsx$/, "");
    const filePath = path.join(calculatorsDir, fileName);
    const src = await readFile(filePath, "utf8");
    const patched = patchSource(src, base);
    if (patched !== src) {
      await writeFile(filePath, patched, "utf8");
      touched.push(fileName);
    }
  }

  console.log(`namespace-calculator-url-keys: updated ${touched.length} files`);
  for (const t of touched) console.log(`- ${t}`);
}

await main();

