import React, { useMemo } from "react";
import { useBooleanParamState, useNumberParamState } from "./useNumberParamState";
import { formatCurrency2, formatNumber } from "../../lib/format";
import { clamp } from "../../lib/math";

const SECONDS_PER_DAY = 86_400;
const BYTES_PER_GB_DECIMAL = 1_000_000_000;

export function LogIngestionCostCalculator() {
  const [useEventRateInputs, setUseEventRateInputs] = useBooleanParamState(
    "LogIngestionCost.useEventRateInputs",
    false,
  );
  const [gbPerDayIngest, setGbPerDayIngest] = useNumberParamState("LogIngestionCost.gbPerDayIngest", 50);
  const [eventsPerSecond, setEventsPerSecond] = useNumberParamState("LogIngestionCost.eventsPerSecond", 1000);
  const [avgBytesPerEvent, setAvgBytesPerEvent] = useNumberParamState("LogIngestionCost.avgBytesPerEvent", 800);
  const [daysPerMonth, setDaysPerMonth] = useNumberParamState("LogIngestionCost.daysPerMonth", 30.4);
  const [ingestPricePerGbUsd, setIngestPricePerGbUsd] = useNumberParamState("LogIngestionCost.ingestPricePerGbUsd", 0.5);
  const [showPeakScenario, setShowPeakScenario] = useBooleanParamState("LogIngestionCost.showPeakScenario", false);
  const [peakMultiplierPct, setPeakMultiplierPct] = useNumberParamState("LogIngestionCost.peakMultiplierPct", 150);

  const result = useMemo(() => {
    const safeDaysPerMonth = clamp(daysPerMonth, 1, 31);
    const safeEventsPerSecond = clamp(eventsPerSecond, 0, 1e12);
    const safeAvgBytesPerEvent = clamp(avgBytesPerEvent, 0, 1e12);

    const bytesPerDayFromEvents = safeEventsPerSecond * SECONDS_PER_DAY * safeAvgBytesPerEvent;
    const gbPerDayFromEvents = bytesPerDayFromEvents / BYTES_PER_GB_DECIMAL;

    const safeGbPerDayIngest = clamp(useEventRateInputs ? gbPerDayFromEvents : gbPerDayIngest, 0, 1e12);
    const safeIngestPricePerGbUsd = clamp(ingestPricePerGbUsd, 0, 1e6);

    const monthlyIngestGb = safeGbPerDayIngest * safeDaysPerMonth;
    const ingestCostUsd = monthlyIngestGb * safeIngestPricePerGbUsd;

    return {
      useEventRateInputs,
      gbPerDayIngest: safeGbPerDayIngest,
      daysPerMonth: safeDaysPerMonth,
      ingestPricePerGbUsd: safeIngestPricePerGbUsd,
      monthlyIngestGb,
      ingestCostUsd,
      eventsPerSecond: safeEventsPerSecond,
      avgBytesPerEvent: safeAvgBytesPerEvent,
      gbPerDayFromEvents,
    };
  }, [avgBytesPerEvent, daysPerMonth, eventsPerSecond, gbPerDayIngest, ingestPricePerGbUsd, useEventRateInputs]);

  const peakResult = useMemo(() => {
    if (!showPeakScenario) return null;
    const safeMultiplier = clamp(peakMultiplierPct, 100, 1000) / 100;
    const peakGbPerDay = clamp(result.gbPerDayIngest * safeMultiplier, 0, 1e12);
    const monthlyIngestGb = peakGbPerDay * result.daysPerMonth;
    const ingestCostUsd = monthlyIngestGb * result.ingestPricePerGbUsd;

    return {
      gbPerDayIngest: peakGbPerDay,
      monthlyIngestGb,
      ingestCostUsd,
    };
  }, [peakMultiplierPct, result, showPeakScenario]);
  const avgMbps = (result.gbPerDayIngest * 8000) / SECONDS_PER_DAY;

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
            <div className="label">Ingest volume (GB / day)</div>
            <input
              type="number"
              inputMode="decimal"
              value={gbPerDayIngest}
              min={0}
              onChange={(e) => setGbPerDayIngest(+e.target.value)}
              disabled={useEventRateInputs}
            />
            <div className="hint">
              {useEventRateInputs
                ? `Derived from events: ${formatNumber(result.gbPerDayFromEvents, 2)} GB/day.`
                : "If you have measured ingestion, use it directly."}
            </div>
            <div className="hint">Avg {formatNumber(avgMbps, 2)} Mbps ingest.</div>
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
            <div className="hint">Tip: sample real log events to avoid guessing.</div>
          </div>

          <div className="field field-3">
            <div className="label">Billing days (per month)</div>
            <input
              type="number"
              inputMode="decimal"
              value={daysPerMonth}
              min={1}
              max={31}
              step={0.1}
              onChange={(e) => setDaysPerMonth(+e.target.value)}
            />
          </div>

          <div className="field field-3">
            <div className="label">Ingest price ($ / GB)</div>
            <input
              type="number"
              inputMode="decimal"
              value={ingestPricePerGbUsd}
              min={0}
              step={0.01}
              onChange={(e) => setIngestPricePerGbUsd(+e.target.value)}
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
            <div className="label">Scenario presets</div>
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setUseEventRateInputs(false);
                  setGbPerDayIngest(12);
                  setEventsPerSecond(250);
                  setAvgBytesPerEvent(700);
                  setDaysPerMonth(30.4);
                  setIngestPricePerGbUsd(0.5);
                  setShowPeakScenario(true);
                  setPeakMultiplierPct(140);
                }}
              >
                Small app
              </button>
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setUseEventRateInputs(false);
                  setGbPerDayIngest(90);
                  setEventsPerSecond(2400);
                  setAvgBytesPerEvent(900);
                  setDaysPerMonth(30.4);
                  setIngestPricePerGbUsd(0.5);
                  setShowPeakScenario(true);
                  setPeakMultiplierPct(180);
                }}
              >
                SaaS ops
              </button>
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setUseEventRateInputs(false);
                  setGbPerDayIngest(600);
                  setEventsPerSecond(12000);
                  setAvgBytesPerEvent(1000);
                  setDaysPerMonth(30.4);
                  setIngestPricePerGbUsd(0.5);
                  setShowPeakScenario(true);
                  setPeakMultiplierPct(220);
                }}
              >
                High volume
              </button>
            </div>
          </div>

          <div className="field field-6">
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setUseEventRateInputs(false);
                  setGbPerDayIngest(50);
                  setEventsPerSecond(1000);
                  setAvgBytesPerEvent(800);
                  setDaysPerMonth(30.4);
                  setIngestPricePerGbUsd(0.5);
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
            <div className="k">Estimated monthly ingestion cost</div>
            <div className="v">{formatCurrency2(result.ingestCostUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">Monthly ingestion</div>
            <div className="v">{formatNumber(result.monthlyIngestGb, 0)} GB</div>
          </div>
          <div className="kpi">
            <div className="k">Ingestion rate</div>
            <div className="v">{formatNumber(result.gbPerDayIngest, 2)} GB/day</div>
          </div>
          <div className="kpi">
            <div className="k">Assumption</div>
            <div className="v">
              {formatNumber(result.ingestPricePerGbUsd, 4)} $/GB x {formatNumber(result.daysPerMonth, 1)} days
            </div>
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
                  <th className="num">Monthly GB</th>
                  <th className="num">Monthly cost</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Baseline</td>
                  <td className="num">{formatNumber(result.gbPerDayIngest, 2)}</td>
                  <td className="num">{formatNumber(result.monthlyIngestGb, 0)}</td>
                  <td className="num">{formatCurrency2(result.ingestCostUsd)}</td>
                </tr>
                <tr>
                  <td>Peak</td>
                  <td className="num">{formatNumber(peakResult.gbPerDayIngest, 2)}</td>
                  <td className="num">{formatNumber(peakResult.monthlyIngestGb, 0)}</td>
                  <td className="num">{formatCurrency2(peakResult.ingestCostUsd)}</td>
                </tr>
                <tr>
                  <td>Delta</td>
                  <td className="num">{formatNumber(peakResult.gbPerDayIngest - result.gbPerDayIngest, 2)}</td>
                  <td className="num">{formatNumber(peakResult.monthlyIngestGb - result.monthlyIngestGb, 0)}</td>
                  <td className="num">{formatCurrency2(peakResult.ingestCostUsd - result.ingestCostUsd)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </div>
  );
}
