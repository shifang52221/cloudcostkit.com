import React, { useMemo, useState } from "react";
import { estimateFargateCost } from "../../lib/calc/fargate";
import { estimateComputeCost } from "../../lib/calc/compute";
import { formatCurrency2, formatNumber, formatPercent } from "../../lib/format";
import { clamp } from "../../lib/math";

export function AwsFargateVsEc2CostCalculator() {
  const [hoursPerMonth, setHoursPerMonth] = useState(730);

  const [tasks, setTasks] = useState(6);
  const [vcpuPerTask, setVcpuPerTask] = useState(0.5);
  const [memoryGbPerTask, setMemoryGbPerTask] = useState(1);
  const [pricePerVcpuHourUsd, setPricePerVcpuHourUsd] = useState(0.04048);
  const [pricePerGbHourUsd, setPricePerGbHourUsd] = useState(0.004445);

  const [instances, setInstances] = useState(3);
  const [pricePerInstanceHourUsd, setPricePerInstanceHourUsd] = useState(0.18);

  const normalizedHoursPerMonth = clamp(hoursPerMonth, 0, 1e6);
  const normalizedDaysPerMonth = normalizedHoursPerMonth / 24;

  const fargate = useMemo(() => {
    return estimateFargateCost({
      tasks: clamp(tasks, 0, 1e9),
      vcpuPerTask: clamp(vcpuPerTask, 0, 1e3),
      memoryGbPerTask: clamp(memoryGbPerTask, 0, 1e6),
      hoursPerMonth: normalizedHoursPerMonth,
      pricePerVcpuHourUsd: clamp(pricePerVcpuHourUsd, 0, 1e3),
      pricePerGbHourUsd: clamp(pricePerGbHourUsd, 0, 1e3),
    });
  }, [
    tasks,
    vcpuPerTask,
    memoryGbPerTask,
    normalizedHoursPerMonth,
    pricePerVcpuHourUsd,
    pricePerGbHourUsd,
  ]);

  const ec2 = useMemo(() => {
    return estimateComputeCost({
      instances: clamp(instances, 0, 1e9),
      pricePerHourUsd: clamp(pricePerInstanceHourUsd, 0, 1e6),
      utilizationPct: 100,
      hoursPerDay: 24,
      daysPerMonth: normalizedDaysPerMonth,
    });
  }, [instances, pricePerInstanceHourUsd, normalizedDaysPerMonth]);

  const deltaUsd = fargate.totalCostUsd - ec2.monthlyCostUsd;
  const winner = deltaUsd > 0 ? "EC2" : deltaUsd < 0 ? "Fargate" : "Tie";
  const deltaPct = ec2.monthlyCostUsd > 0 ? (Math.abs(deltaUsd) / ec2.monthlyCostUsd) * 100 : 0;

  return (
    <div className="calc-grid">
      <div className="panel">
        <h3>Shared assumptions</h3>
        <div className="form">
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
          <div className="field field-9 muted" style={{ alignSelf: "end" }}>
            Use average running tasks/instances over the month. If you schedule down environments, reduce hours/month.
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
          <div className="field field-6 muted" style={{ alignSelf: "end" }}>
            Compute-only: vCPU-hours + GB-hours. Add load balancers, logs, and data transfer separately.
          </div>
        </div>
      </div>

      <div className="panel">
        <h3>EC2 inputs</h3>
        <div className="form">
          <div className="field field-3">
            <div className="label">Instances (average)</div>
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
            <div className="label">Price ($ / instance-hour)</div>
            <input
              type="number"
              inputMode="decimal"
              value={pricePerInstanceHourUsd}
              min={0}
              step={0.001}
              onChange={(e) => setPricePerInstanceHourUsd(+e.target.value)}
            />
          </div>
          <div className="field field-6 muted" style={{ alignSelf: "end" }}>
            Use a blended $/hour if you mix on-demand, Savings Plans, and Reserved Instances.
          </div>
        </div>
      </div>

      <div className="panel">
        <h3>Comparison (compute-only)</h3>
        <div className="kpis">
          <div className="kpi">
            <div className="k">Fargate monthly compute total</div>
            <div className="v">{formatCurrency2(fargate.totalCostUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">EC2 monthly compute total</div>
            <div className="v">{formatCurrency2(ec2.monthlyCostUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">Cheaper (compute-only)</div>
            <div className="v">{winner}</div>
          </div>
          <div className="kpi">
            <div className="k">Difference (Fargate − EC2)</div>
            <div className="v">
              {formatCurrency2(deltaUsd)}{" "}
              <span className="muted" style={{ fontSize: 12 }}>
                ({formatPercent(deltaPct, 0)} vs EC2)
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="panel">
        <h3>Breakdown (sanity checks)</h3>
        <div className="kpis">
          <div className="kpi">
            <div className="k">Fargate vCPU-hours</div>
            <div className="v">{formatNumber(fargate.vcpuHours, 0)}</div>
          </div>
          <div className="kpi">
            <div className="k">Fargate GB-hours</div>
            <div className="v">{formatNumber(fargate.memoryGbHours, 0)}</div>
          </div>
          <div className="kpi">
            <div className="k">EC2 billable hours (per instance)</div>
            <div className="v">{formatNumber(ec2.billableHoursPerInstance, 0)}</div>
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
              setHoursPerMonth(730);

              setTasks(6);
              setVcpuPerTask(0.5);
              setMemoryGbPerTask(1);
              setPricePerVcpuHourUsd(0.04048);
              setPricePerGbHourUsd(0.004445);

              setInstances(3);
              setPricePerInstanceHourUsd(0.18);
            }}
          >
            Reset example
          </button>
        </div>
      </div>
    </div>
  );
}

