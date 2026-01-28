import React, { useMemo } from "react";
import { useBooleanParamState, useNumberParamState } from "./useNumberParamState";
import { estimateRoute53Cost } from "../../lib/calc/route53";
import { formatCurrency2, formatNumber } from "../../lib/format";
import { clamp } from "../../lib/math";

export function AwsRoute53CostCalculator() {
  const [hostedZones, setHostedZones] = useNumberParamState("AwsRoute53Cost.hostedZones", 20);
  const [standardQueriesPerMonth, setStandardQueriesPerMonth] = useNumberParamState("AwsRoute53Cost.standardQueriesPerMonth", 500_000_000);
  const [healthChecks, setHealthChecks] = useNumberParamState("AwsRoute53Cost.healthChecks", 10);
  const [showPeakScenario, setShowPeakScenario] = useBooleanParamState("AwsRoute53Cost.showPeakScenario", false);
  const [peakMultiplierPct, setPeakMultiplierPct] = useNumberParamState("AwsRoute53Cost.peakMultiplierPct", 180);

  const [pricePerHostedZoneUsdPerMonth, setPricePerHostedZoneUsdPerMonth] = useNumberParamState("AwsRoute53Cost.pricePerHostedZoneUsdPerMonth", 0.5);
  const [pricePerMillionQueriesUsd, setPricePerMillionQueriesUsd] = useNumberParamState("AwsRoute53Cost.pricePerMillionQueriesUsd", 0.4);
  const [pricePerHealthCheckUsdPerMonth, setPricePerHealthCheckUsdPerMonth] = useNumberParamState("AwsRoute53Cost.pricePerHealthCheckUsdPerMonth", 0.5);

  const result = useMemo(() => {
    return estimateRoute53Cost({
      hostedZones: clamp(hostedZones, 0, 1e9),
      standardQueriesPerMonth: clamp(standardQueriesPerMonth, 0, 1e18),
      healthChecks: clamp(healthChecks, 0, 1e9),
      pricePerHostedZoneUsdPerMonth: clamp(pricePerHostedZoneUsdPerMonth, 0, 1e9),
      pricePerMillionQueriesUsd: clamp(pricePerMillionQueriesUsd, 0, 1e9),
      pricePerHealthCheckUsdPerMonth: clamp(pricePerHealthCheckUsdPerMonth, 0, 1e9),
    });
  }, [
    hostedZones,
    standardQueriesPerMonth,
    healthChecks,
    pricePerHostedZoneUsdPerMonth,
    pricePerMillionQueriesUsd,
    pricePerHealthCheckUsdPerMonth,
  ]);

  const peakResult = useMemo(() => {
    if (!showPeakScenario) return null;
    const multiplier = clamp(peakMultiplierPct, 100, 1000) / 100;
    return estimateRoute53Cost({
      hostedZones: clamp(hostedZones, 0, 1e9),
      standardQueriesPerMonth: clamp(standardQueriesPerMonth, 0, 1e18) * multiplier,
      healthChecks: clamp(healthChecks, 0, 1e9),
      pricePerHostedZoneUsdPerMonth: clamp(pricePerHostedZoneUsdPerMonth, 0, 1e9),
      pricePerMillionQueriesUsd: clamp(pricePerMillionQueriesUsd, 0, 1e9),
      pricePerHealthCheckUsdPerMonth: clamp(pricePerHealthCheckUsdPerMonth, 0, 1e9),
    });
  }, [
    healthChecks,
    hostedZones,
    peakMultiplierPct,
    pricePerHealthCheckUsdPerMonth,
    pricePerHostedZoneUsdPerMonth,
    pricePerMillionQueriesUsd,
    showPeakScenario,
    standardQueriesPerMonth,
  ]);

  return (
    <div className="calc-grid">
      <div className="panel">
        <h3>Inputs</h3>
        <div className="form">
          <div className="field field-3">
            <div className="label">Hosted zones</div>
            <input
              type="number"
              inputMode="numeric"
              value={hostedZones}
              min={0}
              step={1}
              onChange={(e) => setHostedZones(+e.target.value)}
            />
          </div>
          <div className="field field-3">
            <div className="label">Standard queries (per month)</div>
            <input
              type="number"
              inputMode="numeric"
              value={standardQueriesPerMonth}
              min={0}
              step={1000}
              onChange={(e) => setStandardQueriesPerMonth(+e.target.value)}
            />
            <div className="hint">Enter your estimated total DNS queries.</div>
          </div>
          <div className="field field-3">
            <div className="label">Health checks</div>
            <input
              type="number"
              inputMode="numeric"
              value={healthChecks}
              min={0}
              step={1}
              onChange={(e) => setHealthChecks(+e.target.value)}
            />
          </div>

          <div className="field field-3">
            <div className="label">Price ($ / hosted zone-month)</div>
            <input
              type="number"
              inputMode="decimal"
              value={pricePerHostedZoneUsdPerMonth}
              min={0}
              step={0.001}
              onChange={(e) => setPricePerHostedZoneUsdPerMonth(+e.target.value)}
            />
          </div>
          <div className="field field-3">
            <div className="label">Price ($ / 1M queries)</div>
            <input
              type="number"
              inputMode="decimal"
              value={pricePerMillionQueriesUsd}
              min={0}
              step={0.001}
              onChange={(e) => setPricePerMillionQueriesUsd(+e.target.value)}
            />
          </div>
          <div className="field field-3">
            <div className="label">Price ($ / health check-month)</div>
            <input
              type="number"
              inputMode="decimal"
              value={pricePerHealthCheckUsdPerMonth}
              min={0}
              step={0.001}
              onChange={(e) => setPricePerHealthCheckUsdPerMonth(+e.target.value)}
            />
            <div className="hint">Use your effective region pricing.</div>
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
              <div className="hint">Applies to DNS queries only.</div>
            </div>
          ) : null}

          <div className="field field-6">
            <div className="label">Scenario presets</div>
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setHostedZones(5);
                  setStandardQueriesPerMonth(80_000_000);
                  setHealthChecks(2);
                  setPricePerHostedZoneUsdPerMonth(0.5);
                  setPricePerMillionQueriesUsd(0.4);
                  setPricePerHealthCheckUsdPerMonth(0.5);
                  setShowPeakScenario(true);
                  setPeakMultiplierPct(160);
                }}
              >
                Small brand
              </button>
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setHostedZones(30);
                  setStandardQueriesPerMonth(800_000_000);
                  setHealthChecks(12);
                  setPricePerHostedZoneUsdPerMonth(0.5);
                  setPricePerMillionQueriesUsd(0.4);
                  setPricePerHealthCheckUsdPerMonth(0.5);
                  setShowPeakScenario(true);
                  setPeakMultiplierPct(220);
                }}
              >
                SaaS global
              </button>
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setHostedZones(80);
                  setStandardQueriesPerMonth(3_000_000_000);
                  setHealthChecks(40);
                  setPricePerHostedZoneUsdPerMonth(0.5);
                  setPricePerMillionQueriesUsd(0.4);
                  setPricePerHealthCheckUsdPerMonth(0.5);
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
                  setHostedZones(20);
                  setStandardQueriesPerMonth(500_000_000);
                  setHealthChecks(10);
                  setPricePerHostedZoneUsdPerMonth(0.5);
                  setPricePerMillionQueriesUsd(0.4);
                  setPricePerHealthCheckUsdPerMonth(0.5);
                  setShowPeakScenario(false);
                  setPeakMultiplierPct(180);
                }}
              >
                Reset example
              </button>
            </div>
            <div className="muted" style={{ marginTop: 8, fontSize: 12 }}>
              This model estimates hosted zones + standard queries + health checks only. Advanced routing features may add
              line items.
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
            <div className="k">Hosted zones</div>
            <div className="v">{formatCurrency2(result.hostedZoneCostUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">Queries</div>
            <div className="v">{formatCurrency2(result.queryCostUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">Health checks</div>
            <div className="v">{formatCurrency2(result.healthCheckCostUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">Queries/month</div>
            <div className="v">{formatNumber(result.standardQueriesPerMonth, 0)}</div>
          </div>
        </div>

        {peakResult ? (
          <div style={{ marginTop: 12 }}>
            <div className="muted" style={{ fontSize: 13, marginBottom: 6 }}>Baseline vs peak</div>
            <table className="table">
              <thead>
                <tr>
                  <th>Scenario</th>
                  <th className="num">Queries</th>
                  <th className="num">Total cost</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Baseline</td>
                  <td className="num">{formatNumber(result.standardQueriesPerMonth, 0)}</td>
                  <td className="num">{formatCurrency2(result.totalCostUsd)}</td>
                </tr>
                <tr>
                  <td>Peak</td>
                  <td className="num">{formatNumber(peakResult.standardQueriesPerMonth, 0)}</td>
                  <td className="num">{formatCurrency2(peakResult.totalCostUsd)}</td>
                </tr>
                <tr>
                  <td>Delta</td>
                  <td className="num">{formatNumber(peakResult.standardQueriesPerMonth - result.standardQueriesPerMonth, 0)}</td>
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
