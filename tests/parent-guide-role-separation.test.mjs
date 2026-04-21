import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const normalize = (value) => value.replace(/\s+/g, " ").trim();

const computeGuide = normalize(
  readFileSync(new URL("../src/pages/guides/compute-costs.astro", import.meta.url), "utf8"),
);
const storageGuide = normalize(
  readFileSync(new URL("../src/pages/guides/storage-costs.astro", import.meta.url), "utf8"),
);
const databaseGuide = normalize(
  readFileSync(new URL("../src/pages/guides/database-costs.astro", import.meta.url), "utf8"),
);
const messagingGuide = normalize(
  readFileSync(new URL("../src/pages/guides/messaging-costs.astro", import.meta.url), "utf8"),
);

test("compute guide owns the runtime budgeting role", () => {
  assert.match(computeGuide, /This is the compute runtime budgeting parent page/i);
  assert.match(computeGuide, /start here before choosing deeper compute paths/i);
});

test("storage guide owns the capacity and lifecycle budgeting role", () => {
  assert.match(storageGuide, /This is the storage system budgeting parent page/i);
  assert.match(storageGuide, /capacity, copies, retrieval, and lifecycle transitions/i);
});

test("database guide owns the stateful service budgeting role", () => {
  assert.match(databaseGuide, /This is the database system budgeting parent page/i);
  assert.match(databaseGuide, /not just a lighter storage page/i);
});

test("messaging guide owns the event and delivery budgeting role", () => {
  assert.match(messagingGuide, /This is the event and delivery budgeting parent page/i);
  assert.match(messagingGuide, /retries, fan-out, and payload amplification/i);
});
