import React, { useMemo } from "react";
import { useBooleanParamState, useNumberParamState } from "./useNumberParamState";
import { estimateVpcInterfaceEndpointCost } from "../../lib/calc/vpcInterfaceEndpoint";
import { formatCurrency2, formatNumber } from "../../lib/format";
import { clamp } from "../../lib/math";

export function AwsVpcInterfaceEndpointCostCalculator() {
  const [endpoints, setEndpoints] = useNumberParamState("AwsVpcInterfaceEndpointCost.endpoints", 3);
  const [azsPerEndpoint, setAzsPerEndpoint] = useNumberParamState("AwsVpcInterfaceEndpointCost.azsPerEndpoint", 2);
  const [hoursPerDay, setHoursPerDay] = useNumberParamState("AwsVpcInterfaceEndpointCost.hoursPerDay", 24);
  const [daysPerMonth, setDaysPerMonth] = useNumberParamState("AwsVpcInterfaceEndpointCost.daysPerMonth", 30.4);
  const [pricePerEndpointHourUsd, setPricePerEndpointHourUsd] = useNumberParamState("AwsVpcInterfaceEndpointCost.pricePerEndpointHourUsd", 0.01);
  const [dataProcessedGbPerMonth, setDataProcessedGbPerMonth] = useNumberParamState("AwsVpcInterfaceEndpointCost.dataProcessedGbPerMonth", 2000);
  const [pricePerGbProcessedUsd, setPricePerGbProcessedUsd] = useNumberParamState("AwsVpcInterfaceEndpointCost.pricePerGbProcessedUsd", 0.01);
  const [showPeakScenario, setShowPeakScenario] = useBooleanParamState("AwsVpcInterfaceEndpointCost.showPeakScenario", false);
  const [peakMultiplierPct, setPeakMultiplierPct] = useNumberParamState("AwsVpcInterfaceEndpointCost.peakMultiplierPct", 180);

  const normalizedHoursPerMonth = clamp(daysPerMonth, 1, 31) * clamp(hoursPerDay, 0, 24);

  const result = useMemo(() => {
    return estimateVpcInterfaceEndpointCost({
      endpoints: clamp(endpoints, 0, 1e6),
      azsPerEndpoint: clamp(azsPerEndpoint, 1, 100),
      hoursPerMonth: clamp(normalizedHoursPerMonth, 0, 744),
      pricePerEndpointHourUsd: clamp(pricePerEndpointHourUsd, 0, 1e6),
      dataProcessedGbPerMonth: clamp(dataProcessedGbPerMonth, 0, 1e12),
      pricePerGbProcessedUsd: clamp(pricePerGbProcessedUsd, 0, 1e3),
    });
  }, [endpoints, azsPerEndpoint, normalizedHoursPerMonth, pricePerEndpointHourUsd, dataProcessedGbPerMonth, pricePerGbProcessedUsd]);

  const peakResult = useMemo(() => {
    if (!showPeakScenario) return null;
    const multiplier = clamp(peakMultiplierPct, 100, 1000) / 100;
    return estimateVpcInterfaceEndpointCost({
      endpoints: clamp(endpoints, 0, 1e6) * multiplier,
      azsPerEndpoint: clamp(azsPerEndpoint, 1, 100),
      hoursPerMonth: clamp(normalizedHoursPerMonth, 0, 744),
      pricePerEndpointHourUsd: clamp(pricePerEndpointHourUsd, 0, 1e6),
      dataProcessedGbPerMonth: clamp(dataProcessedGbPerMonth, 0, 1e12) * multiplier,
      pricePerGbProcessedUsd: clamp(pricePerGbProcessedUsd, 0, 1e3),
    });
  }, [
    azsPerEndpoint,
    dataProcessedGbPerMonth,
    endpoints,
    normalizedHoursPerMonth,
    peakMultiplierPct,
    pricePerEndpointHourUsd,
    pricePerGbProcessedUsd,
    showPeakScenario,
  ]);

  return (
    <div className="calc-grid">
      <div className="panel">
        <h3>Inputs</h3>
        <div className="form">
          <div className="field field-3">
            <div className="label">Interface endpoints</div>
            <input
              type="number"
              inputMode="numeric"
              value={endpoints}
              min={0}
              step={1}
              onChange={(e) => setEndpoints(+e.target.value)}
            />
          </div>
          <div className="field field-3">
            <div className="label">AZs per endpoint</div>
            <input
              type="number"
              inputMode="numeric"
              value={azsPerEndpoint}
              min={1}
              step={1}
              onChange={(e) => setAzsPerEndpoint(+e.target.value)}
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
            <div className="label">Price ($ / endpoint-hour)</div>
            <input
              type="number"
              inputMode="decimal"
              value={pricePerEndpointHourUsd}
              min={0}
              step={0.001}
              onChange={(e) => setPricePerEndpointHourUsd(+e.target.value)}
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
              <div className="hint">Applies to endpoints and data processed.</div>
            </div>
          ) : null}

          <div className="field field-6">
            <div className="label">Scenario presets</div>
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setEndpoints(2);
                  setAzsPerEndpoint(2);
                  setHoursPerDay(24);
                  setDaysPerMonth(30.4);
                  setPricePerEndpointHourUsd(0.01);
                  setDataProcessedGbPerMonth(600);
                  setPricePerGbProcessedUsd(0.01);
                  setShowPeakScenario(true);
                  setPeakMultiplierPct(150);
                }}
              >
                Small VPC
              </button>
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setEndpoints(6);
                  setAzsPerEndpoint(3);
                  setHoursPerDay(24);
                  setDaysPerMonth(30.4);
                  setPricePerEndpointHourUsd(0.01);
                  setDataProcessedGbPerMonth(6000);
                  setPricePerGbProcessedUsd(0.01);
                  setShowPeakScenario(true);
                  setPeakMultiplierPct(210);
                }}
              >
                Data heavy
              </button>
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setEndpoints(12);
                  setAzsPerEndpoint(3);
                  setHoursPerDay(24);
                  setDaysPerMonth(30.4);
                  setPricePerEndpointHourUsd(0.01);
                  setDataProcessedGbPerMonth(18_000);
                  setPricePerGbProcessedUsd(0.01);
                  setShowPeakScenario(true);
                  setPeakMultiplierPct(180);
                }}
              >
                Multi-service
              </button>
            </div>
          </div>

          <div className="field field-6">
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setEndpoints(3);
                  setAzsPerEndpoint(2);
                  setHoursPerDay(24);
                  setDaysPerMonth(30.4);
                  setPricePerEndpointHourUsd(0.01);
                  setDataProcessedGbPerMonth(2000);
                  setPricePerGbProcessedUsd(0.01);
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
            <div className="k">Data processing component</div>
            <div className="v">{formatCurrency2(result.dataProcessingCostUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">Endpoint-hours</div>
            <div className="v">{formatNumber(result.endpointHours, 0)}</div>
          </div>
        </div>

        {peakResult ? (
          <div style={{ marginTop: 12 }}>
            <div className="muted" style={{ fontSize: 13, marginBottom: 6 }}>Baseline vs peak</div>
            <table className="table">
              <thead>
                <tr>
                  <th>Scenario</th>
                  <th className="num">Endpoints</th>
                  <th className="num">Processed GB</th>
                  <th className="num">Total cost</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Baseline</td>
                  <td className="num">{formatNumber(result.endpoints, 0)}</td>
                  <td className="num">{formatNumber(result.dataProcessedGbPerMonth, 0)}</td>
                  <td className="num">{formatCurrency2(result.totalCostUsd)}</td>
                </tr>
                <tr>
                  <td>Peak</td>
                  <td className="num">{formatNumber(peakResult.endpoints, 0)}</td>
                  <td className="num">{formatNumber(peakResult.dataProcessedGbPerMonth, 0)}</td>
                  <td className="num">{formatCurrency2(peakResult.totalCostUsd)}</td>
                </tr>
                <tr>
                  <td>Delta</td>
                  <td className="num">{formatNumber(peakResult.endpoints - result.endpoints, 0)}</td>
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
