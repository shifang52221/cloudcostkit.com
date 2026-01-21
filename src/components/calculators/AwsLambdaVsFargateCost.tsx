import React, { useMemo, useState } from "react";
import { estimateFargateCost } from "../../lib/calc/fargate";
import { estimateLambdaCost } from "../../lib/calc/lambda";
import { formatCurrency2, formatNumber, formatPercent } from "../../lib/format";
import { clamp } from "../../lib/math";

export function AwsLambdaVsFargateCostCalculator() {
  const [invocationsPerMonth, setInvocationsPerMonth] = useState(50_000_000);
  const [avgDurationMs, setAvgDurationMs] = useState(120);
  const [memoryMb, setMemoryMb] = useState(512);
  const [pricePerMillionRequestsUsd, setPricePerMillionRequestsUsd] = useState(0.2);
  const [pricePerGbSecondUsd, setPricePerGbSecondUsd] = useState(0.0000166667);
  const [includeFreeTier, setIncludeFreeTier] = useState(true);

  const [tasks, setTasks] = useState(3);
  const [vcpuPerTask, setVcpuPerTask] = useState(0.5);
  const [memoryGbPerTask, setMemoryGbPerTask] = useState(1);
  const [hoursPerMonth, setHoursPerMonth] = useState(730);
  const [pricePerVcpuHourUsd, setPricePerVcpuHourUsd] = useState(0.04048);
  const [pricePerGbHourUsd, setPricePerGbHourUsd] = useState(0.004445);

  const lambda = useMemo(() => {
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

  const fargate = useMemo(() => {
    return estimateFargateCost({
      tasks: clamp(tasks, 0, 1e9),
      vcpuPerTask: clamp(vcpuPerTask, 0, 1e3),
      memoryGbPerTask: clamp(memoryGbPerTask, 0, 1e6),
      hoursPerMonth: clamp(hoursPerMonth, 0, 1e6),
      pricePerVcpuHourUsd: clamp(pricePerVcpuHourUsd, 0, 1e3),
      pricePerGbHourUsd: clamp(pricePerGbHourUsd, 0, 1e3),
    });
  }, [tasks, vcpuPerTask, memoryGbPerTask, hoursPerMonth, pricePerVcpuHourUsd, pricePerGbHourUsd]);

  const deltaUsd = fargate.totalCostUsd - lambda.totalCostUsd;
  const winner = deltaUsd > 0 ? "Lambda" : deltaUsd < 0 ? "Fargate" : "Tie";
  const deltaPct =
    lambda.totalCostUsd > 0 ? (Math.abs(deltaUsd) / lambda.totalCostUsd) * 100 : deltaUsd !== 0 ? 100 : 0;

  return (
    <div className="calc-grid">
      <div className="panel">
        <h3>Lambda inputs</h3>
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
        </div>
      </div>

      <div className="panel">
        <h3>Fargate inputs</h3>
        <div className="form">
          <div className="field field-3">
            <div className="label">Running tasks (average)</div>
            <input
              type="number"
              inputMode="numeric"
              value={tasks}
              min={0}
              step={1}
              onChange={(e) => setTasks(+e.target.value)}
            />
          </div>
          <div className="field field-3">
            <div className="label">vCPU per task</div>
            <input
              type="number"
              inputMode="decimal"
              value={vcpuPerTask}
              min={0}
              step={0.25}
              onChange={(e) => setVcpuPerTask(+e.target.value)}
            />
          </div>
          <div className="field field-3">
            <div className="label">Memory (GB) per task</div>
            <input
              type="number"
              inputMode="decimal"
              value={memoryGbPerTask}
              min={0}
              step={0.5}
              onChange={(e) => setMemoryGbPerTask(+e.target.value)}
            />
          </div>
          <div className="field field-3">
            <div className="label">Hours per month</div>
            <input
              type="number"
              inputMode="numeric"
              value={hoursPerMonth}
              min={0}
              step={1}
              onChange={(e) => setHoursPerMonth(+e.target.value)}
            />
          </div>
          <div className="field field-3">
            <div className="label">Price ($ / vCPU-hour)</div>
            <input
              type="number"
              inputMode="decimal"
              value={pricePerVcpuHourUsd}
              min={0}
              step={0.0001}
              onChange={(e) => setPricePerVcpuHourUsd(+e.target.value)}
            />
          </div>
          <div className="field field-3">
            <div className="label">Price ($ / GB-hour)</div>
            <input
              type="number"
              inputMode="decimal"
              value={pricePerGbHourUsd}
              min={0}
              step={0.0001}
              onChange={(e) => setPricePerGbHourUsd(+e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="panel">
        <h3>Comparison</h3>
        <div className="kpis">
          <div className="kpi">
            <div className="k">Lambda monthly total</div>
            <div className="v">{formatCurrency2(lambda.totalCostUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">Fargate monthly total</div>
            <div className="v">{formatCurrency2(fargate.totalCostUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">Cheaper (compute-only)</div>
            <div className="v">{winner}</div>
          </div>
          <div className="kpi">
            <div className="k">Difference (Fargate − Lambda)</div>
            <div className="v">
              {formatCurrency2(deltaUsd)}{" "}
              <span className="muted" style={{ fontSize: 12 }}>
                ({formatPercent(deltaPct, 0)} vs Lambda)
              </span>
            </div>
          </div>
        </div>

        <div className="muted" style={{ marginTop: 10, fontSize: 12 }}>
          This compares compute-only pricing. Add logs, load balancers, NAT/egress, and retries for a full model.
        </div>
      </div>

      <div className="panel">
        <h3>Breakdown (sanity checks)</h3>
        <div className="kpis">
          <div className="kpi">
            <div className="k">Lambda billable invocations</div>
            <div className="v">{formatNumber(lambda.billableInvocations, 0)}</div>
          </div>
          <div className="kpi">
            <div className="k">Lambda billable GB-seconds</div>
            <div className="v">{formatNumber(lambda.billableGbSeconds, 0)}</div>
          </div>
          <div className="kpi">
            <div className="k">Fargate vCPU-hours</div>
            <div className="v">{formatNumber(fargate.vcpuHours, 0)}</div>
          </div>
          <div className="kpi">
            <div className="k">Fargate GB-hours</div>
            <div className="v">{formatNumber(fargate.memoryGbHours, 0)}</div>
          </div>
        </div>
      </div>

      <div className="panel">
        <h3>Reset</h3>
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

              setTasks(3);
              setVcpuPerTask(0.5);
              setMemoryGbPerTask(1);
              setHoursPerMonth(730);
              setPricePerVcpuHourUsd(0.04048);
              setPricePerGbHourUsd(0.004445);
            }}
          >
            Reset example
          </button>
        </div>
      </div>
    </div>
  );
}

