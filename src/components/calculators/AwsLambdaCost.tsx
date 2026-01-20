import React, { useMemo, useState } from "react";
import { estimateLambdaCost } from "../../lib/calc/lambda";
import { formatCurrency2, formatNumber } from "../../lib/format";
import { clamp } from "../../lib/math";

export function AwsLambdaCostCalculator() {
  const [invocationsPerMonth, setInvocationsPerMonth] = useState(50_000_000);
  const [avgDurationMs, setAvgDurationMs] = useState(120);
  const [memoryMb, setMemoryMb] = useState(512);
  const [pricePerMillionRequestsUsd, setPricePerMillionRequestsUsd] = useState(0.2);
  const [pricePerGbSecondUsd, setPricePerGbSecondUsd] = useState(0.0000166667);
  const [includeFreeTier, setIncludeFreeTier] = useState(true);

  const result = useMemo(() => {
    return estimateLambdaCost({
      invocationsPerMonth: clamp(invocationsPerMonth, 0, 1e18),
      avgDurationMs: clamp(avgDurationMs, 0, 1e9),
      memoryMb: clamp(memoryMb, 0, 10_240),
      pricePerMillionRequestsUsd: clamp(pricePerMillionRequestsUsd, 0, 1e9),
      pricePerGbSecondUsd: clamp(pricePerGbSecondUsd, 0, 1e3),
      freeInvocationsPerMonth: includeFreeTier ? 1_000_000 : 0,
      freeGbSecondsPerMonth: includeFreeTier ? 400_000 : 0,
    });
  }, [
    invocationsPerMonth,
    avgDurationMs,
    memoryMb,
    pricePerMillionRequestsUsd,
    pricePerGbSecondUsd,
    includeFreeTier,
  ]);

  return (
    <div className="calc-grid">
      <div className="panel">
        <h3>Inputs</h3>
        <div className="form">
          <div className="field field-3">
            <div className="label">Invocations (per month)</div>
            <input
              type="number"
              inputMode="numeric"
              value={invocationsPerMonth}
              min={0}
              step={1000}
              onChange={(e) => setInvocationsPerMonth(+e.target.value)}
            />
          </div>

          <div className="field field-3">
            <div className="label">Avg duration (ms)</div>
            <input
              type="number"
              inputMode="numeric"
              value={avgDurationMs}
              min={0}
              step={1}
              onChange={(e) => setAvgDurationMs(+e.target.value)}
            />
          </div>

          <div className="field field-3">
            <div className="label">Memory (MB)</div>
            <input
              type="number"
              inputMode="numeric"
              value={memoryMb}
              min={0}
              step={64}
              onChange={(e) => setMemoryMb(+e.target.value)}
            />
          </div>

          <div className="field field-3">
            <div className="label">Price ($ / 1M requests)</div>
            <input
              type="number"
              inputMode="decimal"
              value={pricePerMillionRequestsUsd}
              min={0}
              step={0.01}
              onChange={(e) => setPricePerMillionRequestsUsd(+e.target.value)}
            />
          </div>

          <div className="field field-3">
            <div className="label">Price ($ / GB-second)</div>
            <input
              type="number"
              inputMode="decimal"
              value={pricePerGbSecondUsd}
              min={0}
              step={0.0000001}
              onChange={(e) => setPricePerGbSecondUsd(+e.target.value)}
            />
          </div>

          <div className="field field-3" style={{ alignSelf: "end" }}>
            <label className="muted" style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <input
                type="checkbox"
                checked={includeFreeTier}
                onChange={(e) => setIncludeFreeTier(e.target.checked)}
              />
              Include AWS free tier
            </label>
          </div>

          <div className="field field-6">
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setInvocationsPerMonth(50_000_000);
                  setAvgDurationMs(120);
                  setMemoryMb(512);
                  setPricePerMillionRequestsUsd(0.2);
                  setPricePerGbSecondUsd(0.0000166667);
                  setIncludeFreeTier(true);
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
            <div className="k">Compute cost (GB-seconds)</div>
            <div className="v">{formatCurrency2(result.computeCostUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">Request cost</div>
            <div className="v">{formatCurrency2(result.requestCostUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">GB-seconds (before free tier)</div>
            <div className="v">{formatNumber(result.gbSeconds, 0)}</div>
          </div>
          <div className="kpi">
            <div className="k">Billable invocations</div>
            <div className="v">{formatNumber(result.billableInvocations, 0)}</div>
          </div>
          <div className="kpi">
            <div className="k">Billable GB-seconds</div>
            <div className="v">{formatNumber(result.billableGbSeconds, 0)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

