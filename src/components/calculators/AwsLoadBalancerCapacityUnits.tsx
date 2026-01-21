import React, { useMemo, useState } from "react";
import { estimateLoadBalancerCapacityUnits, type LoadBalancerType } from "../../lib/calc/loadBalancerCapacityUnits";
import { formatNumber } from "../../lib/format";
import { clamp } from "../../lib/math";

export function AwsLoadBalancerCapacityUnitsCalculator() {
  const [type, setType] = useState<LoadBalancerType>("alb");
  const [newConnectionsPerSecond, setNewConnectionsPerSecond] = useState(40);
  const [activeConnections, setActiveConnections] = useState(2000);
  const [processedGbPerHour, setProcessedGbPerHour] = useState(0.8);
  const [ruleEvaluationsPerSecond, setRuleEvaluationsPerSecond] = useState(300);

  const result = useMemo(() => {
    return estimateLoadBalancerCapacityUnits({
      type,
      newConnectionsPerSecond: clamp(newConnectionsPerSecond, 0, 1e12),
      activeConnections: clamp(activeConnections, 0, 1e12),
      processedGbPerHour: clamp(processedGbPerHour, 0, 1e12),
      ruleEvaluationsPerSecond: clamp(ruleEvaluationsPerSecond, 0, 1e12),
    });
  }, [type, newConnectionsPerSecond, activeConnections, processedGbPerHour, ruleEvaluationsPerSecond]);

  return (
    <div className="calc-grid">
      <div className="panel">
        <h3>Inputs</h3>
        <div className="form">
          <div className="field field-3">
            <div className="label">LB type</div>
            <select value={type} onChange={(e) => setType(e.target.value as LoadBalancerType)}>
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

          <div className="field field-6">
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setType("alb");
                  setNewConnectionsPerSecond(40);
                  setActiveConnections(2000);
                  setProcessedGbPerHour(0.8);
                  setRuleEvaluationsPerSecond(300);
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
      </div>
    </div>
  );
}

