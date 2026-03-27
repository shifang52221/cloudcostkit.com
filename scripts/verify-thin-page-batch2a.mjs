import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const robotPages = [
  "src/pages/guides/requests-costs.astro",
  "src/pages/guides/kubernetes-cost-calculator.astro",
];

const excludedRoutes = [
  "/guides/requests-costs/",
  "/guides/kubernetes-cost-calculator/",
];

const linkExpectations = [
  {
    relPath: "src/pages/calculators/finops.astro",
    expected: 'href="/guides/request-based-pricing/"',
    label: "FinOps hub points to request-based-pricing",
  },
  {
    relPath: "src/pages/guides/serverless-costs.astro",
    expected: 'href="/guides/request-based-pricing/"',
    label: "Serverless guide points to request-based-pricing",
  },
  {
    relPath: "src/pages/calculators/kubernetes-cost-calculator.astro",
    expected: 'href: "/guides/kubernetes-costs"',
    label: "Kubernetes calculator related link points to kubernetes-costs",
  },
  {
    relPath: "src/pages/calculators/kubernetes-requests-limits-calculator.astro",
    expected: 'href="/guides/kubernetes-costs/"',
    label: "Kubernetes requests-limits next step points to kubernetes-costs",
  },
  {
    relPath: "src/pages/calculators/kubernetes-node-cost-calculator.astro",
    expected: 'href="/guides/kubernetes-costs/"',
    label: "Kubernetes node-cost next step points to kubernetes-costs",
  },
  {
    relPath: "src/pages/guides/kubernetes-requests-limits.astro",
    expected: 'href="/guides/kubernetes-costs/"',
    label: "Kubernetes requests-limits guide points to kubernetes-costs",
  },
  {
    relPath: "src/pages/index.astro",
    expected: 'href="/guides/kubernetes-costs/"',
    label: "Homepage guide card points to kubernetes-costs",
  },
];

let failed = false;

function read(relPath) {
  return fs.readFileSync(path.join(root, relPath), "utf8");
}

for (const relPath of robotPages) {
  const text = read(relPath);
  const ok = /robots="noindex,follow"/.test(text);
  console.log(`${ok ? "OK " : "BAD"} robots ${relPath}`);
  if (!ok) failed = true;
}

const astroConfig = read("astro.config.mjs");

for (const route of excludedRoutes) {
  const ok = astroConfig.includes(`"${route}"`);
  console.log(`${ok ? "OK " : "BAD"} sitemap ${route}`);
  if (!ok) failed = true;
}

for (const check of linkExpectations) {
  const text = read(check.relPath);
  const ok = text.includes(check.expected);
  console.log(`${ok ? "OK " : "BAD"} ${check.label}`);
  if (!ok) failed = true;
}

if (failed) {
  console.error("Thin page batch 2A verification failed.");
  process.exit(1);
}

console.log("Thin page batch 2A verification passed.");
