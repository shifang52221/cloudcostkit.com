import React, { useMemo } from "react";
import { useBooleanParamState, useNumberParamState } from "./useNumberParamState";
import { estimateRequestCost } from "../../lib/calc/requests";
import { formatCurrency2, formatNumber } from "../../lib/format";
import { clamp } from "../../lib/math";

export function ApiRequestCostCalculator() {
  const [requestsPerMonth, setRequestsPerMonth] = useNumberParamState("ApiRequestCost.requestsPerMonth", 500_000_000);
  const [pricePerMillionUsd, setPricePerMillionUsd] = useNumberParamState("ApiRequestCost.pricePerMillionUsd", 1.0);
  const [showPeakScenario, setShowPeakScenario] = useBooleanParamState("ApiRequestCost.showPeakScenario", false);
  const [peakMultiplierPct, setPeakMultiplierPct] = useNumberParamState("ApiRequestCost.peakMultiplierPct", 180);
  const requestsPerSecond = requestsPerMonth / (30.4 * 24 * 3600);
  const pricePerBillionUsd = pricePerMillionUsd * 1000;

  const result = useMemo(() => {
    return estimateRequestCost({
      requestsPerMonth: clamp(requestsPerMonth, 0, 1e18),
      pricePerMillionUsd: clamp(pricePerMillionUsd, 0, 1e9),
    });
  }, [requestsPerMonth, pricePerMillionUsd]);

  const peakResult = useMemo(() => {
    if (!showPeakScenario) return null;
    const multiplier = clamp(peakMultiplierPct, 100, 1000) / 100;
    return estimateRequestCost({
      requestsPerMonth: clamp(requestsPerMonth, 0, 1e18) * multiplier,
      pricePerMillionUsd: clamp(pricePerMillionUsd, 0, 1e9),
    });
  }, [peakMultiplierPct, pricePerMillionUsd, requestsPerMonth, showPeakScenario]);

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
            <div className="hint">Avg {formatNumber(requestsPerSecond, 2)} req/sec.</div>
          </div>
          <div className="field field-3">
            <div className="label">Price ($ / 1M requests)</div>
            <input
              type="number"
              inputMode="decimal"
              value={pricePerMillionUsd}
              min={0}
              step={0.01}
              onChange={(e) => setPricePerMillionUsd(+e.target.value)}
            />
            <div className="hint">~{formatCurrency2(pricePerBillionUsd)} per 1B requests.</div>
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
              <div className="hint">Use for seasonal or bursty traffic months.</div>
            </div>
          ) : null}

          <div className="field field-6">
            <div className="label">Scenario presets</div>
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setRequestsPerMonth(120_000_000);
                  setPricePerMillionUsd(1.1);
                  setShowPeakScenario(true);
                  setPeakMultiplierPct(150);
                }}
              >
                SaaS baseline
              </button>
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setRequestsPerMonth(900_000_000);
                  setPricePerMillionUsd(0.9);
                  setShowPeakScenario(true);
                  setPeakMultiplierPct(220);
                }}
              >
                API heavy
              </button>
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setRequestsPerMonth(3_500_000_000);
                  setPricePerMillionUsd(0.7);
                  setShowPeakScenario(true);
                  setPeakMultiplierPct(260);
                }}
              >
                Mobile spike
              </button>
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setRequestsPerMonth(2_500_000_000);
                  setPricePerMillionUsd(0.8);
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
                  setRequestsPerMonth(500_000_000);
                  setPricePerMillionUsd(1.0);
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
            <div className="k">Estimated monthly request cost</div>
            <div className="v">{formatCurrency2(result.costUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">Requests</div>
            <div className="v">{formatNumber(result.requestsPerMonth, 0)}</div>
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
                  <th className="num">Monthly cost</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Baseline</td>
                  <td className="num">{formatNumber(result.requestsPerMonth, 0)}</td>
                  <td className="num">{formatCurrency2(result.costUsd)}</td>
                </tr>
                <tr>
                  <td>Peak</td>
                  <td className="num">{formatNumber(peakResult.requestsPerMonth, 0)}</td>
                  <td className="num">{formatCurrency2(peakResult.costUsd)}</td>
                </tr>
                <tr>
                  <td>Delta</td>
                  <td className="num">{formatNumber(peakResult.requestsPerMonth - result.requestsPerMonth, 0)}</td>
                  <td className="num">{formatCurrency2(peakResult.costUsd - result.costUsd)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </div>
  );
}
