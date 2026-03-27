import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const templateCleanupPages = [
  "src/pages/guides/load-balancing-costs.astro",
  "src/pages/guides/backups-and-snapshots-costs.astro",
];

const bannedSnippets = [
  'import { GUIDES } from "../../lib/guides.generated";',
  "More load balancing guides",
  "More backup guides",
];

const expectedSnippets = [
  {
    relPath: "src/pages/guides/load-balancing-costs.astro",
    expected: "cross-provider load-balancer diagnosis guide",
    label: "load-balancing page declares diagnosis role",
  },
  {
    relPath: "src/pages/guides/load-balancing-costs.astro",
    expected: 'href="/guides/networking-costs/"',
    label: "load-balancing page links to networking parent",
  },
  {
    relPath: "src/pages/guides/backups-and-snapshots-costs.astro",
    expected: 'robots="noindex,follow"',
    label: "backups page is noindex",
  },
  {
    relPath: "astro.config.mjs",
    expected: '"/guides/backups-and-snapshots-costs/"',
    label: "astro config excludes backups page from sitemap",
  },
  {
    relPath: "src/pages/calculators/storage.astro",
    expected: "Guide: replication and backup cost drivers",
    label: "storage entry page uses narrowed backup label",
  },
  {
    relPath: "src/pages/guides/compute-costs.astro",
    expected: "load-balancer cost diagnosis",
    label: "compute page uses narrowed load-balancing label",
  },
];

let failed = false;

function read(relPath) {
  return fs.readFileSync(path.join(root, relPath), "utf8");
}

for (const relPath of templateCleanupPages) {
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
  console.error("Thin page batch 2C verification failed.");
  process.exit(1);
}

console.log("Thin page batch 2C verification passed.");
