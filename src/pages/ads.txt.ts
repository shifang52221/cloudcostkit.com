function getAdsensePublisherId() {
  const explicit = (
    import.meta.env.ADSENSE_PUBLISHER_ID ||
    import.meta.env.PUBLIC_ADSENSE_PUBLISHER_ID ||
    ""
  ).trim();
  if (explicit) return explicit;

  const client = (import.meta.env.PUBLIC_ADSENSE_CLIENT || "").trim();
  if (client.startsWith("ca-pub-")) return `pub-${client.slice("ca-pub-".length)}`;
  return "";
}

export function GET() {
  const publisherId = getAdsensePublisherId();

  const lines: string[] = [
    "# ads.txt for CloudCostKit",
    "# Set ADSENSE_PUBLISHER_ID (or PUBLIC_ADSENSE_PUBLISHER_ID) to output your AdSense record.",
  ];

  if (publisherId) {
    lines.push(`google.com, ${publisherId}, DIRECT, f08c47fec0942fa0`);
  } else {
    lines.push("# google.com, pub-0000000000000000, DIRECT, f08c47fec0942fa0");
  }

  return new Response(lines.join("\n") + "\n", {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
}
