import React, { useMemo } from "react";
import { useBooleanParamState, useNumberParamState, useStringParamState } from "./useNumberParamState";
import { estimateLoadBalancerCapacityUnits, type LoadBalancerType } from "../../lib/calc/loadBalancerCapacityUnits";
import { formatNumber } from "../../lib/format";
import { clamp } from "../../lib/math";

export function AwsLoadBalancerCapacityUnitsCalculator() {
  const getMaxDriverUnits = (drivers: {
    newConnectionsUnits: number;
    activeConnectionsUnits: number;
    processedBytesUnits: number;
    ruleEvaluationsUnits?: number;
  }) => {
    return Math.max(
      drivers.newConnectionsUnits,
      drivers.activeConnectionsUnits,
      drivers.processedBytesUnits,
      typeof drivers.ruleEvaluationsUnits === "number" ? drivers.ruleEvaluationsUnits : 0,
    );
  };

  const [typeRaw, setTypeRaw] = useStringParamState("AwsLoadBalancerCapacityUnits.type", "alb", ["alb", "nlb"]);
  const type = typeRaw as LoadBalancerType;
  const [newConnectionsPerSecond, setNewConnectionsPerSecond] = useNumberParamState("AwsLoadBalancerCapacityUnits.newConnectionsPerSecond", 40);
  const [activeConnections, setActiveConnections] = useNumberParamState("AwsLoadBalancerCapacityUnits.activeConnections", 2000);
  const [processedGbPerHour, setProcessedGbPerHour] = useNumberParamState("AwsLoadBalancerCapacityUnits.processedGbPerHour", 0.8);
  const [ruleEvaluationsPerSecond, setRuleEvaluationsPerSecond] = useNumberParamState("AwsLoadBalancerCapacityUnits.ruleEvaluationsPerSecond", 300);
  const [showPeakScenario, setShowPeakScenario] = useBooleanParamState("AwsLoadBalancerCapacityUnits.showPeakScenario", false);
  const [peakMultiplierPct, setPeakMultiplierPct] = useNumberParamState("AwsLoadBalancerCapacityUnits.peakMultiplierPct", 200);
  const newConnectionsPerMinute = newConnectionsPerSecond * 60;
  const processedMbps = (processedGbPerHour * 8000) / 3600;

  const result = useMemo(() => {
    return estimateLoadBalancerCapacityUnits({
      type,
      newConnectionsPerSecond: clamp(newConnectionsPerSecond, 0, 1e12),
      activeConnections: clamp(activeConnections, 0, 1e12),
      processedGbPerHour: clamp(processedGbPerHour, 0, 1e12),
      ruleEvaluationsPerSecond: clamp(ruleEvaluationsPerSecond, 0, 1e12),
    });
  }, [type, newConnectionsPerSecond, activeConnections, processedGbPerHour, ruleEvaluationsPerSecond]);

  const peakResult = useMemo(() => {
    if (!showPeakScenario) return null;
    const multiplier = clamp(peakMultiplierPct, 100, 1000) / 100;
    return estimateLoadBalancerCapacityUnits({
      type,
      newConnectionsPerSecond: clamp(newConnectionsPerSecond, 0, 1e12) * multiplier,
      activeConnections: clamp(activeConnections, 0, 1e12) * multiplier,
      processedGbPerHour: clamp(processedGbPerHour, 0, 1e12) * multiplier,
      ruleEvaluationsPerSecond: clamp(ruleEvaluationsPerSecond, 0, 1e12) * multiplier,
    });
  }, [
    activeConnections,
    newConnectionsPerSecond,
    peakMultiplierPct,
    processedGbPerHour,
    ruleEvaluationsPerSecond,
    showPeakScenario,
    type,
  ]);

  return (
    <div className="calc-grid">
      <div className="panel">
        <h3>Inputs</h3>
        <div className="form">
          <div className="field field-3">
            <div className="label">LB type</div>
            <select value={typeRaw} onChange={(e) => setTypeRaw(e.target.value)}>
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
            <div className="hint">~{formatNumber(newConnectionsPerMinute, 0)} new connections/min.</div>
          </div>

          <div className="field field-3">
            <div className="label">Active connections (avg)</div>
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
              step={0.1}
              onChange={(e) => setProcessedGbPerHour(+e.target.value)}
            />
            <div className="hint">Avg {formatNumber(processedMbps, 2)} Mbps.</div>
          </div>

          {type === "alb" ? (
            <div className="field field-3">
              <div className="label">Rule evals / sec (ALB)</div>
              <input
                type="number"
                inputMode="numeric"
                value={ruleEvaluationsPerSecond}
                min={0}
                step={10}
                onChange={(e) => setRuleEvaluationsPerSecond(+e.target.value)}
              />
            </div>
          ) : (
            <div className="field field-3 muted" style={{ alignSelf: "end" }}>
              Rule evaluations apply to ALB; NLB uses connections + bytes processed.
            </div>
          )}

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
              <div className="hint">Applies to connection, bytes, and rules.</div>
            </div>
          ) : null}

          <div className="field field-6">
            <div className="label">Scenario presets</div>
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setTypeRaw("alb");
                  setNewConnectionsPerSecond(20);
                  setActiveConnections(900);
                  setProcessedGbPerHour(0.4);
                  setRuleEvaluationsPerSecond(120);
                  setShowPeakScenario(true);
                  setPeakMultiplierPct(170);
                }}
              >
                Small web
              </button>
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setTypeRaw("alb");
                  setNewConnectionsPerSecond(180);
                  setActiveConnections(12_000);
                  setProcessedGbPerHour(3.6);
                  setRuleEvaluationsPerSecond(900);
                  setShowPeakScenario(true);
                  setPeakMultiplierPct(230);
                }}
              >
                SaaS surge
              </button>
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setTypeRaw("nlb");
                  setNewConnectionsPerSecond(120);
                  setActiveConnections(18_000);
                  setProcessedGbPerHour(5.2);
                  setRuleEvaluationsPerSecond(0);
                  setShowPeakScenario(true);
                  setPeakMultiplierPct(200);
                }}
              >
                NLB throughput
              </button>
            </div>
          </div>

          <div className="field field-6">
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setTypeRaw("alb");
                  setNewConnectionsPerSecond(40);
                  setActiveConnections(2000);
                  setProcessedGbPerHour(0.8);
                  setRuleEvaluationsPerSecond(300);
                  setShowPeakScenario(false);
                  setPeakMultiplierPct(200);
                }}
              >
                Reset example
              </button>
            </div>
            <div className="muted" style={{ marginTop: 8, fontSize: 12 }}>
              Use averages for budgeting; model peaks separately. This uses the common LCU/NLCU driver definitions; verify
              your provider docs and region pricing.
            </div>
          </div>
        </div>
      </div>

      <div className="panel">
        <h3>Results</h3>
        <div className="kpis">
          <div className="kpi">
            <div className="k">Estimated capacity units (avg per hour)</div>
            <div className="v">{formatNumber(result.capacityUnitsPerHour, 3)}</div>
          </div>
          <div className="kpi">
            <div className="k">Driver: new connections</div>
            <div className="v">{formatNumber(result.drivers.newConnectionsUnits, 3)}</div>
          </div>
          <div className="kpi">
            <div className="k">Driver: active connections</div>
            <div className="v">{formatNumber(result.drivers.activeConnectionsUnits, 3)}</div>
          </div>
          <div className="kpi">
            <div className="k">Driver: processed bytes</div>
            <div className="v">{formatNumber(result.drivers.processedBytesUnits, 3)}</div>
          </div>
          {typeof result.drivers.ruleEvaluationsUnits === "number" ? (
            <div className="kpi">
              <div className="k">Driver: rule evaluations</div>
              <div className="v">{formatNumber(result.drivers.ruleEvaluationsUnits, 3)}</div>
            </div>
          ) : null}
        </div>

        {peakResult ? (
          <div style={{ marginTop: 12 }}>
            <div className="muted" style={{ fontSize: 13, marginBottom: 6 }}>Baseline vs peak</div>
            <table className="table">
              <thead>
                <tr>
                  <th>Scenario</th>
                  <th className="num">Capacity units/hr</th>
                  <th className="num">Driver max</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Baseline</td>
                  <td className="num">{formatNumber(result.capacityUnitsPerHour, 3)}</td>
                  <td className="num">{formatNumber(getMaxDriverUnits(result.drivers), 3)}</td>
                </tr>
                <tr>
                  <td>Peak</td>
                  <td className="num">{formatNumber(peakResult.capacityUnitsPerHour, 3)}</td>
                  <td className="num">{formatNumber(getMaxDriverUnits(peakResult.drivers), 3)}</td>
                </tr>
                <tr>
                  <td>Delta</td>
                  <td className="num">{formatNumber(peakResult.capacityUnitsPerHour - result.capacityUnitsPerHour, 3)}</td>
                  <td className="num">
                    {formatNumber(getMaxDriverUnits(peakResult.drivers) - getMaxDriverUnits(result.drivers), 3)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </div>
  );
}
