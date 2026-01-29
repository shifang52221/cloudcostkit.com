import React, { useMemo } from "react";
import { useBooleanParamState, useNumberParamState } from "./useNumberParamState";
import { estimateS3GlacierCost } from "../../lib/calc/s3Glacier";
import { formatCurrency2, formatNumber } from "../../lib/format";
import { clamp } from "../../lib/math";

export function AwsS3GlacierCostCalculator() {
  const [storedGbMonth, setStoredGbMonth] = useNumberParamState("AwsS3GlacierCost.storedGbMonth", 10_000);
  const [storagePricePerGbMonthUsd, setStoragePricePerGbMonthUsd] = useNumberParamState("AwsS3GlacierCost.storagePricePerGbMonthUsd", 0.004);

  const [retrievalGbPerMonth, setRetrievalGbPerMonth] = useNumberParamState("AwsS3GlacierCost.retrievalGbPerMonth", 500);
  const [retrievalPricePerGbUsd, setRetrievalPricePerGbUsd] = useNumberParamState("AwsS3GlacierCost.retrievalPricePerGbUsd", 0.01);

  const [retrievalRequestsPerMonth, setRetrievalRequestsPerMonth] = useNumberParamState("AwsS3GlacierCost.retrievalRequestsPerMonth", 2_000_000);
  const [retrievalPricePer1000RequestsUsd, setRetrievalPricePer1000RequestsUsd] = useNumberParamState("AwsS3GlacierCost.retrievalPricePer1000RequestsUsd", 0.05);
  const [showPeakScenario, setShowPeakScenario] = useBooleanParamState("AwsS3GlacierCost.showPeakScenario", false);
  const [peakMultiplierPct, setPeakMultiplierPct] = useNumberParamState("AwsS3GlacierCost.peakMultiplierPct", 200);
  const storedTbMonth = storedGbMonth / 1024;
  const retrievalGbPerDay = retrievalGbPerMonth / 30.4;
  const retrievalAvgMbps = (retrievalGbPerMonth * 8000) / (30.4 * 24 * 3600);
  const retrievalRequestsPerSecond = retrievalRequestsPerMonth / (30.4 * 24 * 3600);
  const retrievalPricePerMillionUsd = retrievalPricePer1000RequestsUsd * 1000;

  const result = useMemo(() => {
    return estimateS3GlacierCost({
      storedGbMonth: clamp(storedGbMonth, 0, 1e18),
      storagePricePerGbMonthUsd: clamp(storagePricePerGbMonthUsd, 0, 1e9),
      retrievalGbPerMonth: clamp(retrievalGbPerMonth, 0, 1e18),
      retrievalPricePerGbUsd: clamp(retrievalPricePerGbUsd, 0, 1e9),
      retrievalRequestsPerMonth: clamp(retrievalRequestsPerMonth, 0, 1e18),
      retrievalPricePer1000RequestsUsd: clamp(retrievalPricePer1000RequestsUsd, 0, 1e9),
    });
  }, [
    storedGbMonth,
    storagePricePerGbMonthUsd,
    retrievalGbPerMonth,
    retrievalPricePerGbUsd,
    retrievalRequestsPerMonth,
    retrievalPricePer1000RequestsUsd,
  ]);

  const peakResult = useMemo(() => {
    if (!showPeakScenario) return null;
    const multiplier = clamp(peakMultiplierPct, 100, 1000) / 100;
    return estimateS3GlacierCost({
      storedGbMonth: clamp(storedGbMonth, 0, 1e18),
      storagePricePerGbMonthUsd: clamp(storagePricePerGbMonthUsd, 0, 1e9),
      retrievalGbPerMonth: clamp(retrievalGbPerMonth, 0, 1e18) * multiplier,
      retrievalPricePerGbUsd: clamp(retrievalPricePerGbUsd, 0, 1e9),
      retrievalRequestsPerMonth: clamp(retrievalRequestsPerMonth, 0, 1e18) * multiplier,
      retrievalPricePer1000RequestsUsd: clamp(retrievalPricePer1000RequestsUsd, 0, 1e9),
    });
  }, [
    peakMultiplierPct,
    retrievalGbPerMonth,
    retrievalPricePer1000RequestsUsd,
    retrievalPricePerGbUsd,
    retrievalRequestsPerMonth,
    showPeakScenario,
    storagePricePerGbMonthUsd,
    storedGbMonth,
  ]);

  return (
    <div className="calc-grid">
      <div className="panel">
        <h3>Inputs</h3>
        <div className="form">
          <div className="field field-3">
            <div className="label">Stored data (GB-month)</div>
            <input
              type="number"
              inputMode="decimal"
              value={storedGbMonth}
              min={0}
              step={1}
              onChange={(e) => setStoredGbMonth(+e.target.value)}
            />
            <div className="hint">Average stored GB over the month (~{formatNumber(storedTbMonth, 2)} TB-month).</div>
          </div>
          <div className="field field-3">
            <div className="label">Storage price ($ / GB-month)</div>
            <input
              type="number"
              inputMode="decimal"
              value={storagePricePerGbMonthUsd}
              min={0}
              step={0.0001}
              onChange={(e) => setStoragePricePerGbMonthUsd(+e.target.value)}
            />
            <div className="hint">Use your effective Glacier/Deep Archive storage price.</div>
          </div>

          <div className="field field-3">
            <div className="label">Retrieval volume (GB/month)</div>
            <input
              type="number"
              inputMode="decimal"
              value={retrievalGbPerMonth}
              min={0}
              step={1}
              onChange={(e) => setRetrievalGbPerMonth(+e.target.value)}
            />
            <div className="hint">
              ~{formatNumber(retrievalGbPerDay, 2)} GB/day, {formatNumber(retrievalAvgMbps, 2)} Mbps.
            </div>
          </div>
          <div className="field field-3">
            <div className="label">Retrieval price ($ / GB)</div>
            <input
              type="number"
              inputMode="decimal"
              value={retrievalPricePerGbUsd}
              min={0}
              step={0.0001}
              onChange={(e) => setRetrievalPricePerGbUsd(+e.target.value)}
            />
            <div className="hint">Varies by retrieval tier and storage class.</div>
          </div>

          <div className="field field-3">
            <div className="label">Retrieval requests (per month)</div>
            <input
              type="number"
              inputMode="numeric"
              value={retrievalRequestsPerMonth}
              min={0}
              step={1000}
              onChange={(e) => setRetrievalRequestsPerMonth(+e.target.value)}
            />
            <div className="hint">Avg {formatNumber(retrievalRequestsPerSecond, 2)} req/sec.</div>
          </div>
          <div className="field field-3">
            <div className="label">Retrieval requests price ($ / 1000)</div>
            <input
              type="number"
              inputMode="decimal"
              value={retrievalPricePer1000RequestsUsd}
              min={0}
              step={0.0001}
              onChange={(e) => setRetrievalPricePer1000RequestsUsd(+e.target.value)}
            />
            <div className="hint">~{formatCurrency2(retrievalPricePerMillionUsd)} per 1M requests.</div>
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
              <div className="hint">Applies to retrieval volume and requests.</div>
            </div>
          ) : null}

          <div className="field field-6">
            <div className="label">Scenario presets</div>
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setStoredGbMonth(5000);
                  setStoragePricePerGbMonthUsd(0.004);
                  setRetrievalGbPerMonth(120);
                  setRetrievalPricePerGbUsd(0.01);
                  setRetrievalRequestsPerMonth(200_000);
                  setRetrievalPricePer1000RequestsUsd(0.05);
                  setShowPeakScenario(true);
                  setPeakMultiplierPct(160);
                }}
              >
                Archive backup
              </button>
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setStoredGbMonth(50_000);
                  setStoragePricePerGbMonthUsd(0.004);
                  setRetrievalGbPerMonth(2000);
                  setRetrievalPricePerGbUsd(0.01);
                  setRetrievalRequestsPerMonth(4_000_000);
                  setRetrievalPricePer1000RequestsUsd(0.05);
                  setShowPeakScenario(true);
                  setPeakMultiplierPct(220);
                }}
              >
                Compliance
              </button>
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setStoredGbMonth(200_000);
                  setStoragePricePerGbMonthUsd(0.004);
                  setRetrievalGbPerMonth(8000);
                  setRetrievalPricePerGbUsd(0.01);
                  setRetrievalRequestsPerMonth(10_000_000);
                  setRetrievalPricePer1000RequestsUsd(0.05);
                  setShowPeakScenario(true);
                  setPeakMultiplierPct(180);
                }}
              >
                Large archive
              </button>
            </div>
          </div>

          <div className="field field-6">
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setStoredGbMonth(10_000);
                  setStoragePricePerGbMonthUsd(0.004);
                  setRetrievalGbPerMonth(500);
                  setRetrievalPricePerGbUsd(0.01);
                  setRetrievalRequestsPerMonth(2_000_000);
                  setRetrievalPricePer1000RequestsUsd(0.05);
                  setShowPeakScenario(false);
                  setPeakMultiplierPct(200);
                }}
              >
                Reset example
              </button>
            </div>
            <div className="muted" style={{ marginTop: 8, fontSize: 12 }}>
              Excludes minimum storage duration fees, early deletion fees, and data transfer out to the internet.
            </div>
          </div>
        </div>
      </div>

      <div className="panel">
        <h3>Results</h3>
        <div className="kpis">
          <div className="kpi">
            <div className="k">Estimated monthly total</div>
            <div className="v">{formatCurrency2(result.totalCostUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">Storage</div>
            <div className="v">{formatCurrency2(result.storageCostUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">Retrieval (GB)</div>
            <div className="v">{formatCurrency2(result.retrievalCostUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">Retrieval (requests)</div>
            <div className="v">{formatCurrency2(result.retrievalRequestCostUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">Stored (GB-month)</div>
            <div className="v">{formatNumber(result.storedGbMonth, 0)}</div>
          </div>
          <div className="kpi">
            <div className="k">Retrieved (GB/month)</div>
            <div className="v">{formatNumber(result.retrievalGbPerMonth, 0)}</div>
          </div>
        </div>

        {peakResult ? (
          <div style={{ marginTop: 12 }}>
            <div className="muted" style={{ fontSize: 13, marginBottom: 6 }}>Baseline vs peak</div>
            <table className="table">
              <thead>
                <tr>
                  <th>Scenario</th>
                  <th className="num">Retrieval GB</th>
                  <th className="num">Requests</th>
                  <th className="num">Total cost</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Baseline</td>
                  <td className="num">{formatNumber(result.retrievalGbPerMonth, 0)}</td>
                  <td className="num">{formatNumber(result.retrievalRequestsPerMonth, 0)}</td>
                  <td className="num">{formatCurrency2(result.totalCostUsd)}</td>
                </tr>
                <tr>
                  <td>Peak</td>
                  <td className="num">{formatNumber(peakResult.retrievalGbPerMonth, 0)}</td>
                  <td className="num">{formatNumber(peakResult.retrievalRequestsPerMonth, 0)}</td>
                  <td className="num">{formatCurrency2(peakResult.totalCostUsd)}</td>
                </tr>
                <tr>
                  <td>Delta</td>
                  <td className="num">{formatNumber(peakResult.retrievalGbPerMonth - result.retrievalGbPerMonth, 0)}</td>
                  <td className="num">{formatNumber(peakResult.retrievalRequestsPerMonth - result.retrievalRequestsPerMonth, 0)}</td>
                  <td className="num">{formatCurrency2(peakResult.totalCostUsd - result.totalCostUsd)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </div>
  );
}
