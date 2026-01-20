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

export const onRequest = defineMiddleware(async (context, next) => {
  const url = new URL(context.request.url);
  const method = context.request.method.toUpperCase();

  // Only normalize URLs for safe navigation requests.
  const isSafeMethod = method === "GET" || method === "HEAD";

  if (isSafeMethod) {
    let didChange = false;

    // Canonicalize host: strip leading "www."
    if (url.hostname.toLowerCase().startsWith("www.")) {
      url.hostname = url.hostname.slice(4);
      didChange = true;
    }

    // Canonicalize protocol: enforce https
    if (url.protocol !== "https:") {
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
  applySecurityHeaders(headers);
  return new Response(res.body, {
    status: res.status,
    statusText: res.statusText,
    headers,
  });
});
