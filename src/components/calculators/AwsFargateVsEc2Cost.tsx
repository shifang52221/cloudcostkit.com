import React, { useMemo } from "react";
import { useBooleanParamState, useNumberParamState } from "./useNumberParamState";
import { estimateFargateCost } from "../../lib/calc/fargate";
import { estimateComputeCost } from "../../lib/calc/compute";
import { formatCurrency2, formatNumber, formatPercent } from "../../lib/format";
import { clamp } from "../../lib/math";

export function AwsFargateVsEc2CostCalculator() {
  const [hoursPerDay, setHoursPerDay] = useNumberParamState("AwsFargateVsEc2Cost.hoursPerDay", 24);
  const [daysPerMonth, setDaysPerMonth] = useNumberParamState("AwsFargateVsEc2Cost.daysPerMonth", 30.4);
  const [showPeakScenario, setShowPeakScenario] = useBooleanParamState("AwsFargateVsEc2Cost.showPeakScenario", false);
  const [peakMultiplierPct, setPeakMultiplierPct] = useNumberParamState("AwsFargateVsEc2Cost.peakMultiplierPct", 180);

  const [tasks, setTasks] = useNumberParamState("AwsFargateVsEc2Cost.tasks", 6);
  const [vcpuPerTask, setVcpuPerTask] = useNumberParamState("AwsFargateVsEc2Cost.vcpuPerTask", 0.5);
  const [memoryGbPerTask, setMemoryGbPerTask] = useNumberParamState("AwsFargateVsEc2Cost.memoryGbPerTask", 1);
  const [pricePerVcpuHourUsd, setPricePerVcpuHourUsd] = useNumberParamState("AwsFargateVsEc2Cost.pricePerVcpuHourUsd", 0.04048);
  const [pricePerGbHourUsd, setPricePerGbHourUsd] = useNumberParamState("AwsFargateVsEc2Cost.pricePerGbHourUsd", 0.004445);

  const [instances, setInstances] = useNumberParamState("AwsFargateVsEc2Cost.instances", 3);
  const [pricePerInstanceHourUsd, setPricePerInstanceHourUsd] = useNumberParamState("AwsFargateVsEc2Cost.pricePerInstanceHourUsd", 0.18);

  const normalizedHoursPerMonth = clamp(daysPerMonth, 1, 31) * clamp(hoursPerDay, 0, 24);
  const normalizedDaysPerMonth = clamp(daysPerMonth, 1, 31);

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

  const fargatePeak = useMemo(() => {
    if (!showPeakScenario) return null;
    const multiplier = clamp(peakMultiplierPct, 100, 1000) / 100;
    return estimateFargateCost({
      tasks: clamp(tasks, 0, 1e9) * multiplier,
      vcpuPerTask: clamp(vcpuPerTask, 0, 1e3),
      memoryGbPerTask: clamp(memoryGbPerTask, 0, 1e6),
      hoursPerMonth: normalizedHoursPerMonth,
      pricePerVcpuHourUsd: clamp(pricePerVcpuHourUsd, 0, 1e3),
      pricePerGbHourUsd: clamp(pricePerGbHourUsd, 0, 1e3),
    });
  }, [
    memoryGbPerTask,
    normalizedHoursPerMonth,
    peakMultiplierPct,
    pricePerGbHourUsd,
    pricePerVcpuHourUsd,
    showPeakScenario,
    tasks,
    vcpuPerTask,
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

  const ec2Peak = useMemo(() => {
    if (!showPeakScenario) return null;
    const multiplier = clamp(peakMultiplierPct, 100, 1000) / 100;
    return estimateComputeCost({
      instances: clamp(instances, 0, 1e9) * multiplier,
      pricePerHourUsd: clamp(pricePerInstanceHourUsd, 0, 1e6),
      utilizationPct: 100,
      hoursPerDay: 24,
      daysPerMonth: normalizedDaysPerMonth,
    });
  }, [instances, normalizedDaysPerMonth, peakMultiplierPct, pricePerInstanceHourUsd, showPeakScenario]);

  const deltaUsd = fargate.totalCostUsd - ec2.monthlyCostUsd;
  const winner = deltaUsd > 0 ? "EC2" : deltaUsd < 0 ? "Fargate" : "Tie";
  const deltaPct = ec2.monthlyCostUsd > 0 ? (Math.abs(deltaUsd) / ec2.monthlyCostUsd) * 100 : 0;

  return (
    <div className="calc-grid">
      <div className="panel">
        <h3>Shared assumptions</h3>
        <div className="form">
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
          <div className="field field-3">
            <div className="label">Days/month</div>
            <input
              type="number"
              inputMode="decimal"
              value={daysPerMonth}
              min={1}
              max={31}
              step={0.1}
              onChange={(e) => setDaysPerMonth(+e.target.value)}
            />
            <div className="hint">Use 30.4 for an average month.</div>
            <div className="muted" style={{ marginTop: 6, fontSize: 12 }}>
              Monthly hours: {formatNumber(normalizedHoursPerMonth, 0)}
            </div>
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
              <div className="hint">Applies to avg tasks and instances.</div>
            </div>
          ) : null}
          <div className="field field-9 muted" style={{ alignSelf: "end" }}>
            Use average running tasks/instances over the month. If you schedule down environments, reduce hours/day or days/month.
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
            <div className="k">Difference (Fargate - EC2)</div>
            <div className="v">
              {formatCurrency2(deltaUsd)}{" "}
              <span className="muted" style={{ fontSize: 12 }}>
                ({formatPercent(deltaPct, 0)} vs EC2)
              </span>
            </div>
          </div>
        </div>

        {fargatePeak && ec2Peak ? (
          <div style={{ marginTop: 12 }}>
            <div className="muted" style={{ fontSize: 13, marginBottom: 6 }}>Baseline vs peak</div>
            <table className="table">
              <thead>
                <tr>
                  <th>Scenario</th>
                  <th className="num">Fargate total</th>
                  <th className="num">EC2 total</th>
                  <th className="num">Delta</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Baseline</td>
                  <td className="num">{formatCurrency2(fargate.totalCostUsd)}</td>
                  <td className="num">{formatCurrency2(ec2.monthlyCostUsd)}</td>
                  <td className="num">{formatCurrency2(deltaUsd)}</td>
                </tr>
                <tr>
                  <td>Peak</td>
                  <td className="num">{formatCurrency2(fargatePeak.totalCostUsd)}</td>
                  <td className="num">{formatCurrency2(ec2Peak.monthlyCostUsd)}</td>
                  <td className="num">{formatCurrency2(fargatePeak.totalCostUsd - ec2Peak.monthlyCostUsd)}</td>
                </tr>
                <tr>
                  <td>Delta</td>
                  <td className="num">{formatCurrency2(fargatePeak.totalCostUsd - fargate.totalCostUsd)}</td>
                  <td className="num">{formatCurrency2(ec2Peak.monthlyCostUsd - ec2.monthlyCostUsd)}</td>
                  <td className="num">{formatCurrency2((fargatePeak.totalCostUsd - ec2Peak.monthlyCostUsd) - deltaUsd)}</td>
                </tr>
              </tbody>
            </table>
            <div className="muted" style={{ marginTop: 6, fontSize: 12 }}>
              Uses {formatNumber(normalizedDaysPerMonth, 1)} days/month and {formatNumber(hoursPerDay, 0)} hours/day.
            </div>
          </div>
        ) : null}
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
        <h3>Scenario presets</h3>
        <div className="btn-row">
          <button
            className="btn"
            type="button"
            onClick={() => {
              setHoursPerDay(24);
              setDaysPerMonth(30.4);
              setShowPeakScenario(true);
              setPeakMultiplierPct(160);

              setTasks(8);
              setVcpuPerTask(0.5);
              setMemoryGbPerTask(1);
              setPricePerVcpuHourUsd(0.04048);
              setPricePerGbHourUsd(0.004445);

              setInstances(3);
              setPricePerInstanceHourUsd(0.17);
            }}
          >
            Steady web app
          </button>
          <button
            className="btn"
            type="button"
            onClick={() => {
              setHoursPerDay(24);
              setDaysPerMonth(30.4);
              setShowPeakScenario(true);
              setPeakMultiplierPct(240);

              setTasks(14);
              setVcpuPerTask(1);
              setMemoryGbPerTask(2);
              setPricePerVcpuHourUsd(0.04048);
              setPricePerGbHourUsd(0.004445);

              setInstances(6);
              setPricePerInstanceHourUsd(0.2);
            }}
          >
            Spiky API
          </button>
          <button
            className="btn"
            type="button"
            onClick={() => {
              setHoursPerDay(6);
              setDaysPerMonth(22);
              setShowPeakScenario(true);
              setPeakMultiplierPct(200);

              setTasks(10);
              setVcpuPerTask(2);
              setMemoryGbPerTask(4);
              setPricePerVcpuHourUsd(0.04048);
              setPricePerGbHourUsd(0.004445);

              setInstances(4);
              setPricePerInstanceHourUsd(0.24);
            }}
          >
            Batch windows
          </button>
        </div>
      </div>

      <div className="panel">
        <h3>Reset</h3>
        <div className="btn-row">
          <button
            className="btn"
            type="button"
            onClick={() => {
              setHoursPerDay(24);
              setDaysPerMonth(30.4);
              setShowPeakScenario(false);
              setPeakMultiplierPct(180);

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

