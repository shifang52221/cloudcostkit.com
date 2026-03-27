const baseUrl = String(
  process.env.SITE_URL || process.env.PUBLIC_SITE_URL || "https://cloudcostkit.com",
).replace(/\/+$/, "");

const removedRoutes = [
  "/calculators/aws-api-gateway-request-estimator/",
  "/calculators/aws-kms-request-estimator/",
  "/calculators/aws-sns-delivery-estimator/",
  "/calculators/aws-sqs-request-estimator/",
  "/calculators/aws-waf-request-estimator/",
  "/calculators/compute-instance-cost-calculator/",
  "/calculators/rps-to-monthly-requests-calculator/",
  "/guides/azure/",
  "/guides/backups-and-snapshots-costs/",
  "/guides/gcp/",
  "/guides/kubernetes-cost-calculator/",
  "/guides/requests-costs/",
];

const retainedRoutes = [
  "/guides/request-based-pricing/",
  "/guides/load-balancing-costs/",
  "/guides/metrics-costs/",
  "/calculators/api-request-cost-calculator/",
  "/calculators/cdn-origin-egress-calculator/",
];

async function fetchText(url) {
  const res = await fetch(url, {
    redirect: "follow",
    headers: { "user-agent": "CloudCostKit post-deploy verifier" },
  });
  const text = await res.text();
  return { res, text };
}

function extractLocs(xml) {
  return [...String(xml || "").matchAll(/<loc>(.*?)<\/loc>/gis)].map((match) => match[1].trim());
}

function normalizeRoute(input) {
  const url = new URL(input, `${baseUrl}/`);
  let route = url.pathname || "/";
  if (!route.startsWith("/")) route = `/${route}`;
  if (!route.endsWith("/") && !/\.[a-z0-9]+$/i.test(route)) {
    route = `${route}/`;
  }
  return route;
}

function extractRobots(html) {
  const metaTags = String(html || "").match(/<meta\b[^>]*>/gi) || [];
  for (const tag of metaTags) {
    if (!/name\s*=\s*["']robots["']/i.test(tag)) continue;
    const contentMatch = tag.match(/content\s*=\s*["']([^"']+)["']/i);
    if (contentMatch) return contentMatch[1].trim();
  }
  return "";
}

function isSuccessStatus(status) {
  return status >= 200 && status < 300;
}

function hasNoindex(robots) {
  return /\bnoindex\b/i.test(robots);
}

function hasFollow(robots) {
  return /\bfollow\b/i.test(robots);
}

let failed = false;

console.log(`Verifying live post-deploy surface: ${baseUrl}`);
console.log("");

let liveRoutes = new Set();
let childSitemaps = [];

try {
  const robotsUrl = `${baseUrl}/robots.txt`;
  const { res, text } = await fetchText(robotsUrl);
  const ok = isSuccessStatus(res.status) && /sitemap:/i.test(text);
  if (!ok) failed = true;
  console.log(`${ok ? "OK " : "BAD"} ${res.status} /robots.txt sitemapLine=${/sitemap:/i.test(text)}`);
} catch (error) {
  failed = true;
  console.log(`BAD ERR /robots.txt ${error instanceof Error ? error.message : String(error)}`);
}

try {
  const sitemapIndexUrl = `${baseUrl}/sitemap-index.xml`;
  const { res, text } = await fetchText(sitemapIndexUrl);
  const ok = isSuccessStatus(res.status);
  if (!ok) failed = true;
  console.log(`${ok ? "OK " : "BAD"} ${res.status} /sitemap-index.xml`);

  if (ok) {
    if (/<sitemapindex\b/i.test(text)) {
      childSitemaps = extractLocs(text);
    } else if (/<urlset\b/i.test(text)) {
      liveRoutes = new Set(extractLocs(text).map(normalizeRoute));
    } else {
      failed = true;
      console.log("BAD sitemap-index.xml did not look like a sitemap index or urlset");
    }
  }
} catch (error) {
  failed = true;
  console.log(`BAD ERR /sitemap-index.xml ${error instanceof Error ? error.message : String(error)}`);
}

for (const childUrl of childSitemaps) {
  try {
    const { res, text } = await fetchText(childUrl);
    const urls = /<urlset\b/i.test(text) ? extractLocs(text) : [];
    const ok = isSuccessStatus(res.status) && urls.length > 0;
    if (!ok) failed = true;
    console.log(`${ok ? "OK " : "BAD"} ${res.status} ${new URL(childUrl).pathname} urls=${urls.length}`);
    for (const url of urls) {
      liveRoutes.add(normalizeRoute(url));
    }
  } catch (error) {
    failed = true;
    console.log(
      `BAD ERR ${new URL(childUrl).pathname} ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

console.log("");
console.log(`Live sitemap routes loaded: ${liveRoutes.size}`);
console.log("");

for (const route of removedRoutes) {
  const ok = !liveRoutes.has(route);
  if (!ok) failed = true;
  console.log(`${ok ? "OK " : "BAD"} sitemap absent ${route}`);
}

console.log("");

for (const route of removedRoutes) {
  const url = `${baseUrl}${route}`;
  try {
    const { res, text } = await fetchText(url);
    const robots = extractRobots(text);
    const ok = isSuccessStatus(res.status) && hasNoindex(robots) && hasFollow(robots);
    if (!ok) failed = true;
    console.log(
      `${ok ? "OK " : "BAD"} ${res.status} noindex ${route} robots=${robots || "missing"}`,
    );
  } catch (error) {
    failed = true;
    console.log(`BAD ERR noindex ${route} ${error instanceof Error ? error.message : String(error)}`);
  }
}

console.log("");

for (const route of retainedRoutes) {
  const url = `${baseUrl}${route}`;
  try {
    const { res, text } = await fetchText(url);
    const robots = extractRobots(text);
    const ok = isSuccessStatus(res.status) && !hasNoindex(robots);
    if (!ok) failed = true;
    console.log(
      `${ok ? "OK " : "BAD"} ${res.status} retained ${route} robots=${robots || "missing"}`,
    );
  } catch (error) {
    failed = true;
    console.log(`BAD ERR retained ${route} ${error instanceof Error ? error.message : String(error)}`);
  }
}

console.log("");
if (failed) {
  console.error("Live post-deploy verification failed.");
  process.exit(1);
}

console.log("Live post-deploy verification passed.");
