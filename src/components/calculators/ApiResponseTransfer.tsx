import React, { useMemo } from "react";
import { useBooleanParamState, useNumberParamState } from "./useNumberParamState";
import { estimateApiTransfer } from "../../lib/calc/apiTransfer";
import { formatNumber } from "../../lib/format";
import { clamp } from "../../lib/math";

export function ApiResponseTransferCalculator() {
  const [requestsPerDay, setRequestsPerDay] = useNumberParamState("ApiResponseTransfer.requestsPerDay", 2_000_000);
  const [avgResponseKb, setAvgResponseKb] = useNumberParamState("ApiResponseTransfer.avgResponseKb", 15);
  const [showPeakScenario, setShowPeakScenario] = useBooleanParamState("ApiResponseTransfer.showPeakScenario", false);
  const [peakMultiplierPct, setPeakMultiplierPct] = useNumberParamState("ApiResponseTransfer.peakMultiplierPct", 180);

  const result = useMemo(() => {
    return estimateApiTransfer({
      requestsPerDay: clamp(requestsPerDay, 0, 1e15),
      avgResponseKb: clamp(avgResponseKb, 0, 1e9),
    });
  }, [requestsPerDay, avgResponseKb]);

  const peakResult = useMemo(() => {
    if (!showPeakScenario) return null;
    const multiplier = clamp(peakMultiplierPct, 100, 1000) / 100;
    return estimateApiTransfer({
      requestsPerDay: clamp(requestsPerDay, 0, 1e15) * multiplier,
      avgResponseKb: clamp(avgResponseKb, 0, 1e9),
    });
  }, [avgResponseKb, peakMultiplierPct, requestsPerDay, showPeakScenario]);

  return (
    <div className="calc-grid">
      <div className="panel">
        <h3>Inputs</h3>
        <div className="form">
          <div className="field field-3">
            <div className="label">Requests (per day)</div>
            <input
              type="number"
              inputMode="numeric"
              value={requestsPerDay}
              min={0}
              step={1000}
              onChange={(e) => setRequestsPerDay(+e.target.value)}
            />
          </div>
          <div className="field field-3">
            <div className="label">Average response size (KB)</div>
            <input
              type="number"
              inputMode="decimal"
              value={avgResponseKb}
              min={0}
              step={0.1}
              onChange={(e) => setAvgResponseKb(+e.target.value)}
            />
            <div className="hint">Use your typical compressed payload size over the wire.</div>
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
              <div className="hint">Apply to the busiest day or launch spike.</div>
            </div>
          ) : null}

          <div className="field field-6">
            <div className="label">Scenario presets</div>
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setRequestsPerDay(500_000);
                  setAvgResponseKb(10);
                  setShowPeakScenario(true);
                  setPeakMultiplierPct(150);
                }}
              >
                Mobile API
              </button>
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setRequestsPerDay(3_000_000);
                  setAvgResponseKb(25);
                  setShowPeakScenario(true);
                  setPeakMultiplierPct(200);
                }}
              >
                Internal platform
              </button>
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setRequestsPerDay(12_000_000);
                  setAvgResponseKb(35);
                  setShowPeakScenario(true);
                  setPeakMultiplierPct(180);
                }}
              >
                Public API
              </button>
            </div>
          </div>

          <div className="field field-6">
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setRequestsPerDay(2_000_000);
                  setAvgResponseKb(15);
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
            <div className="k">Requests per month (est.)</div>
            <div className="v">{formatNumber(result.requestsPerMonth, 0)}</div>
          </div>
          <div className="kpi">
            <div className="k">Monthly transfer (est.)</div>
            <div className="v">{formatNumber(result.totalGb, 0)} GB</div>
          </div>
        </div>

        {peakResult ? (
          <div style={{ marginTop: 12 }}>
            <div className="muted" style={{ fontSize: 13, marginBottom: 6 }}>Baseline vs peak</div>
            <table className="table">
              <thead>
                <tr>
                  <th>Scenario</th>
                  <th className="num">Requests/mo</th>
                  <th className="num">Transfer (GB)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Baseline</td>
                  <td className="num">{formatNumber(result.requestsPerMonth, 0)}</td>
                  <td className="num">{formatNumber(result.totalGb, 0)}</td>
                </tr>
                <tr>
                  <td>Peak</td>
                  <td className="num">{formatNumber(peakResult.requestsPerMonth, 0)}</td>
                  <td className="num">{formatNumber(peakResult.totalGb, 0)}</td>
                </tr>
                <tr>
                  <td>Delta</td>
                  <td className="num">{formatNumber(peakResult.requestsPerMonth - result.requestsPerMonth, 0)}</td>
                  <td className="num">{formatNumber(peakResult.totalGb - result.totalGb, 0)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </div>
  );
}
