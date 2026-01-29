import React, { useMemo } from "react";
import { useBooleanParamState, useNumberParamState } from "./useNumberParamState";
import { estimateEbsSnapshotCost } from "../../lib/calc/ebsSnapshot";
import { formatCurrency2, formatNumber } from "../../lib/format";
import { clamp } from "../../lib/math";

export function AwsEbsSnapshotCostCalculator() {
  const [volumeGb, setVolumeGb] = useNumberParamState("AwsEbsSnapshotCost.volumeGb", 1000);
  const [dailyChangePct, setDailyChangePct] = useNumberParamState("AwsEbsSnapshotCost.dailyChangePct", 2);
  const [retentionDays, setRetentionDays] = useNumberParamState("AwsEbsSnapshotCost.retentionDays", 30);
  const [pricePerGbMonthUsd, setPricePerGbMonthUsd] = useNumberParamState("AwsEbsSnapshotCost.pricePerGbMonthUsd", 0.05);
  const [showPeakScenario, setShowPeakScenario] = useBooleanParamState("AwsEbsSnapshotCost.showPeakScenario", false);
  const [peakMultiplierPct, setPeakMultiplierPct] = useNumberParamState("AwsEbsSnapshotCost.peakMultiplierPct", 180);
  const dailyChangeGb = (volumeGb * dailyChangePct) / 100;
  const retentionMonths = retentionDays / 30.4;

  const result = useMemo(() => {
    return estimateEbsSnapshotCost({
      volumeGb: clamp(volumeGb, 0, 1e12),
      dailyChangePct: clamp(dailyChangePct, 0, 100),
      retentionDays: clamp(retentionDays, 0, 3650),
      pricePerGbMonthUsd: clamp(pricePerGbMonthUsd, 0, 1e6),
    });
  }, [volumeGb, dailyChangePct, retentionDays, pricePerGbMonthUsd]);

  const peakResult = useMemo(() => {
    if (!showPeakScenario) return null;
    const multiplier = clamp(peakMultiplierPct, 100, 1000) / 100;
    const peakDailyChangePct = clamp(dailyChangePct * multiplier, 0, 100);
    return estimateEbsSnapshotCost({
      volumeGb: clamp(volumeGb, 0, 1e12),
      dailyChangePct: peakDailyChangePct,
      retentionDays: clamp(retentionDays, 0, 3650),
      pricePerGbMonthUsd: clamp(pricePerGbMonthUsd, 0, 1e6),
    });
  }, [dailyChangePct, peakMultiplierPct, pricePerGbMonthUsd, retentionDays, showPeakScenario, volumeGb]);

  return (
    <div className="calc-grid">
      <div className="panel">
        <h3>Inputs</h3>
        <div className="form">
          <div className="field field-3">
            <div className="label">Volume size (GB)</div>
            <input
              type="number"
              inputMode="decimal"
              value={volumeGb}
              min={0}
              step={1}
              onChange={(e) => setVolumeGb(+e.target.value)}
            />
            <div className="hint">~{formatNumber(volumeGb / 1024, 2)} TB.</div>
          </div>
          <div className="field field-3">
            <div className="label">Daily change rate (%)</div>
            <input
              type="number"
              inputMode="decimal"
              value={dailyChangePct}
              min={0}
              max={100}
              step={0.1}
              onChange={(e) => setDailyChangePct(+e.target.value)}
            />
            <div className="hint">~{formatNumber(dailyChangeGb, 2)} GB/day of changes.</div>
          </div>
          <div className="field field-3">
            <div className="label">Retention (days)</div>
            <input
              type="number"
              inputMode="numeric"
              value={retentionDays}
              min={0}
              step={1}
              onChange={(e) => setRetentionDays(+e.target.value)}
            />
            <div className="hint">~{formatNumber(retentionMonths, 1)} months of snapshots.</div>
          </div>
          <div className="field field-3">
            <div className="label">Snapshot storage price ($ / GB-month)</div>
            <input
              type="number"
              inputMode="decimal"
              value={pricePerGbMonthUsd}
              min={0}
              step={0.001}
              onChange={(e) => setPricePerGbMonthUsd(+e.target.value)}
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
              <div className="hint">Applies to daily change rate.</div>
            </div>
          ) : null}

          <div className="field field-6">
            <div className="label">Scenario presets</div>
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setVolumeGb(500);
                  setDailyChangePct(1.5);
                  setRetentionDays(30);
                  setPricePerGbMonthUsd(0.05);
                  setShowPeakScenario(true);
                  setPeakMultiplierPct(160);
                }}
              >
                App server
              </button>
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setVolumeGb(2000);
                  setDailyChangePct(3);
                  setRetentionDays(35);
                  setPricePerGbMonthUsd(0.05);
                  setShowPeakScenario(true);
                  setPeakMultiplierPct(220);
                }}
              >
                Core database
              </button>
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setVolumeGb(8000);
                  setDailyChangePct(4);
                  setRetentionDays(45);
                  setPricePerGbMonthUsd(0.05);
                  setShowPeakScenario(true);
                  setPeakMultiplierPct(180);
                }}
              >
                Data platform
              </button>
            </div>
          </div>

          <div className="field field-6">
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setVolumeGb(1000);
                  setDailyChangePct(2);
                  setRetentionDays(30);
                  setPricePerGbMonthUsd(0.05);
                  setShowPeakScenario(false);
                  setPeakMultiplierPct(180);
                }}
              >
                Reset example
              </button>
            </div>
            <div className="muted" style={{ marginTop: 8, fontSize: 12 }}>
              This is a simplified steady-state estimate for planning. Snapshot storage is incremental, but real behavior
              depends on change patterns, deletes, compaction, and service specifics.
            </div>
          </div>
        </div>
      </div>

      <div className="panel">
        <h3>Results</h3>
        <div className="kpis">
          <div className="kpi">
            <div className="k">Estimated snapshot stored volume</div>
            <div className="v">{formatNumber(result.estimatedStoredGb, 0)} GB</div>
          </div>
          <div className="kpi">
            <div className="k">Estimated monthly snapshot storage cost</div>
            <div className="v">{formatCurrency2(result.estimatedMonthlyCostUsd)}</div>
          </div>
        </div>

        {peakResult ? (
          <div style={{ marginTop: 12 }}>
            <div className="muted" style={{ fontSize: 13, marginBottom: 6 }}>Baseline vs peak</div>
            <table className="table">
              <thead>
                <tr>
                  <th>Scenario</th>
                  <th className="num">Daily change</th>
                  <th className="num">Stored GB</th>
                  <th className="num">Monthly cost</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Baseline</td>
                  <td className="num">{formatNumber(clamp(dailyChangePct, 0, 100), 2)}%</td>
                  <td className="num">{formatNumber(result.estimatedStoredGb, 0)}</td>
                  <td className="num">{formatCurrency2(result.estimatedMonthlyCostUsd)}</td>
                </tr>
                <tr>
                  <td>Peak</td>
                  <td className="num">{formatNumber(clamp(dailyChangePct * (clamp(peakMultiplierPct, 100, 1000) / 100), 0, 100), 2)}%</td>
                  <td className="num">{formatNumber(peakResult.estimatedStoredGb, 0)}</td>
                  <td className="num">{formatCurrency2(peakResult.estimatedMonthlyCostUsd)}</td>
                </tr>
                <tr>
                  <td>Delta</td>
                  <td className="num">
                    {formatNumber(
                      clamp(dailyChangePct * (clamp(peakMultiplierPct, 100, 1000) / 100), 0, 100) - clamp(dailyChangePct, 0, 100),
                      2,
                    )}
                    %
                  </td>
                  <td className="num">{formatNumber(peakResult.estimatedStoredGb - result.estimatedStoredGb, 0)}</td>
                  <td className="num">{formatCurrency2(peakResult.estimatedMonthlyCostUsd - result.estimatedMonthlyCostUsd)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </div>
  );
}
