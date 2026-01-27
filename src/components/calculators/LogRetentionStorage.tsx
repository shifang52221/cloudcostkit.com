import React, { useMemo } from "react";
import { useBooleanParamState, useNumberParamState } from "./useNumberParamState";
import { estimateLogRetentionStorage } from "../../lib/calc/logRetention";
import { formatCurrency2, formatNumber } from "../../lib/format";
import { clamp } from "../../lib/math";

export function LogRetentionStorageCostCalculator() {
  const [gbPerDay, setGbPerDay] = useNumberParamState("LogRetentionStorage.gbPerDay", 50);
  const [retentionDays, setRetentionDays] = useNumberParamState("LogRetentionStorage.retentionDays", 30);
  const [storagePricePerGbMonthUsd, setStoragePricePerGbMonthUsd] = useNumberParamState("LogRetentionStorage.storagePricePerGbMonthUsd", 0.03);
  const [showPeakScenario, setShowPeakScenario] = useBooleanParamState("LogRetentionStorage.showPeakScenario", false);
  const [peakMultiplierPct, setPeakMultiplierPct] = useNumberParamState("LogRetentionStorage.peakMultiplierPct", 150);

  const result = useMemo(() => {
    return estimateLogRetentionStorage({
      gbPerDay: clamp(gbPerDay, 0, 1e12),
      retentionDays: clamp(retentionDays, 0, 3650),
      storagePricePerGbMonthUsd: clamp(storagePricePerGbMonthUsd, 0, 1e6),
    });
  }, [gbPerDay, retentionDays, storagePricePerGbMonthUsd]);

  const peakResult = useMemo(() => {
    if (!showPeakScenario) return null;
    const safeMultiplier = clamp(peakMultiplierPct, 100, 1000) / 100;
    return estimateLogRetentionStorage({
      gbPerDay: clamp(gbPerDay, 0, 1e12) * safeMultiplier,
      retentionDays: clamp(retentionDays, 0, 3650),
      storagePricePerGbMonthUsd: clamp(storagePricePerGbMonthUsd, 0, 1e6),
    });
  }, [gbPerDay, peakMultiplierPct, retentionDays, showPeakScenario, storagePricePerGbMonthUsd]);

  return (
    <div className="calc-grid">
      <div className="panel">
        <h3>Inputs</h3>
        <div className="form">
          <div className="field field-3">
            <div className="label">Logs produced (GB / day)</div>
            <input
              type="number"
              inputMode="decimal"
              value={gbPerDay}
              min={0}
              onChange={(e) => setGbPerDay(+e.target.value)}
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
            <div className="label">Storage price ($ / GB-month)</div>
            <input
              type="number"
              inputMode="decimal"
              value={storagePricePerGbMonthUsd}
              min={0}
              step={0.01}
              onChange={(e) => setStoragePricePerGbMonthUsd(+e.target.value)}
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
              <div className="hint">Use a peak month or incident spike.</div>
            </div>
          ) : null}

          <div className="field field-6">
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setGbPerDay(50);
                  setRetentionDays(30);
                  setStoragePricePerGbMonthUsd(0.03);
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
            <div className="k">Retained volume (steady state)</div>
            <div className="v">{formatNumber(result.storedGbSteadyState, 0)} GB</div>
          </div>
          <div className="kpi">
            <div className="k">Estimated monthly storage cost</div>
            <div className="v">{formatCurrency2(result.monthlyStorageCostUsd)}</div>
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
                  <th className="num">Retained GB</th>
                  <th className="num">Monthly cost</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Baseline</td>
                  <td className="num">{formatNumber(result.gbPerDay, 2)}</td>
                  <td className="num">{formatNumber(result.storedGbSteadyState, 0)}</td>
                  <td className="num">{formatCurrency2(result.monthlyStorageCostUsd)}</td>
                </tr>
                <tr>
                  <td>Peak</td>
                  <td className="num">{formatNumber(peakResult.gbPerDay, 2)}</td>
                  <td className="num">{formatNumber(peakResult.storedGbSteadyState, 0)}</td>
                  <td className="num">{formatCurrency2(peakResult.monthlyStorageCostUsd)}</td>
                </tr>
                <tr>
                  <td>Delta</td>
                  <td className="num">{formatNumber(peakResult.gbPerDay - result.gbPerDay, 2)}</td>
                  <td className="num">{formatNumber(peakResult.storedGbSteadyState - result.storedGbSteadyState, 0)}</td>
                  <td className="num">{formatCurrency2(peakResult.monthlyStorageCostUsd - result.monthlyStorageCostUsd)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </div>
  );
}
