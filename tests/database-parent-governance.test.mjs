import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const normalize = (value) => value.replace(/\s+/g, " ").trim();

const databaseGuide = normalize(readFileSync(new URL("../src/pages/guides/database-costs.astro", import.meta.url), "utf8"));
const rdsPricingGuide = normalize(
  readFileSync(new URL("../src/pages/guides/aws-rds-pricing.astro", import.meta.url), "utf8"),
);
const rdsBackupsGuide = normalize(
  readFileSync(new URL("../src/pages/guides/aws-rds-backups-and-snapshots.astro", import.meta.url), "utf8"),
);
const rdsAuroraGuide = normalize(
  readFileSync(new URL("../src/pages/guides/aws-rds-vs-aurora-cost.astro", import.meta.url), "utf8"),
);

test("database guide owns the database system budgeting parent role", () => {
  assert.match(databaseGuide, /This is the database system budgeting parent page/i);
  assert.match(
    databaseGuide,
    /move into RDS bill-boundary, backup workflow, or engine-comparison pages only after the broader database budget shape is clear/i,
  );
});

test("RDS pricing guide owns the bill-boundary role", () => {
  assert.match(rdsPricingGuide, /This is the AWS RDS bill-boundary page/i);
  assert.match(
    rdsPricingGuide,
    /go back to the database parent page if the broader database budget shape is still unclear/i,
  );
});

test("RDS backups guide owns the backup-retention workflow role", () => {
  assert.match(rdsBackupsGuide, /This is the backup-retention workflow page/i);
  assert.match(
    rdsBackupsGuide,
    /go back to the database parent page if the broader database budget shape is still unclear/i,
  );
});

test("RDS vs Aurora guide owns the engine-choice comparison role", () => {
  assert.match(rdsAuroraGuide, /This is the engine-choice comparison page/i);
  assert.match(
    rdsAuroraGuide,
    /go back to the database parent page if the broader database budget shape is still unclear/i,
  );
});
