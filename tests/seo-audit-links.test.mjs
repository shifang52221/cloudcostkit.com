import test from "node:test";
import assert from "node:assert/strict";

import { extractInternalLinks } from "../scripts/lib/seo-audit-links.mjs";

test("extractInternalLinks keeps normal same-site pages and ignores fragments, mailto, and Cloudflare email protection links", () => {
  const html = `
    <main>
      <a href="/calculators/ec2-cost-calculator">EC2 calculator</a>
      <a href="https://cloudcostkit.com/guides/egress-costs">Egress guide</a>
      <a href="#faq">Jump to FAQ</a>
      <a href="mailto:team@cloudcostkit.com">Email us</a>
      <a href="/cdn-cgi/l/email-protection#123456">Protected email</a>
      <a href="https://example.com/offsite">Offsite</a>
    </main>
  `;

  assert.deepEqual(extractInternalLinks(html, "https://cloudcostkit.com"), [
    "https://cloudcostkit.com/calculators/ec2-cost-calculator/",
    "https://cloudcostkit.com/guides/egress-costs/",
  ]);
});
