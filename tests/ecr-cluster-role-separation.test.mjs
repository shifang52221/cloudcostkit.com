import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

function read(pagePath) {
  return readFileSync(new URL(`../${pagePath}`, import.meta.url), "utf8");
}

test("pricing page is framed as the ECR bill-boundary page", () => {
  const content = read("src/pages/guides/aws-ecr-pricing.astro");

  assert.match(
    content,
    /Use this page when you need to decide what belongs inside the ECR bill before you debate retention policy, image slimming, or pull reduction\./,
  );
  assert.match(
    content,
    /This guide is about bill boundaries: registry storage, ECR-native transfer, replication-linked storage duplication, and the adjacent NAT, workload-side, or network-path costs that should be tracked beside the ECR bill rather than blended into it\./,
  );
});

test("estimate page is framed as the storage-measurement workflow page", () => {
  const content = read("src/pages/guides/aws-ecr-estimate-storage-gb-month.astro");

  assert.match(
    content,
    /This page is the storage-measurement workflow, not the bill-boundary page: the goal is to turn repo classes, image sizes, push frequency, retention windows, and multi-arch duplication into a defendable GB-month model\./,
  );
  assert.match(
    content,
    /If you are still deciding which costs belong inside the ECR bill versus beside it, go back to the pricing guide first\./,
  );
});

test("optimization page is framed as the production intervention page", () => {
  const content = read("src/pages/guides/aws-ecr-cost-optimization.astro");

  assert.match(
    content,
    /Optimization starts only after you know whether retention drift, oversized images, duplicate tags, repeated pull paths, or unnecessary replication is the real ECR cost driver; otherwise teams delete tags blindly without reducing the real bill\./,
  );
  assert.match(
    content,
    /This page is for production intervention: retention enforcement, image slimming, pull-path discipline, replication control, and rollback safety\./,
  );
});
