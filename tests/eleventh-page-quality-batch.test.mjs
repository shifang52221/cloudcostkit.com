import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const normalize = (value) => value.replace(/\s+/g, " ").trim();

const metricsEstimatePage = normalize(
  readFileSync(
    new URL("../src/pages/guides/aws-cloudwatch-metrics-estimate-custom-metrics.astro", import.meta.url),
    "utf8",
  ),
);
const logsInsightsEstimatePage = normalize(
  readFileSync(
    new URL("../src/pages/guides/aws-cloudwatch-logs-insights-estimate-scanned-gb.astro", import.meta.url),
    "utf8",
  ),
);
const alarmsEstimatePage = normalize(
  readFileSync(
    new URL("../src/pages/guides/aws-cloudwatch-alarms-estimate-alarm-count.astro", import.meta.url),
    "utf8",
  ),
);

test("metrics estimate page uses more specific evidence-pack and handoff language", () => {
  assert.match(
    metricsEstimatePage,
    /Before you trust the active-series model, show which namespaces are truly custom, which dimensions only restate infrastructure identity, and which exporter or dashboard habits would make the same metric family appear larger than the billable CloudWatch series count\./i,
  );
  assert.match(
    metricsEstimatePage,
    /You are ready to hand this estimate to pricing or optimization only when another reviewer can see the baseline series, the main cardinality multiplier, and the small set of dimensions most likely to change next month if the system grows\./i,
  );
});

test("Logs Insights estimate page uses more specific scan-evidence and handoff language", () => {
  assert.match(
    logsInsightsEstimatePage,
    /A defendable estimate should separate routine dashboard refresh scans, normal engineer investigation scans, and incident-driven wide-window searches before you multiply anything into a monthly total\./i,
  );
  assert.match(
    logsInsightsEstimatePage,
    /Hand this model to pricing or optimization only after someone else can trace which default time windows, refresh loops, and log-group scope decisions create the recurring scanned-GB baseline versus the temporary incident spike\./i,
  );
});

test("alarms estimate page uses more specific inventory-evidence and handoff language", () => {
  assert.match(
    alarmsEstimatePage,
    /Before you trust the alarm-month estimate, show which alarms come from intentional coverage, which arrive automatically from template expansion, and which only exist because ephemeral environments inherit the full production alarm pack\./i,
  );
  assert.match(
    alarmsEstimatePage,
    /This inventory model is ready to hand off only when another reviewer can identify the baseline alarm set, the main growth multiplier, and the specific environments or rollout habits that would change the next month's alarm count without changing alert quality\./i,
  );
});
