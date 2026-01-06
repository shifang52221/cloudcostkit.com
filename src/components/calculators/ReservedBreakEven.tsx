import React, { useMemo, useState } from "react";
import { estimateReservedBreakEven } from "../../lib/calc/reserved";
import { formatCurrency2, formatNumber } from "../../lib/format";
import { clamp } from "../../lib/math";

export function ReservedBreakEvenCalculator() {
  const [onDemandHourlyUsd, setOnDemandHourlyUsd] = useState(0.12);
  const [reservedHourlyUsd, setReservedHourlyUsd] = useState(0.075);
  const [upfrontUsd, setUpfrontUsd] = useState(300);
  const [hoursPerMonth, setHoursPerMonth] = useState(730);

  const result = useMemo(() => {
    return estimateReservedBreakEven({
      onDemandHourlyUsd: clamp(onDemandHourlyUsd, 0, 1e6),
      reservedHourlyUsd: clamp(reservedHourlyUsd, 0, 1e6),
      upfrontUsd: clamp(upfrontUsd, 0, 1e12),
      hoursPerMonth: clamp(hoursPerMonth, 1, 10000),
    });
  }, [onDemandHourlyUsd, reservedHourlyUsd, upfrontUsd, hoursPerMonth]);

  return (
    <div className="calc-grid">
      <div className="panel">
        <h3>Inputs</h3>
        <div className="form">
          <div className="field field-3">
            <div className="label">On-demand ($ / hour)</div>
            <input
              type="number"
              inputMode="decimal"
              value={onDemandHourlyUsd}
              min={0}
              step={0.001}
              onChange={(e) => setOnDemandHourlyUsd(+e.target.value)}
            />
          </div>
          <div className="field field-3">
            <div className="label">Committed ($ / hour)</div>
            <input
              type="number"
              inputMode="decimal"
              value={reservedHourlyUsd}
              min={0}
              step={0.001}
              onChange={(e) => setReservedHourlyUsd(+e.target.value)}
            />
          </div>
          <div className="field field-3">
            <div className="label">Upfront cost ($)</div>
            <input
              type="number"
              inputMode="decimal"
              value={upfrontUsd}
              min={0}
              step={1}
              onChange={(e) => setUpfrontUsd(+e.target.value)}
            />
          </div>
          <div className="field field-3">
            <div className="label">Hours per month</div>
            <input
              type="number"
              inputMode="numeric"
              value={hoursPerMonth}
              min={1}
              step={1}
              onChange={(e) => setHoursPerMonth(+e.target.value)}
            />
          </div>

          <div className="field field-6">
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setOnDemandHourlyUsd(0.12);
                  setReservedHourlyUsd(0.075);
                  setUpfrontUsd(300);
                  setHoursPerMonth(730);
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
            <div className="k">Hourly savings</div>
            <div className="v">{formatCurrency2(result.hourlySavings)} / hr</div>
          </div>
          <div className="kpi">
            <div className="k">Break-even usage</div>
            <div className="v">
              {result.breakEvenHours === null ? "No break-even (commitment not cheaper)" : `${formatNumber(result.breakEvenHours, 0)} hours`}
            </div>
          </div>
          <div className="kpi">
            <div className="k">Monthly on-demand</div>
            <div className="v">{formatCurrency2(result.monthlyOnDemandUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">Monthly committed</div>
            <div className="v">{formatCurrency2(result.monthlyReservedUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">Monthly savings (excluding upfront)</div>
            <div className="v">{formatCurrency2(result.monthlySavingsUsd)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

