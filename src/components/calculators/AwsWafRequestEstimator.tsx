import React, { useMemo } from "react";
import { useNumberParamState } from "./useNumberParamState";
import { clamp } from "../../lib/math";
import { formatNumber } from "../../lib/format";

type Estimate = {
  baselineRequests: number;
  attackRequests: number;
  totalRequests: number;
  effectiveMultiplierPct: number;
};

function estimateRequests({
  baselineRps,
  baselineHoursPerDay,
  daysPerMonth,
  attackRps,
  attackHoursPerMonth,
  requestMultiplierPct,
}: {
  baselineRps: number;
  baselineHoursPerDay: number;
  daysPerMonth: number;
  attackRps: number;
  attackHoursPerMonth: number;
  requestMultiplierPct: number;
}): Estimate {
  const hoursPerMonth = clamp(daysPerMonth, 0, 31) * clamp(baselineHoursPerDay, 0, 24);
  const attackHours = clamp(attackHoursPerMonth, 0, hoursPerMonth);
  const baselineHours = Math.max(0, hoursPerMonth - attackHours);
  const multiplier = clamp(requestMultiplierPct, 50, 1000) / 100;

  const baselineRequests = clamp(baselineRps, 0, 1e9) * baselineHours * 3600;
  const attackRequests = clamp(attackRps, 0, 1e9) * attackHours * 3600;
  const totalRequests = (baselineRequests + attackRequests) * multiplier;

  return {
    baselineRequests,
    attackRequests,
    totalRequests,
    effectiveMultiplierPct: multiplier * 100,
  };
}

export function AwsWafRequestEstimator() {
  const [baselineRps, setBaselineRps] = useNumberParamState("AwsWafReq.baselineRps", 1200);
  const [baselineHoursPerDay, setBaselineHoursPerDay] = useNumberParamState("AwsWafReq.baselineHoursPerDay", 24);
  const [daysPerMonth, setDaysPerMonth] = useNumberParamState("AwsWafReq.daysPerMonth", 30.4);
  const [attackRps, setAttackRps] = useNumberParamState("AwsWafReq.attackRps", 12000);
  const [attackHoursPerMonth, setAttackHoursPerMonth] = useNumberParamState("AwsWafReq.attackHoursPerMonth", 20);
  const [requestMultiplierPct, setRequestMultiplierPct] = useNumberParamState("AwsWafReq.requestMultiplierPct", 110);

  const result = useMemo(
    () =>
      estimateRequests({
        baselineRps,
        baselineHoursPerDay,
        daysPerMonth,
        attackRps,
        attackHoursPerMonth,
        requestMultiplierPct,
      }),
    [attackHoursPerMonth, attackRps, baselineHoursPerDay, baselineRps, daysPerMonth, requestMultiplierPct]
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
            <div className="hint">Average evaluated requests per second.</div>
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
            <div className="label">Attack RPS (avg)</div>
            <input
              type="number"
              inputMode="decimal"
              value={attackRps}
              min={0}
              step={50}
              onChange={(e) => setAttackRps(+e.target.value)}
            />
            <div className="hint">Extra load during bot or attack windows.</div>
          </div>
          <div className="field field-3">
            <div className="label">Attack hours (per month)</div>
            <input
              type="number"
              inputMode="decimal"
              value={attackHoursPerMonth}
              min={0}
              step={1}
              onChange={(e) => setAttackHoursPerMonth(+e.target.value)}
            />
            <div className="hint">Total hours of spikes this month.</div>
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
            <div className="hint">Buffer for retries, bots, and blocked traffic.</div>
          </div>

          <div className="field field-6">
            <div className="label">Scenario presets</div>
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setBaselineRps(400);
                  setBaselineHoursPerDay(24);
                  setDaysPerMonth(30.4);
                  setAttackRps(4000);
                  setAttackHoursPerMonth(10);
                  setRequestMultiplierPct(105);
                }}
              >
                Startup app
              </button>
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setBaselineRps(2200);
                  setBaselineHoursPerDay(24);
                  setDaysPerMonth(30.4);
                  setAttackRps(18000);
                  setAttackHoursPerMonth(24);
                  setRequestMultiplierPct(115);
                }}
              >
                SaaS traffic
              </button>
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setBaselineRps(6000);
                  setBaselineHoursPerDay(24);
                  setDaysPerMonth(30.4);
                  setAttackRps(60000);
                  setAttackHoursPerMonth(60);
                  setRequestMultiplierPct(125);
                }}
              >
                High-traffic + attacks
              </button>
            </div>
          </div>

          <div className="field field-6">
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setBaselineRps(1200);
                  setBaselineHoursPerDay(24);
                  setDaysPerMonth(30.4);
                  setAttackRps(12000);
                  setAttackHoursPerMonth(20);
                  setRequestMultiplierPct(110);
                }}
              >
                Reset example
              </button>
            </div>
            <div className="muted" style={{ marginTop: 8, fontSize: 12 }}>
              Use the total requests in the AWS WAF cost calculator.
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
            <div className="k">Attack requests</div>
            <div className="v">{formatNumber(result.attackRequests, 0)}</div>
          </div>
          <div className="kpi">
            <div className="k">Total evaluated requests</div>
            <div className="v">{formatNumber(result.totalRequests, 0)}</div>
          </div>
          <div className="kpi">
            <div className="k">Applied multiplier</div>
            <div className="v">{formatNumber(result.effectiveMultiplierPct, 0)}%</div>
          </div>
        </div>
      </div>
    </div>
  );
}
