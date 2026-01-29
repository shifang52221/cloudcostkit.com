import React, { useMemo } from "react";
import { useBooleanParamState, useNumberParamState } from "./useNumberParamState";
import { estimateDbStorageGrowth } from "../../lib/calc/dbGrowth";
import { formatCurrency2, formatNumber } from "../../lib/format";
import { clamp } from "../../lib/math";

export function DatabaseStorageGrowthCostCalculator() {
  const [startingGb, setStartingGb] = useNumberParamState("DatabaseStorageGrowth.startingGb", 500);
  const [growthGbPerDay, setGrowthGbPerDay] = useNumberParamState("DatabaseStorageGrowth.growthGbPerDay", 5);
  const [months, setMonths] = useNumberParamState("DatabaseStorageGrowth.months", 6);
  const [storagePricePerGbMonthUsd, setStoragePricePerGbMonthUsd] = useNumberParamState("DatabaseStorageGrowth.storagePricePerGbMonthUsd", 0.12);
  const [showPeakScenario, setShowPeakScenario] = useBooleanParamState("DatabaseStorageGrowth.showPeakScenario", false);
  const [peakMultiplierPct, setPeakMultiplierPct] = useNumberParamState("DatabaseStorageGrowth.peakMultiplierPct", 180);
  const startingTb = startingGb / 1024;
  const growthGbPerMonth = growthGbPerDay * 30.4;
  const pricePerTbMonthUsd = storagePricePerGbMonthUsd * 1024;

  const result = useMemo(() => {
    return estimateDbStorageGrowth({
      startingGb: clamp(startingGb, 0, 1e15),
      growthGbPerDay: clamp(growthGbPerDay, 0, 1e12),
      months: clamp(months, 0, 120),
      storagePricePerGbMonthUsd: clamp(storagePricePerGbMonthUsd, 0, 1e6),
    });
  }, [startingGb, growthGbPerDay, months, storagePricePerGbMonthUsd]);

  const peakResult = useMemo(() => {
    if (!showPeakScenario) return null;
    const multiplier = clamp(peakMultiplierPct, 100, 1000) / 100;
    return estimateDbStorageGrowth({
      startingGb: clamp(startingGb, 0, 1e15),
      growthGbPerDay: clamp(growthGbPerDay, 0, 1e12) * multiplier,
      months: clamp(months, 0, 120),
      storagePricePerGbMonthUsd: clamp(storagePricePerGbMonthUsd, 0, 1e6),
    });
  }, [growthGbPerDay, months, peakMultiplierPct, showPeakScenario, startingGb, storagePricePerGbMonthUsd]);

  return (
    <div className="calc-grid">
      <div className="panel">
        <h3>Inputs</h3>
        <div className="form">
          <div className="field field-3">
            <div className="label">Starting size (GB)</div>
            <input
              type="number"
              inputMode="decimal"
              value={startingGb}
              min={0}
              onChange={(e) => setStartingGb(+e.target.value)}
            />
            <div className="hint">~{formatNumber(startingTb, 2)} TB.</div>
          </div>
          <div className="field field-3">
            <div className="label">Growth (GB / day)</div>
            <input
              type="number"
              inputMode="decimal"
              value={growthGbPerDay}
              min={0}
              step={0.1}
              onChange={(e) => setGrowthGbPerDay(+e.target.value)}
            />
            <div className="hint">~{formatNumber(growthGbPerMonth, 1)} GB/month growth.</div>
          </div>
          <div className="field field-3">
            <div className="label">Horizon (months)</div>
            <input
              type="number"
              inputMode="numeric"
              value={months}
              min={0}
              max={120}
              step={1}
              onChange={(e) => setMonths(+e.target.value)}
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
            <div className="hint">~{formatCurrency2(pricePerTbMonthUsd)} per TB-month.</div>
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
              <div className="hint">Applies to daily growth rate.</div>
            </div>
          ) : null}

          <div className="field field-6">
            <div className="label">Scenario presets</div>
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setStartingGb(200);
                  setGrowthGbPerDay(1.2);
                  setMonths(6);
                  setStoragePricePerGbMonthUsd(0.12);
                  setShowPeakScenario(true);
                  setPeakMultiplierPct(160);
                }}
              >
                Startup
              </button>
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setStartingGb(1200);
                  setGrowthGbPerDay(6);
                  setMonths(12);
                  setStoragePricePerGbMonthUsd(0.12);
                  setShowPeakScenario(true);
                  setPeakMultiplierPct(220);
                }}
              >
                SaaS core
              </button>
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setStartingGb(5000);
                  setGrowthGbPerDay(18);
                  setMonths(18);
                  setStoragePricePerGbMonthUsd(0.1);
                  setShowPeakScenario(true);
                  setPeakMultiplierPct(180);
                }}
              >
                High growth
              </button>
            </div>
          </div>

          <div className="field field-6">
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setStartingGb(500);
                  setGrowthGbPerDay(5);
                  setMonths(6);
                  setStoragePricePerGbMonthUsd(0.12);
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
            <div className="k">Ending size (est.)</div>
            <div className="v">{formatNumber(result.endingGb, 0)} GB</div>
          </div>
          <div className="kpi">
            <div className="k">Average size (est.)</div>
            <div className="v">{formatNumber(result.averageGb, 0)} GB</div>
          </div>
          <div className="kpi">
            <div className="k">Estimated monthly cost (average)</div>
            <div className="v">{formatCurrency2(result.estimatedMonthlyCostUsd)}</div>
          </div>
        </div>

        {peakResult ? (
          <div style={{ marginTop: 12 }}>
            <div className="muted" style={{ fontSize: 13, marginBottom: 6 }}>Baseline vs peak</div>
            <table className="table">
              <thead>
                <tr>
                  <th>Scenario</th>
                  <th className="num">Ending size</th>
                  <th className="num">Avg size</th>
                  <th className="num">Monthly cost</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Baseline</td>
                  <td className="num">{formatNumber(result.endingGb, 0)} GB</td>
                  <td className="num">{formatNumber(result.averageGb, 0)} GB</td>
                  <td className="num">{formatCurrency2(result.estimatedMonthlyCostUsd)}</td>
                </tr>
                <tr>
                  <td>Peak</td>
                  <td className="num">{formatNumber(peakResult.endingGb, 0)} GB</td>
                  <td className="num">{formatNumber(peakResult.averageGb, 0)} GB</td>
                  <td className="num">{formatCurrency2(peakResult.estimatedMonthlyCostUsd)}</td>
                </tr>
                <tr>
                  <td>Delta</td>
                  <td className="num">{formatNumber(peakResult.endingGb - result.endingGb, 0)} GB</td>
                  <td className="num">{formatNumber(peakResult.averageGb - result.averageGb, 0)} GB</td>
                  <td className="num">{formatCurrency2(peakResult.estimatedMonthlyCostUsd - result.estimatedMonthlyCostUsd)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </div>
  );
}
