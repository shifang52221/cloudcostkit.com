import React, { useMemo } from "react";
import { useBooleanParamState, useNumberParamState } from "./useNumberParamState";
import { estimateReservedBreakEven } from "../../lib/calc/reserved";
import { formatCurrency2, formatNumber } from "../../lib/format";
import { clamp } from "../../lib/math";

export function ReservedBreakEvenCalculator() {
  const [onDemandHourlyUsd, setOnDemandHourlyUsd] = useNumberParamState("ReservedBreakEven.onDemandHourlyUsd", 0.12);
  const [reservedHourlyUsd, setReservedHourlyUsd] = useNumberParamState("ReservedBreakEven.reservedHourlyUsd", 0.075);
  const [upfrontUsd, setUpfrontUsd] = useNumberParamState("ReservedBreakEven.upfrontUsd", 300);
  const [hoursPerDay, setHoursPerDay] = useNumberParamState("ReservedBreakEven.hoursPerDay", 24);
  const [daysPerMonth, setDaysPerMonth] = useNumberParamState("ReservedBreakEven.daysPerMonth", 30.4);
  const [showPeakScenario, setShowPeakScenario] = useBooleanParamState("ReservedBreakEven.showPeakScenario", false);
  const [peakMultiplierPct, setPeakMultiplierPct] = useNumberParamState("ReservedBreakEven.peakMultiplierPct", 200);

  const normalizedHoursPerMonth = clamp(daysPerMonth, 1, 31) * clamp(hoursPerDay, 0, 24);
  const onDemandMonthlyAtSchedule = onDemandHourlyUsd * normalizedHoursPerMonth;
  const reservedMonthlyAtSchedule = reservedHourlyUsd * normalizedHoursPerMonth;

  const result = useMemo(() => {
    return estimateReservedBreakEven({
      onDemandHourlyUsd: clamp(onDemandHourlyUsd, 0, 1e6),
      reservedHourlyUsd: clamp(reservedHourlyUsd, 0, 1e6),
      upfrontUsd: clamp(upfrontUsd, 0, 1e12),
      hoursPerMonth: clamp(normalizedHoursPerMonth, 1, 10000),
    });
  }, [onDemandHourlyUsd, reservedHourlyUsd, upfrontUsd, normalizedHoursPerMonth]);

  const peakResult = useMemo(() => {
    if (!showPeakScenario) return null;
    const multiplier = clamp(peakMultiplierPct, 100, 1000) / 100;
    return estimateReservedBreakEven({
      onDemandHourlyUsd: clamp(onDemandHourlyUsd, 0, 1e6),
      reservedHourlyUsd: clamp(reservedHourlyUsd, 0, 1e6),
      upfrontUsd: clamp(upfrontUsd, 0, 1e12),
      hoursPerMonth: clamp(normalizedHoursPerMonth, 1, 10000) * multiplier,
    });
  }, [normalizedHoursPerMonth, onDemandHourlyUsd, peakMultiplierPct, reservedHourlyUsd, showPeakScenario, upfrontUsd]);

  const paybackMonths = result.monthlySavingsUsd > 0 ? upfrontUsd / result.monthlySavingsUsd : null;
  const peakPaybackMonths = peakResult && peakResult.monthlySavingsUsd > 0 ? upfrontUsd / peakResult.monthlySavingsUsd : null;
  const breakEvenMonthsAtSchedule =
    result.breakEvenHours === null || normalizedHoursPerMonth <= 0
      ? null
      : result.breakEvenHours / normalizedHoursPerMonth;

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
            <div className="hint">~{formatCurrency2(onDemandMonthlyAtSchedule)} / month at current schedule.</div>
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
            <div className="hint">~{formatCurrency2(reservedMonthlyAtSchedule)} / month at current schedule.</div>
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
            <div className="muted" style={{ marginTop: 6, fontSize: 12 }}>
              Monthly hours: {formatNumber(normalizedHoursPerMonth, 0)}
            </div>
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
              <div className="hint">Applies to hours/day x days/month.</div>
            </div>
          ) : null}

          <div className="field field-6">
            <div className="label">Scenario presets</div>
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setOnDemandHourlyUsd(0.12);
                  setReservedHourlyUsd(0.075);
                  setUpfrontUsd(300);
                  setHoursPerDay(10);
                  setDaysPerMonth(30);
                  setShowPeakScenario(true);
                  setPeakMultiplierPct(180);
                }}
              >
                Dev/test
              </button>
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setOnDemandHourlyUsd(0.12);
                  setReservedHourlyUsd(0.075);
                  setUpfrontUsd(300);
                  setHoursPerDay(24);
                  setDaysPerMonth(30.4);
                  setShowPeakScenario(true);
                  setPeakMultiplierPct(220);
                }}
              >
                Always-on
              </button>
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setOnDemandHourlyUsd(0.22);
                  setReservedHourlyUsd(0.14);
                  setUpfrontUsd(1200);
                  setHoursPerDay(24);
                  setDaysPerMonth(30.4);
                  setShowPeakScenario(true);
                  setPeakMultiplierPct(160);
                }}
              >
                High spend
              </button>
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setOnDemandHourlyUsd(0.12);
                  setReservedHourlyUsd(0.08);
                  setUpfrontUsd(200);
                  setHoursPerDay(10);
                  setDaysPerMonth(22);
                  setShowPeakScenario(true);
                  setPeakMultiplierPct(150);
                }}
              >
                Weekday only
              </button>
            </div>
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
            <div className="k">Hourly savings</div>
            <div className="v">{formatCurrency2(result.hourlySavings)} / hr</div>
          </div>
          <div className="kpi">
            <div className="k">Break-even usage</div>
            <div className="v">
              {result.breakEvenHours === null ? "No break-even (commitment not cheaper)" : `${formatNumber(result.breakEvenHours, 0)} hours`}
            </div>
            {breakEvenMonthsAtSchedule !== null ? (
              <div className="muted" style={{ marginTop: 4 }}>
                At current schedule: {formatNumber(breakEvenMonthsAtSchedule, 2)} months
              </div>
            ) : null}
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

        {showPeakScenario ? (
          <div style={{ marginTop: 12 }}>
            <div className="muted" style={{ fontSize: 13, marginBottom: 6 }}>Baseline vs peak</div>
            <table className="table">
              <thead>
                <tr>
                  <th>Scenario</th>
                  <th className="num">Hours/month</th>
                  <th className="num">On-demand</th>
                  <th className="num">Committed</th>
                  <th className="num">Savings</th>
                  <th className="num">Payback (mo)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Baseline</td>
                  <td className="num">{formatNumber(result.hoursPerMonth, 0)}</td>
                  <td className="num">{formatCurrency2(result.monthlyOnDemandUsd)}</td>
                  <td className="num">{formatCurrency2(result.monthlyReservedUsd)}</td>
                  <td className="num">{formatCurrency2(result.monthlySavingsUsd)}</td>
                  <td className="num">{paybackMonths === null ? "n/a" : formatNumber(paybackMonths, 1)}</td>
                </tr>
                {peakResult ? (
                  <tr>
                    <td>Peak</td>
                    <td className="num">{formatNumber(peakResult.hoursPerMonth, 0)}</td>
                    <td className="num">{formatCurrency2(peakResult.monthlyOnDemandUsd)}</td>
                    <td className="num">{formatCurrency2(peakResult.monthlyReservedUsd)}</td>
                    <td className="num">{formatCurrency2(peakResult.monthlySavingsUsd)}</td>
                    <td className="num">{peakPaybackMonths === null ? "n/a" : formatNumber(peakPaybackMonths, 1)}</td>
                  </tr>
                ) : null}
              </tbody>
            </table>
            <div className="muted" style={{ marginTop: 6, fontSize: 12 }}>
              Uses {formatNumber(daysPerMonth, 1)} days/month and {formatNumber(hoursPerDay, 0)} hours/day.
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
