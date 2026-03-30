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

function isIgnoredInternalPathname(pathname) {
  return pathname.startsWith("/cdn-cgi/");
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
    const normalized = new URL(abs);
    if (isIgnoredInternalPathname(normalized.pathname)) continue;
    out.add(abs);
  }
  return Array.from(out);
}

export { extractInternalLinks, isSameSite, normalizeInternalPathname, normalizeUrl, shouldHaveTrailingSlash };
