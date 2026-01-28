import React, { useMemo } from "react";
import { useBooleanParamState, useNumberParamState } from "./useNumberParamState";
import { estimateTimeseriesCost } from "../../lib/calc/metrics";
import { formatCurrency2, formatNumber } from "../../lib/format";
import { clamp } from "../../lib/math";

export function MetricsTimeseriesCostCalculator() {
  const [activeSeries, setActiveSeries] = useNumberParamState("MetricsTimeseriesCost.activeSeries", 50_000);
  const [pricePerSeriesMonthUsd, setPricePerSeriesMonthUsd] = useNumberParamState("MetricsTimeseriesCost.pricePerSeriesMonthUsd", 0.0005);
  const [showPeakScenario, setShowPeakScenario] = useBooleanParamState("MetricsTimeseriesCost.showPeakScenario", false);
  const [peakMultiplierPct, setPeakMultiplierPct] = useNumberParamState("MetricsTimeseriesCost.peakMultiplierPct", 160);

  const result = useMemo(() => {
    return estimateTimeseriesCost({
      activeSeries: clamp(activeSeries, 0, 1e12),
      pricePerSeriesMonthUsd: clamp(pricePerSeriesMonthUsd, 0, 1e6),
    });
  }, [activeSeries, pricePerSeriesMonthUsd]);

  const peakResult = useMemo(() => {
    if (!showPeakScenario) return null;
    const safeMultiplier = clamp(peakMultiplierPct, 100, 1000) / 100;
    return estimateTimeseriesCost({
      activeSeries: clamp(activeSeries, 0, 1e12) * safeMultiplier,
      pricePerSeriesMonthUsd: clamp(pricePerSeriesMonthUsd, 0, 1e6),
    });
  }, [activeSeries, peakMultiplierPct, pricePerSeriesMonthUsd, showPeakScenario]);

  return (
    <div className="calc-grid">
      <div className="panel">
        <h3>Inputs</h3>
        <div className="form">
          <div className="field field-3">
            <div className="label">Active time series</div>
            <input
              type="number"
              inputMode="numeric"
              value={activeSeries}
              min={0}
              step={100}
              onChange={(e) => setActiveSeries(+e.target.value)}
            />
          </div>
          <div className="field field-3">
            <div className="label">Price ($ / series-month)</div>
            <input
              type="number"
              inputMode="decimal"
              value={pricePerSeriesMonthUsd}
              min={0}
              step={0.0001}
              onChange={(e) => setPricePerSeriesMonthUsd(+e.target.value)}
            />
            <div className="hint">Providers define "active series" differently; use the definition in your billing docs.</div>
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
              <div className="hint">Use a peak week or incident spike.</div>
            </div>
          ) : null}

          <div className="field field-6">
            <div className="label">Scenario presets</div>
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setActiveSeries(12000);
                  setPricePerSeriesMonthUsd(0.0004);
                  setShowPeakScenario(true);
                  setPeakMultiplierPct(140);
                }}
              >
                Small SaaS
              </button>
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setActiveSeries(75000);
                  setPricePerSeriesMonthUsd(0.0005);
                  setShowPeakScenario(true);
                  setPeakMultiplierPct(170);
                }}
              >
                Prod baseline
              </button>
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setActiveSeries(200000);
                  setPricePerSeriesMonthUsd(0.0006);
                  setShowPeakScenario(true);
                  setPeakMultiplierPct(220);
                }}
              >
                High cardinality
              </button>
            </div>
          </div>

          <div className="field field-6">
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setActiveSeries(50_000);
                  setPricePerSeriesMonthUsd(0.0005);
                  setShowPeakScenario(false);
                  setPeakMultiplierPct(160);
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
            <div className="k">Estimated monthly metrics cost</div>
            <div className="v">{formatCurrency2(result.monthlyCostUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">Active series</div>
            <div className="v">{formatNumber(result.activeSeries, 0)}</div>
          </div>
        </div>

        {peakResult ? (
          <div style={{ marginTop: 12 }}>
            <div className="muted" style={{ fontSize: 13, marginBottom: 6 }}>Baseline vs peak</div>
            <table className="table">
              <thead>
                <tr>
                  <th>Scenario</th>
                  <th className="num">Active series</th>
                  <th className="num">Monthly cost</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Baseline</td>
                  <td className="num">{formatNumber(result.activeSeries, 0)}</td>
                  <td className="num">{formatCurrency2(result.monthlyCostUsd)}</td>
                </tr>
                <tr>
                  <td>Peak</td>
                  <td className="num">{formatNumber(peakResult.activeSeries, 0)}</td>
                  <td className="num">{formatCurrency2(peakResult.monthlyCostUsd)}</td>
                </tr>
                <tr>
                  <td>Delta</td>
                  <td className="num">{formatNumber(peakResult.activeSeries - result.activeSeries, 0)}</td>
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
