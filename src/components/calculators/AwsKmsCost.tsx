import React, { useMemo } from "react";
import { useBooleanParamState, useNumberParamState } from "./useNumberParamState";
import { estimateKmsCost } from "../../lib/calc/kms";
import { formatCurrency2, formatNumber } from "../../lib/format";
import { clamp } from "../../lib/math";

export function AwsKmsCostCalculator() {
  const [keys, setKeys] = useNumberParamState("AwsKmsCost.keys", 50);
  const [requestsPerMonth, setRequestsPerMonth] = useNumberParamState("AwsKmsCost.requestsPerMonth", 300_000_000);
  const [pricePerKeyUsdPerMonth, setPricePerKeyUsdPerMonth] = useNumberParamState("AwsKmsCost.pricePerKeyUsdPerMonth", 1);
  const [pricePer10kRequestsUsd, setPricePer10kRequestsUsd] = useNumberParamState("AwsKmsCost.pricePer10kRequestsUsd", 0.03);
  const [showPeakScenario, setShowPeakScenario] = useBooleanParamState("AwsKmsCost.showPeakScenario", false);
  const [peakMultiplierPct, setPeakMultiplierPct] = useNumberParamState("AwsKmsCost.peakMultiplierPct", 180);

  const result = useMemo(() => {
    return estimateKmsCost({
      keys: clamp(keys, 0, 1e9),
      requestsPerMonth: clamp(requestsPerMonth, 0, 1e18),
      pricePerKeyUsdPerMonth: clamp(pricePerKeyUsdPerMonth, 0, 1e9),
      pricePer10kRequestsUsd: clamp(pricePer10kRequestsUsd, 0, 1e9),
    });
  }, [keys, requestsPerMonth, pricePerKeyUsdPerMonth, pricePer10kRequestsUsd]);

  const peakResult = useMemo(() => {
    if (!showPeakScenario) return null;
    const multiplier = clamp(peakMultiplierPct, 100, 1000) / 100;
    return estimateKmsCost({
      keys: clamp(keys, 0, 1e9),
      requestsPerMonth: clamp(requestsPerMonth, 0, 1e18) * multiplier,
      pricePerKeyUsdPerMonth: clamp(pricePerKeyUsdPerMonth, 0, 1e9),
      pricePer10kRequestsUsd: clamp(pricePer10kRequestsUsd, 0, 1e9),
    });
  }, [keys, peakMultiplierPct, pricePer10kRequestsUsd, pricePerKeyUsdPerMonth, requestsPerMonth, showPeakScenario]);

  return (
    <div className="calc-grid">
      <div className="panel">
        <h3>Inputs</h3>
        <div className="form">
          <div className="field field-3">
            <div className="label">Customer managed keys (count)</div>
            <input
              type="number"
              inputMode="numeric"
              value={keys}
              min={0}
              step={1}
              onChange={(e) => setKeys(+e.target.value)}
            />
          </div>
          <div className="field field-3">
            <div className="label">KMS requests (per month)</div>
            <input
              type="number"
              inputMode="numeric"
              value={requestsPerMonth}
              min={0}
              step={1000}
              onChange={(e) => setRequestsPerMonth(+e.target.value)}
            />
            <div className="hint">Total Encrypt/Decrypt/GenerateDataKey/etc. across services.</div>
          </div>
          <div className="field field-3">
            <div className="label">Price ($ / key-month)</div>
            <input
              type="number"
              inputMode="decimal"
              value={pricePerKeyUsdPerMonth}
              min={0}
              step={0.01}
              onChange={(e) => setPricePerKeyUsdPerMonth(+e.target.value)}
            />
          </div>
          <div className="field field-3">
            <div className="label">Price ($ / 10k requests)</div>
            <input
              type="number"
              inputMode="decimal"
              value={pricePer10kRequestsUsd}
              min={0}
              step={0.001}
              onChange={(e) => setPricePer10kRequestsUsd(+e.target.value)}
            />
            <div className="hint">Use your effective region pricing and request type mix.</div>
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
              <div className="hint">Applies to KMS request volume only.</div>
            </div>
          ) : null}

          <div className="field field-6">
            <div className="label">Scenario presets</div>
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setKeys(10);
                  setRequestsPerMonth(40_000_000);
                  setPricePerKeyUsdPerMonth(1);
                  setPricePer10kRequestsUsd(0.03);
                  setShowPeakScenario(true);
                  setPeakMultiplierPct(160);
                }}
              >
                Startup stack
              </button>
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setKeys(60);
                  setRequestsPerMonth(600_000_000);
                  setPricePerKeyUsdPerMonth(1);
                  setPricePer10kRequestsUsd(0.03);
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
                  setKeys(200);
                  setRequestsPerMonth(3_000_000_000);
                  setPricePerKeyUsdPerMonth(1);
                  setPricePer10kRequestsUsd(0.03);
                  setShowPeakScenario(true);
                  setPeakMultiplierPct(180);
                }}
              >
                Enterprise scale
              </button>
            </div>
          </div>

          <div className="field field-6">
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setKeys(50);
                  setRequestsPerMonth(300_000_000);
                  setPricePerKeyUsdPerMonth(1);
                  setPricePer10kRequestsUsd(0.03);
                  setShowPeakScenario(false);
                  setPeakMultiplierPct(180);
                }}
              >
                Reset example
              </button>
            </div>
            <div className="muted" style={{ marginTop: 8, fontSize: 12 }}>
              Simplified estimate: key-months + request charges. Multi-region keys, custom key stores, and downstream
              service charges are excluded.
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
            <div className="k">Key-month charges</div>
            <div className="v">{formatCurrency2(result.keyCostUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">Request charges</div>
            <div className="v">{formatCurrency2(result.requestCostUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">Requests/month</div>
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
                  <th className="num">Total cost</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Baseline</td>
                  <td className="num">{formatNumber(result.requestsPerMonth, 0)}</td>
                  <td className="num">{formatCurrency2(result.totalCostUsd)}</td>
                </tr>
                <tr>
                  <td>Peak</td>
                  <td className="num">{formatNumber(peakResult.requestsPerMonth, 0)}</td>
                  <td className="num">{formatCurrency2(peakResult.totalCostUsd)}</td>
                </tr>
                <tr>
                  <td>Delta</td>
                  <td className="num">{formatNumber(peakResult.requestsPerMonth - result.requestsPerMonth, 0)}</td>
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
