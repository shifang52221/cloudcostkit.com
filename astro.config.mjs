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
  integrations: [react(), sitemap()],
  prefetch: true,
});
