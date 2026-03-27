import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const noGuideGridPages = [
  "src/pages/guides/metrics-costs.astro",
  "src/pages/guides/serverless-costs.astro",
];

const bannedSnippets = [
  'import { GUIDES } from "../../lib/guides.generated";',
  "More metrics guides",
  "More serverless guides",
];

const expectedSnippets = [
  {
    relPath: "src/pages/guides/metrics-costs.astro",
    expected: 'href="/guides/observability-costs/"',
    label: "metrics-costs links to observability parent",
  },
  {
    relPath: "src/pages/guides/metrics-costs.astro",
    expected: "metrics-specific deep dive",
    label: "metrics-costs declares deep-dive role",
  },
  {
    relPath: "src/pages/guides/serverless-costs.astro",
    expected: 'href="/guides/compute-costs/"',
    label: "serverless-costs links to compute parent",
  },
  {
    relPath: "src/pages/guides/serverless-costs.astro",
    expected: "cross-provider serverless architecture guide",
    label: "serverless-costs declares specialized role",
  },
  {
    relPath: "src/pages/guides/observability-costs.astro",
    expected: "metrics costs and cardinality governance",
    label: "observability parent uses narrower metrics label",
  },
  {
    relPath: "src/pages/guides/compute-costs.astro",
    expected: "serverless architecture costs",
    label: "compute parent uses narrower serverless label",
  },
  {
    relPath: "src/pages/calculators/logging.astro",
    expected: "Guide: metrics cardinality",
    label: "logging entry page uses narrower metrics label",
  },
];

let failed = false;

function read(relPath) {
  return fs.readFileSync(path.join(root, relPath), "utf8");
}

for (const relPath of noGuideGridPages) {
  const text = read(relPath);
  const hasBanned = bannedSnippets.some((snippet) => text.includes(snippet));
  console.log(`${hasBanned ? "BAD" : "OK "} template cleanup ${relPath}`);
  if (hasBanned) failed = true;
}

for (const check of expectedSnippets) {
  const text = read(check.relPath);
  const ok = text.includes(check.expected);
  console.log(`${ok ? "OK " : "BAD"} ${check.label}`);
  if (!ok) failed = true;
}

if (failed) {
  console.error("Thin page batch 2B verification failed.");
  process.exit(1);
}

console.log("Thin page batch 2B verification passed.");
