import { defineMiddleware } from "astro:middleware";

function shouldHaveTrailingSlash(pathname: string): boolean {
  if (pathname === "/") return false;
  if (pathname.endsWith("/")) return false;
  const lastSegment = pathname.split("/").pop() || "";
  if (lastSegment.includes(".")) return false;
  return true;
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
      return Response.redirect(url.toString(), 301);
    }
  }

  return next();
});

