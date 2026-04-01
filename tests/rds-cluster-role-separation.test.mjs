import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

function read(pagePath) {
  return readFileSync(new URL(`../${pagePath}`, import.meta.url), "utf8");
}

test("pricing page is framed as the RDS bill-boundary page", () => {
  const content = read("src/pages/guides/aws-rds-pricing.astro");

  assert.match(
    content,
    /Use this page when you need to decide what belongs inside the RDS bill before you debate instance right-sizing, backup retention changes, or storage tuning\./,
  );
  assert.match(
    content,
    /This guide is about bill boundaries: instance-hours, DB storage, backup storage, I\/O-priced storage exposure, Multi-AZ and replica capacity, and the adjacent monitoring, transfer, or application-side costs that should be tracked beside the RDS bill rather than blended into it\./,
  );
});

test("estimate page is framed as the backup-storage measurement workflow page", () => {
  const content = read("src/pages/guides/aws-rds-backup-storage-gb-month-estimate.astro");

  assert.match(
    content,
    /This page is the backup-storage measurement workflow, not the bill-boundary page: the goal is to turn churn, retention, manual snapshot behavior, copy policies, and long-term retention windows into a defendable backup GB-month model\./,
  );
  assert.match(
    content,
    /If you are still deciding which costs belong inside the RDS bill versus beside it, go back to the pricing guide first\./,
  );
});

test("optimization page is framed as the production intervention page", () => {
  const content = read("src/pages/guides/aws-rds-cost-optimization.astro");

  assert.match(
    content,
    /Optimization starts only after you know whether compute headroom, storage growth, backup retention, or I\/O-heavy query patterns are the real RDS cost driver; otherwise teams downsize or shorten retention blindly without reducing the real bill\./,
  );
  assert.match(
    content,
    /This page is for production intervention: instance right-sizing, storage-growth control, backup-policy tuning, I\/O pattern cleanup, and reliability-safe architecture decisions\./,
  );
});
