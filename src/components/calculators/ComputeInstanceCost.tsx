import React, { useMemo } from "react";
import { useBooleanParamState, useNumberParamState } from "./useNumberParamState";
import { estimateComputeCost } from "../../lib/calc/compute";
import { formatCurrency2, formatNumber, formatPercent } from "../../lib/format";
import { clamp } from "../../lib/math";

export function ComputeInstanceCostCalculator() {
  const [instances, setInstances] = useNumberParamState("ComputeInstanceCost.instances", 6);
  const [pricePerHourUsd, setPricePerHourUsd] = useNumberParamState("ComputeInstanceCost.pricePerHourUsd", 0.18);
  const [utilizationPct, setUtilizationPct] = useNumberParamState("ComputeInstanceCost.utilizationPct", 100);
  const [hoursPerDay, setHoursPerDay] = useNumberParamState("ComputeInstanceCost.hoursPerDay", 24);
  const [daysPerMonth, setDaysPerMonth] = useNumberParamState("ComputeInstanceCost.daysPerMonth", 30.4);
  const [showPeakScenario, setShowPeakScenario] = useBooleanParamState("ComputeInstanceCost.showPeakScenario", false);
  const [peakMultiplierPct, setPeakMultiplierPct] = useNumberParamState("ComputeInstanceCost.peakMultiplierPct", 200);

  const normalizedHoursPerMonth = clamp(daysPerMonth, 1, 31) * clamp(hoursPerDay, 0, 24);
  const fullTimeMonthlyCost = pricePerHourUsd * 24 * 30.4;

  const result = useMemo(() => {
    return estimateComputeCost({
      instances: clamp(instances, 0, 1e9),
      pricePerHourUsd: clamp(pricePerHourUsd, 0, 1e6),
      utilizationPct: clamp(utilizationPct, 0, 100),
      hoursPerDay: clamp(hoursPerDay, 0, 24),
      daysPerMonth: clamp(daysPerMonth, 1, 31),
    });
  }, [instances, pricePerHourUsd, utilizationPct, hoursPerDay, daysPerMonth]);

  const billableHoursTotal = result.billableHoursPerInstance * result.instances;
  const costPerInstance = result.instances > 0 ? result.monthlyCostUsd / result.instances : 0;

  const peakResult = useMemo(() => {
    if (!showPeakScenario) return null;
    const multiplier = clamp(peakMultiplierPct, 100, 1000) / 100;
    return estimateComputeCost({
      instances: clamp(instances, 0, 1e9) * multiplier,
      pricePerHourUsd: clamp(pricePerHourUsd, 0, 1e6),
      utilizationPct: clamp(utilizationPct, 0, 100),
      hoursPerDay: clamp(hoursPerDay, 0, 24),
      daysPerMonth: clamp(daysPerMonth, 1, 31),
    });
  }, [daysPerMonth, hoursPerDay, instances, peakMultiplierPct, pricePerHourUsd, showPeakScenario, utilizationPct]);

  return (
    <div className="calc-grid">
      <div className="panel">
        <h3>Inputs</h3>
        <div className="form">
          <div className="field field-3">
            <div className="label">Instances</div>
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
            <div className="label">Price ($ / hour)</div>
            <input
              type="number"
              inputMode="decimal"
              value={pricePerHourUsd}
              min={0}
              step={0.001}
              onChange={(e) => setPricePerHourUsd(+e.target.value)}
            />
            <div className="hint">~{formatCurrency2(fullTimeMonthlyCost)} per month at 24x30.4.</div>
          </div>
          <div className="field field-3">
            <div className="label">Utilization (%)</div>
            <input
              type="number"
              inputMode="numeric"
              value={utilizationPct}
              min={0}
              max={100}
              step={1}
              onChange={(e) => setUtilizationPct(+e.target.value)}
            />
            <div className="hint">Use 100 if hours/day already models uptime.</div>
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
            <div className="hint">Use 24 for always-on workloads.</div>
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
              <div className="hint">Applies to instance count.</div>
            </div>
          ) : null}

          <div className="field field-6">
            <div className="label">Scenario presets</div>
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setInstances(8);
                  setPricePerHourUsd(0.22);
                  setUtilizationPct(100);
                  setHoursPerDay(24);
                  setDaysPerMonth(30.4);
                  setShowPeakScenario(true);
                  setPeakMultiplierPct(160);
                }}
              >
                Steady prod
              </button>
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setInstances(20);
                  setPricePerHourUsd(0.12);
                  setUtilizationPct(60);
                  setHoursPerDay(10);
                  setDaysPerMonth(30.4);
                  setShowPeakScenario(true);
                  setPeakMultiplierPct(220);
                }}
              >
                Workday fleet
              </button>
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setInstances(40);
                  setPricePerHourUsd(0.18);
                  setUtilizationPct(85);
                  setHoursPerDay(24);
                  setDaysPerMonth(30.4);
                  setShowPeakScenario(true);
                  setPeakMultiplierPct(250);
                }}
              >
                Autoscale burst
              </button>
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setInstances(16);
                  setPricePerHourUsd(0.25);
                  setUtilizationPct(100);
                  setHoursPerDay(6);
                  setDaysPerMonth(30.4);
                  setShowPeakScenario(true);
                  setPeakMultiplierPct(300);
                }}
              >
                Nightly batch
              </button>
            </div>
          </div>

          <div className="field field-6">
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setInstances(6);
                  setPricePerHourUsd(0.18);
                  setUtilizationPct(100);
                  setHoursPerDay(24);
                  setDaysPerMonth(30.4);
                  setShowPeakScenario(false);
                  setPeakMultiplierPct(200);
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
            <div className="k">Estimated monthly compute cost</div>
            <div className="v">{formatCurrency2(result.monthlyCostUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">Billable hours (per instance)</div>
            <div className="v">
              {formatNumber(result.billableHoursPerInstance, 0)} hr ({formatPercent(result.utilizationPct, 0)})
            </div>
          </div>
          <div className="kpi">
            <div className="k">Cost per instance</div>
            <div className="v">{formatCurrency2(costPerInstance)}</div>
          </div>
          <div className="kpi">
            <div className="k">Billable hours (fleet)</div>
            <div className="v">{formatNumber(billableHoursTotal, 0)} hr</div>
          </div>
        </div>

        {peakResult ? (
          <div style={{ marginTop: 12 }}>
            <div className="muted" style={{ fontSize: 13, marginBottom: 6 }}>Baseline vs peak</div>
            <table className="table">
              <thead>
                <tr>
                  <th>Scenario</th>
                  <th className="num">Instances</th>
                  <th className="num">Monthly cost</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Baseline</td>
                  <td className="num">{formatNumber(result.instances, 0)}</td>
                  <td className="num">{formatCurrency2(result.monthlyCostUsd)}</td>
                </tr>
                <tr>
                  <td>Peak</td>
                  <td className="num">{formatNumber(peakResult.instances, 0)}</td>
                  <td className="num">{formatCurrency2(peakResult.monthlyCostUsd)}</td>
                </tr>
                <tr>
                  <td>Delta</td>
                  <td className="num">{formatNumber(peakResult.instances - result.instances, 0)}</td>
                  <td className="num">{formatCurrency2(peakResult.monthlyCostUsd - result.monthlyCostUsd)}</td>
                </tr>
              </tbody>
            </table>
            <div className="muted" style={{ marginTop: 6, fontSize: 12 }}>
              Uses {formatNumber(result.daysPerMonth, 1)} days/month and {formatNumber(result.hoursPerDay, 0)} hours/day.
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
