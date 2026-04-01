import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

function read(pagePath) {
  return readFileSync(new URL(`../${pagePath}`, import.meta.url), "utf8");
}

test("pricing page is framed as the DynamoDB bill-boundary page", () => {
  const content = read("src/pages/guides/aws-dynamodb-pricing.astro");

  assert.match(
    content,
    /Use this page when you need to decide what belongs inside the DynamoDB bill before you debate schema changes, caching, or retry control\./,
  );
  assert.match(
    content,
    /This guide is about bill boundaries: read exposure, write exposure, table storage, index amplification, backups, streams, global tables, and the adjacent cache, stream-consumer, or application-side costs that should be tracked beside the DynamoDB bill rather than blended into it\./,
  );
});

test("RCU\/WCU page is framed as the capacity-measurement explainer page", () => {
  const content = read("src/pages/guides/aws-dynamodb-rcu-wcu-explained.astro");

  assert.match(
    content,
    /This page is the capacity-measurement explainer, not the bill-boundary page: the goal is to turn item size, consistency, query shape, scan behavior, and index updates into a defendable read and write unit model\./,
  );
  assert.match(
    content,
    /If you are still deciding which costs belong inside the DynamoDB bill versus beside it, go back to the pricing guide first\./,
  );
});

test("optimization page is framed as the production intervention page", () => {
  const content = read("src/pages/guides/aws-dynamodb-cost-optimization.astro");

  assert.match(
    content,
    /Optimization starts only after you know whether reads, writes, storage, or index amplification is the real DynamoDB cost driver; otherwise teams cache, compress, or drop indexes blindly without removing the real waste\./,
  );
  assert.match(
    content,
    /This page is for production intervention: read-path cleanup, write amplification control, storage shaping, index hygiene, and correctness-safe query changes\./,
  );
});
