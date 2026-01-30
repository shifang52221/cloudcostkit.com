import React, { useMemo } from "react";
import { useBooleanParamState, useNumberParamState } from "./useNumberParamState";
import { clamp } from "../../lib/math";
import { formatNumber } from "../../lib/format";

type Estimate = {
  matchedFanout: number;
  baselineDeliveries: number;
  totalDeliveries: number;
  retryMultiplierPct: number;
  matchRatePct: number;
};

function estimateDeliveries({
  publishesPerMonth,
  subscriptionsPerTopic,
  matchRatePct,
  retryMultiplierPct,
}: {
  publishesPerMonth: number;
  subscriptionsPerTopic: number;
  matchRatePct: number;
  retryMultiplierPct: number;
}): Estimate {
  const matchRate = clamp(matchRatePct, 0, 100) / 100;
  const retryMultiplier = clamp(retryMultiplierPct, 50, 1000) / 100;
  const matchedFanout = clamp(subscriptionsPerTopic, 0, 1e6) * matchRate;
  const baselineDeliveries = clamp(publishesPerMonth, 0, 1e18) * matchedFanout;
  const totalDeliveries = baselineDeliveries * retryMultiplier;

  return {
    matchedFanout,
    baselineDeliveries,
    totalDeliveries,
    retryMultiplierPct: retryMultiplier * 100,
    matchRatePct: matchRate * 100,
  };
}

export function AwsSnsDeliveryEstimator() {
  const [publishesPerMonth, setPublishesPerMonth] = useNumberParamState("AwsSnsDeliv.publishesPerMonth", 120_000_000);
  const [subscriptionsPerTopic, setSubscriptionsPerTopic] = useNumberParamState("AwsSnsDeliv.subscriptionsPerTopic", 25);
  const [matchRatePct, setMatchRatePct] = useNumberParamState("AwsSnsDeliv.matchRatePct", 40);
  const [retryMultiplierPct, setRetryMultiplierPct] = useNumberParamState("AwsSnsDeliv.retryMultiplierPct", 110);
  const [showPeakScenario, setShowPeakScenario] = useBooleanParamState("AwsSnsDeliv.showPeakScenario", true);
  const [peakPublishMultiplierPct, setPeakPublishMultiplierPct] = useNumberParamState(
    "AwsSnsDeliv.peakPublishMultiplierPct",
    180
  );

  const baseline = useMemo(
    () =>
      estimateDeliveries({
        publishesPerMonth,
        subscriptionsPerTopic,
        matchRatePct,
        retryMultiplierPct,
      }),
    [matchRatePct, publishesPerMonth, retryMultiplierPct, subscriptionsPerTopic]
  );

  const peak = useMemo(() => {
    if (!showPeakScenario) return null;
    const peakPublishes = clamp(publishesPerMonth, 0, 1e18) * (clamp(peakPublishMultiplierPct, 100, 1000) / 100);
    return estimateDeliveries({
      publishesPerMonth: peakPublishes,
      subscriptionsPerTopic,
      matchRatePct,
      retryMultiplierPct,
    });
  }, [matchRatePct, peakPublishMultiplierPct, publishesPerMonth, retryMultiplierPct, showPeakScenario, subscriptionsPerTopic]);

  return (
    <div className="calc-grid">
      <div className="panel">
        <h3>Inputs</h3>
        <div className="form">
          <div className="field field-3">
            <div className="label">Publishes (per month)</div>
            <input
              type="number"
              inputMode="numeric"
              value={publishesPerMonth}
              min={0}
              step={1000}
              onChange={(e) => setPublishesPerMonth(+e.target.value)}
            />
            <div className="hint">Total messages published to the topic.</div>
          </div>
          <div className="field field-3">
            <div className="label">Subscriptions per topic</div>
            <input
              type="number"
              inputMode="numeric"
              value={subscriptionsPerTopic}
              min={0}
              step={1}
              onChange={(e) => setSubscriptionsPerTopic(+e.target.value)}
            />
            <div className="hint">Average subscribers for the topic or workload.</div>
          </div>
          <div className="field field-3">
            <div className="label">Match rate (%)</div>
            <input
              type="number"
              inputMode="decimal"
              value={matchRatePct}
              min={0}
              max={100}
              step={1}
              onChange={(e) => setMatchRatePct(+e.target.value)}
            />
            <div className="hint">Percent of subscriptions that receive each publish.</div>
          </div>
          <div className="field field-3">
            <div className="label">Retry multiplier (%)</div>
            <input
              type="number"
              inputMode="decimal"
              value={retryMultiplierPct}
              min={50}
              max={1000}
              step={5}
              onChange={(e) => setRetryMultiplierPct(+e.target.value)}
            />
            <div className="hint">Buffer for failed deliveries and retries.</div>
          </div>

          <div className="field field-3" style={{ alignSelf: "end" }}>
            <label className="muted" style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <input
                type="checkbox"
                checked={showPeakScenario}
                onChange={(e) => setShowPeakScenario(e.target.checked)}
              />
              Include peak scenario
            </label>
          </div>

          {showPeakScenario ? (
            <div className="field field-3">
              <div className="label">Peak publish multiplier (%)</div>
              <input
                type="number"
                inputMode="numeric"
                value={peakPublishMultiplierPct}
                min={100}
                max={1000}
                step={5}
                onChange={(e) => setPeakPublishMultiplierPct(+e.target.value)}
              />
              <div className="hint">Applies to publish volume only.</div>
            </div>
          ) : null}

          <div className="field field-6">
            <div className="label">Scenario presets</div>
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setPublishesPerMonth(45_000_000);
                  setSubscriptionsPerTopic(12);
                  setMatchRatePct(35);
                  setRetryMultiplierPct(105);
                  setShowPeakScenario(true);
                  setPeakPublishMultiplierPct(160);
                }}
              >
                SaaS alerts
              </button>
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setPublishesPerMonth(220_000_000);
                  setSubscriptionsPerTopic(40);
                  setMatchRatePct(60);
                  setRetryMultiplierPct(120);
                  setShowPeakScenario(true);
                  setPeakPublishMultiplierPct(220);
                }}
              >
                Fan-out heavy
              </button>
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setPublishesPerMonth(12_000_000);
                  setSubscriptionsPerTopic(6);
                  setMatchRatePct(80);
                  setRetryMultiplierPct(130);
                  setShowPeakScenario(true);
                  setPeakPublishMultiplierPct(200);
                }}
              >
                Incident spikes
              </button>
            </div>
          </div>

          <div className="field field-6">
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setPublishesPerMonth(120_000_000);
                  setSubscriptionsPerTopic(25);
                  setMatchRatePct(40);
                  setRetryMultiplierPct(110);
                  setShowPeakScenario(true);
                  setPeakPublishMultiplierPct(180);
                }}
              >
                Reset example
              </button>
            </div>
            <div className="muted" style={{ marginTop: 8, fontSize: 12 }}>
              Use publishes and deliveries in the AWS SNS cost calculator.
            </div>
          </div>
        </div>
      </div>

      <div className="panel">
        <h3>Results</h3>
        <div className="kpis">
          <div className="kpi">
            <div className="k">Matched fan-out</div>
            <div className="v">{formatNumber(baseline.matchedFanout, 2)}</div>
          </div>
          <div className="kpi">
            <div className="k">Baseline deliveries</div>
            <div className="v">{formatNumber(baseline.baselineDeliveries, 0)}</div>
          </div>
          <div className="kpi">
            <div className="k">Total deliveries</div>
            <div className="v">{formatNumber(baseline.totalDeliveries, 0)}</div>
          </div>
          <div className="kpi">
            <div className="k">Retry multiplier</div>
            <div className="v">{formatNumber(baseline.retryMultiplierPct, 0)}%</div>
          </div>
          <div className="kpi">
            <div className="k">Match rate</div>
            <div className="v">{formatNumber(baseline.matchRatePct, 0)}%</div>
          </div>
        </div>

        {peak ? (
          <div style={{ marginTop: 12 }}>
            <div className="muted" style={{ fontSize: 13, marginBottom: 6 }}>Baseline vs peak</div>
            <table className="table">
              <thead>
                <tr>
                  <th>Scenario</th>
                  <th className="num">Deliveries</th>
                  <th className="num">Fan-out</th>
                  <th className="num">Retry</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Baseline</td>
                  <td className="num">{formatNumber(baseline.totalDeliveries, 0)}</td>
                  <td className="num">{formatNumber(baseline.matchedFanout, 2)}</td>
                  <td className="num">{formatNumber(baseline.retryMultiplierPct, 0)}%</td>
                </tr>
                <tr>
                  <td>Peak</td>
                  <td className="num">{formatNumber(peak.totalDeliveries, 0)}</td>
                  <td className="num">{formatNumber(peak.matchedFanout, 2)}</td>
                  <td className="num">{formatNumber(peak.retryMultiplierPct, 0)}%</td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </div>
  );
}
