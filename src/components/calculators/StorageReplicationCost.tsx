import React, { useMemo, useState } from "react";
import { useBooleanParamState, useNumberParamState } from "./useNumberParamState";
import { estimateReplicationCost } from "../../lib/calc/replication";
import { formatCurrency2, formatNumber } from "../../lib/format";
import { clamp } from "../../lib/math";

export function StorageReplicationCostCalculator() {
  const [replicatedGbPerMonth, setReplicatedGbPerMonth] = useNumberParamState("StorageReplicationCost.replicatedGbPerMonth", 2500);
  const [pricePerGbUsd, setPricePerGbUsd] = useNumberParamState("StorageReplicationCost.pricePerGbUsd", 0.02);
  const [showPeakScenario, setShowPeakScenario] = useBooleanParamState("StorageReplicationCost.showPeakScenario", false);
  const [peakMultiplierPct, setPeakMultiplierPct] = useNumberParamState("StorageReplicationCost.peakMultiplierPct", 180);
  const [writeGbPerDay, setWriteGbPerDay] = useState(80);
  const [eventsPerDay, setEventsPerDay] = useState(1_500_000);
  const [avgPayloadKb, setAvgPayloadKb] = useState(64);
  const gbPerDay = replicatedGbPerMonth / 30.4;
  const avgMbps = (replicatedGbPerMonth * 8000) / (30.4 * 24 * 3600);
  const estimatedReplicatedGbPerMonth = clamp(writeGbPerDay, 0, 1e12) * 30.4;
  const estimatedWriteGbPerDayFromEvents = (clamp(eventsPerDay, 0, 1e12) * clamp(avgPayloadKb, 0, 1e6)) / (1024 * 1024);

  const result = useMemo(() => {
    return estimateReplicationCost({
      replicatedGbPerMonth: clamp(replicatedGbPerMonth, 0, 1e12),
      pricePerGbUsd: clamp(pricePerGbUsd, 0, 1e6),
    });
  }, [replicatedGbPerMonth, pricePerGbUsd]);

  const peakResult = useMemo(() => {
    if (!showPeakScenario) return null;
    const multiplier = clamp(peakMultiplierPct, 100, 1000) / 100;
    return estimateReplicationCost({
      replicatedGbPerMonth: clamp(replicatedGbPerMonth, 0, 1e12) * multiplier,
      pricePerGbUsd: clamp(pricePerGbUsd, 0, 1e6),
    });
  }, [peakMultiplierPct, pricePerGbUsd, replicatedGbPerMonth, showPeakScenario]);

  return (
    <div className="calc-grid">
      <div className="panel">
        <h3>Inputs</h3>
        <div className="form">
          <div className="field field-3">
            <div className="label">Replicated data (GB / month)</div>
            <input
              type="number"
              inputMode="decimal"
              value={replicatedGbPerMonth}
              min={0}
              onChange={(e) => setReplicatedGbPerMonth(+e.target.value)}
            />
            <div className="hint">
              ~{formatNumber(gbPerDay, 2)} GB/day, {formatNumber(avgMbps, 2)} Mbps.
            </div>
          </div>
          <div className="field field-3">
            <div className="label">Changed data (GB / day)</div>
            <input
              type="number"
              inputMode="decimal"
              value={writeGbPerDay}
              min={0}
              step={0.1}
              onChange={(e) => setWriteGbPerDay(+e.target.value)}
            />
          </div>
          <div className="field field-3">
            <div className="label">Events (per day)</div>
            <input
              type="number"
              inputMode="numeric"
              value={eventsPerDay}
              min={0}
              step={1000}
              onChange={(e) => setEventsPerDay(+e.target.value)}
            />
          </div>
          <div className="field field-3">
            <div className="label">Avg payload (KB)</div>
            <input
              type="number"
              inputMode="decimal"
              value={avgPayloadKb}
              min={0}
              step={1}
              onChange={(e) => setAvgPayloadKb(+e.target.value)}
            />
          </div>
          <div className="field field-3" style={{ alignSelf: "end" }}>
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => setWriteGbPerDay(Math.round(estimatedWriteGbPerDayFromEvents * 100) / 100)}
              >
                Use estimate
              </button>
            </div>
            <div className="hint">Est {formatNumber(estimatedWriteGbPerDayFromEvents, 2)} GB/day.</div>
          </div>
          <div className="field field-3" style={{ alignSelf: "end" }}>
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => setReplicatedGbPerMonth(Math.round(estimatedReplicatedGbPerMonth))}
              >
                Use estimate
              </button>
            </div>
            <div className="hint">Est {formatNumber(estimatedReplicatedGbPerMonth, 0)} GB/month.</div>
          </div>
          <div className="field field-3">
            <div className="label">Price ($ / GB)</div>
            <input
              type="number"
              inputMode="decimal"
              value={pricePerGbUsd}
              min={0}
              step={0.001}
              onChange={(e) => setPricePerGbUsd(+e.target.value)}
            />
            <div className="hint">Replication can be priced as cross-region transfer or as a feature fee.</div>
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
              <div className="hint">Applies to replicated volume only.</div>
            </div>
          ) : null}

          <div className="field field-6">
            <div className="label">Scenario presets</div>
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setReplicatedGbPerMonth(800);
                  setPricePerGbUsd(0.02);
                  setShowPeakScenario(true);
                  setPeakMultiplierPct(160);
                }}
              >
                Small prod
              </button>
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setReplicatedGbPerMonth(6000);
                  setPricePerGbUsd(0.02);
                  setShowPeakScenario(true);
                  setPeakMultiplierPct(220);
                }}
              >
                Multi-region
              </button>
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setReplicatedGbPerMonth(25_000);
                  setPricePerGbUsd(0.02);
                  setShowPeakScenario(true);
                  setPeakMultiplierPct(180);
                }}
              >
                High churn
              </button>
            </div>
          </div>

          <div className="field field-6">
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setReplicatedGbPerMonth(2500);
                  setPricePerGbUsd(0.02);
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
            <div className="k">Estimated monthly replication cost</div>
            <div className="v">{formatCurrency2(result.monthlyCostUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">Replicated volume</div>
            <div className="v">{formatNumber(result.replicatedGbPerMonth, 0)} GB</div>
          </div>
        </div>

        {peakResult ? (
          <div style={{ marginTop: 12 }}>
            <div className="muted" style={{ fontSize: 13, marginBottom: 6 }}>Baseline vs peak</div>
            <table className="table">
              <thead>
                <tr>
                  <th>Scenario</th>
                  <th className="num">Replicated GB</th>
                  <th className="num">Monthly cost</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Baseline</td>
                  <td className="num">{formatNumber(result.replicatedGbPerMonth, 0)}</td>
                  <td className="num">{formatCurrency2(result.monthlyCostUsd)}</td>
                </tr>
                <tr>
                  <td>Peak</td>
                  <td className="num">{formatNumber(peakResult.replicatedGbPerMonth, 0)}</td>
                  <td className="num">{formatCurrency2(peakResult.monthlyCostUsd)}</td>
                </tr>
                <tr>
                  <td>Delta</td>
                  <td className="num">{formatNumber(peakResult.replicatedGbPerMonth - result.replicatedGbPerMonth, 0)}</td>
                  <td className="num">{formatCurrency2(peakResult.monthlyCostUsd - result.monthlyCostUsd)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </div>
  );
}
