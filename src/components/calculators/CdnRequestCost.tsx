import React, { useMemo } from "react";
import { useBooleanParamState, useNumberParamState } from "./useNumberParamState";
import { useStringParamState } from "./useNumberParamState";
import { estimateRequestCostPer10k } from "../../lib/calc/requests";
import { formatCurrency2, formatNumber } from "../../lib/format";
import { clamp } from "../../lib/math";

export function CdnRequestCostCalculator() {
  const [requestsPerMonth, setRequestsPerMonth] = useNumberParamState("CdnRequestCost.requestsPerMonth", 300_000_000);
  const [pricePer10kUsd, setPricePer10kUsd] = useNumberParamState("CdnRequestCost.pricePer10kUsd", 0.0075);
  const [pricingUnit, setPricingUnit] = useStringParamState("CdnRequestCost.pricingUnit", "per10k", ["per10k", "per1m"] as const);
  const [showPeakScenario, setShowPeakScenario] = useBooleanParamState("CdnRequestCost.showPeakScenario", false);
  const [peakMultiplierPct, setPeakMultiplierPct] = useNumberParamState("CdnRequestCost.peakMultiplierPct", 160);

  const result = useMemo(() => {
    return estimateRequestCostPer10k({
      requestsPerMonth: clamp(requestsPerMonth, 0, 1e18),
      pricePer10kUsd: clamp(pricePer10kUsd, 0, 1e9),
    });
  }, [requestsPerMonth, pricePer10kUsd]);

  const peakResult = useMemo(() => {
    if (!showPeakScenario) return null;
    const safeMultiplier = clamp(peakMultiplierPct, 100, 1000) / 100;
    return estimateRequestCostPer10k({
      requestsPerMonth: clamp(requestsPerMonth, 0, 1e18) * safeMultiplier,
      pricePer10kUsd: clamp(pricePer10kUsd, 0, 1e9),
    });
  }, [peakMultiplierPct, pricePer10kUsd, requestsPerMonth, showPeakScenario]);

  const priceInputLabel = pricingUnit === "per1m" ? "Price ($ / 1M requests)" : "Price ($ / 10k requests)";
  const priceInputValue = pricingUnit === "per1m" ? pricePer10kUsd * 100 : pricePer10kUsd;
  const effectivePer1m = pricePer10kUsd * 100;

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
            <div className="label">Pricing unit</div>
            <select value={pricingUnit} onChange={(e) => setPricingUnit(String(e.target.value))}>
              <option value="per10k">$ per 10k</option>
              <option value="per1m">$ per 1M</option>
            </select>
            <div className="hint">Per 1M is 100x per 10k.</div>
          </div>
          <div className="field field-3">
            <div className="label">{priceInputLabel}</div>
            <input
              type="number"
              inputMode="decimal"
              value={priceInputValue}
              min={0}
              step={0.0001}
              onChange={(e) => {
                const next = +e.target.value;
                if (pricingUnit === "per1m") setPricePer10kUsd(next / 100);
                else setPricePer10kUsd(next);
              }}
            />
            <div className="hint">
              Effective rate: {formatCurrency2(effectivePer1m)} / 1M requests
            </div>
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
              <div className="hint">Use a peak month or bot spike.</div>
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
                  setPricePer10kUsd(0.0075);
                  setPricingUnit("per10k");
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
                  setRequestsPerMonth(600_000_000);
                  setPricePer10kUsd(0.01);
                  setPricingUnit("per10k");
                  setShowPeakScenario(true);
                  setPeakMultiplierPct(200);
                }}
              >
                API heavy
              </button>
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setRequestsPerMonth(1_500_000_000);
                  setPricePer10kUsd(0.006);
                  setPricingUnit("per10k");
                  setShowPeakScenario(true);
                  setPeakMultiplierPct(180);
                }}
              >
                Media scale
              </button>
            </div>
          </div>

          <div className="field field-6">
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setRequestsPerMonth(300_000_000);
                  setPricePer10kUsd(0.0075);
                  setPricingUnit("per10k");
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
