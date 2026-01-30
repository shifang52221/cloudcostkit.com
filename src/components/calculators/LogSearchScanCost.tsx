import React, { useMemo, useState } from "react";
import { useBooleanParamState, useNumberParamState } from "./useNumberParamState";
import { estimateLogScanCost } from "../../lib/calc/logScan";
import { formatCurrency2, formatNumber } from "../../lib/format";
import { clamp } from "../../lib/math";

export function LogSearchScanCostCalculator() {
  const [gbScannedPerDay, setGbScannedPerDay] = useNumberParamState("LogSearchScanCost.gbScannedPerDay", 800);
  const [pricePerGbUsd, setPricePerGbUsd] = useNumberParamState("LogSearchScanCost.pricePerGbUsd", 0.005);
  const [showPeakScenario, setShowPeakScenario] = useBooleanParamState("LogSearchScanCost.showPeakScenario", false);
  const [peakMultiplierPct, setPeakMultiplierPct] = useNumberParamState("LogSearchScanCost.peakMultiplierPct", 150);
  const [queriesPerDay, setQueriesPerDay] = useState(2500);
  const [avgGbPerQuery, setAvgGbPerQuery] = useState(0.12);
  const estimatedGbScannedPerDay = clamp(queriesPerDay, 0, 1e12) * clamp(avgGbPerQuery, 0, 1e9);
  const avgMbps = (gbScannedPerDay * 8000) / (24 * 3600);
  const scansPerSecondGb = gbScannedPerDay / (24 * 3600);

  const result = useMemo(() => {
    return estimateLogScanCost({
      gbScannedPerDay: clamp(gbScannedPerDay, 0, 1e12),
      pricePerGbUsd: clamp(pricePerGbUsd, 0, 1e6),
    });
  }, [gbScannedPerDay, pricePerGbUsd]);

  const peakResult = useMemo(() => {
    if (!showPeakScenario) return null;
    const safeMultiplier = clamp(peakMultiplierPct, 100, 1000) / 100;
    return estimateLogScanCost({
      gbScannedPerDay: clamp(gbScannedPerDay, 0, 1e12) * safeMultiplier,
      pricePerGbUsd: clamp(pricePerGbUsd, 0, 1e6),
    });
  }, [gbScannedPerDay, peakMultiplierPct, pricePerGbUsd, showPeakScenario]);

  return (
    <div className="calc-grid">
      <div className="panel">
        <h3>Inputs</h3>
        <div className="form">
          <div className="field field-3">
            <div className="label">GB scanned (per day)</div>
            <input
              type="number"
              inputMode="decimal"
              value={gbScannedPerDay}
              min={0}
              onChange={(e) => setGbScannedPerDay(+e.target.value)}
            />
            <div className="hint">
              Avg {formatNumber(avgMbps, 2)} Mbps scanning, {formatNumber(scansPerSecondGb, 4)} GB/sec.
            </div>
          </div>
          <div className="field field-3">
            <div className="label">Scan price ($ / GB)</div>
            <input
              type="number"
              inputMode="decimal"
              value={pricePerGbUsd}
              min={0}
              step={0.0001}
              onChange={(e) => setPricePerGbUsd(+e.target.value)}
            />
          </div>
          <div className="field field-3">
            <div className="label">Queries (per day)</div>
            <input
              type="number"
              inputMode="numeric"
              value={queriesPerDay}
              min={0}
              step={1}
              onChange={(e) => setQueriesPerDay(+e.target.value)}
            />
          </div>
          <div className="field field-3">
            <div className="label">Avg GB per query</div>
            <input
              type="number"
              inputMode="decimal"
              value={avgGbPerQuery}
              min={0}
              step={0.01}
              onChange={(e) => setAvgGbPerQuery(+e.target.value)}
            />
          </div>
          <div className="field field-3" style={{ alignSelf: "end" }}>
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => setGbScannedPerDay(Math.round(estimatedGbScannedPerDay * 100) / 100)}
              >
                Use estimate
              </button>
            </div>
            <div className="hint">Est {formatNumber(estimatedGbScannedPerDay, 2)} GB/day.</div>
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
              <div className="hint">Use a peak month or incident spike.</div>
            </div>
          ) : null}

          <div className="field field-6">
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setGbScannedPerDay(800);
                  setPricePerGbUsd(0.005);
                  setShowPeakScenario(false);
                  setPeakMultiplierPct(150);
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
            <div className="k">Monthly scan volume (est.)</div>
            <div className="v">{formatNumber(result.monthlyGbScanned, 0)} GB</div>
          </div>
          <div className="kpi">
            <div className="k">Estimated monthly scan cost</div>
            <div className="v">{formatCurrency2(result.monthlyCostUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">Cost per GB scanned</div>
            <div className="v">{formatCurrency2(result.pricePerGbUsd)} / GB</div>
          </div>
        </div>

        {peakResult ? (
          <div style={{ marginTop: 12 }}>
            <div className="muted" style={{ fontSize: 13, marginBottom: 6 }}>Baseline vs peak</div>
            <table className="table">
              <thead>
                <tr>
                  <th>Scenario</th>
                  <th className="num">GB/day</th>
                  <th className="num">Monthly GB</th>
                  <th className="num">Monthly cost</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Baseline</td>
                  <td className="num">{formatNumber(result.gbScannedPerDay, 2)}</td>
                  <td className="num">{formatNumber(result.monthlyGbScanned, 0)}</td>
                  <td className="num">{formatCurrency2(result.monthlyCostUsd)}</td>
                </tr>
                <tr>
                  <td>Peak</td>
                  <td className="num">{formatNumber(peakResult.gbScannedPerDay, 2)}</td>
                  <td className="num">{formatNumber(peakResult.monthlyGbScanned, 0)}</td>
                  <td className="num">{formatCurrency2(peakResult.monthlyCostUsd)}</td>
                </tr>
                <tr>
                  <td>Delta</td>
                  <td className="num">{formatNumber(peakResult.gbScannedPerDay - result.gbScannedPerDay, 2)}</td>
                  <td className="num">{formatNumber(peakResult.monthlyGbScanned - result.monthlyGbScanned, 0)}</td>
                  <td className="num">{formatCurrency2(peakResult.monthlyCostUsd - result.monthlyCostUsd)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </div>
  );
}
