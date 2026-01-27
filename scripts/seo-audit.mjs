import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const DEFAULT_BASE_URL = process.env.SITE_URL || process.env.PUBLIC_SITE_URL || "https://cloudcostkit.com";

function nowStamp() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}_${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
}

function shouldHaveTrailingSlash(pathname) {
  if (pathname === "/") return false;
  if (pathname.endsWith("/")) return false;
  const last = pathname.split("/").pop() || "";
  if (last.includes(".")) return false;
  return true;
}

function normalizeInternalPathname(pathname) {
  if (!pathname.startsWith("/")) pathname = `/${pathname}`;
  if (shouldHaveTrailingSlash(pathname)) return `${pathname}/`;
  return pathname;
}

function normalizeUrl(input, baseUrl) {
  try {
    const u = new URL(input, baseUrl);
    u.hash = "";
    // Keep query params; they can represent distinct states, but treat as separate URLs.
    u.pathname = normalizeInternalPathname(u.pathname);
    return u.toString();
  } catch {
    return null;
  }
}

function isSameSite(url, baseUrl) {
  try {
    const u = new URL(url);
    const b = new URL(baseUrl);
    const hostA = u.hostname.replace(/^www\./i, "").toLowerCase();
    const hostB = b.hostname.replace(/^www\./i, "").toLowerCase();
    return hostA === hostB;
  } catch {
    return false;
  }
}

async function fetchWithRedirectChain(url, { maxRedirects = 10, timeoutMs = 20_000 } = {}) {
  const chain = [];
  let current = url;
  for (let i = 0; i <= maxRedirects; i++) {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), timeoutMs);
    let res;
    try {
      try {
        res = await fetch(current, {
          redirect: "manual",
          signal: ctrl.signal,
          headers: {
            "user-agent": "CloudCostKit SEO Audit (+https://cloudcostkit.com/)",
            accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          },
        });
      } catch (e) {
        chain.push({ url: current, status: 0, location: null, error: e instanceof Error ? e.message : String(e) });
        return { finalUrl: current, status: 0, headers: {}, contentType: "", body: "", chain };
      }
    } finally {
      clearTimeout(t);
    }

    const status = res.status;
    const location = res.headers.get("location");
    chain.push({ url: current, status, location });

    if (status >= 300 && status < 400 && location) {
      const next = normalizeUrl(location, current);
      if (!next) break;
      current = next;
      continue;
    }

    const contentType = res.headers.get("content-type") || "";
    const body = await res.text().catch(() => "");
    return { finalUrl: res.url || current, status, headers: Object.fromEntries(res.headers.entries()), contentType, body, chain };
  }
  return { finalUrl: current, status: 0, headers: {}, contentType: "", body: "", chain };
}

function extractFirst(html, re) {
  const m = html.match(re);
  return m ? String(m[1] || "").trim() : null;
}

function decodeEntities(s) {
  return String(s || "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'");
}

function stripTags(html) {
  let s = String(html || "");
  s = s.replace(/<script[\s\S]*?<\/script>/gi, " ");
  s = s.replace(/<style[\s\S]*?<\/style>/gi, " ");
  s = s.replace(/<noscript[\s\S]*?<\/noscript>/gi, " ");
  s = s.replace(/<svg[\s\S]*?<\/svg>/gi, " ");
  s = s.replace(/<[^>]+>/g, " ");
  s = decodeEntities(s);
  s = s.replace(/\s+/g, " ").trim();
  return s;
}

function extractMainHtml(html) {
  const lower = html.toLowerCase();
  const mainOpenIdx = lower.indexOf("<main");
  if (mainOpenIdx !== -1) {
    const mainTagEnd = lower.indexOf(">", mainOpenIdx);
    if (mainTagEnd !== -1) {
      const mainCloseIdx = lower.indexOf("</main>", mainTagEnd);
      if (mainCloseIdx !== -1) return html.slice(mainTagEnd + 1, mainCloseIdx);
    }
  }
  const bodyOpenIdx = lower.indexOf("<body");
  if (bodyOpenIdx !== -1) {
    const bodyTagEnd = lower.indexOf(">", bodyOpenIdx);
    if (bodyTagEnd !== -1) {
      const bodyCloseIdx = lower.indexOf("</body>", bodyTagEnd);
      if (bodyCloseIdx !== -1) return html.slice(bodyTagEnd + 1, bodyCloseIdx);
    }
  }
  return html;
}

function removeH2Section(html, headingText) {
  // Remove from <h2 ...>Heading</h2> until next <h2 ...> or end of string.
  // Works on rendered HTML and is resilient to minified output.
  const escaped = headingText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`<h2\\b[^>]*>\\s*${escaped}\\s*<\\/h2>[\\s\\S]*?(?=<h2\\b|$)`, "gi");
  return String(html || "").replace(re, " ");
}

function removeCommonBlocks(html, category) {
  let s = String(html || "");
  if (category === "calculator") {
    s = removeH2Section(s, "How to get your inputs");
    s = removeH2Section(s, "Common mistakes");
    s = removeH2Section(s, "Validate after changes");
    s = removeH2Section(s, "Next steps");
  }
  if (category === "guide") {
    s = removeH2Section(s, "Related guides");
    s = removeH2Section(s, "Related calculators");
    s = removeH2Section(s, "FAQ");
    s = s.replace(/<div[^>]*>\s*Last updated:\s*[^<]*<\/div>/gi, " ");
  }
  return s;
}

function wordCount(text) {
  const t = stripTags(text);
  if (!t) return 0;
  return t.split(/\s+/).filter(Boolean).length;
}

function extractTitle(html) {
  return extractFirst(html, /<title[^>]*>([\s\S]*?)<\/title>/i);
}

function extractMetaContent(html, name) {
  const re = new RegExp(`<meta[^>]*name=[\"']${name}[\"'][^>]*content=[\"']([^\"']+)[\"'][^>]*>`, "i");
  return extractFirst(html, re);
}

function extractCanonical(html) {
  const re = /<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/i;
  return extractFirst(html, re);
}

function extractHreflang(html) {
  const out = [];
  const re = /<link[^>]*rel=["']alternate["'][^>]*hreflang=["']([^"']+)["'][^>]*href=["']([^"']+)["'][^>]*>/gi;
  let m;
  while ((m = re.exec(html))) {
    out.push({ hreflang: String(m[1] || "").trim(), href: String(m[2] || "").trim() });
  }
  return out;
}

function extractInternalLinks(html, baseUrl) {
  const out = new Set();
  const re = /<a\b[^>]*\bhref\s*=\s*(["'])(.*?)\1/gi;
  let m;
  while ((m = re.exec(html))) {
    const href = String(m[2] || "").trim();
    if (!href) continue;
    if (href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) continue;
    const abs = normalizeUrl(href, baseUrl);
    if (!abs) continue;
    if (!isSameSite(abs, baseUrl)) continue;
    out.add(abs);
  }
  return Array.from(out);
}

function extractJsonLd(html) {
  const blocks = [];
  const errors = [];
  const re = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(html))) {
    const raw = String(m[1] || "").trim();
    if (!raw) continue;
    try {
      blocks.push(JSON.parse(raw));
    } catch (e) {
      errors.push({ message: e instanceof Error ? e.message : String(e), excerpt: raw.slice(0, 180) });
    }
  }
  return { blocks, errors };
}

function categorize(url) {
  try {
    const u = new URL(url);
    const p = u.pathname;
    if (p === "/") return "category";
    if (p.startsWith("/calculators/")) {
      if (p === "/calculators/" || p.split("/").filter(Boolean).length === 1) return "category";
      // Hub pages are also under /calculators/{topic}/
      const segs = p.split("/").filter(Boolean);
      if (segs.length === 2 && ["networking", "logging", "storage", "kubernetes", "finops", "units", "aws", "azure", "gcp"].includes(segs[1]))
        return "category";
      return "calculator";
    }
    if (p.startsWith("/guides/")) {
      if (p === "/guides/") return "category";
      const segs = p.split("/").filter(Boolean);
      if (segs.length === 2 && ["aws", "azure", "gcp"].includes(segs[1])) return "category";
      return "guide";
    }
    if (p === "/sitemap/" || p.endsWith(".xml") || p.endsWith(".txt")) return "resource";
    if (p.endsWith(".js") || p.endsWith(".css") || p.endsWith(".ico") || p.endsWith(".svg")) return "static";
    return "resource";
  } catch {
    return "resource";
  }
}

function normalizeCanonical(canonicalHref, baseUrl) {
  if (!canonicalHref) return null;
  return normalizeUrl(canonicalHref, baseUrl);
}

function normalizeFinalUrl(finalUrl, baseUrl) {
  return normalizeUrl(finalUrl, baseUrl);
}

function simhash64(tokens) {
  // Very small, dependency-free SimHash for near-duplicate clustering.
  // Tokens -> 64-bit BigInt hash -> +/- weight vector -> final bits.
  const v = new Array(64).fill(0);
  for (const t of tokens) {
    const h = fnv1a64(t);
    for (let i = 0; i < 64; i++) {
      const bit = (h >> BigInt(i)) & 1n;
      v[i] += bit === 1n ? 1 : -1;
    }
  }
  let out = 0n;
  for (let i = 0; i < 64; i++) {
    if (v[i] > 0) out |= 1n << BigInt(i);
  }
  return out;
}

function fnv1a64(str) {
  let h = 0xcbf29ce484222325n;
  const prime = 0x100000001b3n;
  const s = String(str);
  for (let i = 0; i < s.length; i++) {
    h ^= BigInt(s.charCodeAt(i));
    h = (h * prime) & 0xffffffffffffffffn;
  }
  return h;
}

function hammingDistance64(a, b) {
  let x = a ^ b;
  let c = 0;
  while (x) {
    x &= x - 1n;
    c++;
  }
  return c;
}

function tokenizeForSimilarity(text) {
  const raw = stripTags(text).toLowerCase();
  const words = raw.split(/[^a-z0-9]+/g).map((w) => w.trim()).filter(Boolean);
  const stop = new Set([
    "the",
    "and",
    "for",
    "with",
    "from",
    "into",
    "your",
    "you",
    "are",
    "this",
    "that",
    "cost",
    "costs",
    "pricing",
    "estimate",
    "estimator",
    "calculator",
    "monthly",
    "per",
    "what",
    "how",
    "use",
    "using",
    "add",
    "included",
    "not",
    "does",
    "include",
    "based",
    "inputs",
  ]);
  return words.filter((w) => w.length >= 3 && !stop.has(w)).slice(0, 600);
}

function findDuplicates(items, keyFn) {
  const map = new Map();
  for (const it of items) {
    const k = keyFn(it);
    if (!k) continue;
    const prev = map.get(k) || [];
    prev.push(it.url);
    map.set(k, prev);
  }
  return Array.from(map.entries())
    .filter(([, urls]) => urls.length > 1)
    .map(([value, urls]) => ({ value, urls }));
}

function isNoindex(robots) {
  const r = String(robots || "").toLowerCase();
  return r.includes("noindex");
}

async function collectFromSitemaps(baseUrl) {
  const start = normalizeUrl("/sitemap-index.xml", baseUrl);
  if (!start) return { sitemapUrls: [], pageUrls: [] };
  const seenSitemaps = new Set();
  const sitemapUrls = [];
  const pageUrls = new Set();
  const queue = [start];

  while (queue.length) {
    const sm = queue.shift();
    if (!sm || seenSitemaps.has(sm)) continue;
    seenSitemaps.add(sm);
    sitemapUrls.push(sm);

    const res = await fetchWithRedirectChain(sm, { timeoutMs: 20_000 });
    const xml = res.body || "";
    const locRe = /<loc>([^<]+)<\/loc>/gi;
    let m;
    while ((m = locRe.exec(xml))) {
      const loc = decodeEntities(String(m[1] || "").trim());
      if (!loc) continue;
      const abs = normalizeUrl(loc, baseUrl);
      if (!abs) continue;
      // Heuristic: sitemap xml tends to end with .xml; everything else is page URL.
      if (abs.endsWith(".xml")) queue.push(abs);
      else pageUrls.add(abs);
    }
  }

  return { sitemapUrls, pageUrls: Array.from(pageUrls) };
}

async function crawlInternal(baseUrl, seeds, { maxPages = 600, concurrency = 8 } = {}) {
  const seen = new Set();
  const out = [];
  const q = [];

  for (const s of seeds) {
    const u = normalizeUrl(s, baseUrl);
    if (u && isSameSite(u, baseUrl)) q.push(u);
  }

  async function worker() {
    while (q.length && out.length < maxPages) {
      const url = q.shift();
      if (!url || seen.has(url)) continue;
      seen.add(url);
      out.push(url);

      const res = await fetchWithRedirectChain(url, { timeoutMs: 25_000 });
      if (res.status !== 200) continue;
      const links = extractInternalLinks(res.body || "", baseUrl);
      for (const l of links) {
        if (!seen.has(l) && q.length + out.length < maxPages * 3) q.push(l);
      }
    }
  }

  const workers = Array.from({ length: concurrency }, () => worker());
  await Promise.all(workers);
  return out;
}

async function audit(baseUrl, { concurrency = 8 } = {}) {
  const baseHost = (() => {
    try {
      return new URL(baseUrl).hostname.toLowerCase();
    } catch {
      return "";
    }
  })();
  const isLocalBase = baseHost === "localhost" || baseHost === "127.0.0.1";

  const { sitemapUrls, pageUrls: fromSitemap } = await collectFromSitemaps(baseUrl);
  const discovered = await crawlInternal(baseUrl, ["/", "/calculators/", "/guides/", "/sitemap/"], {
    maxPages: 1200,
    concurrency: Math.max(2, Math.floor(concurrency / 2)),
  });

  const allUrls = Array.from(new Set([...fromSitemap, ...discovered])).filter((u) => isSameSite(u, baseUrl));

  const pages = [];
  const linkGraph = new Map(); // url -> outgoing

  // Concurrency-limited fetch
  let idx = 0;
  async function worker() {
    while (idx < allUrls.length) {
      const i = idx++;
      const url = allUrls[i];
      const res = await fetchWithRedirectChain(url, { timeoutMs: 30_000 });

      const title = extractTitle(res.body || "");
      const description = extractMetaContent(res.body || "", "description");
      const robots = extractMetaContent(res.body || "", "robots");
      const canonicalRaw = extractCanonical(res.body || "");
      const canonical = normalizeCanonical(canonicalRaw, baseUrl);
      const hreflang = extractHreflang(res.body || "");
      const mainHtml = extractMainHtml(res.body || "");
      const mainWords = wordCount(mainHtml);
      const internalLinks = res.status === 200 ? extractInternalLinks(res.body || "", baseUrl) : [];
      const { blocks: schemaBlocks, errors: schemaErrors } = extractJsonLd(res.body || "");

      const finalUrlNorm = normalizeFinalUrl(res.finalUrl || url, baseUrl);

      const urlCategory = categorize(url);
      const uniqueMainHtml = removeCommonBlocks(mainHtml, urlCategory);
      const uniqueWords = wordCount(uniqueMainHtml);
      const uniqueText = stripTags(uniqueMainHtml);
      const simHash = simhash64(tokenizeForSimilarity(uniqueText));

      pages.push({
        url,
        status: res.status,
        final_url: finalUrlNorm || res.finalUrl || url,
        redirect_chain: res.chain,
        category: urlCategory,
        title: title ? decodeEntities(title) : null,
        description: description ? decodeEntities(description) : null,
        canonical,
        canonical_raw: canonicalRaw,
        robots,
        hreflang,
        main_content_words: mainWords,
        main_unique_words: uniqueWords,
        internal_links: internalLinks,
        main_simhash64: `0x${simHash.toString(16).padStart(16, "0")}`,
        schema_blocks_count: schemaBlocks.length,
        schema_errors: schemaErrors,
      });
      linkGraph.set(url, internalLinks);
    }
  }

  await Promise.all(Array.from({ length: concurrency }, () => worker()));

  // Link in-degree for orphan detection
  const inDegree = new Map();
  for (const p of pages) inDegree.set(p.url, 0);
  for (const [from, outs] of linkGraph.entries()) {
    for (const to of outs) {
      if (!inDegree.has(to)) continue;
      inDegree.set(to, (inDegree.get(to) || 0) + 1);
    }
    void from;
  }

  // Duplicates
  const dupTitle = findDuplicates(pages.filter((p) => p.status === 200), (p) => (p.title || "").trim());
  const dupDesc = findDuplicates(pages.filter((p) => p.status === 200), (p) => (p.description || "").trim());

  // Near duplicates (SimHash on extracted main content)
  const simRows = pages
    .filter((p) => p.status === 200 && p.main_simhash64)
    .map((p) => ({ url: p.url, hash: BigInt(p.main_simhash64) }));

  const parent = new Map(simRows.map((r) => [r.url, r.url]));
  const find = (x) => {
    let p = parent.get(x) || x;
    while (p !== (parent.get(p) || p)) p = parent.get(p) || p;
    // path compression
    let cur = x;
    while (cur !== p) {
      const next = parent.get(cur) || cur;
      parent.set(cur, p);
      cur = next;
    }
    return p;
  };
  const union = (a, b) => {
    const ra = find(a);
    const rb = find(b);
    if (ra !== rb) parent.set(ra, rb);
  };

  const NEAR_DUP_HAMMING = 6;
  for (let i = 0; i < simRows.length; i++) {
    for (let j = i + 1; j < simRows.length; j++) {
      const d = hammingDistance64(simRows[i].hash, simRows[j].hash);
      if (d <= NEAR_DUP_HAMMING) union(simRows[i].url, simRows[j].url);
    }
  }

  const clustersMap = new Map();
  for (const r of simRows) {
    const root = find(r.url);
    const arr = clustersMap.get(root) || [];
    arr.push(r.url);
    clustersMap.set(root, arr);
  }
  const nearDuplicateClusters = Array.from(clustersMap.values()).filter((c) => c.length >= 4);

  const sitemapSet = new Set(fromSitemap);
  const issues = [];

  for (const p of pages) {
    if (p.status !== 200) {
      issues.push({
        type: "non200",
        url: p.url,
        evidence: `status=${p.status}`,
        fix: p.status >= 300 && p.status < 400 ? "Remove redirects from internal links/sitemap, link to the final URL." : "Fix the route to return 200 or remove from sitemap/internal links.",
        priority: 1,
      });
    }

    if (p.redirect_chain && p.redirect_chain.length > 1) {
      issues.push({
        type: "redirect_chain",
        url: p.url,
        evidence: p.redirect_chain.map((h) => `${h.status} ${h.url}${h.location ? ` -> ${h.location}` : ""}`).join(" | "),
        fix: "Update internal links and sitemap to point directly at the final canonical URL; avoid multi-hop redirects.",
        priority: 1,
      });
    }

    const finalNorm = normalizeFinalUrl(p.final_url, baseUrl);
    if (!isLocalBase && p.status === 200 && p.canonical && finalNorm && p.canonical !== finalNorm) {
      issues.push({
        type: "canonical_mismatch",
        url: p.url,
        evidence: `canonical=${p.canonical} final=${finalNorm}`,
        fix: "Make canonical match the final, normalized URL (host + trailing slash).",
        priority: 1,
      });
    }

    if (p.status === 200 && !p.title) {
      issues.push({ type: "missing_title", url: p.url, evidence: "missing <title>", fix: "Add a unique, descriptive <title>.", priority: 2 });
    }
    if (p.status === 200 && !p.description) {
      issues.push({ type: "missing_description", url: p.url, evidence: "missing meta description", fix: "Add a unique meta description that matches intent.", priority: 2 });
    }
    if (p.status === 200 && !p.canonical) {
      issues.push({ type: "missing_canonical", url: p.url, evidence: "missing canonical", fix: "Add canonical URL and ensure it matches the final URL.", priority: 2 });
    }

    if (sitemapSet.has(p.url) && isNoindex(p.robots)) {
      issues.push({
        type: "noindex_in_sitemap",
        url: p.url,
        evidence: `robots=${p.robots}`,
        fix: "Remove noindex pages from sitemap (or remove noindex if the page should be indexed).",
        priority: 1,
      });
    }

    // Thin content checks (tune thresholds per category)
    const shortThreshold = p.category === "calculator" ? 160 : p.category === "guide" ? 350 : 160;
    if (p.status === 200 && p.main_unique_words > 0 && p.main_unique_words < shortThreshold) {
      issues.push({
        type: "very_short",
        url: p.url,
        evidence: `main_unique_words=${p.main_unique_words} threshold=${shortThreshold} category=${p.category}`,
        fix: p.category === "guide" ? "Add unique, task-completing content (steps, examples, validation, pitfalls) or consolidate/noindex." : "Add actionable usage guidance, input sourcing, validation, and pitfalls.",
        priority: 3,
      });
    }

    if (p.schema_errors && p.schema_errors.length) {
      issues.push({
        type: "schema_error",
        url: p.url,
        evidence: p.schema_errors.map((e) => e.message).join("; "),
        fix: "Fix JSON-LD to be valid JSON and match schema.org types for the page.",
        priority: 2,
      });
    }
  }

  // Orphan pages: in sitemap but no internal in-links (within audited set)
  for (const p of pages) {
    if (!sitemapSet.has(p.url)) continue;
    if (p.url === normalizeUrl("/", baseUrl)) continue;
    const deg = inDegree.get(p.url) || 0;
    if (deg === 0) {
      issues.push({
        type: "orphan_page",
        url: p.url,
        evidence: "in_degree=0 (no internal links found from audited pages)",
        fix: "Add internal links from relevant hubs/guides/calculators; ensure it appears in navigation or cluster pages.",
        priority: 4,
      });
    }
  }

  // Bad links (only within audited URL set)
  const urlSet = new Set(pages.map((p) => p.url));
  for (const [from, outs] of linkGraph.entries()) {
    for (const to of outs) {
      if (!urlSet.has(to) && !sitemapSet.has(to)) {
        issues.push({
          type: "bad_link",
          url: from,
          evidence: `links_to=${to}`,
          fix: "Fix or remove the link; ensure destination exists and returns 200.",
          priority: 2,
        });
      }
    }
  }

  // Duplicate title/description issues
  for (const d of dupTitle) {
    for (const url of d.urls) {
      issues.push({
        type: "duplicate_title",
        url,
        evidence: `title=${d.value}`,
        fix: "Make titles unique and intent-specific; avoid templated titles across pages.",
        priority: 3,
      });
    }
  }
  for (const d of dupDesc) {
    for (const url of d.urls) {
      issues.push({
        type: "duplicate_description",
        url,
        evidence: `description=${d.value}`,
        fix: "Make meta descriptions unique and reflect page-specific value.",
        priority: 3,
      });
    }
  }

  // Near-duplicate cluster issue
  for (const cluster of nearDuplicateClusters) {
    issues.push({
      type: "near_duplicate_cluster",
      url: cluster[0],
      evidence: `cluster_size=${cluster.length} urls=${cluster.slice(0, 8).join(", ")}${cluster.length > 8 ? "..." : ""}`,
      fix: "Ensure each page has distinct intent and unique information; consolidate or noindex near-duplicates.",
      priority: 4,
    });
  }

  issues.sort((a, b) => a.priority - b.priority || String(a.type).localeCompare(String(b.type)) || String(a.url).localeCompare(String(b.url)));

  const issueCounts = issues.reduce((acc, i) => {
    acc[i.type] = (acc[i.type] || 0) + 1;
    return acc;
  }, {});

  function groupForIssueType(type) {
    // Priority order requested:
    // crawl+canonical → dedupe → content → internal links → schema
    const t = String(type || "");
    if (t === "non200" || t === "redirect_chain" || t === "canonical_mismatch" || t === "missing_canonical") return "crawl_normalize";
    if (t === "duplicate_title" || t === "duplicate_description" || t === "near_duplicate_cluster") return "dedupe";
    if (t === "very_short" || t === "missing_title" || t === "missing_description") return "content";
    if (t === "orphan_page" || t === "bad_link") return "internal_links";
    if (t === "schema_error") return "schema";
    return "other";
  }

  const groupOrder = ["crawl_normalize", "dedupe", "content", "internal_links", "schema", "other"];
  const groupedIssues = new Map(groupOrder.map((g) => [g, []]));
  for (const i of issues) {
    const g = groupForIssueType(i.type);
    if (!groupedIssues.has(g)) groupedIssues.set(g, []);
    groupedIssues.get(g).push(i);
  }

  const batches = [];
  for (const g of groupOrder) {
    const groupIssues = groupedIssues.get(g) || [];
    const seenUrl = new Set();
    const urls = [];
    for (const i of groupIssues) {
      if (seenUrl.has(i.url)) continue;
      seenUrl.add(i.url);
      urls.push(i.url);
    }
    for (let b = 0; b < urls.length; b += 10) {
      batches.push({ group: g, batch: Math.floor(b / 10) + 1, urls: urls.slice(b, b + 10) });
    }
  }

  return {
    baseUrl,
    generated_at: new Date().toISOString(),
    sitemaps: sitemapUrls,
    counts: {
      urls_total: allUrls.length,
      urls_from_sitemap: fromSitemap.length,
      urls_discovered: discovered.length,
      pages_fetched: pages.length,
      issues: issues.length,
    },
    issue_counts: issueCounts,
    batches,
    pages,
    issues,
  };
}

function toCsvRow(values) {
  const esc = (v) => {
    const s = v == null ? "" : String(v);
    if (/[\",\n]/.test(s)) return `"${s.replace(/\"/g, '""')}"`;
    return s;
  };
  return values.map(esc).join(",");
}

async function main() {
  const baseUrl = process.argv[2] || DEFAULT_BASE_URL;
  const concurrency = Math.max(2, Number(process.env.CONCURRENCY || 10));
  const outRoot = path.join(process.cwd(), "seo-audit", "out", nowStamp());

  await mkdir(outRoot, { recursive: true });

  const report = await audit(baseUrl, { concurrency });

  await writeFile(path.join(outRoot, "report.json"), JSON.stringify(report, null, 2), "utf8");

  const pagesCsv = [
    toCsvRow([
      "url",
      "status",
      "final_url",
      "category",
      "title",
      "description",
      "canonical",
      "robots",
      "main_content_words",
      "main_unique_words",
      "main_simhash64",
      "internal_links_count",
      "schema_blocks_count",
      "schema_errors_count",
    ]),
    ...report.pages.map((p) =>
      toCsvRow([
        p.url,
        p.status,
        p.final_url,
        p.category,
        p.title || "",
        p.description || "",
        p.canonical || "",
        p.robots || "",
        p.main_content_words,
        p.main_unique_words,
        p.main_simhash64 || "",
        (p.internal_links || []).length,
        p.schema_blocks_count,
        (p.schema_errors || []).length,
      ]),
    ),
  ].join("\n");
  await writeFile(path.join(outRoot, "pages.csv"), pagesCsv, "utf8");

  const issuesCsv = [
    toCsvRow(["priority", "type", "url", "evidence", "fix"]),
    ...report.issues.map((i) => toCsvRow([i.priority, i.type, i.url, i.evidence, i.fix])),
  ].join("\n");
  await writeFile(path.join(outRoot, "issues.csv"), issuesCsv, "utf8");

  await writeFile(path.join(outRoot, "batches.json"), JSON.stringify(report.batches, null, 2), "utf8");

  const top = report.issues.slice(0, 40);
  const summary = [
    `# SEO audit summary`,
    ``,
    `Base: ${report.baseUrl}`,
    `Generated: ${report.generated_at}`,
    ``,
    `Counts:`,
    `- urls_total: ${report.counts.urls_total}`,
    `- urls_from_sitemap: ${report.counts.urls_from_sitemap}`,
    `- urls_discovered: ${report.counts.urls_discovered}`,
    `- pages_fetched: ${report.counts.pages_fetched}`,
    `- issues: ${report.counts.issues}`,
    ``,
    `Top issues (first 40):`,
    ...top.map((i) => `- P${i.priority} ${i.type} ${i.url} (${i.evidence})`),
    ``,
    `Files:`,
    `- report.json`,
    `- pages.csv`,
    `- issues.csv`,
    `- batches.json`,
  ].join("\n");
  await writeFile(path.join(outRoot, "summary.md"), summary, "utf8");

  console.log(`SEO audit complete: ${outRoot}`);
  console.log(`Issues: ${report.counts.issues}`);
}

await main();
