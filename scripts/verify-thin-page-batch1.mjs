import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const targetPages = [
  "src/pages/guides/gcp.astro",
  "src/pages/guides/azure.astro",
  "src/pages/calculators/aws-api-gateway-request-estimator.astro",
  "src/pages/calculators/aws-kms-request-estimator.astro",
  "src/pages/calculators/aws-sns-delivery-estimator.astro",
  "src/pages/calculators/aws-sqs-request-estimator.astro",
  "src/pages/calculators/aws-waf-request-estimator.astro",
];

const excludedRoutes = [
  "/guides/gcp/",
  "/guides/azure/",
  "/calculators/aws-api-gateway-request-estimator/",
  "/calculators/aws-kms-request-estimator/",
  "/calculators/aws-sns-delivery-estimator/",
  "/calculators/aws-sqs-request-estimator/",
  "/calculators/aws-waf-request-estimator/",
];

let failed = false;

function read(relPath) {
  return fs.readFileSync(path.join(root, relPath), "utf8");
}

for (const relPath of targetPages) {
  const text = read(relPath);
  const ok = /robots="noindex,follow"/.test(text);
  console.log(`${ok ? "OK " : "BAD"} robots ${relPath}`);
  if (!ok) failed = true;
}

const guideLayout = read("src/layouts/GuideLayout.astro");
const calcLayout = read("src/layouts/CalculatorLayout.astro");
const astroConfig = read("astro.config.mjs");

const layoutChecks = [
  ["GuideLayout robots prop", /robots\?: string;/.test(guideLayout) && /const \{[^}]*robots[^}]*\} = Astro\.props;/s.test(guideLayout) && /<BaseLayout[\s\S]*robots=\{robots\}/.test(guideLayout)],
  ["CalculatorLayout robots prop", /robots\?: string;/.test(calcLayout) && /const \{[^}]*robots[^}]*\} = Astro\.props;/s.test(calcLayout) && /<BaseLayout[\s\S]*robots=\{robots\}/.test(calcLayout)],
];

for (const [label, ok] of layoutChecks) {
  console.log(`${ok ? "OK " : "BAD"} ${label}`);
  if (!ok) failed = true;
}

for (const route of excludedRoutes) {
  const ok = astroConfig.includes(`"${route}"`);
  console.log(`${ok ? "OK " : "BAD"} sitemap ${route}`);
  if (!ok) failed = true;
}

if (failed) {
  console.error("Thin page batch 1 verification failed.");
  process.exit(1);
}

console.log("Thin page batch 1 verification passed.");
