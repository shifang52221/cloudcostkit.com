import React, { useMemo } from "react";
import { useBooleanParamState, useNumberParamState } from "./useNumberParamState";
import { estimateNatGatewayCost } from "../../lib/calc/natGateway";
import { formatCurrency2, formatNumber } from "../../lib/format";
import { clamp } from "../../lib/math";

export function AwsNatGatewayCostCalculator() {
  const [natGateways, setNatGateways] = useNumberParamState("AwsNatGatewayCost.natGateways", 1);
  const [hoursPerDay, setHoursPerDay] = useNumberParamState("AwsNatGatewayCost.hoursPerDay", 24);
  const [daysPerMonth, setDaysPerMonth] = useNumberParamState("AwsNatGatewayCost.daysPerMonth", 30.4);
  const [pricePerNatGatewayHourUsd, setPricePerNatGatewayHourUsd] = useNumberParamState("AwsNatGatewayCost.pricePerNatGatewayHourUsd", 0.045);
  const [dataProcessedGbPerMonth, setDataProcessedGbPerMonth] = useNumberParamState("AwsNatGatewayCost.dataProcessedGbPerMonth", 2000);
  const [pricePerGbProcessedUsd, setPricePerGbProcessedUsd] = useNumberParamState("AwsNatGatewayCost.pricePerGbProcessedUsd", 0.045);
  const [showPeakScenario, setShowPeakScenario] = useBooleanParamState("AwsNatGatewayCost.showPeakScenario", false);
  const [peakMultiplierPct, setPeakMultiplierPct] = useNumberParamState("AwsNatGatewayCost.peakMultiplierPct", 180);

  const normalizedHoursPerMonth = clamp(daysPerMonth, 1, 31) * clamp(hoursPerDay, 0, 24);
  const secondsPerMonth = 30.4 * 24 * 3600;
  const avgMbps = (dataProcessedGbPerMonth * 8000) / secondsPerMonth;

  const result = useMemo(() => {
    return estimateNatGatewayCost({
      natGateways: clamp(natGateways, 0, 1e6),
      hoursPerMonth: clamp(normalizedHoursPerMonth, 0, 744),
      pricePerNatGatewayHourUsd: clamp(pricePerNatGatewayHourUsd, 0, 1e6),
      dataProcessedGbPerMonth: clamp(dataProcessedGbPerMonth, 0, 1e12),
      pricePerGbProcessedUsd: clamp(pricePerGbProcessedUsd, 0, 1e3),
    });
  }, [natGateways, normalizedHoursPerMonth, pricePerNatGatewayHourUsd, dataProcessedGbPerMonth, pricePerGbProcessedUsd]);

  const peakResult = useMemo(() => {
    if (!showPeakScenario) return null;
    const multiplier = clamp(peakMultiplierPct, 100, 1000) / 100;
    return estimateNatGatewayCost({
      natGateways: clamp(natGateways, 0, 1e6),
      hoursPerMonth: clamp(normalizedHoursPerMonth, 0, 744),
      pricePerNatGatewayHourUsd: clamp(pricePerNatGatewayHourUsd, 0, 1e6),
      dataProcessedGbPerMonth: clamp(dataProcessedGbPerMonth, 0, 1e12) * multiplier,
      pricePerGbProcessedUsd: clamp(pricePerGbProcessedUsd, 0, 1e3),
    });
  }, [
    dataProcessedGbPerMonth,
    natGateways,
    normalizedHoursPerMonth,
    peakMultiplierPct,
    pricePerGbProcessedUsd,
    pricePerNatGatewayHourUsd,
    showPeakScenario,
  ]);
  const trafficSharePct = result.totalCostUsd > 0 ? (result.dataProcessingCostUsd / result.totalCostUsd) * 100 : 0;

  return (
    <div className="calc-grid">
      <div className="panel">
        <h3>Inputs</h3>
        <div className="form">
          <div className="field field-3">
            <div className="label">NAT gateways</div>
            <input
              type="number"
              inputMode="numeric"
              value={natGateways}
              min={0}
              step={1}
              onChange={(e) => setNatGateways(+e.target.value)}
            />
          </div>
          <div className="field field-3">
            <div className="label">Hours/day</div>
            <input
              type="number"
              inputMode="numeric"
              value={hoursPerDay}
              min={0}
              max={24}
              step={1}
              onChange={(e) => setHoursPerDay(+e.target.value)}
            />
          </div>
          <div className="field field-3">
            <div className="label">Days/month</div>
            <input
              type="number"
              inputMode="decimal"
              value={daysPerMonth}
              min={1}
              max={31}
              step={0.1}
              onChange={(e) => setDaysPerMonth(+e.target.value)}
            />
            <div className="hint">Use 30.4 for an average month.</div>
            <div className="muted" style={{ marginTop: 6, fontSize: 12 }}>
              Monthly hours: {formatNumber(normalizedHoursPerMonth, 0)}
            </div>
          </div>
          <div className="field field-3">
            <div className="label">Price ($ / NAT gateway-hour)</div>
            <input
              type="number"
              inputMode="decimal"
              value={pricePerNatGatewayHourUsd}
              min={0}
              step={0.001}
              onChange={(e) => setPricePerNatGatewayHourUsd(+e.target.value)}
            />
          </div>

          <div className="field field-3">
            <div className="label">Data processed (GB / month)</div>
            <input
              type="number"
              inputMode="numeric"
              value={dataProcessedGbPerMonth}
              min={0}
              step={1}
              onChange={(e) => setDataProcessedGbPerMonth(+e.target.value)}
            />
            <div className="hint">Avg throughput {formatNumber(avgMbps, 2)} Mbps.</div>
          </div>
          <div className="field field-3">
            <div className="label">Price ($ / GB processed)</div>
            <input
              type="number"
              inputMode="decimal"
              value={pricePerGbProcessedUsd}
              min={0}
              step={0.001}
              onChange={(e) => setPricePerGbProcessedUsd(+e.target.value)}
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
              <div className="hint">Applies to processed data only.</div>
            </div>
          ) : null}

          <div className="field field-6">
            <div className="label">Scenario presets</div>
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setNatGateways(1);
                  setHoursPerDay(24);
                  setDaysPerMonth(30.4);
                  setPricePerNatGatewayHourUsd(0.045);
                  setDataProcessedGbPerMonth(600);
                  setPricePerGbProcessedUsd(0.045);
                  setShowPeakScenario(true);
                  setPeakMultiplierPct(160);
                }}
              >
                Small app
              </button>
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setNatGateways(2);
                  setHoursPerDay(24);
                  setDaysPerMonth(30.4);
                  setPricePerNatGatewayHourUsd(0.045);
                  setDataProcessedGbPerMonth(5000);
                  setPricePerGbProcessedUsd(0.045);
                  setShowPeakScenario(true);
                  setPeakMultiplierPct(220);
                }}
              >
                Data heavy
              </button>
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setNatGateways(4);
                  setHoursPerDay(24);
                  setDaysPerMonth(30.4);
                  setPricePerNatGatewayHourUsd(0.045);
                  setDataProcessedGbPerMonth(15_000);
                  setPricePerGbProcessedUsd(0.043);
                  setShowPeakScenario(true);
                  setPeakMultiplierPct(180);
                }}
              >
                Multi-region
              </button>
            </div>
          </div>

          <div className="field field-6">
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setNatGateways(1);
                  setHoursPerDay(24);
                  setDaysPerMonth(30.4);
                  setPricePerNatGatewayHourUsd(0.045);
                  setDataProcessedGbPerMonth(2000);
                  setPricePerGbProcessedUsd(0.045);
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
            <div className="k">Estimated monthly total</div>
            <div className="v">{formatCurrency2(result.totalCostUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">Hourly component</div>
            <div className="v">{formatCurrency2(result.hourlyCostUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">Traffic component</div>
            <div className="v">{formatCurrency2(result.dataProcessingCostUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">GB processed</div>
            <div className="v">{formatNumber(result.dataProcessedGbPerMonth, 0)}</div>
          </div>
          <div className="kpi">
            <div className="k">Traffic share</div>
            <div className="v">{formatNumber(trafficSharePct, 1)}%</div>
          </div>
        </div>

        {peakResult ? (
          <div style={{ marginTop: 12 }}>
            <div className="muted" style={{ fontSize: 13, marginBottom: 6 }}>Baseline vs peak</div>
            <table className="table">
              <thead>
                <tr>
                  <th>Scenario</th>
                  <th className="num">GB processed</th>
                  <th className="num">Total cost</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Baseline</td>
                  <td className="num">{formatNumber(result.dataProcessedGbPerMonth, 0)}</td>
                  <td className="num">{formatCurrency2(result.totalCostUsd)}</td>
                </tr>
                <tr>
                  <td>Peak</td>
                  <td className="num">{formatNumber(peakResult.dataProcessedGbPerMonth, 0)}</td>
                  <td className="num">{formatCurrency2(peakResult.totalCostUsd)}</td>
                </tr>
                <tr>
                  <td>Delta</td>
                  <td className="num">{formatNumber(peakResult.dataProcessedGbPerMonth - result.dataProcessedGbPerMonth, 0)}</td>
                  <td className="num">{formatCurrency2(peakResult.totalCostUsd - result.totalCostUsd)}</td>
                </tr>
              </tbody>
            </table>
            <div className="muted" style={{ marginTop: 6, fontSize: 12 }}>
              Uses {formatNumber(daysPerMonth, 1)} days/month and {formatNumber(hoursPerDay, 0)} hours/day.
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
