import React, { useMemo } from "react";
import { useNumberParamState } from "./useNumberParamState";
import { estimateEcsTasks } from "../../lib/calc/ecsTasks";
import { formatNumber, formatPercent } from "../../lib/format";
import { clamp } from "../../lib/math";

export function AwsEcsTaskSizingCalculator() {
  const [totalVcpuNeeded, setTotalVcpuNeeded] = useNumberParamState("AwsEcsTaskSizing.totalVcpuNeeded", 2);
  const [totalMemoryGbNeeded, setTotalMemoryGbNeeded] = useNumberParamState("AwsEcsTaskSizing.totalMemoryGbNeeded", 4);
  const [vcpuPerTask, setVcpuPerTask] = useNumberParamState("AwsEcsTaskSizing.vcpuPerTask", 0.5);
  const [memoryGbPerTask, setMemoryGbPerTask] = useNumberParamState("AwsEcsTaskSizing.memoryGbPerTask", 1);
  const [targetUtilizationPct, setTargetUtilizationPct] = useNumberParamState("AwsEcsTaskSizing.targetUtilizationPct", 70);

  const result = useMemo(() => {
    return estimateEcsTasks({
      totalVcpuNeeded: clamp(totalVcpuNeeded, 0, 1e9),
      totalMemoryGbNeeded: clamp(totalMemoryGbNeeded, 0, 1e9),
      vcpuPerTask: clamp(vcpuPerTask, 0.001, 1e6),
      memoryGbPerTask: clamp(memoryGbPerTask, 0.001, 1e9),
      targetUtilizationPct: clamp(targetUtilizationPct, 1, 100),
    });
  }, [totalVcpuNeeded, totalMemoryGbNeeded, vcpuPerTask, memoryGbPerTask, targetUtilizationPct]);

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
            Use <strong>average</strong> CPU/memory demand, not peak. For safety, target 60–80% utilization instead of
            100%.
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
        <div className="muted" style={{ marginTop: 10, fontSize: 12 }}>
          This sizes tasks only. Use a pricing calculator (Fargate or EC2) to convert task count into monthly cost.
        </div>
      </div>
    </div>
  );
}

