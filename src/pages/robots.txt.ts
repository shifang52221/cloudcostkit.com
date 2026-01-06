import { SITE } from "../config/site";

export function GET() {
  const siteUrl = (import.meta.env.PUBLIC_SITE_URL || SITE.url).replace(/\/+$/, "");
  const lines = ["User-agent: *", "Allow: /", "", `Sitemap: ${siteUrl}/sitemap-index.xml`, ""];
  return new Response(lines.join("\n"), {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
}

