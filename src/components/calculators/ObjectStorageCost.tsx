import React, { useMemo } from "react";
import { useBooleanParamState, useNumberParamState } from "./useNumberParamState";
import { estimateObjectStorageCost } from "../../lib/calc/storage";
import { formatCurrency2, formatNumber } from "../../lib/format";
import { clamp } from "../../lib/math";

export function ObjectStorageCostCalculator() {
  const [averageStoredGb, setAverageStoredGb] = useNumberParamState("ObjectStorageCost.averageStoredGb", 5000);
  const [storagePricePerGbMonthUsd, setStoragePricePerGbMonthUsd] = useNumberParamState("ObjectStorageCost.storagePricePerGbMonthUsd", 0.023);
  const [getRequestsPerMonth, setGetRequestsPerMonth] = useNumberParamState("ObjectStorageCost.getRequestsPerMonth", 5_000_000);
  const [putRequestsPerMonth, setPutRequestsPerMonth] = useNumberParamState("ObjectStorageCost.putRequestsPerMonth", 500_000);
  const [getPricePer1kUsd, setGetPricePer1kUsd] = useNumberParamState("ObjectStorageCost.getPricePer1kUsd", 0.0004);
  const [putPricePer1kUsd, setPutPricePer1kUsd] = useNumberParamState("ObjectStorageCost.putPricePer1kUsd", 0.005);
  const [showPeakScenario, setShowPeakScenario] = useBooleanParamState("ObjectStorageCost.showPeakScenario", false);
  const [peakMultiplierPct, setPeakMultiplierPct] = useNumberParamState("ObjectStorageCost.peakMultiplierPct", 180);
  const secondsPerMonth = 30.4 * 24 * 3600;
  const averageStoredTb = averageStoredGb / 1024;
  const getRps = getRequestsPerMonth / secondsPerMonth;
  const putRps = putRequestsPerMonth / secondsPerMonth;

  const result = useMemo(() => {
    return estimateObjectStorageCost({
      averageStoredGb: clamp(averageStoredGb, 0, 1e12),
      storagePricePerGbMonthUsd: clamp(storagePricePerGbMonthUsd, 0, 1e6),
      getRequestsPerMonth: clamp(getRequestsPerMonth, 0, 1e15),
      putRequestsPerMonth: clamp(putRequestsPerMonth, 0, 1e15),
      getPricePer1kUsd: clamp(getPricePer1kUsd, 0, 1e3),
      putPricePer1kUsd: clamp(putPricePer1kUsd, 0, 1e3),
    });
  }, [
    averageStoredGb,
    storagePricePerGbMonthUsd,
    getRequestsPerMonth,
    putRequestsPerMonth,
    getPricePer1kUsd,
    putPricePer1kUsd,
  ]);

  const peakResult = useMemo(() => {
    if (!showPeakScenario) return null;
    const multiplier = clamp(peakMultiplierPct, 100, 1000) / 100;
    return estimateObjectStorageCost({
      averageStoredGb: clamp(averageStoredGb, 0, 1e12),
      storagePricePerGbMonthUsd: clamp(storagePricePerGbMonthUsd, 0, 1e6),
      getRequestsPerMonth: clamp(getRequestsPerMonth, 0, 1e15) * multiplier,
      putRequestsPerMonth: clamp(putRequestsPerMonth, 0, 1e15) * multiplier,
      getPricePer1kUsd: clamp(getPricePer1kUsd, 0, 1e3),
      putPricePer1kUsd: clamp(putPricePer1kUsd, 0, 1e3),
    });
  }, [
    averageStoredGb,
    getPricePer1kUsd,
    getRequestsPerMonth,
    peakMultiplierPct,
    putPricePer1kUsd,
    putRequestsPerMonth,
    showPeakScenario,
    storagePricePerGbMonthUsd,
  ]);

  return (
    <div className="calc-grid">
      <div className="panel">
        <h3>Inputs</h3>
        <div className="form">
          <div className="field field-3">
            <div className="label">Average stored (GB)</div>
            <input
              type="number"
              inputMode="decimal"
              value={averageStoredGb}
              min={0}
              onChange={(e) => setAverageStoredGb(+e.target.value)}
            />
            <div className="hint">Approx {formatNumber(averageStoredTb, 2)} TB-month.</div>
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

          <div className="field field-3">
            <div className="label">GET requests (per month)</div>
            <input
              type="number"
              inputMode="numeric"
              value={getRequestsPerMonth}
              min={0}
              step={1000}
              onChange={(e) => setGetRequestsPerMonth(+e.target.value)}
            />
            <div className="hint">Approx {formatNumber(getRps, 2)} req/sec.</div>
          </div>
          <div className="field field-3">
            <div className="label">PUT requests (per month)</div>
            <input
              type="number"
              inputMode="numeric"
              value={putRequestsPerMonth}
              min={0}
              step={1000}
              onChange={(e) => setPutRequestsPerMonth(+e.target.value)}
            />
            <div className="hint">Approx {formatNumber(putRps, 2)} req/sec.</div>
          </div>

          <div className="field field-3">
            <div className="label">GET price ($ / 1k)</div>
            <input
              type="number"
              inputMode="decimal"
              value={getPricePer1kUsd}
              min={0}
              step={0.0001}
              onChange={(e) => setGetPricePer1kUsd(+e.target.value)}
            />
          </div>
          <div className="field field-3">
            <div className="label">PUT price ($ / 1k)</div>
            <input
              type="number"
              inputMode="decimal"
              value={putPricePer1kUsd}
              min={0}
              step={0.0001}
              onChange={(e) => setPutPricePer1kUsd(+e.target.value)}
            />
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
              <div className="hint">Applies to GET/PUT requests only.</div>
            </div>
          ) : null}

          <div className="field field-6">
            <div className="label">Scenario presets</div>
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setAverageStoredGb(1200);
                  setStoragePricePerGbMonthUsd(0.023);
                  setGetRequestsPerMonth(1_200_000);
                  setPutRequestsPerMonth(120_000);
                  setGetPricePer1kUsd(0.0004);
                  setPutPricePer1kUsd(0.005);
                  setShowPeakScenario(true);
                  setPeakMultiplierPct(160);
                }}
              >
                Media library
              </button>
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setAverageStoredGb(7000);
                  setStoragePricePerGbMonthUsd(0.023);
                  setGetRequestsPerMonth(12_000_000);
                  setPutRequestsPerMonth(1_200_000);
                  setGetPricePer1kUsd(0.0004);
                  setPutPricePer1kUsd(0.005);
                  setShowPeakScenario(true);
                  setPeakMultiplierPct(220);
                }}
              >
                SaaS assets
              </button>
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setAverageStoredGb(30_000);
                  setStoragePricePerGbMonthUsd(0.021);
                  setGetRequestsPerMonth(50_000_000);
                  setPutRequestsPerMonth(3_000_000);
                  setGetPricePer1kUsd(0.00035);
                  setPutPricePer1kUsd(0.0045);
                  setShowPeakScenario(true);
                  setPeakMultiplierPct(180);
                }}
              >
                Consumer scale
              </button>
            </div>
          </div>

          <div className="field field-6">
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setAverageStoredGb(5000);
                  setStoragePricePerGbMonthUsd(0.023);
                  setGetRequestsPerMonth(5_000_000);
                  setPutRequestsPerMonth(500_000);
                  setGetPricePer1kUsd(0.0004);
                  setPutPricePer1kUsd(0.005);
                  setShowPeakScenario(false);
                  setPeakMultiplierPct(180);
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
            <div className="k">Estimated monthly total</div>
            <div className="v">{formatCurrency2(result.totalMonthlyUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">Storage cost</div>
            <div className="v">{formatCurrency2(result.storageCostUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">GET request cost</div>
            <div className="v">{formatCurrency2(result.getCostUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">PUT request cost</div>
            <div className="v">{formatCurrency2(result.putCostUsd)}</div>
          </div>
        </div>

        <details style={{ marginTop: 12 }}>
          <summary style={{ cursor: "pointer", fontWeight: 800 }}>Inputs summary</summary>
          <div style={{ overflowX: "auto", marginTop: 10 }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th className="num">Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Average stored</td>
                  <td className="num">{formatNumber(result.averageStoredGb)} GB</td>
                </tr>
                <tr>
                  <td>GET requests</td>
                  <td className="num">{formatNumber(result.getRequestsPerMonth, 0)}</td>
                </tr>
                <tr>
                  <td>PUT requests</td>
                  <td className="num">{formatNumber(result.putRequestsPerMonth, 0)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </details>

        {peakResult ? (
          <div style={{ marginTop: 12 }}>
            <div className="muted" style={{ fontSize: 13, marginBottom: 6 }}>Baseline vs peak</div>
            <table className="table">
              <thead>
                <tr>
                  <th>Scenario</th>
                  <th className="num">Requests</th>
                  <th className="num">Request cost</th>
                  <th className="num">Total cost</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Baseline</td>
                  <td className="num">{formatNumber(result.getRequestsPerMonth + result.putRequestsPerMonth, 0)}</td>
                  <td className="num">{formatCurrency2(result.getCostUsd + result.putCostUsd)}</td>
                  <td className="num">{formatCurrency2(result.totalMonthlyUsd)}</td>
                </tr>
                <tr>
                  <td>Peak</td>
                  <td className="num">{formatNumber(peakResult.getRequestsPerMonth + peakResult.putRequestsPerMonth, 0)}</td>
                  <td className="num">{formatCurrency2(peakResult.getCostUsd + peakResult.putCostUsd)}</td>
                  <td className="num">{formatCurrency2(peakResult.totalMonthlyUsd)}</td>
                </tr>
                <tr>
                  <td>Delta</td>
                  <td className="num">{formatNumber((peakResult.getRequestsPerMonth + peakResult.putRequestsPerMonth) - (result.getRequestsPerMonth + result.putRequestsPerMonth), 0)}</td>
                  <td className="num">{formatCurrency2((peakResult.getCostUsd + peakResult.putCostUsd) - (result.getCostUsd + result.putCostUsd))}</td>
                  <td className="num">{formatCurrency2(peakResult.totalMonthlyUsd - result.totalMonthlyUsd)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </div>
  );
}
