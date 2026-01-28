import React, { useMemo } from "react";
import { useBooleanParamState, useNumberParamState } from "./useNumberParamState";
import { estimateLambdaCost } from "../../lib/calc/lambda";
import { formatCurrency2, formatNumber } from "../../lib/format";
import { clamp } from "../../lib/math";

export function AwsLambdaCostCalculator() {
  const [invocationsPerMonth, setInvocationsPerMonth] = useNumberParamState("AwsLambdaCost.invocationsPerMonth", 50_000_000);
  const [avgDurationMs, setAvgDurationMs] = useNumberParamState("AwsLambdaCost.avgDurationMs", 120);
  const [memoryMb, setMemoryMb] = useNumberParamState("AwsLambdaCost.memoryMb", 512);
  const [pricePerMillionRequestsUsd, setPricePerMillionRequestsUsd] = useNumberParamState("AwsLambdaCost.pricePerMillionRequestsUsd", 0.2);
  const [pricePerGbSecondUsd, setPricePerGbSecondUsd] = useNumberParamState("AwsLambdaCost.pricePerGbSecondUsd", 0.0000166667);
  const [includeFreeTier, setIncludeFreeTier] = useBooleanParamState("AwsLambdaCost.includeFreeTier", true);
  const [showPeakScenario, setShowPeakScenario] = useBooleanParamState("AwsLambdaCost.showPeakScenario", false);
  const [peakMultiplierPct, setPeakMultiplierPct] = useNumberParamState("AwsLambdaCost.peakMultiplierPct", 180);

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

  const peakResult = useMemo(() => {
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
              <div className="hint">Applies to invocation volume only.</div>
            </div>
          ) : null}

          <div className="field field-6">
            <div className="label">Scenario presets</div>
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setInvocationsPerMonth(12_000_000);
                  setAvgDurationMs(90);
                  setMemoryMb(256);
                  setPricePerMillionRequestsUsd(0.2);
                  setPricePerGbSecondUsd(0.0000166667);
                  setIncludeFreeTier(true);
                  setShowPeakScenario(true);
                  setPeakMultiplierPct(160);
                }}
              >
                Startup API
              </button>
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setInvocationsPerMonth(120_000_000);
                  setAvgDurationMs(150);
                  setMemoryMb(512);
                  setPricePerMillionRequestsUsd(0.2);
                  setPricePerGbSecondUsd(0.0000166667);
                  setIncludeFreeTier(true);
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
                  setInvocationsPerMonth(900_000_000);
                  setAvgDurationMs(240);
                  setMemoryMb(1024);
                  setPricePerMillionRequestsUsd(0.2);
                  setPricePerGbSecondUsd(0.0000166667);
                  setIncludeFreeTier(false);
                  setShowPeakScenario(true);
                  setPeakMultiplierPct(180);
                }}
              >
                Event burst
              </button>
            </div>
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

        {peakResult ? (
          <div style={{ marginTop: 12 }}>
            <div className="muted" style={{ fontSize: 13, marginBottom: 6 }}>Baseline vs peak</div>
            <table className="table">
              <thead>
                <tr>
                  <th>Scenario</th>
                  <th className="num">Invocations</th>
                  <th className="num">Billable GB-sec</th>
                  <th className="num">Total cost</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Baseline</td>
                  <td className="num">{formatNumber(result.billableInvocations, 0)}</td>
                  <td className="num">{formatNumber(result.billableGbSeconds, 0)}</td>
                  <td className="num">{formatCurrency2(result.totalCostUsd)}</td>
                </tr>
                <tr>
                  <td>Peak</td>
                  <td className="num">{formatNumber(peakResult.billableInvocations, 0)}</td>
                  <td className="num">{formatNumber(peakResult.billableGbSeconds, 0)}</td>
                  <td className="num">{formatCurrency2(peakResult.totalCostUsd)}</td>
                </tr>
                <tr>
                  <td>Delta</td>
                  <td className="num">{formatNumber(peakResult.billableInvocations - result.billableInvocations, 0)}</td>
                  <td className="num">{formatNumber(peakResult.billableGbSeconds - result.billableGbSeconds, 0)}</td>
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
