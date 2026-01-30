import React, { useMemo } from "react";
import { useBooleanParamState, useNumberParamState } from "./useNumberParamState";
import { clamp } from "../../lib/math";
import { formatNumber } from "../../lib/format";

type Estimate = {
  baseRequests: number;
  totalRequests: number;
  callsPerUnit: number;
  multiplierPct: number;
};

function estimateKmsRequests({
  unitsPerMonth,
  callsPerUnit,
  retryMultiplierPct,
}: {
  unitsPerMonth: number;
  callsPerUnit: number;
  retryMultiplierPct: number;
}): Estimate {
  const multiplier = clamp(retryMultiplierPct, 50, 1000) / 100;
  const baseRequests = clamp(unitsPerMonth, 0, 1e18) * clamp(callsPerUnit, 0, 1e6);
  const totalRequests = baseRequests * multiplier;

  return {
    baseRequests,
    totalRequests,
    callsPerUnit: clamp(callsPerUnit, 0, 1e6),
    multiplierPct: multiplier * 100,
  };
}

export function AwsKmsRequestEstimator() {
  const [unitsPerMonth, setUnitsPerMonth] = useNumberParamState("AwsKmsReq.unitsPerMonth", 500_000_000);
  const [callsPerUnit, setCallsPerUnit] = useNumberParamState("AwsKmsReq.callsPerUnit", 0.08);
  const [retryMultiplierPct, setRetryMultiplierPct] = useNumberParamState("AwsKmsReq.retryMultiplierPct", 115);
  const [showPeakScenario, setShowPeakScenario] = useBooleanParamState("AwsKmsReq.showPeakScenario", false);
  const [peakMultiplierPct, setPeakMultiplierPct] = useNumberParamState("AwsKmsReq.peakMultiplierPct", 180);

  const baseline = useMemo(
    () =>
      estimateKmsRequests({
        unitsPerMonth,
        callsPerUnit,
        retryMultiplierPct,
      }),
    [callsPerUnit, retryMultiplierPct, unitsPerMonth]
  );

  const peak = useMemo(() => {
    if (!showPeakScenario) return null;
    const peakUnits = clamp(unitsPerMonth, 0, 1e18) * (clamp(peakMultiplierPct, 100, 1000) / 100);
    return estimateKmsRequests({
      unitsPerMonth: peakUnits,
      callsPerUnit,
      retryMultiplierPct,
    });
  }, [callsPerUnit, peakMultiplierPct, retryMultiplierPct, showPeakScenario, unitsPerMonth]);

  return (
    <div className="calc-grid">
      <div className="panel">
        <h3>Inputs</h3>
        <div className="form">
          <div className="field field-3">
            <div className="label">Units (per month)</div>
            <input
              type="number"
              inputMode="numeric"
              value={unitsPerMonth}
              min={0}
              step={1000}
              onChange={(e) => setUnitsPerMonth(+e.target.value)}
            />
            <div className="hint">App requests, object uploads, or secret fetches.</div>
          </div>
          <div className="field field-3">
            <div className="label">KMS calls per unit</div>
            <input
              type="number"
              inputMode="decimal"
              value={callsPerUnit}
              min={0}
              step={0.01}
              onChange={(e) => setCallsPerUnit(+e.target.value)}
            />
            <div className="hint">How many Encrypt/Decrypt/GenerateDataKey calls per unit.</div>
          </div>
          <div className="field field-3">
            <div className="label">Retry multiplier (%)</div>
            <input
              type="number"
              inputMode="decimal"
              value={retryMultiplierPct}
              min={50}
              max={1000}
              step={5}
              onChange={(e) => setRetryMultiplierPct(+e.target.value)}
            />
            <div className="hint">Buffer for retries, timeouts, and bursts.</div>
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
              <div className="hint">Applies to the unit volume only.</div>
            </div>
          ) : null}

          <div className="field field-6">
            <div className="label">Scenario presets</div>
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setUnitsPerMonth(120_000_000);
                  setCallsPerUnit(0.03);
                  setRetryMultiplierPct(110);
                  setShowPeakScenario(true);
                  setPeakMultiplierPct(160);
                }}
              >
                SaaS API
              </button>
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setUnitsPerMonth(900_000_000);
                  setCallsPerUnit(0.12);
                  setRetryMultiplierPct(120);
                  setShowPeakScenario(true);
                  setPeakMultiplierPct(220);
                }}
              >
                Event processing
              </button>
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setUnitsPerMonth(3_000_000_000);
                  setCallsPerUnit(0.2);
                  setRetryMultiplierPct(130);
                  setShowPeakScenario(true);
                  setPeakMultiplierPct(180);
                }}
              >
                High-volume crypto
              </button>
            </div>
          </div>

          <div className="field field-6">
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setUnitsPerMonth(500_000_000);
                  setCallsPerUnit(0.08);
                  setRetryMultiplierPct(115);
                  setShowPeakScenario(false);
                  setPeakMultiplierPct(180);
                }}
              >
                Reset example
              </button>
            </div>
            <div className="muted" style={{ marginTop: 8, fontSize: 12 }}>
              Use the total requests in the AWS KMS cost calculator.
            </div>
          </div>
        </div>
      </div>

      <div className="panel">
        <h3>Results</h3>
        <div className="kpis">
          <div className="kpi">
            <div className="k">Baseline KMS requests</div>
            <div className="v">{formatNumber(baseline.baseRequests, 0)}</div>
          </div>
          <div className="kpi">
            <div className="k">Total requests (with multiplier)</div>
            <div className="v">{formatNumber(baseline.totalRequests, 0)}</div>
          </div>
          <div className="kpi">
            <div className="k">Calls per unit</div>
            <div className="v">{formatNumber(baseline.callsPerUnit, 2)}</div>
          </div>
          <div className="kpi">
            <div className="k">Applied multiplier</div>
            <div className="v">{formatNumber(baseline.multiplierPct, 0)}%</div>
          </div>
        </div>

        {peak ? (
          <div style={{ marginTop: 12 }}>
            <div className="muted" style={{ fontSize: 13, marginBottom: 6 }}>Baseline vs peak</div>
            <table className="table">
              <thead>
                <tr>
                  <th>Scenario</th>
                  <th className="num">Requests</th>
                  <th className="num">Calls/unit</th>
                  <th className="num">Multiplier</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Baseline</td>
                  <td className="num">{formatNumber(baseline.totalRequests, 0)}</td>
                  <td className="num">{formatNumber(baseline.callsPerUnit, 2)}</td>
                  <td className="num">{formatNumber(baseline.multiplierPct, 0)}%</td>
                </tr>
                <tr>
                  <td>Peak</td>
                  <td className="num">{formatNumber(peak.totalRequests, 0)}</td>
                  <td className="num">{formatNumber(peak.callsPerUnit, 2)}</td>
                  <td className="num">{formatNumber(peak.multiplierPct, 0)}%</td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </div>
  );
}
