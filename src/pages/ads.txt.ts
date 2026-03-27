import { SITE } from "../config/site";

export function GET() {
  const publisherId = SITE.ads.publisherId;

  const lines: string[] = [
    "# ads.txt for CloudCostKit",
    "# Set ADSENSE_PUBLISHER_ID or PUBLIC_ADSENSE_PUBLISHER_ID to output your AdSense record.",
  ];

  if (publisherId) {
    lines.push(`google.com, ${publisherId}, DIRECT, f08c47fec0942fa0`);
  } else {
    lines.push("# No AdSense publisher id configured.");
  }

  return new Response(lines.join("\n") + "\n", {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
}
