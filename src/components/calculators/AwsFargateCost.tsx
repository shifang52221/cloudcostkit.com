import React, { useMemo, useState } from "react";
import { estimateFargateCost } from "../../lib/calc/fargate";
import { formatCurrency2, formatNumber } from "../../lib/format";
import { clamp } from "../../lib/math";

export function AwsFargateCostCalculator() {
  const [tasks, setTasks] = useState(3);
  const [vcpuPerTask, setVcpuPerTask] = useState(0.5);
  const [memoryGbPerTask, setMemoryGbPerTask] = useState(1);
  const [hoursPerMonth, setHoursPerMonth] = useState(730);
  const [pricePerVcpuHourUsd, setPricePerVcpuHourUsd] = useState(0.04048);
  const [pricePerGbHourUsd, setPricePerGbHourUsd] = useState(0.004445);

  const result = useMemo(() => {
    return estimateFargateCost({
      tasks: clamp(tasks, 0, 1e9),
      vcpuPerTask: clamp(vcpuPerTask, 0, 1e3),
      memoryGbPerTask: clamp(memoryGbPerTask, 0, 1e6),
      hoursPerMonth: clamp(hoursPerMonth, 0, 1e6),
      pricePerVcpuHourUsd: clamp(pricePerVcpuHourUsd, 0, 1e3),
      pricePerGbHourUsd: clamp(pricePerGbHourUsd, 0, 1e3),
    });
  }, [tasks, vcpuPerTask, memoryGbPerTask, hoursPerMonth, pricePerVcpuHourUsd, pricePerGbHourUsd]);

  return (
    <div className="calc-grid">
      <div className="panel">
        <h3>Inputs</h3>
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

          <div className="field field-6">
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => {
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
            <div className="muted" style={{ marginTop: 8, fontSize: 12 }}>
              Tip: for autoscaling services, use average running tasks over the month (not peak).
            </div>
          </div>
        </div>
      </div>

      <div className="panel">
        <h3>Results</h3>
        <div className="kpis">
          <div className="kpi">
            <div className="k">Estimated monthly Fargate compute total</div>
            <div className="v">{formatCurrency2(result.totalCostUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">vCPU-hours</div>
            <div className="v">{formatNumber(result.vcpuHours, 0)}</div>
          </div>
          <div className="kpi">
            <div className="k">GB-hours</div>
            <div className="v">{formatNumber(result.memoryGbHours, 0)}</div>
          </div>
          <div className="kpi">
            <div className="k">vCPU cost</div>
            <div className="v">{formatCurrency2(result.vcpuCostUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">Memory cost</div>
            <div className="v">{formatCurrency2(result.memoryCostUsd)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

