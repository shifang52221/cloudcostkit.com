import React, { useMemo, useState } from "react";
import { estimateMonthlyRequestsFromRps } from "../../lib/calc/rps";
import { formatNumber, formatPercent } from "../../lib/format";
import { clamp } from "../../lib/math";

export function RpsToMonthlyRequestsCalculator() {
  const [rps, setRps] = useState(2500);
  const [utilizationPct, setUtilizationPct] = useState(35);
  const [hoursPerDay, setHoursPerDay] = useState(24);

  const result = useMemo(() => {
    return estimateMonthlyRequestsFromRps({
      rps: clamp(rps, 0, 1e12),
      utilizationPct: clamp(utilizationPct, 0, 100),
      hoursPerDay: clamp(hoursPerDay, 0, 24),
    });
  }, [rps, utilizationPct, hoursPerDay]);

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

          <div className="field field-6">
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setRps(2500);
                  setUtilizationPct(35);
                  setHoursPerDay(24);
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
              {formatNumber(result.rps, 0)} RPS × {formatPercent(result.utilizationPct, 0)} × {formatNumber(result.hoursPerDay, 0)} h/day
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

