import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const normalize = (value) => value.replace(/\s+/g, " ").trim();

const auroraGuide = normalize(
  readFileSync(new URL("../src/pages/guides/aws-aurora-pricing.astro", import.meta.url), "utf8"),
);
const auroraServerlessGuide = normalize(
  readFileSync(new URL("../src/pages/guides/aws-aurora-serverless-v2-pricing.astro", import.meta.url), "utf8"),
);
const rdsAuroraGuide = normalize(
  readFileSync(new URL("../src/pages/guides/aws-rds-vs-aurora-cost.astro", import.meta.url), "utf8"),
);

test("aws-aurora-pricing owns the Aurora bill anatomy role", () => {
  assert.match(auroraGuide, /This is the Aurora bill anatomy page/i);
  assert.match(
    auroraGuide,
    /go back to the database parent page if the broader database budget shape is still unclear/i,
  );
});

test("aws-aurora-serverless-v2-pricing owns the Serverless v2 capacity-shape role", () => {
  assert.match(auroraServerlessGuide, /This is the Aurora Serverless v2 capacity-shape page/i);
  assert.match(
    auroraServerlessGuide,
    /go back to the database parent page if the broader database budget shape is still unclear/i,
  );
  assert.match(
    auroraServerlessGuide,
    /go back to the Aurora bill anatomy page if the broader Aurora bill structure is still unclear/i,
  );
});

test("aws-rds-vs-aurora-cost stays the engine-choice comparison page", () => {
  assert.match(rdsAuroraGuide, /This is the engine-choice comparison page/i);
  assert.match(
    rdsAuroraGuide,
    /go back to the database parent page if the broader database budget shape is still unclear/i,
  );
  assert.match(
    rdsAuroraGuide,
    /go back to the Aurora bill anatomy page if the broader Aurora bill structure is still unclear/i,
  );
});
