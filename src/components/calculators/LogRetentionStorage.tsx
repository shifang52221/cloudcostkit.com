import React, { useMemo } from "react";
import { useBooleanParamState, useNumberParamState } from "./useNumberParamState";
import { estimateLogRetentionStorage } from "../../lib/calc/logRetention";
import { formatCurrency2, formatNumber } from "../../lib/format";
import { clamp } from "../../lib/math";

const SECONDS_PER_DAY = 86_400;
const BYTES_PER_GB_DECIMAL = 1_000_000_000;

export function LogRetentionStorageCostCalculator() {
  const [useEventRateInputs, setUseEventRateInputs] = useBooleanParamState(
    "LogRetentionStorage.useEventRateInputs",
    false,
  );
  const [gbPerDay, setGbPerDay] = useNumberParamState("LogRetentionStorage.gbPerDay", 50);
  const [eventsPerSecond, setEventsPerSecond] = useNumberParamState("LogRetentionStorage.eventsPerSecond", 800);
  const [avgBytesPerEvent, setAvgBytesPerEvent] = useNumberParamState("LogRetentionStorage.avgBytesPerEvent", 700);
  const [retentionDays, setRetentionDays] = useNumberParamState("LogRetentionStorage.retentionDays", 30);
  const [storagePricePerGbMonthUsd, setStoragePricePerGbMonthUsd] = useNumberParamState("LogRetentionStorage.storagePricePerGbMonthUsd", 0.03);
  const [showPeakScenario, setShowPeakScenario] = useBooleanParamState("LogRetentionStorage.showPeakScenario", false);
  const [peakMultiplierPct, setPeakMultiplierPct] = useNumberParamState("LogRetentionStorage.peakMultiplierPct", 150);
  const retentionMonths = retentionDays / 30.4;

  const result = useMemo(() => {
    const safeEventsPerSecond = clamp(eventsPerSecond, 0, 1e12);
    const safeAvgBytesPerEvent = clamp(avgBytesPerEvent, 0, 1e12);
    const bytesPerDayFromEvents = safeEventsPerSecond * SECONDS_PER_DAY * safeAvgBytesPerEvent;
    const gbPerDayFromEvents = bytesPerDayFromEvents / BYTES_PER_GB_DECIMAL;
    const safeGbPerDay = clamp(useEventRateInputs ? gbPerDayFromEvents : gbPerDay, 0, 1e12);
    const retentionResult = estimateLogRetentionStorage({
      gbPerDay: safeGbPerDay,
      retentionDays: clamp(retentionDays, 0, 3650),
      storagePricePerGbMonthUsd: clamp(storagePricePerGbMonthUsd, 0, 1e6),
    });
    return {
      ...retentionResult,
      useEventRateInputs,
      eventsPerSecond: safeEventsPerSecond,
      avgBytesPerEvent: safeAvgBytesPerEvent,
      gbPerDayFromEvents,
    };
  }, [avgBytesPerEvent, eventsPerSecond, gbPerDay, retentionDays, storagePricePerGbMonthUsd, useEventRateInputs]);

  const peakResult = useMemo(() => {
    if (!showPeakScenario) return null;
    const safeMultiplier = clamp(peakMultiplierPct, 100, 1000) / 100;
    return estimateLogRetentionStorage({
      gbPerDay: clamp(result.gbPerDay, 0, 1e12) * safeMultiplier,
      retentionDays: clamp(retentionDays, 0, 3650),
      storagePricePerGbMonthUsd: clamp(storagePricePerGbMonthUsd, 0, 1e6),
    });
  }, [peakMultiplierPct, result.gbPerDay, retentionDays, showPeakScenario, storagePricePerGbMonthUsd]);
  const retainedTbEstimate = (result.gbPerDay * retentionDays) / 1024;

  return (
    <div className="calc-grid">
      <div className="panel">
        <h3>Inputs</h3>
        <div className="form">
          <div className="field field-6">
            <label className="muted" style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <input
                type="checkbox"
                checked={useEventRateInputs}
                onChange={(e) => setUseEventRateInputs(e.target.checked)}
              />
              Estimate GB/day from events/s x bytes/event (decimal GB)
            </label>
          </div>

          <div className="field field-3">
            <div className="label">Logs produced (GB / day)</div>
            <input
              type="number"
              inputMode="decimal"
              value={gbPerDay}
              min={0}
              onChange={(e) => setGbPerDay(+e.target.value)}
              disabled={useEventRateInputs}
            />
            <div className="hint">
              {useEventRateInputs
                ? `Derived from events: ${formatNumber(result.gbPerDayFromEvents, 2)} GB/day.`
                : "If you have measured ingestion, use it directly."}
            </div>
            <div className="hint">~{formatNumber(retainedTbEstimate, 2)} TB retained at steady state.</div>
          </div>
          <div className="field field-3">
            <div className="label">Events per second</div>
            <input
              type="number"
              inputMode="decimal"
              value={eventsPerSecond}
              min={0}
              step={1}
              onChange={(e) => setEventsPerSecond(+e.target.value)}
              disabled={!useEventRateInputs}
            />
          </div>
          <div className="field field-3">
            <div className="label">Avg bytes per event</div>
            <input
              type="number"
              inputMode="decimal"
              value={avgBytesPerEvent}
              min={0}
              step={1}
              onChange={(e) => setAvgBytesPerEvent(+e.target.value)}
              disabled={!useEventRateInputs}
            />
            <div className="hint">Sample real logs for a reliable average.</div>
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
            <div className="hint">~{formatNumber(retentionMonths, 1)} months of logs.</div>
          </div>
          <div className="field field-3">
            <div className="label">Storage price ($ / GB-month)</div>
            <input
              type="number"
              inputMode="decimal"
              value={storagePricePerGbMonthUsd}
              min={0}
              step={0.01}
              onChange={(e) => setStoragePricePerGbMonthUsd(+e.target.value)}
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
              <div className="hint">Use a peak month or incident spike.</div>
            </div>
          ) : null}

          <div className="field field-6">
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setUseEventRateInputs(false);
                  setGbPerDay(50);
                  setEventsPerSecond(800);
                  setAvgBytesPerEvent(700);
                  setRetentionDays(30);
                  setStoragePricePerGbMonthUsd(0.03);
                  setShowPeakScenario(false);
                  setPeakMultiplierPct(150);
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
            <div className="k">Retained volume (steady state)</div>
            <div className="v">{formatNumber(result.storedGbSteadyState, 0)} GB</div>
          </div>
          <div className="kpi">
            <div className="k">Estimated monthly storage cost</div>
            <div className="v">{formatCurrency2(result.monthlyStorageCostUsd)}</div>
          </div>
          {result.useEventRateInputs ? (
            <div className="kpi">
              <div className="k">Derived from events</div>
              <div className="v">
                {formatNumber(result.eventsPerSecond, 0)} events/s x {formatNumber(result.avgBytesPerEvent, 0)} bytes/event
              </div>
            </div>
          ) : null}
        </div>

        {peakResult ? (
          <div style={{ marginTop: 12 }}>
            <div className="muted" style={{ fontSize: 13, marginBottom: 6 }}>Baseline vs peak</div>
            <table className="table">
              <thead>
                <tr>
                  <th>Scenario</th>
                  <th className="num">GB/day</th>
                  <th className="num">Retained GB</th>
                  <th className="num">Monthly cost</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Baseline</td>
                  <td className="num">{formatNumber(result.gbPerDay, 2)}</td>
                  <td className="num">{formatNumber(result.storedGbSteadyState, 0)}</td>
                  <td className="num">{formatCurrency2(result.monthlyStorageCostUsd)}</td>
                </tr>
                <tr>
                  <td>Peak</td>
                  <td className="num">{formatNumber(peakResult.gbPerDay, 2)}</td>
                  <td className="num">{formatNumber(peakResult.storedGbSteadyState, 0)}</td>
                  <td className="num">{formatCurrency2(peakResult.monthlyStorageCostUsd)}</td>
                </tr>
                <tr>
                  <td>Delta</td>
                  <td className="num">{formatNumber(peakResult.gbPerDay - result.gbPerDay, 2)}</td>
                  <td className="num">{formatNumber(peakResult.storedGbSteadyState - result.storedGbSteadyState, 0)}</td>
                  <td className="num">{formatCurrency2(peakResult.monthlyStorageCostUsd - result.monthlyStorageCostUsd)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </div>
  );
}
