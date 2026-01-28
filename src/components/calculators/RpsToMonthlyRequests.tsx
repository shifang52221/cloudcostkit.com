import React, { useMemo } from "react";
import { useBooleanParamState, useNumberParamState } from "./useNumberParamState";
import { estimateMonthlyRequestsFromRps } from "../../lib/calc/rps";
import { formatNumber, formatPercent } from "../../lib/format";
import { clamp } from "../../lib/math";

export function RpsToMonthlyRequestsCalculator() {
  const [rps, setRps] = useNumberParamState("RpsToMonthlyRequests.rps", 2500);
  const [utilizationPct, setUtilizationPct] = useNumberParamState("RpsToMonthlyRequests.utilizationPct", 35);
  const [hoursPerDay, setHoursPerDay] = useNumberParamState("RpsToMonthlyRequests.hoursPerDay", 24);
  const [daysPerMonth, setDaysPerMonth] = useNumberParamState("RpsToMonthlyRequests.daysPerMonth", 30.4);
  const [showPeakScenario, setShowPeakScenario] = useBooleanParamState("RpsToMonthlyRequests.showPeakScenario", false);
  const [peakMultiplierPct, setPeakMultiplierPct] = useNumberParamState("RpsToMonthlyRequests.peakMultiplierPct", 200);

  const result = useMemo(() => {
    return estimateMonthlyRequestsFromRps({
      rps: clamp(rps, 0, 1e12),
      utilizationPct: clamp(utilizationPct, 0, 100),
      hoursPerDay: clamp(hoursPerDay, 0, 24),
      daysPerMonth: clamp(daysPerMonth, 1, 31),
    });
  }, [rps, utilizationPct, hoursPerDay, daysPerMonth]);

  const peakResult = useMemo(() => {
    if (!showPeakScenario) return null;
    const multiplier = clamp(peakMultiplierPct, 100, 1000) / 100;
    return estimateMonthlyRequestsFromRps({
      rps: clamp(rps, 0, 1e12) * multiplier,
      utilizationPct: clamp(utilizationPct, 0, 100),
      hoursPerDay: clamp(hoursPerDay, 0, 24),
      daysPerMonth: clamp(daysPerMonth, 1, 31),
    });
  }, [daysPerMonth, hoursPerDay, peakMultiplierPct, rps, showPeakScenario, utilizationPct]);

  return (
    <div className="calc-grid">
      <div className="panel">
        <h3>Inputs</h3>
        <div className="form">
          <div className="field field-3">
            <div className="label">Requests per second (RPS)</div>
            <input
              type="number"
              inputMode="decimal"
              value={rps}
              min={0}
              step={1}
              onChange={(e) => setRps(+e.target.value)}
            />
          </div>
          <div className="field field-3">
            <div className="label">Utilization (%)</div>
            <input
              type="number"
              inputMode="numeric"
              value={utilizationPct}
              min={0}
              max={100}
              step={1}
              onChange={(e) => setUtilizationPct(+e.target.value)}
            />
            <div className="hint">Use this to model peak vs average traffic.</div>
          </div>
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
              <div className="hint">Applies to RPS.</div>
            </div>
          ) : null}

          <div className="field field-6">
            <div className="label">Scenario presets</div>
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setRps(400);
                  setUtilizationPct(20);
                  setHoursPerDay(24);
                  setDaysPerMonth(30.4);
                  setShowPeakScenario(true);
                  setPeakMultiplierPct(180);
                }}
              >
                Low traffic
              </button>
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setRps(2500);
                  setUtilizationPct(35);
                  setHoursPerDay(24);
                  setDaysPerMonth(30.4);
                  setShowPeakScenario(true);
                  setPeakMultiplierPct(230);
                }}
              >
                SaaS baseline
              </button>
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setRps(12000);
                  setUtilizationPct(45);
                  setHoursPerDay(24);
                  setDaysPerMonth(30.4);
                  setShowPeakScenario(true);
                  setPeakMultiplierPct(200);
                }}
              >
                Event spike
              </button>
            </div>
          </div>

          <div className="field field-6">
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setRps(2500);
                  setUtilizationPct(35);
                  setHoursPerDay(24);
                  setDaysPerMonth(30.4);
                  setShowPeakScenario(false);
                  setPeakMultiplierPct(200);
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
            <div className="k">Monthly requests (est.)</div>
            <div className="v">{formatNumber(result.requestsPerMonth, 0)}</div>
          </div>
          <div className="kpi">
            <div className="k">Assumptions</div>
            <div className="v">
              {formatNumber(result.rps, 0)} RPS x {formatPercent(result.utilizationPct, 0)} x {formatNumber(result.hoursPerDay, 0)} h/day x {formatNumber(result.daysPerMonth, 1)} days
            </div>
          </div>
        </div>

        {peakResult ? (
          <div style={{ marginTop: 12 }}>
            <div className="muted" style={{ fontSize: 13, marginBottom: 6 }}>Baseline vs peak</div>
            <table className="table">
              <thead>
                <tr>
                  <th>Scenario</th>
                  <th className="num">RPS</th>
                  <th className="num">Monthly requests</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Baseline</td>
                  <td className="num">{formatNumber(result.rps, 0)}</td>
                  <td className="num">{formatNumber(result.requestsPerMonth, 0)}</td>
                </tr>
                <tr>
                  <td>Peak</td>
                  <td className="num">{formatNumber(peakResult.rps, 0)}</td>
                  <td className="num">{formatNumber(peakResult.requestsPerMonth, 0)}</td>
                </tr>
                <tr>
                  <td>Delta</td>
                  <td className="num">{formatNumber(peakResult.rps - result.rps, 0)}</td>
                  <td className="num">{formatNumber(peakResult.requestsPerMonth - result.requestsPerMonth, 0)}</td>
                </tr>
              </tbody>
            </table>
            <div className="muted" style={{ marginTop: 6, fontSize: 12 }}>
              Uses {formatNumber(result.daysPerMonth, 1)} days/month and {formatNumber(result.hoursPerDay, 0)} hours/day.
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}


