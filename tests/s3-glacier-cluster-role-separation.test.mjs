import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

function read(pagePath) {
  return readFileSync(new URL(`../${pagePath}`, import.meta.url), "utf8");
}

test("pricing page is framed as the archive bill-boundary page", () => {
  const content = read("src/pages/guides/aws-s3-glacier-pricing.astro");

  assert.match(
    content,
    /Use this page when you need to decide what belongs inside the archive bill before you debate restore batching, object repackaging, or tier changes\./,
  );
  assert.match(
    content,
    /This guide is about bill boundaries: stored GB-month, retrieval GB, retrieval requests, transition exposure, minimum-duration exposure, and the adjacent compute, analysis-copy, or workflow costs that should be tracked beside the archive bill rather than blended into it\./,
  );
  assert.match(
    content,
    /minimum storage duration|minimum-duration/i,
  );
  assert.match(
    content,
    /Deep Archive|Flexible Retrieval|Instant Retrieval/i,
  );
});

test("estimate page is framed as the retrieval-measurement workflow page", () => {
  const content = read("src/pages/guides/aws-s3-glacier-estimate-retrieval.astro");

  assert.match(
    content,
    /This page is the retrieval-measurement workflow, not the bill-boundary page: the goal is to turn restore events, job frequency, object counts, backfill windows, and object packaging into a defendable retrieval model\./,
  );
  assert.match(
    content,
    /If you are still deciding which costs belong inside the archive bill versus beside it, go back to the pricing guide first\./,
  );
});

test("optimization page is framed as the production intervention page", () => {
  const content = read("src/pages/guides/aws-s3-glacier-cost-optimization.astro");

  assert.match(
    content,
    /Optimization starts only after you know whether restore frequency, small-object fan-out, minimum-duration churn, or wrong-tier placement is the real archive cost driver; otherwise teams batch or re-tier blindly without removing the real waste\./,
  );
  assert.match(
    content,
    /This page is for production intervention: restore discipline, object packaging, lifecycle control, tier placement, and restore-SLA protection\./,
  );
});
