import React, { useMemo } from "react";
import { useBooleanParamState, useNumberParamState } from "./useNumberParamState";
import { estimateFargateCost } from "../../lib/calc/fargate";
import { formatCurrency2, formatNumber } from "../../lib/format";
import { clamp } from "../../lib/math";

export function AwsFargateCostCalculator() {
  const [tasks, setTasks] = useNumberParamState("AwsFargateCost.tasks", 3);
  const [vcpuPerTask, setVcpuPerTask] = useNumberParamState("AwsFargateCost.vcpuPerTask", 0.5);
  const [memoryGbPerTask, setMemoryGbPerTask] = useNumberParamState("AwsFargateCost.memoryGbPerTask", 1);
  const [hoursPerMonth, setHoursPerMonth] = useNumberParamState("AwsFargateCost.hoursPerMonth", 730);
  const [pricePerVcpuHourUsd, setPricePerVcpuHourUsd] = useNumberParamState("AwsFargateCost.pricePerVcpuHourUsd", 0.04048);
  const [pricePerGbHourUsd, setPricePerGbHourUsd] = useNumberParamState("AwsFargateCost.pricePerGbHourUsd", 0.004445);
  const [showPeakScenario, setShowPeakScenario] = useBooleanParamState("AwsFargateCost.showPeakScenario", false);
  const [peakMultiplierPct, setPeakMultiplierPct] = useNumberParamState("AwsFargateCost.peakMultiplierPct", 180);

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

  const peakResult = useMemo(() => {
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
              <div className="hint">Applies to average running tasks.</div>
            </div>
          ) : null}

          <div className="field field-6">
            <div className="label">Scenario presets</div>
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setTasks(2);
                  setVcpuPerTask(0.5);
                  setMemoryGbPerTask(1);
                  setHoursPerMonth(730);
                  setPricePerVcpuHourUsd(0.04048);
                  setPricePerGbHourUsd(0.004445);
                  setShowPeakScenario(true);
                  setPeakMultiplierPct(160);
                }}
              >
                Startup app
              </button>
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setTasks(10);
                  setVcpuPerTask(1);
                  setMemoryGbPerTask(2);
                  setHoursPerMonth(730);
                  setPricePerVcpuHourUsd(0.04048);
                  setPricePerGbHourUsd(0.004445);
                  setShowPeakScenario(true);
                  setPeakMultiplierPct(220);
                }}
              >
                SaaS scale
              </button>
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setTasks(25);
                  setVcpuPerTask(2);
                  setMemoryGbPerTask(4);
                  setHoursPerMonth(730);
                  setPricePerVcpuHourUsd(0.04048);
                  setPricePerGbHourUsd(0.004445);
                  setShowPeakScenario(true);
                  setPeakMultiplierPct(180);
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
                  setTasks(3);
                  setVcpuPerTask(0.5);
                  setMemoryGbPerTask(1);
                  setHoursPerMonth(730);
                  setPricePerVcpuHourUsd(0.04048);
                  setPricePerGbHourUsd(0.004445);
                  setShowPeakScenario(false);
                  setPeakMultiplierPct(180);
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

        {peakResult ? (
          <div style={{ marginTop: 12 }}>
            <div className="muted" style={{ fontSize: 13, marginBottom: 6 }}>Baseline vs peak</div>
            <table className="table">
              <thead>
                <tr>
                  <th>Scenario</th>
                  <th className="num">Tasks (avg)</th>
                  <th className="num">Total cost</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Baseline</td>
                  <td className="num">{formatNumber(tasks, 2)}</td>
                  <td className="num">{formatCurrency2(result.totalCostUsd)}</td>
                </tr>
                <tr>
                  <td>Peak</td>
                  <td className="num">{formatNumber(tasks * (clamp(peakMultiplierPct, 100, 1000) / 100), 2)}</td>
                  <td className="num">{formatCurrency2(peakResult.totalCostUsd)}</td>
                </tr>
                <tr>
                  <td>Delta</td>
                  <td className="num">{formatNumber((tasks * (clamp(peakMultiplierPct, 100, 1000) / 100)) - tasks, 2)}</td>
                  <td className="num">{formatCurrency2(peakResult.totalCostUsd - result.totalCostUsd)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </div>
  );
}
