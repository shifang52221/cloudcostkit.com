const baseUrl = String(
  process.env.SITE_URL || process.env.PUBLIC_SITE_URL || "https://cloudcostkit.com",
).replace(/\/+$/, "");

const expectNoAds = String(process.env.EXPECT_NO_ADS || "true").trim().toLowerCase() !== "false";

const trustRoutes = [
  "/",
  "/about/",
  "/contact/",
  "/methodology/",
  "/editorial-policy/",
  "/privacy-policy/",
  "/terms/",
  "/cookie-notice/",
  "/ads.txt",
  "/robots.txt",
];

const monetizationChecks = ["/", "/guides/", "/calculators/ec2-cost-calculator/"];

async function fetchText(url) {
  const res = await fetch(url, {
    redirect: "follow",
    headers: { "user-agent": "CloudCostKit live verifier" },
  });
  const text = await res.text();
  return { res, text };
}

function countMatches(text, pattern) {
  return [...String(text || "").matchAll(pattern)].length;
}

function titleOf(text) {
  const m = String(text || "").match(/<title>(.*?)<\/title>/i);
  return m ? m[1] : "";
}

let failed = false;

console.log(`Verifying live site: ${baseUrl}`);
console.log("");

for (const path of trustRoutes) {
  const url = `${baseUrl}${path}`;
  try {
    const { res, text } = await fetchText(url);
    const ok = res.status >= 200 && res.status < 300;
    if (!ok) failed = true;
    console.log(`${ok ? "OK " : "BAD"} ${res.status} ${path} ${titleOf(text)}`.trim());
  } catch (error) {
    failed = true;
    console.log(`BAD ERR ${path} ${error instanceof Error ? error.message : String(error)}`);
  }
}

console.log("");

for (const path of monetizationChecks) {
  const url = `${baseUrl}${path}`;
  try {
    const { res, text } = await fetchText(url);
    const hasAdsenseScript = /pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js/i.test(text);
    const hasAdsByGoogle = /adsbygoogle/i.test(text);
    const adLabels = countMatches(text, /Advertisement/gi);
    const badAds = expectNoAds && (hasAdsenseScript || hasAdsByGoogle || adLabels > 0);
    if (res.status < 200 || res.status >= 300 || badAds) failed = true;
    console.log(
      `${badAds ? "BAD" : "OK "} ${res.status} ${path} adsenseScript=${hasAdsenseScript} adsContainers=${hasAdsByGoogle} adLabels=${adLabels}`,
    );
  } catch (error) {
    failed = true;
    console.log(`BAD ERR ${path} ${error instanceof Error ? error.message : String(error)}`);
  }
}

console.log("");
if (failed) {
  console.error("Live verification failed.");
  process.exit(1);
}

console.log("Live verification passed.");
