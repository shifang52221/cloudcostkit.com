import React, { useMemo } from "react";
import { useBooleanParamState, useNumberParamState } from "./useNumberParamState";
import { estimateCloudTrailCost } from "../../lib/calc/cloudTrail";
import { formatCurrency2, formatNumber } from "../../lib/format";
import { clamp } from "../../lib/math";

export function AwsCloudTrailCostCalculator() {
  const [managementEventsPerMonth, setManagementEventsPerMonth] = useNumberParamState("AwsCloudTrailCost.managementEventsPerMonth", 50_000_000);
  const [dataEventsPerMonth, setDataEventsPerMonth] = useNumberParamState("AwsCloudTrailCost.dataEventsPerMonth", 10_000_000);
  const [insightsEventsPerMonth, setInsightsEventsPerMonth] = useNumberParamState("AwsCloudTrailCost.insightsEventsPerMonth", 1_000_000);
  const [showPeakScenario, setShowPeakScenario] = useBooleanParamState("AwsCloudTrailCost.showPeakScenario", false);
  const [peakMultiplierPct, setPeakMultiplierPct] = useNumberParamState("AwsCloudTrailCost.peakMultiplierPct", 180);

  const [pricePer100kManagementEventsUsd, setPricePer100kManagementEventsUsd] = useNumberParamState("AwsCloudTrailCost.pricePer100kManagementEventsUsd", 0.1);
  const [pricePer100kDataEventsUsd, setPricePer100kDataEventsUsd] = useNumberParamState("AwsCloudTrailCost.pricePer100kDataEventsUsd", 0.2);
  const [pricePer100kInsightsEventsUsd, setPricePer100kInsightsEventsUsd] = useNumberParamState("AwsCloudTrailCost.pricePer100kInsightsEventsUsd", 0.35);
  const secondsPerMonth = 30.4 * 24 * 3600;
  const managementEventsPerSecond = managementEventsPerMonth / secondsPerMonth;
  const dataEventsPerSecond = dataEventsPerMonth / secondsPerMonth;
  const insightsEventsPerSecond = insightsEventsPerMonth / secondsPerMonth;
  const managementPricePerMillionUsd = pricePer100kManagementEventsUsd * 10;
  const dataPricePerMillionUsd = pricePer100kDataEventsUsd * 10;
  const insightsPricePerMillionUsd = pricePer100kInsightsEventsUsd * 10;

  const result = useMemo(() => {
    return estimateCloudTrailCost({
      managementEventsPerMonth: clamp(managementEventsPerMonth, 0, 1e18),
      dataEventsPerMonth: clamp(dataEventsPerMonth, 0, 1e18),
      insightsEventsPerMonth: clamp(insightsEventsPerMonth, 0, 1e18),
      pricePer100kManagementEventsUsd: clamp(pricePer100kManagementEventsUsd, 0, 1e9),
      pricePer100kDataEventsUsd: clamp(pricePer100kDataEventsUsd, 0, 1e9),
      pricePer100kInsightsEventsUsd: clamp(pricePer100kInsightsEventsUsd, 0, 1e9),
    });
  }, [
    managementEventsPerMonth,
    dataEventsPerMonth,
    insightsEventsPerMonth,
    pricePer100kManagementEventsUsd,
    pricePer100kDataEventsUsd,
    pricePer100kInsightsEventsUsd,
  ]);

  const peakResult = useMemo(() => {
    if (!showPeakScenario) return null;
    const multiplier = clamp(peakMultiplierPct, 100, 1000) / 100;
    return estimateCloudTrailCost({
      managementEventsPerMonth: clamp(managementEventsPerMonth, 0, 1e18) * multiplier,
      dataEventsPerMonth: clamp(dataEventsPerMonth, 0, 1e18) * multiplier,
      insightsEventsPerMonth: clamp(insightsEventsPerMonth, 0, 1e18) * multiplier,
      pricePer100kManagementEventsUsd: clamp(pricePer100kManagementEventsUsd, 0, 1e9),
      pricePer100kDataEventsUsd: clamp(pricePer100kDataEventsUsd, 0, 1e9),
      pricePer100kInsightsEventsUsd: clamp(pricePer100kInsightsEventsUsd, 0, 1e9),
    });
  }, [
    dataEventsPerMonth,
    insightsEventsPerMonth,
    managementEventsPerMonth,
    peakMultiplierPct,
    pricePer100kDataEventsUsd,
    pricePer100kInsightsEventsUsd,
    pricePer100kManagementEventsUsd,
    showPeakScenario,
  ]);

  return (
    <div className="calc-grid">
      <div className="panel">
        <h3>Inputs</h3>
        <div className="form">
          <div className="field field-3">
            <div className="label">Management events (per month)</div>
            <input
              type="number"
              inputMode="numeric"
              value={managementEventsPerMonth}
              min={0}
              step={1000}
              onChange={(e) => setManagementEventsPerMonth(+e.target.value)}
            />
            <div className="hint">Avg {formatNumber(managementEventsPerSecond, 2)} events/sec.</div>
          </div>
          <div className="field field-3">
            <div className="label">Data events (per month)</div>
            <input
              type="number"
              inputMode="numeric"
              value={dataEventsPerMonth}
              min={0}
              step={1000}
              onChange={(e) => setDataEventsPerMonth(+e.target.value)}
            />
            <div className="hint">Avg {formatNumber(dataEventsPerSecond, 2)} events/sec.</div>
          </div>
          <div className="field field-3">
            <div className="label">Insights events (per month)</div>
            <input
              type="number"
              inputMode="numeric"
              value={insightsEventsPerMonth}
              min={0}
              step={1000}
              onChange={(e) => setInsightsEventsPerMonth(+e.target.value)}
            />
            <div className="hint">Avg {formatNumber(insightsEventsPerSecond, 2)} events/sec.</div>
          </div>

          <div className="field field-3">
            <div className="label">Management price ($ / 100k events)</div>
            <input
              type="number"
              inputMode="decimal"
              value={pricePer100kManagementEventsUsd}
              min={0}
              step={0.001}
              onChange={(e) => setPricePer100kManagementEventsUsd(+e.target.value)}
            />
            <div className="hint">~{formatCurrency2(managementPricePerMillionUsd)} per 1M events.</div>
          </div>
          <div className="field field-3">
            <div className="label">Data price ($ / 100k events)</div>
            <input
              type="number"
              inputMode="decimal"
              value={pricePer100kDataEventsUsd}
              min={0}
              step={0.001}
              onChange={(e) => setPricePer100kDataEventsUsd(+e.target.value)}
            />
            <div className="hint">~{formatCurrency2(dataPricePerMillionUsd)} per 1M events.</div>
          </div>
          <div className="field field-3">
            <div className="label">Insights price ($ / 100k events)</div>
            <input
              type="number"
              inputMode="decimal"
              value={pricePer100kInsightsEventsUsd}
              min={0}
              step={0.001}
              onChange={(e) => setPricePer100kInsightsEventsUsd(+e.target.value)}
            />
            <div className="hint">~{formatCurrency2(insightsPricePerMillionUsd)} per 1M events.</div>
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
              <div className="hint">Apply to event volume during incidents.</div>
            </div>
          ) : null}

          <div className="field field-6">
            <div className="label">Scenario presets</div>
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setManagementEventsPerMonth(20_000_000);
                  setDataEventsPerMonth(5_000_000);
                  setInsightsEventsPerMonth(200_000);
                  setPricePer100kManagementEventsUsd(0.1);
                  setPricePer100kDataEventsUsd(0.2);
                  setPricePer100kInsightsEventsUsd(0.35);
                  setShowPeakScenario(true);
                  setPeakMultiplierPct(160);
                }}
              >
                Dev account
              </button>
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setManagementEventsPerMonth(80_000_000);
                  setDataEventsPerMonth(30_000_000);
                  setInsightsEventsPerMonth(1_500_000);
                  setPricePer100kManagementEventsUsd(0.1);
                  setPricePer100kDataEventsUsd(0.2);
                  setPricePer100kInsightsEventsUsd(0.35);
                  setShowPeakScenario(true);
                  setPeakMultiplierPct(200);
                }}
              >
                Multi-team
              </button>
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setManagementEventsPerMonth(180_000_000);
                  setDataEventsPerMonth(60_000_000);
                  setInsightsEventsPerMonth(4_000_000);
                  setPricePer100kManagementEventsUsd(0.1);
                  setPricePer100kDataEventsUsd(0.2);
                  setPricePer100kInsightsEventsUsd(0.35);
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
                  setManagementEventsPerMonth(50_000_000);
                  setDataEventsPerMonth(10_000_000);
                  setInsightsEventsPerMonth(1_000_000);
                  setPricePer100kManagementEventsUsd(0.1);
                  setPricePer100kDataEventsUsd(0.2);
                  setPricePer100kInsightsEventsUsd(0.35);
                  setShowPeakScenario(false);
                  setPeakMultiplierPct(180);
                }}
              >
                Reset example
              </button>
            </div>
            <div className="muted" style={{ marginTop: 8, fontSize: 12 }}>
              Pricing can vary by region and product features. Use your effective prices.
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
            <div className="k">Management events</div>
            <div className="v">{formatCurrency2(result.managementCostUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">Data events</div>
            <div className="v">{formatCurrency2(result.dataCostUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">Insights events</div>
            <div className="v">{formatCurrency2(result.insightsCostUsd)}</div>
          </div>
        </div>

        {peakResult ? (
          <div style={{ marginTop: 12 }}>
            <div className="muted" style={{ fontSize: 13, marginBottom: 6 }}>Baseline vs peak</div>
            <table className="table">
              <thead>
                <tr>
                  <th>Scenario</th>
                  <th className="num">Management</th>
                  <th className="num">Data</th>
                  <th className="num">Insights</th>
                  <th className="num">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Baseline</td>
                  <td className="num">{formatCurrency2(result.managementCostUsd)}</td>
                  <td className="num">{formatCurrency2(result.dataCostUsd)}</td>
                  <td className="num">{formatCurrency2(result.insightsCostUsd)}</td>
                  <td className="num">{formatCurrency2(result.totalCostUsd)}</td>
                </tr>
                <tr>
                  <td>Peak</td>
                  <td className="num">{formatCurrency2(peakResult.managementCostUsd)}</td>
                  <td className="num">{formatCurrency2(peakResult.dataCostUsd)}</td>
                  <td className="num">{formatCurrency2(peakResult.insightsCostUsd)}</td>
                  <td className="num">{formatCurrency2(peakResult.totalCostUsd)}</td>
                </tr>
                <tr>
                  <td>Delta</td>
                  <td className="num">{formatCurrency2(peakResult.managementCostUsd - result.managementCostUsd)}</td>
                  <td className="num">{formatCurrency2(peakResult.dataCostUsd - result.dataCostUsd)}</td>
                  <td className="num">{formatCurrency2(peakResult.insightsCostUsd - result.insightsCostUsd)}</td>
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
