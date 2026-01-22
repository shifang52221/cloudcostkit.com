import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import { SITE } from "./src/config/site";

export default defineConfig({
  site: process.env.SITE_URL ?? process.env.PUBLIC_SITE_URL ?? SITE.url,
  output: "server",
  trailingSlash: "always",
  adapter: cloudflare(),
  integrations: [
    react(),
    sitemap({
      filter: (page) => !["/404/", "/terms/", "/privacy-policy/", "/cookie-notice/"].includes(page),
      serialize: (item) => {
        const excluded = new Set(["/404/", "/terms/", "/privacy-policy/", "/cookie-notice/"]);
        const pathname = item.url.startsWith("http") ? new URL(item.url).pathname : item.url;
        if (excluded.has(pathname)) return undefined;
        return item;
      },
    }),
  ],
  prefetch: true,
});
