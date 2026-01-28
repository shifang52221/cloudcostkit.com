import React, { useMemo } from "react";
import { useBooleanParamState, useNumberParamState } from "./useNumberParamState";
import { estimateComputeCost } from "../../lib/calc/compute";
import { formatCurrency2, formatNumber, formatPercent } from "../../lib/format";
import { clamp } from "../../lib/math";

export function KubernetesNodeCostCalculator() {
  const [nodes, setNodes] = useNumberParamState("KubernetesNodeCost.nodes", 12);
  const [pricePerHourUsd, setPricePerHourUsd] = useNumberParamState("KubernetesNodeCost.pricePerHourUsd", 0.32);
  const [utilizationPct, setUtilizationPct] = useNumberParamState("KubernetesNodeCost.utilizationPct", 100);
  const [hoursPerDay, setHoursPerDay] = useNumberParamState("KubernetesNodeCost.hoursPerDay", 24);
  const [showPeakScenario, setShowPeakScenario] = useBooleanParamState("KubernetesNodeCost.showPeakScenario", false);
  const [peakMultiplierPct, setPeakMultiplierPct] = useNumberParamState("KubernetesNodeCost.peakMultiplierPct", 180);

  const result = useMemo(() => {
    return estimateComputeCost({
      instances: clamp(nodes, 0, 1e9),
      pricePerHourUsd: clamp(pricePerHourUsd, 0, 1e6),
      utilizationPct: clamp(utilizationPct, 0, 100),
      hoursPerDay: clamp(hoursPerDay, 0, 24),
    });
  }, [nodes, pricePerHourUsd, utilizationPct, hoursPerDay]);

  const peakResult = useMemo(() => {
    if (!showPeakScenario) return null;
    const multiplier = clamp(peakMultiplierPct, 100, 1000) / 100;
    return estimateComputeCost({
      instances: clamp(nodes, 0, 1e9) * multiplier,
      pricePerHourUsd: clamp(pricePerHourUsd, 0, 1e6),
      utilizationPct: clamp(utilizationPct, 0, 100),
      hoursPerDay: clamp(hoursPerDay, 0, 24),
    });
  }, [hoursPerDay, nodes, peakMultiplierPct, pricePerHourUsd, showPeakScenario, utilizationPct]);

  return (
    <div className="calc-grid">
      <div className="panel">
        <h3>Inputs</h3>
        <div className="form">
          <div className="field field-3">
            <div className="label">Nodes</div>
            <input
              type="number"
              inputMode="numeric"
              value={nodes}
              min={0}
              step={1}
              onChange={(e) => setNodes(+e.target.value)}
            />
          </div>
          <div className="field field-3">
            <div className="label">Price per node ($ / hour)</div>
            <input
              type="number"
              inputMode="decimal"
              value={pricePerHourUsd}
              min={0}
              step={0.001}
              onChange={(e) => setPricePerHourUsd(+e.target.value)}
            />
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
            <div className="hint">Use &lt;100% if nodes aren't running 24/7.</div>
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
              <div className="hint">Applies to node count.</div>
            </div>
          ) : null}

          <div className="field field-6">
            <div className="label">Scenario presets</div>
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setNodes(6);
                  setPricePerHourUsd(0.28);
                  setUtilizationPct(100);
                  setHoursPerDay(24);
                  setShowPeakScenario(true);
                  setPeakMultiplierPct(160);
                }}
              >
                Small cluster
              </button>
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setNodes(24);
                  setPricePerHourUsd(0.32);
                  setUtilizationPct(95);
                  setHoursPerDay(24);
                  setShowPeakScenario(true);
                  setPeakMultiplierPct(210);
                }}
              >
                Microservices
              </button>
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setNodes(80);
                  setPricePerHourUsd(0.36);
                  setUtilizationPct(90);
                  setHoursPerDay(24);
                  setShowPeakScenario(true);
                  setPeakMultiplierPct(240);
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
                  setNodes(12);
                  setPricePerHourUsd(0.32);
                  setUtilizationPct(100);
                  setHoursPerDay(24);
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
            <div className="k">Estimated monthly node cost</div>
            <div className="v">{formatCurrency2(result.monthlyCostUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">Billable hours (per node)</div>
            <div className="v">
              {formatNumber(result.billableHoursPerInstance, 0)} hr ({formatPercent(result.utilizationPct, 0)})
            </div>
          </div>
        </div>

        {peakResult ? (
          <div style={{ marginTop: 12 }}>
            <div className="muted" style={{ fontSize: 13, marginBottom: 6 }}>Baseline vs peak</div>
            <table className="table">
              <thead>
                <tr>
                  <th>Scenario</th>
                  <th className="num">Nodes</th>
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
          </div>
        ) : null}
      </div>
    </div>
  );
}
