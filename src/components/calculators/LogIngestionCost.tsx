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
              Estimate GB/day from events/s × bytes/event (decimal GB)
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
              {formatNumber(result.ingestPricePerGbUsd, 4)} $/GB × {formatNumber(result.daysPerMonth, 1)} days
            </div>
          </div>
          {result.useEventRateInputs ? (
            <div className="kpi">
              <div className="k">Derived from events</div>
              <div className="v">
                {formatNumber(result.eventsPerSecond, 0)} events/s × {formatNumber(result.avgBytesPerEvent, 0)} bytes/event
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

