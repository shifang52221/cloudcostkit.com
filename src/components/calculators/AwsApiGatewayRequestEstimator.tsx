import React, { useMemo } from "react";
import { useBooleanParamState, useNumberParamState } from "./useNumberParamState";
import { clamp } from "../../lib/math";
import { formatNumber } from "../../lib/format";

type Estimate = {
  baselineRequests: number;
  peakRequests: number;
  totalRequests: number;
  averageRps: number;
  multiplierPct: number;
};

function estimateRequests({
  baselineRps,
  baselineHoursPerDay,
  daysPerMonth,
  peakRps,
  peakHoursPerMonth,
  requestMultiplierPct,
}: {
  baselineRps: number;
  baselineHoursPerDay: number;
  daysPerMonth: number;
  peakRps: number;
  peakHoursPerMonth: number;
  requestMultiplierPct: number;
}): Estimate {
  const hoursPerMonth = clamp(daysPerMonth, 0, 31) * clamp(baselineHoursPerDay, 0, 24);
  const peakHours = clamp(peakHoursPerMonth, 0, hoursPerMonth);
  const baselineHours = Math.max(0, hoursPerMonth - peakHours);
  const multiplier = clamp(requestMultiplierPct, 50, 1000) / 100;

  const baselineRequests = clamp(baselineRps, 0, 1e9) * baselineHours * 3600;
  const peakRequests = clamp(peakRps, 0, 1e9) * peakHours * 3600;
  const totalRequests = (baselineRequests + peakRequests) * multiplier;
  const averageRps = hoursPerMonth > 0 ? totalRequests / (hoursPerMonth * 3600) : 0;

  return {
    baselineRequests,
    peakRequests,
    totalRequests,
    averageRps,
    multiplierPct: multiplier * 100,
  };
}

export function AwsApiGatewayRequestEstimator() {
  const [baselineRps, setBaselineRps] = useNumberParamState("AwsApiGatewayReq.baselineRps", 250);
  const [baselineHoursPerDay, setBaselineHoursPerDay] = useNumberParamState("AwsApiGatewayReq.baselineHoursPerDay", 24);
  const [daysPerMonth, setDaysPerMonth] = useNumberParamState("AwsApiGatewayReq.daysPerMonth", 30.4);
  const [peakRps, setPeakRps] = useNumberParamState("AwsApiGatewayReq.peakRps", 1500);
  const [peakHoursPerMonth, setPeakHoursPerMonth] = useNumberParamState("AwsApiGatewayReq.peakHoursPerMonth", 12);
  const [requestMultiplierPct, setRequestMultiplierPct] = useNumberParamState("AwsApiGatewayReq.requestMultiplierPct", 115);
  const [showPeakWindow, setShowPeakWindow] = useBooleanParamState("AwsApiGatewayReq.showPeakWindow", true);

  const result = useMemo(
    () =>
      estimateRequests({
        baselineRps,
        baselineHoursPerDay,
        daysPerMonth,
        peakRps: showPeakWindow ? peakRps : 0,
        peakHoursPerMonth: showPeakWindow ? peakHoursPerMonth : 0,
        requestMultiplierPct,
      }),
    [
      baselineHoursPerDay,
      baselineRps,
      daysPerMonth,
      peakHoursPerMonth,
      peakRps,
      requestMultiplierPct,
      showPeakWindow,
    ]
  );

  return (
    <div className="calc-grid">
      <div className="panel">
        <h3>Inputs</h3>
        <div className="form">
          <div className="field field-3">
            <div className="label">Baseline RPS (avg)</div>
            <input
              type="number"
              inputMode="decimal"
              value={baselineRps}
              min={0}
              step={10}
              onChange={(e) => setBaselineRps(+e.target.value)}
            />
            <div className="hint">Average requests per second for normal traffic.</div>
          </div>
          <div className="field field-3">
            <div className="label">Baseline hours per day</div>
            <input
              type="number"
              inputMode="decimal"
              value={baselineHoursPerDay}
              min={0}
              max={24}
              step={1}
              onChange={(e) => setBaselineHoursPerDay(+e.target.value)}
            />
            <div className="hint">Use 24 for always-on traffic.</div>
          </div>
          <div className="field field-3">
            <div className="label">Days per month</div>
            <input
              type="number"
              inputMode="decimal"
              value={daysPerMonth}
              min={0}
              max={31}
              step={0.1}
              onChange={(e) => setDaysPerMonth(+e.target.value)}
            />
          </div>
          <div className="field field-3">
            <div className="label">Request multiplier (%)</div>
            <input
              type="number"
              inputMode="decimal"
              value={requestMultiplierPct}
              min={50}
              max={1000}
              step={5}
              onChange={(e) => setRequestMultiplierPct(+e.target.value)}
            />
            <div className="hint">Buffer for retries, timeouts, and bots.</div>
          </div>

          <div className="field field-3" style={{ alignSelf: "end" }}>
            <label className="muted" style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <input type="checkbox" checked={showPeakWindow} onChange={(e) => setShowPeakWindow(e.target.checked)} />
              Include peak window
            </label>
          </div>

          {showPeakWindow ? (
            <>
              <div className="field field-3">
                <div className="label">Peak RPS (avg)</div>
                <input
                  type="number"
                  inputMode="decimal"
                  value={peakRps}
                  min={0}
                  step={25}
                  onChange={(e) => setPeakRps(+e.target.value)}
                />
                <div className="hint">Higher traffic during launches or spikes.</div>
              </div>
              <div className="field field-3">
                <div className="label">Peak hours (per month)</div>
                <input
                  type="number"
                  inputMode="decimal"
                  value={peakHoursPerMonth}
                  min={0}
                  step={1}
                  onChange={(e) => setPeakHoursPerMonth(+e.target.value)}
                />
                <div className="hint">Total hours of higher traffic each month.</div>
              </div>
            </>
          ) : null}

          <div className="field field-6">
            <div className="label">Scenario presets</div>
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setBaselineRps(180);
                  setBaselineHoursPerDay(24);
                  setDaysPerMonth(30.4);
                  setRequestMultiplierPct(110);
                  setShowPeakWindow(true);
                  setPeakRps(800);
                  setPeakHoursPerMonth(10);
                }}
              >
                Steady SaaS
              </button>
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setBaselineRps(900);
                  setBaselineHoursPerDay(24);
                  setDaysPerMonth(30.4);
                  setRequestMultiplierPct(120);
                  setShowPeakWindow(true);
                  setPeakRps(3200);
                  setPeakHoursPerMonth(30);
                }}
              >
                Mobile + bursts
              </button>
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setBaselineRps(60);
                  setBaselineHoursPerDay(16);
                  setDaysPerMonth(30.4);
                  setRequestMultiplierPct(130);
                  setShowPeakWindow(true);
                  setPeakRps(2000);
                  setPeakHoursPerMonth(8);
                }}
              >
                Batch spikes
              </button>
            </div>
          </div>

          <div className="field field-6">
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setBaselineRps(250);
                  setBaselineHoursPerDay(24);
                  setDaysPerMonth(30.4);
                  setRequestMultiplierPct(115);
                  setShowPeakWindow(true);
                  setPeakRps(1500);
                  setPeakHoursPerMonth(12);
                }}
              >
                Reset example
              </button>
            </div>
            <div className="muted" style={{ marginTop: 8, fontSize: 12 }}>
              Use the total requests in the AWS API Gateway cost calculator.
            </div>
          </div>
        </div>
      </div>

      <div className="panel">
        <h3>Results</h3>
        <div className="kpis">
          <div className="kpi">
            <div className="k">Baseline requests</div>
            <div className="v">{formatNumber(result.baselineRequests, 0)}</div>
          </div>
          <div className="kpi">
            <div className="k">Peak requests</div>
            <div className="v">{formatNumber(result.peakRequests, 0)}</div>
          </div>
          <div className="kpi">
            <div className="k">Total requests</div>
            <div className="v">{formatNumber(result.totalRequests, 0)}</div>
          </div>
          <div className="kpi">
            <div className="k">Average RPS</div>
            <div className="v">{formatNumber(result.averageRps, 2)}</div>
          </div>
          <div className="kpi">
            <div className="k">Applied multiplier</div>
            <div className="v">{formatNumber(result.multiplierPct, 0)}%</div>
          </div>
        </div>
      </div>
    </div>
  );
}
