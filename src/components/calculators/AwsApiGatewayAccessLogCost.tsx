import React, { useMemo } from "react";
import { useBooleanParamState, useNumberParamState } from "./useNumberParamState";
import { estimateLogCost } from "../../lib/calc/logs";
import { formatCurrency2, formatNumber } from "../../lib/format";
import { clamp } from "../../lib/math";

function estimateGbPerDayFromRequests(opts: { requestsPerMonth: number; bytesPerRequest: number; daysPerMonth?: number }) {
  const daysPerMonth = clamp(opts.daysPerMonth ?? 30.4, 1, 31);
  const requestsPerMonth = clamp(opts.requestsPerMonth, 0, 1e18);
  const bytesPerRequest = clamp(opts.bytesPerRequest, 0, 1e7);
  const bytesPerDay = requestsPerMonth / daysPerMonth * bytesPerRequest;
  return bytesPerDay / 1e9;
}

export function AwsApiGatewayAccessLogCostCalculator() {
  const [requestsPerMonth, setRequestsPerMonth] = useNumberParamState("AwsApiGatewayAccessLogCost.requestsPerMonth", 50_000_000);
  const [avgLogBytesPerRequest, setAvgLogBytesPerRequest] = useNumberParamState("AwsApiGatewayAccessLogCost.avgLogBytesPerRequest", 1500);
  const [retentionDays, setRetentionDays] = useNumberParamState("AwsApiGatewayAccessLogCost.retentionDays", 30);
  const [ingestPricePerGbUsd, setIngestPricePerGbUsd] = useNumberParamState("AwsApiGatewayAccessLogCost.ingestPricePerGbUsd", 0.5);
  const [storagePricePerGbMonthUsd, setStoragePricePerGbMonthUsd] = useNumberParamState("AwsApiGatewayAccessLogCost.storagePricePerGbMonthUsd", 0.03);
  const [showPeakScenario, setShowPeakScenario] = useBooleanParamState("AwsApiGatewayAccessLogCost.showPeakScenario", false);
  const [peakMultiplierPct, setPeakMultiplierPct] = useNumberParamState("AwsApiGatewayAccessLogCost.peakMultiplierPct", 200);

  const gbPerDay = useMemo(() => {
    return estimateGbPerDayFromRequests({
      requestsPerMonth,
      bytesPerRequest: avgLogBytesPerRequest,
      daysPerMonth: 30.4,
    });
  }, [requestsPerMonth, avgLogBytesPerRequest]);

  const cost = useMemo(() => {
    return estimateLogCost({
      gbPerDayIngest: clamp(gbPerDay, 0, 1e12),
      retentionDays: clamp(retentionDays, 0, 3650),
      ingestPricePerGbUsd: clamp(ingestPricePerGbUsd, 0, 1e6),
      storagePricePerGbMonthUsd: clamp(storagePricePerGbMonthUsd, 0, 1e6),
    });
  }, [gbPerDay, retentionDays, ingestPricePerGbUsd, storagePricePerGbMonthUsd]);

  const peakResult = useMemo(() => {
    if (!showPeakScenario) return null;
    const multiplier = clamp(peakMultiplierPct, 100, 1000) / 100;
    const peakRequests = clamp(requestsPerMonth, 0, 1e18) * multiplier;
    const peakGbPerDay = estimateGbPerDayFromRequests({
      requestsPerMonth: peakRequests,
      bytesPerRequest: avgLogBytesPerRequest,
      daysPerMonth: 30.4,
    });
    const peakCost = estimateLogCost({
      gbPerDayIngest: clamp(peakGbPerDay, 0, 1e12),
      retentionDays: clamp(retentionDays, 0, 3650),
      ingestPricePerGbUsd: clamp(ingestPricePerGbUsd, 0, 1e6),
      storagePricePerGbMonthUsd: clamp(storagePricePerGbMonthUsd, 0, 1e6),
    });
    return { requestsPerMonth: peakRequests, gbPerDay: peakGbPerDay, cost: peakCost };
  }, [
    avgLogBytesPerRequest,
    ingestPricePerGbUsd,
    peakMultiplierPct,
    requestsPerMonth,
    retentionDays,
    showPeakScenario,
    storagePricePerGbMonthUsd,
  ]);

  const baselineRequests = clamp(requestsPerMonth, 0, 1e18);

  return (
    <div className="calc-grid">
      <div className="panel">
        <h3>Inputs</h3>
        <div className="form">
          <div className="field field-3">
            <div className="label">Requests (per month)</div>
            <input
              type="number"
              inputMode="numeric"
              value={requestsPerMonth}
              min={0}
              step={1000}
              onChange={(e) => setRequestsPerMonth(+e.target.value)}
            />
          </div>
          <div className="field field-3">
            <div className="label">Avg log bytes per request</div>
            <input
              type="number"
              inputMode="numeric"
              value={avgLogBytesPerRequest}
              min={0}
              step={50}
              onChange={(e) => setAvgLogBytesPerRequest(+e.target.value)}
            />
          </div>
          <div className="field field-3">
            <div className="label">Retention (days)</div>
            <input
              type="number"
              inputMode="numeric"
              value={retentionDays}
              min={0}
              step={1}
              onChange={(e) => setRetentionDays(+e.target.value)}
            />
          </div>
          <div className="field field-3">
            <div className="label">Ingest price ($ / GB)</div>
            <input
              type="number"
              inputMode="decimal"
              value={ingestPricePerGbUsd}
              min={0}
              step={0.01}
              onChange={(e) => setIngestPricePerGbUsd(+e.target.value)}
            />
          </div>
          <div className="field field-3">
            <div className="label">Storage price ($ / GB-month)</div>
            <input
              type="number"
              inputMode="decimal"
              value={storagePricePerGbMonthUsd}
              min={0}
              step={0.001}
              onChange={(e) => setStoragePricePerGbMonthUsd(+e.target.value)}
            />
          </div>
          <div className="field field-9 muted" style={{ alignSelf: "end" }}>
            Use your actual log format size. If unsure, sample 100-1,000 log lines and compute average bytes.
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
              <div className="label">Peak multiplier (%)</div>
              <input
                type="number"
                inputMode="numeric"
                value={peakMultiplierPct}
                min={100}
                max={1000}
                step={5}
                onChange={(e) => setPeakMultiplierPct(+e.target.value)}
              />
              <div className="hint">Applies to request volume.</div>
            </div>
          ) : null}

          <div className="field field-6">
            <div className="label">Scenario presets</div>
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setRequestsPerMonth(12_000_000);
                  setAvgLogBytesPerRequest(900);
                  setRetentionDays(14);
                  setIngestPricePerGbUsd(0.5);
                  setStoragePricePerGbMonthUsd(0.03);
                  setShowPeakScenario(true);
                  setPeakMultiplierPct(160);
                }}
              >
                Low traffic
              </button>
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setRequestsPerMonth(120_000_000);
                  setAvgLogBytesPerRequest(1500);
                  setRetentionDays(30);
                  setIngestPricePerGbUsd(0.5);
                  setStoragePricePerGbMonthUsd(0.03);
                  setShowPeakScenario(true);
                  setPeakMultiplierPct(220);
                }}
              >
                SaaS spike
              </button>
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setRequestsPerMonth(400_000_000);
                  setAvgLogBytesPerRequest(2200);
                  setRetentionDays(30);
                  setIngestPricePerGbUsd(0.5);
                  setStoragePricePerGbMonthUsd(0.03);
                  setShowPeakScenario(true);
                  setPeakMultiplierPct(180);
                }}
              >
                High volume
              </button>
            </div>
          </div>

          <div className="field field-6">
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setRequestsPerMonth(50_000_000);
                  setAvgLogBytesPerRequest(1500);
                  setRetentionDays(30);
                  setIngestPricePerGbUsd(0.5);
                  setStoragePricePerGbMonthUsd(0.03);
                  setShowPeakScenario(false);
                  setPeakMultiplierPct(200);
                }}
              >
                Reset example
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="panel">
        <h3>Results</h3>
        <div className="kpis">
          <div className="kpi">
            <div className="k">Estimated ingestion volume</div>
            <div className="v">{formatNumber(gbPerDay, 2)} GB/day</div>
          </div>
          <div className="kpi">
            <div className="k">Estimated monthly total</div>
            <div className="v">{formatCurrency2(cost.totalMonthlyUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">Ingest cost</div>
            <div className="v">{formatCurrency2(cost.ingestCostUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">Storage cost</div>
            <div className="v">{formatCurrency2(cost.storageCostUsd)}</div>
          </div>
        </div>

        {peakResult ? (
          <div style={{ marginTop: 12 }}>
            <div className="muted" style={{ fontSize: 13, marginBottom: 6 }}>Baseline vs peak</div>
            <table className="table">
              <thead>
                <tr>
                  <th>Scenario</th>
                  <th className="num">Requests</th>
                  <th className="num">GB/day</th>
                  <th className="num">Total cost</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Baseline</td>
                  <td className="num">{formatNumber(baselineRequests, 0)}</td>
                  <td className="num">{formatNumber(gbPerDay, 2)}</td>
                  <td className="num">{formatCurrency2(cost.totalMonthlyUsd)}</td>
                </tr>
                <tr>
                  <td>Peak</td>
                  <td className="num">{formatNumber(peakResult.requestsPerMonth, 0)}</td>
                  <td className="num">{formatNumber(peakResult.gbPerDay, 2)}</td>
                  <td className="num">{formatCurrency2(peakResult.cost.totalMonthlyUsd)}</td>
                </tr>
                <tr>
                  <td>Delta</td>
                  <td className="num">{formatNumber(peakResult.requestsPerMonth - baselineRequests, 0)}</td>
                  <td className="num">{formatNumber(peakResult.gbPerDay - gbPerDay, 2)}</td>
                  <td className="num">{formatCurrency2(peakResult.cost.totalMonthlyUsd - cost.totalMonthlyUsd)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </div>
  );
}



