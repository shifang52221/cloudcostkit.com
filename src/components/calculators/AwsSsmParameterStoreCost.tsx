import React, { useMemo, useState } from "react";
import { useBooleanParamState, useNumberParamState } from "./useNumberParamState";
import { estimateSsmParameterStoreCost } from "../../lib/calc/ssmParameterStore";
import { formatCurrency2, formatNumber } from "../../lib/format";
import { clamp } from "../../lib/math";

export function AwsSsmParameterStoreCostCalculator() {
  const [standardParameters, setStandardParameters] = useNumberParamState("AwsSsmParameterStoreCost.standardParameters", 1000);
  const [advancedParameters, setAdvancedParameters] = useNumberParamState("AwsSsmParameterStoreCost.advancedParameters", 200);
  const [pricePerAdvancedParameterUsdPerMonth, setPricePerAdvancedParameterUsdPerMonth] = useNumberParamState("AwsSsmParameterStoreCost.pricePerAdvancedParameterUsdPerMonth", 0.05);

  const [apiCallsPerMonth, setApiCallsPerMonth] = useNumberParamState("AwsSsmParameterStoreCost.apiCallsPerMonth", 200_000_000);
  const [pricePer10kApiCallsUsd, setPricePer10kApiCallsUsd] = useNumberParamState("AwsSsmParameterStoreCost.pricePer10kApiCallsUsd", 0.05);
  const [showPeakScenario, setShowPeakScenario] = useBooleanParamState("AwsSsmParameterStoreCost.showPeakScenario", false);
  const [peakMultiplierPct, setPeakMultiplierPct] = useNumberParamState("AwsSsmParameterStoreCost.peakMultiplierPct", 200);
  const [instances, setInstances] = useState(300);
  const [refreshMinutes, setRefreshMinutes] = useState(10);
  const [callsPerRefresh, setCallsPerRefresh] = useState(1);
  const safeRefreshMinutes = clamp(refreshMinutes, 1, 1e6);
  const estimatedApiCallsPerMonth = (instances * (30.4 * 24 * 60)) / safeRefreshMinutes * clamp(callsPerRefresh, 0, 1e6);
  const apiCallsPerSecond = apiCallsPerMonth / (30.4 * 24 * 3600);
  const pricePerMillionApiCallsUsd = pricePer10kApiCallsUsd * 100;

  const result = useMemo(() => {
    return estimateSsmParameterStoreCost({
      standardParameters: clamp(standardParameters, 0, 1e12),
      advancedParameters: clamp(advancedParameters, 0, 1e12),
      pricePerAdvancedParameterUsdPerMonth: clamp(pricePerAdvancedParameterUsdPerMonth, 0, 1e9),
      apiCallsPerMonth: clamp(apiCallsPerMonth, 0, 1e18),
      pricePer10kApiCallsUsd: clamp(pricePer10kApiCallsUsd, 0, 1e9),
    });
  }, [
    standardParameters,
    advancedParameters,
    pricePerAdvancedParameterUsdPerMonth,
    apiCallsPerMonth,
    pricePer10kApiCallsUsd,
  ]);

  const peakResult = useMemo(() => {
    if (!showPeakScenario) return null;
    const multiplier = clamp(peakMultiplierPct, 100, 1000) / 100;
    return estimateSsmParameterStoreCost({
      standardParameters: clamp(standardParameters, 0, 1e12),
      advancedParameters: clamp(advancedParameters, 0, 1e12),
      pricePerAdvancedParameterUsdPerMonth: clamp(pricePerAdvancedParameterUsdPerMonth, 0, 1e9),
      apiCallsPerMonth: clamp(apiCallsPerMonth, 0, 1e18) * multiplier,
      pricePer10kApiCallsUsd: clamp(pricePer10kApiCallsUsd, 0, 1e9),
    });
  }, [
    advancedParameters,
    apiCallsPerMonth,
    peakMultiplierPct,
    pricePer10kApiCallsUsd,
    pricePerAdvancedParameterUsdPerMonth,
    showPeakScenario,
    standardParameters,
  ]);

  return (
    <div className="calc-grid">
      <div className="panel">
        <h3>Inputs</h3>
        <div className="form">
          <div className="field field-3">
            <div className="label">Standard parameters (count)</div>
            <input
              type="number"
              inputMode="numeric"
              value={standardParameters}
              min={0}
              step={1}
              onChange={(e) => setStandardParameters(+e.target.value)}
            />
            <div className="hint">Often free or low-cost; include for inventory sanity.</div>
          </div>
          <div className="field field-3">
            <div className="label">Advanced parameters (count)</div>
            <input
              type="number"
              inputMode="numeric"
              value={advancedParameters}
              min={0}
              step={1}
              onChange={(e) => setAdvancedParameters(+e.target.value)}
            />
            <div className="hint">Charged per parameter-month in many pricing models.</div>
          </div>
          <div className="field field-3">
            <div className="label">Price ($ / advanced parameter-month)</div>
            <input
              type="number"
              inputMode="decimal"
              value={pricePerAdvancedParameterUsdPerMonth}
              min={0}
              step={0.001}
              onChange={(e) => setPricePerAdvancedParameterUsdPerMonth(+e.target.value)}
            />
          </div>

          <div className="field field-3">
            <div className="label">API calls (per month)</div>
            <input
              type="number"
              inputMode="numeric"
              value={apiCallsPerMonth}
              min={0}
              step={1000}
              onChange={(e) => setApiCallsPerMonth(+e.target.value)}
            />
            <div className="hint">
              Avg {formatNumber(apiCallsPerSecond, 2)} req/sec. GetParameter(s), PutParameter, List*, etc.
            </div>
          </div>
          <div className="field field-3">
            <div className="label">Price ($ / 10k API calls)</div>
            <input
              type="number"
              inputMode="decimal"
              value={pricePer10kApiCallsUsd}
              min={0}
              step={0.001}
              onChange={(e) => setPricePer10kApiCallsUsd(+e.target.value)}
            />
            <div className="hint">~{formatCurrency2(pricePerMillionApiCallsUsd)} per 1M calls.</div>
          </div>

          <div className="field field-3">
            <div className="label">Instances (avg)</div>
            <input
              type="number"
              inputMode="numeric"
              value={instances}
              min={0}
              step={1}
              onChange={(e) => setInstances(+e.target.value)}
            />
          </div>
          <div className="field field-3">
            <div className="label">Refresh interval (minutes)</div>
            <input
              type="number"
              inputMode="numeric"
              value={refreshMinutes}
              min={1}
              step={1}
              onChange={(e) => setRefreshMinutes(+e.target.value)}
            />
          </div>
          <div className="field field-3">
            <div className="label">Calls per refresh</div>
            <input
              type="number"
              inputMode="numeric"
              value={callsPerRefresh}
              min={0}
              step={1}
              onChange={(e) => setCallsPerRefresh(+e.target.value)}
            />
          </div>
          <div className="field field-3" style={{ alignSelf: "end" }}>
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => setApiCallsPerMonth(Math.round(estimatedApiCallsPerMonth))}
              >
                Use estimate
              </button>
            </div>
            <div className="hint">Est {formatNumber(estimatedApiCallsPerMonth, 0)} calls/month.</div>
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
              <div className="hint">Applies to API calls.</div>
            </div>
          ) : null}

          <div className="field field-6">
            <div className="label">Scenario presets</div>
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setStandardParameters(400);
                  setAdvancedParameters(60);
                  setPricePerAdvancedParameterUsdPerMonth(0.05);
                  setApiCallsPerMonth(30_000_000);
                  setPricePer10kApiCallsUsd(0.05);
                  setShowPeakScenario(true);
                  setPeakMultiplierPct(170);
                }}
              >
                Small app
              </button>
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setStandardParameters(2500);
                  setAdvancedParameters(400);
                  setPricePerAdvancedParameterUsdPerMonth(0.05);
                  setApiCallsPerMonth(420_000_000);
                  setPricePer10kApiCallsUsd(0.05);
                  setShowPeakScenario(true);
                  setPeakMultiplierPct(240);
                }}
              >
                Multi-env
              </button>
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setStandardParameters(8000);
                  setAdvancedParameters(1400);
                  setPricePerAdvancedParameterUsdPerMonth(0.05);
                  setApiCallsPerMonth(1_800_000_000);
                  setPricePer10kApiCallsUsd(0.05);
                  setShowPeakScenario(true);
                  setPeakMultiplierPct(190);
                }}
              >
                Platform scale
              </button>
            </div>
          </div>

          <div className="field field-6">
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setStandardParameters(1000);
                  setAdvancedParameters(200);
                  setPricePerAdvancedParameterUsdPerMonth(0.05);
                  setApiCallsPerMonth(200_000_000);
                  setPricePer10kApiCallsUsd(0.05);
                  setShowPeakScenario(false);
                  setPeakMultiplierPct(200);
                }}
              >
                Reset example
              </button>
            </div>
            <div className="muted" style={{ marginTop: 8, fontSize: 12 }}>
              Simplified estimate: advanced parameter-month charges + API call charges. Additional features and downstream
              systems are excluded.
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
            <div className="k">Advanced parameters</div>
            <div className="v">{formatCurrency2(result.advancedParameterCostUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">API calls</div>
            <div className="v">{formatCurrency2(result.apiCostUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">API calls/month</div>
            <div className="v">{formatNumber(result.apiCallsPerMonth, 0)}</div>
          </div>
        </div>

        {peakResult ? (
          <div style={{ marginTop: 12 }}>
            <div className="muted" style={{ fontSize: 13, marginBottom: 6 }}>Baseline vs peak</div>
            <table className="table">
              <thead>
                <tr>
                  <th>Scenario</th>
                  <th className="num">API calls</th>
                  <th className="num">Total cost</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Baseline</td>
                  <td className="num">{formatNumber(result.apiCallsPerMonth, 0)}</td>
                  <td className="num">{formatCurrency2(result.totalCostUsd)}</td>
                </tr>
                <tr>
                  <td>Peak</td>
                  <td className="num">{formatNumber(peakResult.apiCallsPerMonth, 0)}</td>
                  <td className="num">{formatCurrency2(peakResult.totalCostUsd)}</td>
                </tr>
                <tr>
                  <td>Delta</td>
                  <td className="num">{formatNumber(peakResult.apiCallsPerMonth - result.apiCallsPerMonth, 0)}</td>
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
