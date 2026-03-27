import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import { SITE } from "./src/config/site";

const sitemapExcludedPaths = new Set([
  "/404/",
  "/terms/",
  "/privacy-policy/",
  "/cookie-notice/",
  "/guides/gcp/",
  "/guides/azure/",
  "/guides/requests-costs/",
  "/guides/kubernetes-cost-calculator/",
  "/guides/backups-and-snapshots-costs/",
  "/calculators/aws-api-gateway-request-estimator/",
  "/calculators/aws-kms-request-estimator/",
  "/calculators/aws-sns-delivery-estimator/",
  "/calculators/aws-sqs-request-estimator/",
  "/calculators/aws-waf-request-estimator/",
]);

export default defineConfig({
  site: process.env.SITE_URL ?? process.env.PUBLIC_SITE_URL ?? SITE.url,
  output: "server",
  trailingSlash: "always",
  adapter: cloudflare(),
  integrations: [
    react(),
    sitemap({
      filter: (page) => !sitemapExcludedPaths.has(page),
      serialize: (item) => {
        const pathname = item.url.startsWith("http") ? new URL(item.url).pathname : item.url;
        if (sitemapExcludedPaths.has(pathname)) return undefined;
        return item;
      },
    }),
  ],
  prefetch: true,
});
