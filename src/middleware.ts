import { defineMiddleware } from "astro:middleware";

function shouldHaveTrailingSlash(pathname: string): boolean {
  if (pathname === "/") return false;
  if (pathname.endsWith("/")) return false;
  const lastSegment = pathname.split("/").pop() || "";
  if (lastSegment.includes(".")) return false;
  return true;
}

function applySecurityHeaders(headers: Headers) {
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  headers.set("X-Frame-Options", "SAMEORIGIN");
  headers.set("Cross-Origin-Opener-Policy", "same-origin");
  headers.set("Cross-Origin-Resource-Policy", "same-origin");
  headers.set(
    "Permissions-Policy",
    "accelerometer=(), autoplay=(), camera=(), clipboard-read=(), clipboard-write=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()",
  );
  headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
}

function ensureUtf8Html(headers: Headers) {
  const ct = headers.get("content-type");
  if (!ct) return;
  const lower = ct.toLowerCase();
  if (!lower.startsWith("text/html")) return;
  if (lower.includes("charset=")) return;
  headers.set("content-type", "text/html; charset=utf-8");
}

export const onRequest = defineMiddleware(async (context, next) => {
  const url = new URL(context.request.url);
  const method = context.request.method.toUpperCase();
  const hostnameLower = url.hostname.toLowerCase();
  const isLocalhost = hostnameLower === "localhost" || hostnameLower === "127.0.0.1";

  // Only normalize URLs for safe navigation requests.
  const isSafeMethod = method === "GET" || method === "HEAD";

  if (isSafeMethod) {
    // Back-compat redirects for renamed pages (avoid long-lived 404s and stale links).
    const pathname = url.pathname;
    if (pathname === "/calculators/aws-load-balancer-estimate-lcu" || pathname === "/calculators/aws-load-balancer-estimate-lcu/") {
      url.pathname = "/calculators/aws-load-balancer-lcu-calculator/";
      const res = Response.redirect(url.toString(), 301);
      applySecurityHeaders(res.headers);
      return res;
    }

    let didChange = false;

    // Canonicalize host: strip leading "www."
    if (hostnameLower.startsWith("www.")) {
      url.hostname = url.hostname.slice(4);
      didChange = true;
    }

    // Canonicalize protocol: enforce https
    if (!isLocalhost && url.protocol !== "https:") {
      url.protocol = "https:";
      didChange = true;
    }

    // Canonicalize trailing slash for route-like URLs.
    if (shouldHaveTrailingSlash(url.pathname)) {
      url.pathname = `${url.pathname}/`;
      didChange = true;
    }

    if (didChange) {
      const res = Response.redirect(url.toString(), 301);
      applySecurityHeaders(res.headers);
      return res;
    }
  }

  const res = await next();
  const headers = new Headers(res.headers);
  ensureUtf8Html(headers);
  applySecurityHeaders(headers);
  return new Response(res.body, {
    status: res.status,
    statusText: res.statusText,
    headers,
  });
});
