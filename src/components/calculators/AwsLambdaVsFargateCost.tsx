import React, { useMemo } from "react";
import { useBooleanParamState, useNumberParamState } from "./useNumberParamState";
import { estimateFargateCost } from "../../lib/calc/fargate";
import { estimateLambdaCost } from "../../lib/calc/lambda";
import { formatCurrency2, formatNumber, formatPercent } from "../../lib/format";
import { clamp } from "../../lib/math";

export function AwsLambdaVsFargateCostCalculator() {
  const [invocationsPerMonth, setInvocationsPerMonth] = useNumberParamState("AwsLambdaVsFargateCost.invocationsPerMonth", 50_000_000);
  const [avgDurationMs, setAvgDurationMs] = useNumberParamState("AwsLambdaVsFargateCost.avgDurationMs", 120);
  const [memoryMb, setMemoryMb] = useNumberParamState("AwsLambdaVsFargateCost.memoryMb", 512);
  const [pricePerMillionRequestsUsd, setPricePerMillionRequestsUsd] = useNumberParamState("AwsLambdaVsFargateCost.pricePerMillionRequestsUsd", 0.2);
  const [pricePerGbSecondUsd, setPricePerGbSecondUsd] = useNumberParamState("AwsLambdaVsFargateCost.pricePerGbSecondUsd", 0.0000166667);
  const [includeFreeTier, setIncludeFreeTier] = useBooleanParamState("AwsLambdaVsFargateCost.includeFreeTier", true);
  const [showPeakScenario, setShowPeakScenario] = useBooleanParamState("AwsLambdaVsFargateCost.showPeakScenario", false);
  const [peakMultiplierPct, setPeakMultiplierPct] = useNumberParamState("AwsLambdaVsFargateCost.peakMultiplierPct", 180);

  const [tasks, setTasks] = useNumberParamState("AwsLambdaVsFargateCost.tasks", 3);
  const [vcpuPerTask, setVcpuPerTask] = useNumberParamState("AwsLambdaVsFargateCost.vcpuPerTask", 0.5);
  const [memoryGbPerTask, setMemoryGbPerTask] = useNumberParamState("AwsLambdaVsFargateCost.memoryGbPerTask", 1);
  const [hoursPerMonth, setHoursPerMonth] = useNumberParamState("AwsLambdaVsFargateCost.hoursPerMonth", 730);
  const [pricePerVcpuHourUsd, setPricePerVcpuHourUsd] = useNumberParamState("AwsLambdaVsFargateCost.pricePerVcpuHourUsd", 0.04048);
  const [pricePerGbHourUsd, setPricePerGbHourUsd] = useNumberParamState("AwsLambdaVsFargateCost.pricePerGbHourUsd", 0.004445);

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

  const lambdaPeak = useMemo(() => {
    if (!showPeakScenario) return null;
    const multiplier = clamp(peakMultiplierPct, 100, 1000) / 100;
    return estimateLambdaCost({
      invocationsPerMonth: clamp(invocationsPerMonth, 0, 1e18) * multiplier,
      avgDurationMs: clamp(avgDurationMs, 0, 1e9),
      memoryMb: clamp(memoryMb, 0, 10_240),
      pricePerMillionRequestsUsd: clamp(pricePerMillionRequestsUsd, 0, 1e9),
      pricePerGbSecondUsd: clamp(pricePerGbSecondUsd, 0, 1e3),
      freeInvocationsPerMonth: includeFreeTier ? 1_000_000 : 0,
      freeGbSecondsPerMonth: includeFreeTier ? 400_000 : 0,
    });
  }, [
    avgDurationMs,
    includeFreeTier,
    invocationsPerMonth,
    memoryMb,
    peakMultiplierPct,
    pricePerGbSecondUsd,
    pricePerMillionRequestsUsd,
    showPeakScenario,
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

  const fargatePeak = useMemo(() => {
    if (!showPeakScenario) return null;
    const multiplier = clamp(peakMultiplierPct, 100, 1000) / 100;
    return estimateFargateCost({
      tasks: clamp(tasks, 0, 1e9) * multiplier,
      vcpuPerTask: clamp(vcpuPerTask, 0, 1e3),
      memoryGbPerTask: clamp(memoryGbPerTask, 0, 1e6),
      hoursPerMonth: clamp(hoursPerMonth, 0, 1e6),
      pricePerVcpuHourUsd: clamp(pricePerVcpuHourUsd, 0, 1e3),
      pricePerGbHourUsd: clamp(pricePerGbHourUsd, 0, 1e3),
    });
  }, [
    hoursPerMonth,
    memoryGbPerTask,
    peakMultiplierPct,
    pricePerGbHourUsd,
    pricePerVcpuHourUsd,
    showPeakScenario,
    tasks,
    vcpuPerTask,
  ]);

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
              <div className="hint">Applies to invocations and tasks.</div>
            </div>
          ) : null}
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
            <div className="k">Difference (Fargate - Lambda)</div>
            <div className="v">
              {formatCurrency2(deltaUsd)}{" "}
              <span className="muted" style={{ fontSize: 12 }}>
                ({formatPercent(deltaPct, 0)} vs Lambda)
              </span>
            </div>
          </div>
        </div>

        {lambdaPeak && fargatePeak ? (
          <div style={{ marginTop: 12 }}>
            <div className="muted" style={{ fontSize: 13, marginBottom: 6 }}>Baseline vs peak</div>
            <table className="table">
              <thead>
                <tr>
                  <th>Scenario</th>
                  <th className="num">Lambda total</th>
                  <th className="num">Fargate total</th>
                  <th className="num">Delta</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Baseline</td>
                  <td className="num">{formatCurrency2(lambda.totalCostUsd)}</td>
                  <td className="num">{formatCurrency2(fargate.totalCostUsd)}</td>
                  <td className="num">{formatCurrency2(deltaUsd)}</td>
                </tr>
                <tr>
                  <td>Peak</td>
                  <td className="num">{formatCurrency2(lambdaPeak.totalCostUsd)}</td>
                  <td className="num">{formatCurrency2(fargatePeak.totalCostUsd)}</td>
                  <td className="num">{formatCurrency2(fargatePeak.totalCostUsd - lambdaPeak.totalCostUsd)}</td>
                </tr>
                <tr>
                  <td>Delta</td>
                  <td className="num">{formatCurrency2(lambdaPeak.totalCostUsd - lambda.totalCostUsd)}</td>
                  <td className="num">{formatCurrency2(fargatePeak.totalCostUsd - fargate.totalCostUsd)}</td>
                  <td className="num">{formatCurrency2((fargatePeak.totalCostUsd - lambdaPeak.totalCostUsd) - deltaUsd)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : null}

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
              setShowPeakScenario(false);
              setPeakMultiplierPct(180);

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

