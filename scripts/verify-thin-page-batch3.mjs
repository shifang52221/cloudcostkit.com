import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const expectedSnippets = [
  {
    relPath: "src/pages/calculators/compute-instance-cost-calculator.astro",
    expected: 'robots="noindex,follow"',
    label: "compute-instance calculator is noindex",
  },
  {
    relPath: "src/pages/calculators/rps-to-monthly-requests-calculator.astro",
    expected: 'robots="noindex,follow"',
    label: "rps-to-monthly-requests calculator is noindex",
  },
  {
    relPath: "astro.config.mjs",
    expected: '"/calculators/compute-instance-cost-calculator/"',
    label: "astro config excludes compute-instance calculator",
  },
  {
    relPath: "astro.config.mjs",
    expected: '"/calculators/rps-to-monthly-requests-calculator/"',
    label: "astro config excludes rps calculator",
  },
  {
    relPath: "src/pages/calculators/api-response-size-transfer-calculator.astro",
    expected: "Treat this as a support estimator",
    label: "api-response-size-transfer has support-tool framing",
  },
  {
    relPath: "src/pages/calculators/cdn-origin-egress-calculator.astro",
    expected: "This is a specialized support calculator",
    label: "cdn-origin-egress has support-tool framing",
  },
  {
    relPath: "src/pages/calculators/index.astro",
    expected: 'href="/calculators/api-request-cost-calculator/"',
    label: "calculators hub promotes api-request-cost instead of rps helper",
  },
  {
    relPath: "src/pages/methodology.astro",
    expected: 'href={withTrailingSlash("/calculators/api-request-cost-calculator")}',
    label: "methodology page no longer features rps helper",
  },
  {
    relPath: "src/pages/calculators/azure.astro",
    expected: "Support: response transfer estimate",
    label: "azure hub narrows response-transfer label",
  },
  {
    relPath: "src/pages/calculators/gcp.astro",
    expected: "Support: response transfer estimate",
    label: "gcp hub narrows response-transfer label",
  },
];

const bannedSnippets = [
  {
    relPath: "src/pages/calculators/index.astro",
    banned: '<a class="btn" href="/calculators/rps-to-monthly-requests-calculator/">RPS to monthly requests</a>',
    label: "calculators hub does not feature rps helper as workflow CTA",
  },
  {
    relPath: "src/pages/methodology.astro",
    banned: 'withTrailingSlash("/calculators/rps-to-monthly-requests-calculator")',
    label: "methodology page does not feature rps helper as starting point",
  },
  {
    relPath: "src/pages/calculators/azure.astro",
    banned: 'href="/calculators/compute-instance-cost-calculator/"',
    label: "azure hub no longer promotes compute-instance helper",
  },
  {
    relPath: "src/pages/calculators/gcp.astro",
    banned: 'href="/calculators/compute-instance-cost-calculator/"',
    label: "gcp hub no longer promotes compute-instance helper",
  },
];

let failed = false;

function read(relPath) {
  return fs.readFileSync(path.join(root, relPath), "utf8");
}

for (const check of expectedSnippets) {
  const text = read(check.relPath);
  const ok = text.includes(check.expected);
  console.log(`${ok ? "OK " : "BAD"} ${check.label}`);
  if (!ok) failed = true;
}

for (const check of bannedSnippets) {
  const text = read(check.relPath);
  const ok = !text.includes(check.banned);
  console.log(`${ok ? "OK " : "BAD"} ${check.label}`);
  if (!ok) failed = true;
}

if (failed) {
  console.error("Thin page batch 3 verification failed.");
  process.exit(1);
}

console.log("Thin page batch 3 verification passed.");
