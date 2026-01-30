import React, { useMemo } from "react";
import { useBooleanParamState, useNumberParamState, useStringParamState } from "./useNumberParamState";
import { estimateLoadBalancerCost } from "../../lib/calc/loadBalancer";
import { estimateLoadBalancerCapacityUnits, type LoadBalancerType } from "../../lib/calc/loadBalancerCapacityUnits";
import { formatCurrency2, formatNumber } from "../../lib/format";
import { clamp } from "../../lib/math";

export function AwsLoadBalancerCostCalculator() {
  const [loadBalancers, setLoadBalancers] = useNumberParamState("AwsLoadBalancerCost.loadBalancers", 2);
  const [hoursPerDay, setHoursPerDay] = useNumberParamState("AwsLoadBalancerCost.hoursPerDay", 24);
  const [daysPerMonth, setDaysPerMonth] = useNumberParamState("AwsLoadBalancerCost.daysPerMonth", 30.4);
  const [pricePerLbHourUsd, setPricePerLbHourUsd] = useNumberParamState("AwsLoadBalancerCost.pricePerLbHourUsd", 0.0225);
  const [capacityUnitsPerHour, setCapacityUnitsPerHour] = useNumberParamState("AwsLoadBalancerCost.capacityUnitsPerHour", 5);
  const [pricePerCapacityUnitHourUsd, setPricePerCapacityUnitHourUsd] = useNumberParamState("AwsLoadBalancerCost.pricePerCapacityUnitHourUsd", 0.008);
  const [showPeakScenario, setShowPeakScenario] = useBooleanParamState("AwsLoadBalancerCost.showPeakScenario", false);
  const [peakMultiplierPct, setPeakMultiplierPct] = useNumberParamState("AwsLoadBalancerCost.peakMultiplierPct", 180);
  const [capacityTypeRaw, setCapacityTypeRaw] = useStringParamState(
    "AwsLoadBalancerCost.capacityType",
    "alb",
    ["alb", "nlb"],
  );
  const capacityType = capacityTypeRaw as LoadBalancerType;
  const [newConnectionsPerSecond, setNewConnectionsPerSecond] = useNumberParamState(
    "AwsLoadBalancerCost.newConnectionsPerSecond",
    40,
  );
  const [activeConnections, setActiveConnections] = useNumberParamState("AwsLoadBalancerCost.activeConnections", 2000);
  const [processedGbPerHour, setProcessedGbPerHour] = useNumberParamState("AwsLoadBalancerCost.processedGbPerHour", 0.8);
  const [ruleEvaluationsPerSecond, setRuleEvaluationsPerSecond] = useNumberParamState(
    "AwsLoadBalancerCost.ruleEvaluationsPerSecond",
    300,
  );
  const [avgMbpsInput, setAvgMbpsInput] = useNumberParamState("AwsLoadBalancerCost.avgMbpsInput", 120);

  const normalizedHoursPerMonth = clamp(daysPerMonth, 1, 31) * clamp(hoursPerDay, 0, 24);
  const hourlyPerLb = normalizedHoursPerMonth * pricePerLbHourUsd;
  const estimatedProcessedGbPerHour = (clamp(avgMbpsInput, 0, 1e9) * 3600) / 8000;
  const capacityEstimate = useMemo(() => {
    return estimateLoadBalancerCapacityUnits({
      type: capacityType,
      newConnectionsPerSecond,
      activeConnections,
      processedGbPerHour,
      ruleEvaluationsPerSecond: capacityType === "alb" ? ruleEvaluationsPerSecond : 0,
    });
  }, [
    activeConnections,
    capacityType,
    newConnectionsPerSecond,
    processedGbPerHour,
    ruleEvaluationsPerSecond,
  ]);

  const result = useMemo(() => {
    return estimateLoadBalancerCost({
      loadBalancers: clamp(loadBalancers, 0, 1e6),
      hoursPerMonth: clamp(normalizedHoursPerMonth, 0, 744),
      pricePerLbHourUsd: clamp(pricePerLbHourUsd, 0, 1e6),
      capacityUnitsPerHour: clamp(capacityUnitsPerHour, 0, 1e12),
      pricePerCapacityUnitHourUsd: clamp(pricePerCapacityUnitHourUsd, 0, 1e6),
    });
  }, [loadBalancers, normalizedHoursPerMonth, pricePerLbHourUsd, capacityUnitsPerHour, pricePerCapacityUnitHourUsd]);

  const peakResult = useMemo(() => {
    if (!showPeakScenario) return null;
    const multiplier = clamp(peakMultiplierPct, 100, 1000) / 100;
    return estimateLoadBalancerCost({
      loadBalancers: clamp(loadBalancers, 0, 1e6),
      hoursPerMonth: clamp(normalizedHoursPerMonth, 0, 744),
      pricePerLbHourUsd: clamp(pricePerLbHourUsd, 0, 1e6),
      capacityUnitsPerHour: clamp(capacityUnitsPerHour, 0, 1e12) * multiplier,
      pricePerCapacityUnitHourUsd: clamp(pricePerCapacityUnitHourUsd, 0, 1e6),
    });
  }, [
    capacityUnitsPerHour,
    loadBalancers,
    normalizedHoursPerMonth,
    peakMultiplierPct,
    pricePerCapacityUnitHourUsd,
    pricePerLbHourUsd,
    showPeakScenario,
  ]);
  const usageSharePct = result.totalCostUsd > 0 ? (result.capacityCostUsd / result.totalCostUsd) * 100 : 0;

  return (
    <div className="calc-grid">
      <div className="panel">
        <h3>Inputs</h3>
        <div className="form">
          <div className="field field-3">
            <div className="label">Load balancers</div>
            <input
              type="number"
              inputMode="numeric"
              value={loadBalancers}
              min={0}
              step={1}
              onChange={(e) => setLoadBalancers(+e.target.value)}
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
            <div className="label">Price ($ / LB-hour)</div>
            <input
              type="number"
              inputMode="decimal"
              value={pricePerLbHourUsd}
              min={0}
              step={0.0001}
              onChange={(e) => setPricePerLbHourUsd(+e.target.value)}
            />
            <div className="hint">Approx {formatCurrency2(hourlyPerLb)} per LB-month.</div>
          </div>

          <div className="field field-3">
            <div className="label">Capacity units (avg per hour)</div>
            <input
              type="number"
              inputMode="decimal"
              value={capacityUnitsPerHour}
              min={0}
              step={0.1}
              onChange={(e) => setCapacityUnitsPerHour(+e.target.value)}
            />
            <div className="muted" style={{ fontSize: 12, marginTop: 6 }}>
              Use LCU-hours (ALB) or NLCU-hours (NLB) as your capacity unit. Enter the average units per hour.
            </div>
          </div>
          <div className="field field-3">
            <div className="label">Price ($ / capacity unit-hour)</div>
            <input
              type="number"
              inputMode="decimal"
              value={pricePerCapacityUnitHourUsd}
              min={0}
              step={0.0001}
              onChange={(e) => setPricePerCapacityUnitHourUsd(+e.target.value)}
            />
          </div>
          <div className="field field-3">
            <div className="label">Capacity unit type</div>
            <select value={capacityType} onChange={(e) => setCapacityTypeRaw(e.target.value)}>
              <option value="alb">ALB (LCU)</option>
              <option value="nlb">NLB (NLCU)</option>
            </select>
          </div>
          <div className="field field-3">
            <div className="label">New connections / sec</div>
            <input
              type="number"
              inputMode="decimal"
              value={newConnectionsPerSecond}
              min={0}
              step={1}
              onChange={(e) => setNewConnectionsPerSecond(+e.target.value)}
            />
          </div>
          <div className="field field-3">
            <div className="label">Active connections</div>
            <input
              type="number"
              inputMode="numeric"
              value={activeConnections}
              min={0}
              step={1}
              onChange={(e) => setActiveConnections(+e.target.value)}
            />
          </div>
          <div className="field field-3">
            <div className="label">Processed GB / hour</div>
            <input
              type="number"
              inputMode="decimal"
              value={processedGbPerHour}
              min={0}
              step={0.01}
              onChange={(e) => setProcessedGbPerHour(+e.target.value)}
            />
          </div>
          <div className="field field-3">
            <div className="label">Avg Mbps</div>
            <input
              type="number"
              inputMode="decimal"
              value={avgMbpsInput}
              min={0}
              step={0.1}
              onChange={(e) => setAvgMbpsInput(+e.target.value)}
            />
            <div className="hint">Use average throughput over the hour.</div>
          </div>
          <div className="field field-3" style={{ alignSelf: "end" }}>
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => setProcessedGbPerHour(Math.round(estimatedProcessedGbPerHour * 100) / 100)}
              >
                Use Mbps
              </button>
            </div>
            <div className="hint">Est {formatNumber(estimatedProcessedGbPerHour, 2)} GB/hour.</div>
          </div>
          {capacityType === "alb" ? (
            <div className="field field-3">
              <div className="label">Rule evaluations / sec</div>
              <input
                type="number"
                inputMode="numeric"
                value={ruleEvaluationsPerSecond}
                min={0}
                step={1}
                onChange={(e) => setRuleEvaluationsPerSecond(+e.target.value)}
              />
            </div>
          ) : null}
          <div className="field field-3" style={{ alignSelf: "end" }}>
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => setCapacityUnitsPerHour(Math.round(capacityEstimate.capacityUnitsPerHour * 100) / 100)}
              >
                Use estimate
              </button>
            </div>
            <div className="hint">Est {formatNumber(capacityEstimate.capacityUnitsPerHour, 2)} units/hour.</div>
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
              <div className="hint">Applies to capacity units (LCU/NLCU).</div>
            </div>
          ) : null}

          <div className="field field-6">
            <div className="label">Scenario presets</div>
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setLoadBalancers(1);
                  setHoursPerDay(24);
                  setDaysPerMonth(30.4);
                  setPricePerLbHourUsd(0.0225);
                  setCapacityUnitsPerHour(2);
                  setPricePerCapacityUnitHourUsd(0.008);
                  setShowPeakScenario(true);
                  setPeakMultiplierPct(160);
                }}
              >
                Startup app
              </button>
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setLoadBalancers(3);
                  setHoursPerDay(24);
                  setDaysPerMonth(30.4);
                  setPricePerLbHourUsd(0.0225);
                  setCapacityUnitsPerHour(12);
                  setPricePerCapacityUnitHourUsd(0.008);
                  setShowPeakScenario(true);
                  setPeakMultiplierPct(220);
                }}
              >
                Regional SaaS
              </button>
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setLoadBalancers(8);
                  setHoursPerDay(24);
                  setDaysPerMonth(30.4);
                  setPricePerLbHourUsd(0.0225);
                  setCapacityUnitsPerHour(45);
                  setPricePerCapacityUnitHourUsd(0.008);
                  setShowPeakScenario(true);
                  setPeakMultiplierPct(180);
                }}
              >
                Global traffic
              </button>
            </div>
          </div>

          <div className="field field-6">
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setLoadBalancers(2);
                  setHoursPerDay(24);
                  setDaysPerMonth(30.4);
                  setPricePerLbHourUsd(0.0225);
                  setCapacityUnitsPerHour(5);
                  setPricePerCapacityUnitHourUsd(0.008);
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
            <div className="k">Fixed hourly (LB-hours)</div>
            <div className="v">{formatCurrency2(result.hourlyCostUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">Capacity units</div>
            <div className="v">{formatCurrency2(result.capacityCostUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">Capacity unit-hours</div>
            <div className="v">{formatNumber(result.capacityUnitHours, 1)}</div>
          </div>
          <div className="kpi">
            <div className="k">Usage share</div>
            <div className="v">{formatNumber(usageSharePct, 1)}%</div>
          </div>
        </div>

        {peakResult ? (
          <div style={{ marginTop: 12 }}>
            <div className="muted" style={{ fontSize: 13, marginBottom: 6 }}>Baseline vs peak</div>
            <table className="table">
              <thead>
                <tr>
                  <th>Scenario</th>
                  <th className="num">Capacity units</th>
                  <th className="num">Total cost</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Baseline</td>
                  <td className="num">{formatNumber(result.capacityUnitHours, 1)}</td>
                  <td className="num">{formatCurrency2(result.totalCostUsd)}</td>
                </tr>
                <tr>
                  <td>Peak</td>
                  <td className="num">{formatNumber(peakResult.capacityUnitHours, 1)}</td>
                  <td className="num">{formatCurrency2(peakResult.totalCostUsd)}</td>
                </tr>
                <tr>
                  <td>Delta</td>
                  <td className="num">{formatNumber(peakResult.capacityUnitHours - result.capacityUnitHours, 1)}</td>
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
