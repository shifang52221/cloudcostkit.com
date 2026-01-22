import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const TARGET_LAST_UPDATED = "2026-01-22";

function normalizeTypography(text) {
  const replacements = [
    // Common mojibake (UTF-8 interpreted as Windows-1252)
    ["â€™", "'"],
    ["â€˜", "'"],
    ["â€œ", '"'],
    ["â€\u009d", '"'],
    ["â€ť", '"'],
    ["â€ś", '"'],
    ["â€?", '"'],
    ["â€“", "-"],
    ["â€”", "-"],
    ["â€¦", "..."],
    ["Â", ""],
    // Other common artifacts we saw in repo
    ["ā‰?", "~"],
    ["×", "x"],
    ["•", "•"], // keep bullet
  ];

  let out = text;
  for (const [from, to] of replacements) out = out.split(from).join(to);

  // Cyrillic-looking mojibake sequences from mis-decoded quotes (e.g., "тАЬ")
  out = out
    .replace(/тАЬ/g, '"')
    .replace(/тА\?/g, '"')
    .replace(/тАЩ/g, "'")
    .replace(/тА�/g, "'")
    .replace(/тА“/g, '"')
    .replace(/тА”/g, '"')
    .replace(/тА–/g, "-")
    .replace(/тА—/g, "-");

  return out;
}

function guessTopic(fileName) {
  const s = fileName.toLowerCase();
  if (s.includes("cloudfront") || s.includes("cdn")) return "cdn";
  if (s.includes("logs-insights")) return "logs_insights";
  if (s.includes("cloudwatch-logs")) return "logs";
  if (s.includes("cloudwatch-metrics")) return "metrics";
  if (s.includes("cloudwatch-alarms")) return "alarms";
  if (s.includes("api-gateway")) return "api_gateway";
  if (s.includes("route-53")) return "route53";
  if (s.includes("kms")) return "kms";
  if (s.includes("nat-gateway")) return "nat";
  if (s.includes("ebs")) return "ebs";
  if (s.includes("rds") || s.includes("aurora")) return "rds";
  if (s.includes("dynamodb")) return "dynamodb";
  if (s.includes("sqs")) return "sqs";
  if (s.includes("sns")) return "sns";
  if (s.includes("ses")) return "ses";
  if (s.includes("cloudtrail")) return "cloudtrail";
  if (s.includes("waf")) return "waf";
  if (s.includes("s3")) return "s3";
  if (s.includes("eks") || s.includes("kubernetes")) return "eks";
  if (s.includes("lambda")) return "lambda";
  if (s.includes("load-balancer") || s.includes("alb") || s.includes("nlb")) return "load_balancer";
  return "general";
}

function validationBlock(topic) {
  // Keep blocks concise and internal-link heavy.
  switch (topic) {
    case "api_gateway":
      return `
  <h2>Validation checklist</h2>
  <ul>
    <li>Validate requests/month from logs or analytics; do not rely on a single peak RPS snapshot.</li>
    <li>Validate payload sizes (response KB/MB) because transfer can dominate for large payload APIs.</li>
    <li>Re-check incident windows: retries/timeouts can multiply requests and transfer.</li>
  </ul>

  <h2>Related tools</h2>
  <div class="btn-row">
    <a class="btn" href="/calculators/aws-api-gateway-cost-calculator/">API Gateway cost</a>
    <a class="btn" href="/calculators/api-request-cost-calculator/">API request cost</a>
    <a class="btn" href="/calculators/api-response-size-transfer-calculator/">Response transfer</a>
    <a class="btn" href="/guides/request-based-pricing/">Request-based pricing</a>
  </div>
`;
    case "logs_insights":
      return `
  <h2>Validation checklist</h2>
  <ul>
    <li>Validate scanned GB/day from query metrics for a representative week.</li>
    <li>Reduce time ranges and add filters early to prevent broad scans.</li>
    <li>Watch for recurring dashboards that run heavy queries frequently.</li>
  </ul>

  <h2>Related tools</h2>
  <div class="btn-row">
    <a class="btn" href="/calculators/cloudwatch-logs-insights-cost-calculator/">Logs Insights cost</a>
    <a class="btn" href="/calculators/log-search-scan-cost-calculator/">Log scan cost</a>
    <a class="btn" href="/guides/log-costs/">Log costs</a>
    <a class="btn" href="/guides/aws-cloudwatch-logs-insights-cost-optimization/">Reduce scan cost</a>
  </div>
`;
    case "route53":
      return `
  <h2>Validation checklist</h2>
  <ul>
    <li>Validate queries/day from Route 53 metrics or resolver logs for at least 7 days.</li>
    <li>Review TTL defaults: extremely low TTL increases query volume and cost.</li>
    <li>Investigate spikes: retries and resolver misconfig can multiply lookups.</li>
  </ul>

  <h2>Related tools</h2>
  <div class="btn-row">
    <a class="btn" href="/calculators/aws-route-53-cost-calculator/">Route 53 cost</a>
    <a class="btn" href="/guides/aws-route-53-estimate-dns-queries/">Estimate DNS queries</a>
    <a class="btn" href="/guides/aws-route-53-pricing/">Route 53 pricing</a>
    <a class="btn" href="/guides/aws-route-53-cost-optimization/">Route 53 optimization</a>
  </div>
`;
    case "kms":
      return `
  <h2>Validation checklist</h2>
  <ul>
    <li>Validate requests/day from billing/metrics and identify the top callers.</li>
    <li>Watch for spike drivers: retries/timeouts, cold starts, and per-request decrypt patterns.</li>
    <li>After changes, confirm rotation and access policies still meet security requirements.</li>
  </ul>

  <h2>Related tools</h2>
  <div class="btn-row">
    <a class="btn" href="/calculators/aws-kms-cost-calculator/">KMS cost</a>
    <a class="btn" href="/guides/aws-kms-estimate-requests/">Estimate requests</a>
    <a class="btn" href="/guides/aws-kms-pricing/">KMS pricing</a>
    <a class="btn" href="/guides/aws-kms-cost-optimization/">KMS optimization</a>
  </div>
`;
    case "nat":
      return `
  <h2>Validation checklist</h2>
  <ul>
    <li>Validate GB processed from NAT metrics or flow logs (representative week).</li>
    <li>Identify the top traffic sources: images, updates, external APIs, log shipping.</li>
    <li>After changes, confirm reduced GB processed and stable application behavior.</li>
  </ul>

  <h2>Related tools</h2>
  <div class="btn-row">
    <a class="btn" href="/calculators/aws-nat-gateway-cost-calculator/">NAT Gateway cost</a>
    <a class="btn" href="/guides/aws-nat-gateway-estimate-gb-processed/">Estimate GB processed</a>
    <a class="btn" href="/guides/aws-nat-gateway-cost-optimization/">NAT optimization</a>
    <a class="btn" href="/guides/aws-network-costs/">AWS network hub</a>
  </div>
`;
    case "ebs":
      return `
  <h2>Validation checklist</h2>
  <ul>
    <li>Validate storage utilization, IOPS, throughput, and latency for a representative week.</li>
    <li>Separate steady-state vs peak windows (backups/migrations/batch).</li>
    <li>After changes, confirm application SLOs and storage latency remain stable.</li>
  </ul>

  <h2>Related tools</h2>
  <div class="btn-row">
    <a class="btn" href="/calculators/aws-ebs-cost-calculator/">EBS cost</a>
    <a class="btn" href="/calculators/aws-ebs-snapshot-cost-calculator/">Snapshot cost</a>
    <a class="btn" href="/guides/aws-ebs-pricing/">EBS pricing</a>
    <a class="btn" href="/guides/aws-ebs-cost-optimization/">EBS optimization</a>
  </div>
`;
    case "s3":
      return `
  <h2>Validation checklist</h2>
  <ul>
    <li>Validate which boundary is billed: storage, requests, egress, replication, retrieval.</li>
    <li>Separate CDN bandwidth from origin egress (cache fill) when using a CDN.</li>
    <li>Validate units (GB vs GiB) and request units (per 1k/10k/1M).</li>
  </ul>

  <h2>Related tools</h2>
  <div class="btn-row">
    <a class="btn" href="/calculators/s3-cost-calculator/">S3 cost</a>
    <a class="btn" href="/calculators/s3-request-cost-calculator/">S3 requests</a>
    <a class="btn" href="/calculators/data-egress-cost-calculator/">Egress</a>
    <a class="btn" href="/guides/storage-costs/">Storage costs</a>
  </div>
`;
    default:
      return `
  <h2>Validation checklist</h2>
  <ul>
    <li>Validate the primary driver with measured usage from a representative window.</li>
    <li>Confirm units and pricing units (per 10k vs per 1M, GB vs GiB) before trusting the estimate.</li>
    <li>Re-check incident windows: retries/timeouts often multiply cost drivers.</li>
  </ul>

  <h2>Related reading</h2>
  <div class="btn-row">
    <a class="btn" href="/guides/cloud-cost-estimation-checklist/">Cost estimation checklist</a>
    <a class="btn" href="/guides/network-transfer-costs/">Network transfer costs</a>
    <a class="btn" href="/guides/request-based-pricing/">Request-based pricing</a>
  </div>
`;
  }
}

function hasValidationSection(body) {
  return /<h2>\s*Validation checklist\s*<\/h2>/i.test(body);
}

function updateGuideLayoutProps(openTag) {
  let updated = openTag;

  if (/lastUpdated\s*=/.test(updated)) {
    updated = updated.replace(/lastUpdated\s*=\s*"[^"]+"/, `lastUpdated="${TARGET_LAST_UPDATED}"`);
  } else {
    updated = updated.replace(/>$/, ` lastUpdated="${TARGET_LAST_UPDATED}">`);
  }

  return updated;
}

function ensureFaqs(frontmatter, openTag, fileName) {
  if (/faqs\s*=/.test(openTag)) return { frontmatter, openTag };
  if (/const\s+faqs\s*=/.test(frontmatter)) return { frontmatter, openTag: openTag.replace(/>$/, " faqs={faqs}>") };

  const topic = guessTopic(fileName);
  const faqs = (() => {
    switch (topic) {
      case "route53":
        return [
          { q: "What usually drives Route 53 cost?", a: "DNS query volume and hosted zones. Spikes often come from low TTL, retries, or resolver misconfiguration." },
          { q: "How do I estimate queries/month?", a: "Use Route 53 query metrics or resolver logs for a representative week and scale to monthly." },
          { q: "How do I reduce cost safely?", a: "Use sane TTLs for stable records, reduce chatty service discovery patterns, and remove unused zones/records." },
        ];
      case "kms":
        return [
          { q: "What usually drives KMS cost?", a: "Request volume. Key-month charges are usually small unless you create many keys." },
          { q: "Why do KMS costs spike?", a: "Retries/timeouts, cold starts, and per-request decrypt patterns in high-QPS workloads." },
          { q: "How do I validate?", a: "Measure requests/day from billing/metrics and identify top callers before optimizing." },
        ];
      case "nat":
        return [
          { q: "What usually drives NAT Gateway cost?", a: "GB processed plus gateway-hours. GB processed often dominates at scale." },
          { q: "What are common GB sources?", a: "Container image pulls, package updates, external APIs, and log shipping." },
          { q: "How do I reduce cost?", a: "Keep traffic private via endpoints/private access and reduce large recurring downloads." },
        ];
      case "ebs":
        return [
          { q: "What usually drives EBS cost?", a: "GB-month plus provisioned performance (IOPS/throughput) depending on volume type." },
          { q: "What's the common waste pattern?", a: "Over-provisioning capacity or performance for peak 24/7 rather than measuring and sizing." },
          { q: "How do I validate?", a: "Compare provisioned vs actual IOPS/throughput and validate latency during peak windows." },
        ];
      case "logs_insights":
        return [
          { q: "What drives Logs Insights cost?", a: "GB scanned. Broad queries over long time ranges can scan huge datasets." },
          { q: "How do I estimate scanned GB?", a: "Use query metrics (bytes scanned per query) and aggregate to daily/monthly." },
          { q: "How do I reduce scan cost?", a: "Narrow time ranges, add filters early, and avoid recurring broad dashboards." },
        ];
      default:
        return [
          { q: "What is the main cost driver?", a: "It depends on the service, but most cloud bills scale with one or two primary drivers (requests, GB processed, GB-month, or instance-hours)." },
          { q: "How do I estimate quickly?", a: "Start with a measured baseline where possible and use a blended effective rate for planning." },
          { q: "How do I validate?", a: "Compare your estimate against a real week of metrics/billing and verify units and boundaries." },
        ];
    }
  })();

  const faqsBlock =
    `\n\nconst faqs = ${JSON.stringify(faqs, null, 2)};\n`;

  const updatedFrontmatter = frontmatter.replace(/\n---\s*$/m, `${faqsBlock}\n---`);
  const updatedOpenTag = openTag.replace(/>$/, " faqs={faqs}>");
  return { frontmatter: updatedFrontmatter, openTag: updatedOpenTag };
}

function patchOneFile({ filePath, fileName }) {
  return readFile(filePath, "utf8").then((raw) => {
    let text = normalizeTypography(raw);

    // Extract frontmatter and body.
    const parts = text.split("---");
    if (parts.length < 3) return { changed: false, text };
    const frontmatter = `---${parts[1]}---`;
    const body = parts.slice(2).join("---");

    // Find the first <GuideLayout ...> open tag.
    const match = body.match(/<GuideLayout[\s\S]*?>/);
    if (!match) return { changed: false, text };

    const openTag = match[0];
    let updatedOpenTag = updateGuideLayoutProps(openTag);

    let updatedFrontmatter = frontmatter;
    const ensured = ensureFaqs(updatedFrontmatter, updatedOpenTag, fileName);
    updatedFrontmatter = ensured.frontmatter;
    updatedOpenTag = ensured.openTag;

    let updatedBody = body.replace(openTag, updatedOpenTag);

    if (!hasValidationSection(updatedBody)) {
      const topic = guessTopic(fileName);
      updatedBody = updatedBody.replace(/<\/GuideLayout>\s*$/m, `${validationBlock(topic)}\n</GuideLayout>`);
    }

    const rebuilt = `${updatedFrontmatter}${updatedBody}`;
    return { changed: rebuilt !== raw, text: rebuilt };
  });
}

async function main() {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  const guidesDir = path.join(root, "src", "pages", "guides");
  const entries = await readdir(guidesDir, { withFileTypes: true });
  const awsFiles = entries
    .filter((e) => e.isFile() && e.name.startsWith("aws-") && e.name.endsWith(".astro"))
    .map((e) => e.name);

  const touched = [];
  for (const fileName of awsFiles) {
    const filePath = path.join(guidesDir, fileName);
    const raw = await readFile(filePath, "utf8");
    const m = raw.match(/lastUpdated=\"([0-9\-]+)\"/);
    const lastUpdated = m ? m[1] : null;

    // Only upgrade older pages (avoid rewriting newly updated ones repeatedly).
    if (lastUpdated === TARGET_LAST_UPDATED) continue;

    const { changed, text } = await patchOneFile({ filePath, fileName });
    if (!changed) continue;
    await writeFile(filePath, text, "utf8");
    touched.push(fileName);
  }

  touched.sort((a, b) => a.localeCompare(b));
  console.log(`upgrade-aws-guides: updated ${touched.length} files`);
  if (touched.length) console.log(touched.join("\n"));
}

await main();

