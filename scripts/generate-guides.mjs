import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

function classifyGuide({ fileName, canonicalPath }) {
  const s = `${fileName} ${canonicalPath}`.toLowerCase();
  if (s.includes("/guides/aws") || s.includes("aws-")) return "AWS";
  if (s.includes("/guides/azure") || s.includes("azure-")) return "Azure";
  if (s.includes("/guides/gcp") || s.includes("gcp-")) return "GCP";
  if (s.includes("kubernetes") || s.includes("eks") || s.includes("gke") || s.includes("aks")) return "Kubernetes";
  if (s.includes("cdn") || s.includes("cloudfront") || s.includes("cloudflare")) return "CDN";
  if (s.includes("log") || s.includes("cloudwatch") || s.includes("cloudtrail")) return "Logging";
  if (s.includes("s3") || s.includes("storage") || s.includes("ebs") || s.includes("ecr")) return "Storage";
  if (s.includes("api-gateway") || s.includes("requests")) return "Requests";
  if (s.includes("egress") || s.includes("transfer") || s.includes("vpc") || s.includes("nat") || s.includes("privatelink"))
    return "Networking";
  return "General";
}

function extractTopics({ fileName, canonicalPath, title, description }) {
  const s = `${fileName} ${canonicalPath} ${title} ${description}`.toLowerCase();
  const topics = new Set();

  if (s.includes("egress") || s.includes("data transfer") || s.includes("transfer") || s.includes("bandwidth"))
    topics.add("egress");
  if (s.includes("cdn") || s.includes("cloudfront") || s.includes("front door") || s.includes("cloud cdn"))
    topics.add("cdn");
  if (s.includes("log") || s.includes("logging") || s.includes("cloudwatch") || s.includes("log analytics"))
    topics.add("logging");
  if (s.includes("metrics") || s.includes("monitor") || s.includes("application insights") || s.includes("insights"))
    topics.add("metrics");
  if (s.includes("kubernetes") || s.includes("eks") || s.includes("gke") || s.includes("aks")) topics.add("kubernetes");
  if (
    s.includes("lambda") ||
    s.includes("functions") ||
    s.includes("cloud run") ||
    s.includes("serverless") ||
    s.includes("fargate")
  )
    topics.add("serverless");
  if (
    s.includes("database") ||
    s.includes("rds") ||
    s.includes("aurora") ||
    s.includes("sql") ||
    s.includes("spanner") ||
    s.includes("bigtable")
  )
    topics.add("database");
  if (
    s.includes("queue") ||
    s.includes("pub/sub") ||
    s.includes("pubsub") ||
    s.includes("sns") ||
    s.includes("sqs") ||
    s.includes("service bus") ||
    s.includes("event hubs")
  )
    topics.add("messaging");
  if (s.includes("api") || s.includes("gateway") || s.includes("requests") || s.includes("request")) topics.add("requests");
  if (s.includes("load balancer") || s.includes("alb") || s.includes("nlb") || s.includes("application gateway"))
    topics.add("load-balancing");
  if (s.includes("storage") || s.includes("s3") || s.includes("blob") || s.includes("ecr") || s.includes("acr")) topics.add("storage");
  if (s.includes("waf") || s.includes("armor") || s.includes("security") || s.includes("key vault") || s.includes("kms"))
    topics.add("security");

  return Array.from(topics).sort((a, b) => a.localeCompare(b));
}

function extractFirstStringLiteral(source, needle) {
  const idx = source.indexOf(needle);
  if (idx === -1) return null;
  const tail = source.slice(idx + needle.length);
  const m = tail.match(/=\s*([`"'])([\s\S]*?)\1\s*;/);
  return m ? m[2].replace(/\s+/g, " ").trim() : null;
}

function extractCanonicalPath(source) {
  const m = source.match(/canonicalPath\s*=\s*["']([^"']+)["']/);
  return m ? m[1].trim() : null;
}

async function main() {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  const guidesDir = path.join(root, "src", "pages", "guides");
  const outFile = path.join(root, "src", "lib", "guides.generated.ts");

  const entries = await readdir(guidesDir, { withFileTypes: true });
  const files = entries
    .filter((e) => e.isFile() && e.name.endsWith(".astro") && e.name !== "index.astro")
    .map((e) => e.name)
    .sort((a, b) => a.localeCompare(b));

  const guides = [];
  for (const fileName of files) {
    const fullPath = path.join(guidesDir, fileName);
    const src = await readFile(fullPath, "utf8");

    // Only include real "article" guides (GuideLayout pages), not category hubs (BaseLayout pages).
    if (!src.includes("GuideLayout") || !src.includes("<GuideLayout")) continue;

    const canonicalPath = extractCanonicalPath(src);
    if (!canonicalPath || !canonicalPath.startsWith("/guides/")) continue;

    const title =
      extractFirstStringLiteral(src, "const title") ||
      canonicalPath.replace(/^\/guides\//, "").replace(/\/+$/, "").replace(/-/g, " ");
    const description = extractFirstStringLiteral(src, "const description") || "";
    const category = classifyGuide({ fileName, canonicalPath });
    const slug = canonicalPath.replace(/^\/guides\//, "").replace(/\/+$/, "");
    const topics = extractTopics({ fileName, canonicalPath, title, description });

    guides.push({
      title,
      description,
      canonicalPath,
      category,
      slug,
      topics,
    });
  }

  guides.sort((a, b) => {
    const c = a.category.localeCompare(b.category);
    if (c !== 0) return c;
    return a.title.localeCompare(b.title);
  });

  const header = `// Generated by scripts/generate-guides.mjs. Do not edit by hand.\n\n`;
  const body =
    `export type GuideLink = {\n` +
    `  title: string;\n` +
    `  description: string;\n` +
    `  canonicalPath: string;\n` +
    `  category: string;\n` +
    `  slug: string;\n` +
    `  topics: string[];\n` +
    `};\n\n` +
    `export const GUIDES: GuideLink[] = ${JSON.stringify(guides, null, 2)};\n`;

  await writeFile(outFile, header + body, "utf8");
}

await main();
