import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const calculatorsDir = path.join(repoRoot, "src/pages/calculators");

function listCalculatorPages() {
  const files = fs.readdirSync(calculatorsDir, { withFileTypes: true });
  return files
    .filter((d) => d.isFile() && d.name.endsWith(".astro"))
    .map((d) => path.join(calculatorsDir, d.name));
}

function normalizeAsciiTypography(input) {
  return input
    .replaceAll("×", "x")
    .replaceAll("—", "-")
    .replaceAll("–", "-")
    .replaceAll("’", "'")
    .replaceAll("“", '"')
    .replaceAll("”", '"')
    .replaceAll("≈", "~");
}

function stripUndefinedLines(input) {
  const lines = input.split(/\r?\n/);
  const cleaned = lines.filter((l) => l.trim() !== "undefined");
  return cleaned.join("\n");
}

function buildEnhancementBlock({ fileName, relatedLinks }) {
  const lower = fileName.toLowerCase();

  const inputBullets = [];
  const mistakeBullets = [];
  const validateBullets = [];

  if (lower.includes("log")) {
    inputBullets.push(
      "<strong>Volume</strong>: start from measured ingestion (GB/day) if you have it, then convert to monthly/retention where needed.",
    );
    inputBullets.push("<strong>Retention</strong>: decide retention days and model steady-state GB-month.");
    inputBullets.push("<strong>Queries</strong>: model scan/query volume if your tool bills by GB scanned.");
    mistakeBullets.push("Modeling ingestion but forgetting retention (GB-month) and scan/query costs.");
    mistakeBullets.push("Keeping noisy logs forever instead of setting explicit retention tiers.");
    validateBullets.push("Check ingestion GB/day and retention GB-month after changes.");
    validateBullets.push("Check query scan GB and dashboard refresh frequency (common hidden driver).");
  } else if (lower.includes("metrics") || lower.includes("alarm")) {
    inputBullets.push("<strong>Counts</strong>: start from inventory (custom metrics, alarms, dashboards) per account/environment.");
    inputBullets.push("<strong>Cardinality</strong>: model multiplicative dimensions (service x env x cluster x pod).");
    inputBullets.push("<strong>API polling</strong>: add dashboard refresh and automation polling scenarios.");
    mistakeBullets.push("Using a single average and ignoring peak/high-cardinality scenarios.");
    mistakeBullets.push("Forgetting API polling and dashboard refresh costs.");
    validateBullets.push("Measure actual custom metric/series counts and alarm/dashboards after rollout.");
    validateBullets.push("Watch API request volume trends (dashboards + automation).");
  } else if (lower.includes("transfer") || lower.includes("egress") || lower.includes("bandwidth")) {
    inputBullets.push("<strong>GB/month</strong>: start from billing exports/flow logs; if you only have throughput, convert Mbps to GB/month.");
    inputBullets.push("<strong>Boundaries</strong>: separate cross-AZ vs cross-region vs internet egress as separate line items.");
    inputBullets.push("<strong>Effective rates</strong>: use your blended $/GB for the traffic mix you expect.");
    mistakeBullets.push("Mixing boundaries and applying the wrong $/GB rate.");
    mistakeBullets.push("Ignoring retries/timeouts that multiply traffic during incidents.");
    validateBullets.push("Validate the top transfer paths and AZ/region locality after architecture changes.");
    validateBullets.push("Re-check during peak windows (that’s when hidden multipliers show up).");
  } else if (lower.includes("waf")) {
    inputBullets.push("<strong>Requests</strong>: estimate evaluated requests/month (include blocked traffic).");
    inputBullets.push("<strong>Baselines</strong>: count ACLs and rules as billed in your pricing model.");
    inputBullets.push("<strong>Downstream</strong>: add logging/storage/analytics volume as a second bill.");
    mistakeBullets.push("Budgeting steady traffic but ignoring attack/bot surge scenarios.");
    mistakeBullets.push("Forgetting downstream log/scan costs that can exceed the WAF line item.");
    validateBullets.push("Track evaluated request volume and rule/ACL sprawl over time.");
    validateBullets.push("Check downstream log ingestion and scan/query costs during incidents.");
  } else if (lower.includes("rds") || lower.includes("database")) {
    inputBullets.push("<strong>Compute</strong>: instance-hours (or average serverless capacity) and a peak scenario.");
    inputBullets.push("<strong>Storage</strong>: average GB-month plus growth over time.");
    inputBullets.push("<strong>Backups</strong>: retention and churn (daily changed data x retention days) as a separate line item.");
    mistakeBullets.push("Ignoring backup storage and long-term retention growth.");
    mistakeBullets.push("Modeling only today’s size and missing 3–12 month growth.");
    validateBullets.push("Compare forecast vs actual storage/backup GB-month after a few weeks.");
    validateBullets.push("Re-check during batch jobs or backfills (churn spikes).");
  } else {
    inputBullets.push("<strong>Inputs</strong>: use billing exports, metrics, or logs to get real counts/GB where possible.");
    inputBullets.push("<strong>Units</strong>: convert throughput (Mbps) or rates (RPS) into monthly units when needed.");
    inputBullets.push("<strong>Scenarios</strong>: build a baseline and a high-usage scenario to avoid under-budgeting.");
    mistakeBullets.push("Using a single average and ignoring peak/incident scenarios.");
    mistakeBullets.push("Double-counting or missing adjacent line items (transfer, logs, retries).");
    validateBullets.push("Compare your estimate to the first real bill and adjust assumptions.");
    validateBullets.push("Track the primary driver metric (requests/GB/count) over time.");
  }

  const nextLinks = (relatedLinks || []).slice(0, 4);
  const nextButtons = [
    `<a class="btn" href="/guides/">Guides</a>`,
    `<a class="btn" href="/calculators/">All calculators</a>`,
    ...nextLinks.map((r) => `<a class="btn" href="${r.href}/">${escapeHtml(r.label)}</a>`),
  ].slice(0, 6);

  return [
    `  <div class="prose" style="margin-top:18px">`,
    `    <h2 style="margin-top:0">How to get your inputs</h2>`,
    `    <ul>`,
    ...inputBullets.map((b) => `      <li>${b}</li>`),
    `    </ul>`,
    ``,
    `    <h2>Common mistakes</h2>`,
    `    <ul>`,
    ...mistakeBullets.map((b) => `      <li>${escapeHtml(b)}</li>`),
    `    </ul>`,
    ``,
    `    <h2>Validate after changes</h2>`,
    `    <ul>`,
    ...validateBullets.map((b) => `      <li>${escapeHtml(b)}</li>`),
    `    </ul>`,
    ``,
    `    <h2>Next steps</h2>`,
    `    <div class="btn-row" style="margin-top:0">`,
    ...nextButtons.map((b) => `      ${b}`),
    `    </div>`,
    `  </div>`,
  ].join("\n");
}

function escapeHtml(input) {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function extractRelatedLinks(source) {
  const match = source.match(/related=\{\[\s*([\s\S]*?)\s*\]\}/m);
  if (!match) return [];

  const body = match[1];
  const links = [];
  const re = /\{\s*href:\s*"([^"]+)"\s*,\s*label:\s*"([^"]+)"\s*\}/g;
  let m;
  while ((m = re.exec(body))) {
    links.push({ href: m[1], label: m[2] });
  }
  return links;
}

function upgradeFile(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  const cleaned = stripUndefinedLines(normalizeAsciiTypography(raw));
  const fileName = path.basename(filePath);

  if (!cleaned.includes("</CalculatorLayout>")) return { filePath, changed: false, reason: "no CalculatorLayout close" };
  if (cleaned.includes("How to get your inputs</h2>")) {
    if (cleaned !== raw) {
      fs.writeFileSync(filePath, cleaned, "utf8");
      return { filePath, changed: true, reason: "normalized typography/undefined" };
    }
    return { filePath, changed: false, reason: "already enhanced" };
  }

  const relatedLinks = extractRelatedLinks(cleaned);
  const block = buildEnhancementBlock({ fileName, relatedLinks });

  const updated = cleaned.replace("</CalculatorLayout>", `${block}\n</CalculatorLayout>`);
  fs.writeFileSync(filePath, updated, "utf8");
  return { filePath, changed: true, reason: "enhanced" };
}

function main() {
  const files = listCalculatorPages();
  const results = files.map(upgradeFile);
  const changed = results.filter((r) => r.changed);
  const skipped = results.filter((r) => !r.changed);

  console.log(`Calculator pages: ${files.length}`);
  console.log(`Changed: ${changed.length}`);
  console.log(`Skipped: ${skipped.length}`);

  if (changed.length) {
    console.log("\nChanged files:");
    for (const r of changed) console.log(`- ${path.relative(repoRoot, r.filePath)} (${r.reason})`);
  }
}

main();

