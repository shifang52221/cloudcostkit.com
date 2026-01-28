import React, { useMemo } from "react";
import { useBooleanParamState, useNumberParamState } from "./useNumberParamState";
import { estimateEcsTasks } from "../../lib/calc/ecsTasks";
import { formatNumber, formatPercent } from "../../lib/format";
import { clamp } from "../../lib/math";

export function AwsEcsTaskSizingCalculator() {
  const [totalVcpuNeeded, setTotalVcpuNeeded] = useNumberParamState("AwsEcsTaskSizing.totalVcpuNeeded", 2);
  const [totalMemoryGbNeeded, setTotalMemoryGbNeeded] = useNumberParamState("AwsEcsTaskSizing.totalMemoryGbNeeded", 4);
  const [vcpuPerTask, setVcpuPerTask] = useNumberParamState("AwsEcsTaskSizing.vcpuPerTask", 0.5);
  const [memoryGbPerTask, setMemoryGbPerTask] = useNumberParamState("AwsEcsTaskSizing.memoryGbPerTask", 1);
  const [targetUtilizationPct, setTargetUtilizationPct] = useNumberParamState("AwsEcsTaskSizing.targetUtilizationPct", 70);
  const [showPeakScenario, setShowPeakScenario] = useBooleanParamState("AwsEcsTaskSizing.showPeakScenario", false);
  const [peakMultiplierPct, setPeakMultiplierPct] = useNumberParamState("AwsEcsTaskSizing.peakMultiplierPct", 180);

  const result = useMemo(() => {
    return estimateEcsTasks({
      totalVcpuNeeded: clamp(totalVcpuNeeded, 0, 1e9),
      totalMemoryGbNeeded: clamp(totalMemoryGbNeeded, 0, 1e9),
      vcpuPerTask: clamp(vcpuPerTask, 0.001, 1e6),
      memoryGbPerTask: clamp(memoryGbPerTask, 0.001, 1e9),
      targetUtilizationPct: clamp(targetUtilizationPct, 1, 100),
    });
  }, [totalVcpuNeeded, totalMemoryGbNeeded, vcpuPerTask, memoryGbPerTask, targetUtilizationPct]);

  const peakResult = useMemo(() => {
    if (!showPeakScenario) return null;
    const multiplier = clamp(peakMultiplierPct, 100, 1000) / 100;
    return estimateEcsTasks({
      totalVcpuNeeded: clamp(totalVcpuNeeded, 0, 1e9) * multiplier,
      totalMemoryGbNeeded: clamp(totalMemoryGbNeeded, 0, 1e9) * multiplier,
      vcpuPerTask: clamp(vcpuPerTask, 0.001, 1e6),
      memoryGbPerTask: clamp(memoryGbPerTask, 0.001, 1e9),
      targetUtilizationPct: clamp(targetUtilizationPct, 1, 100),
    });
  }, [
    memoryGbPerTask,
    peakMultiplierPct,
    showPeakScenario,
    targetUtilizationPct,
    totalMemoryGbNeeded,
    totalVcpuNeeded,
    vcpuPerTask,
  ]);

  return (
    <div className="calc-grid">
      <div className="panel">
        <h3>Inputs</h3>
        <div className="form">
          <div className="field field-3">
            <div className="label">Total vCPU needed (average)</div>
            <input
              type="number"
              inputMode="decimal"
              value={totalVcpuNeeded}
              min={0}
              step={0.1}
              onChange={(e) => setTotalVcpuNeeded(+e.target.value)}
            />
          </div>
          <div className="field field-3">
            <div className="label">Total memory needed (GB, average)</div>
            <input
              type="number"
              inputMode="decimal"
              value={totalMemoryGbNeeded}
              min={0}
              step={0.1}
              onChange={(e) => setTotalMemoryGbNeeded(+e.target.value)}
            />
          </div>
          <div className="field field-3">
            <div className="label">vCPU per task</div>
            <input
              type="number"
              inputMode="decimal"
              value={vcpuPerTask}
              min={0.001}
              step={0.25}
              onChange={(e) => setVcpuPerTask(+e.target.value)}
            />
          </div>
          <div className="field field-3">
            <div className="label">Memory per task (GB)</div>
            <input
              type="number"
              inputMode="decimal"
              value={memoryGbPerTask}
              min={0.001}
              step={0.5}
              onChange={(e) => setMemoryGbPerTask(+e.target.value)}
            />
          </div>
          <div className="field field-3">
            <div className="label">Target utilization (%)</div>
            <input
              type="number"
              inputMode="numeric"
              value={targetUtilizationPct}
              min={1}
              max={100}
              step={1}
              onChange={(e) => setTargetUtilizationPct(+e.target.value)}
            />
          </div>

          <div className="field field-9 muted" style={{ alignSelf: "end" }}>
            Use <strong>average</strong> CPU/memory demand, not peak. For safety, target 60-80% utilization instead of
            100%.
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
              <div className="hint">Applies to total vCPU and memory demand.</div>
            </div>
          ) : null}

          <div className="field field-6">
            <div className="label">Scenario presets</div>
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setTotalVcpuNeeded(1);
                  setTotalMemoryGbNeeded(2);
                  setVcpuPerTask(0.25);
                  setMemoryGbPerTask(0.5);
                  setTargetUtilizationPct(70);
                  setShowPeakScenario(true);
                  setPeakMultiplierPct(160);
                }}
              >
                Small service
              </button>
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setTotalVcpuNeeded(8);
                  setTotalMemoryGbNeeded(16);
                  setVcpuPerTask(1);
                  setMemoryGbPerTask(2);
                  setTargetUtilizationPct(70);
                  setShowPeakScenario(true);
                  setPeakMultiplierPct(220);
                }}
              >
                API workload
              </button>
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setTotalVcpuNeeded(24);
                  setTotalMemoryGbNeeded(64);
                  setVcpuPerTask(2);
                  setMemoryGbPerTask(4);
                  setTargetUtilizationPct(65);
                  setShowPeakScenario(true);
                  setPeakMultiplierPct(190);
                }}
              >
                Batch heavy
              </button>
            </div>
          </div>

          <div className="field field-6">
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setTotalVcpuNeeded(2);
                  setTotalMemoryGbNeeded(4);
                  setVcpuPerTask(0.5);
                  setMemoryGbPerTask(1);
                  setTargetUtilizationPct(70);
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
            <div className="k">Tasks needed (CPU)</div>
            <div className="v">{formatNumber(result.tasksByCpu, 0)}</div>
          </div>
          <div className="kpi">
            <div className="k">Tasks needed (memory)</div>
            <div className="v">{formatNumber(result.tasksByMemory, 0)}</div>
          </div>
          <div className="kpi">
            <div className="k">Recommended tasks</div>
            <div className="v">{formatNumber(result.recommendedTasks, 0)}</div>
          </div>
          <div className="kpi">
            <div className="k">CPU utilization (at recommended)</div>
            <div className="v">{formatPercent(result.cpuUtilizationPctAtRecommended, 0)}</div>
          </div>
          <div className="kpi">
            <div className="k">Memory utilization (at recommended)</div>
            <div className="v">{formatPercent(result.memoryUtilizationPctAtRecommended, 0)}</div>
          </div>
        </div>
        {peakResult ? (
          <div style={{ marginTop: 12 }}>
            <div className="muted" style={{ fontSize: 13, marginBottom: 6 }}>Baseline vs peak</div>
            <table className="table">
              <thead>
                <tr>
                  <th>Scenario</th>
                  <th className="num">Recommended tasks</th>
                  <th className="num">CPU util</th>
                  <th className="num">Memory util</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Baseline</td>
                  <td className="num">{formatNumber(result.recommendedTasks, 0)}</td>
                  <td className="num">{formatPercent(result.cpuUtilizationPctAtRecommended, 0)}</td>
                  <td className="num">{formatPercent(result.memoryUtilizationPctAtRecommended, 0)}</td>
                </tr>
                <tr>
                  <td>Peak</td>
                  <td className="num">{formatNumber(peakResult.recommendedTasks, 0)}</td>
                  <td className="num">{formatPercent(peakResult.cpuUtilizationPctAtRecommended, 0)}</td>
                  <td className="num">{formatPercent(peakResult.memoryUtilizationPctAtRecommended, 0)}</td>
                </tr>
                <tr>
                  <td>Delta</td>
                  <td className="num">{formatNumber(peakResult.recommendedTasks - result.recommendedTasks, 0)}</td>
                  <td className="num">
                    {formatPercent(peakResult.cpuUtilizationPctAtRecommended - result.cpuUtilizationPctAtRecommended, 0)}
                  </td>
                  <td className="num">
                    {formatPercent(
                      peakResult.memoryUtilizationPctAtRecommended - result.memoryUtilizationPctAtRecommended,
                      0
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : null}
        <div className="muted" style={{ marginTop: 10, fontSize: 12 }}>
          This sizes tasks only. Use a pricing calculator (Fargate or EC2) to convert task count into monthly cost.
        </div>
      </div>
    </div>
  );
}


