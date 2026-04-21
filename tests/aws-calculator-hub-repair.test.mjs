import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const calculatorsIndex = readFileSync(new URL("../src/pages/calculators/index.astro", import.meta.url), "utf8");
const awsHub = readFileSync(new URL("../src/pages/calculators/aws.astro", import.meta.url), "utf8");

test("calculators index exposes the AWS provider hub", () => {
  assert.match(calculatorsIndex, /href="\/calculators\/aws\/"/);
  assert.match(calculatorsIndex, /AWS calculators/i);
});

test("aws calculators hub avoids the noindex AWS guide router", () => {
  assert.doesNotMatch(awsHub, /href="\/guides\/aws\/"/);
});

test("aws calculators hub routes readers to indexed next-step guides", () => {
  assert.match(awsHub, /href="\/guides\/aws-network-costs\/"/);
  assert.match(awsHub, /href="\/guides\/compute-costs\/"/);
  assert.match(awsHub, /href="\/guides\/request-based-pricing\/"/);
});
