import React, { useMemo } from "react";
import { useNumberParamState } from "./useNumberParamState";
import { estimateLogCost } from "../../lib/calc/logs";
import { formatCurrency2, formatNumber } from "../../lib/format";
import { clamp } from "../../lib/math";

export function LogIngestionCostCalculator() {
  const [gbPerDayIngest, setGbPerDayIngest] = useNumberParamState("LogIngestionCost.gbPerDayIngest", 50);
  const [retentionDays, setRetentionDays] = useNumberParamState("LogIngestionCost.retentionDays", 30);
  const [ingestPricePerGbUsd, setIngestPricePerGbUsd] = useNumberParamState("LogIngestionCost.ingestPricePerGbUsd", 0.5);
  const [storagePricePerGbMonthUsd, setStoragePricePerGbMonthUsd] = useNumberParamState("LogIngestionCost.storagePricePerGbMonthUsd", 0.03);

  const result = useMemo(() => {
    return estimateLogCost({
      gbPerDayIngest: clamp(gbPerDayIngest, 0, 1e12),
      retentionDays: clamp(retentionDays, 0, 3650),
      ingestPricePerGbUsd: clamp(ingestPricePerGbUsd, 0, 1e6),
      storagePricePerGbMonthUsd: clamp(storagePricePerGbMonthUsd, 0, 1e6),
    });
  }, [gbPerDayIngest, retentionDays, ingestPricePerGbUsd, storagePricePerGbMonthUsd]);

  return (
    <div className="calc-grid">
      <div className="panel">
        <h3>Inputs</h3>
        <div className="form">
          <div className="field field-3">
            <div className="label">Ingest volume (GB / day)</div>
            <input
              type="number"
              inputMode="decimal"
              value={gbPerDayIngest}
              min={0}
              onChange={(e) => setGbPerDayIngest(+e.target.value)}
            />
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
            <div className="hint">Steady state assumes logs are kept for the full retention window.</div>
          </div>

          <div className="field field-6">
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setGbPerDayIngest(50);
                  setRetentionDays(30);
                  setIngestPricePerGbUsd(0.5);
                  setStoragePricePerGbMonthUsd(0.03);
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
            <div className="k">Estimated monthly total</div>
            <div className="v">{formatCurrency2(result.totalMonthlyUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">Monthly ingestion</div>
            <div className="v">{formatNumber(result.monthlyIngestGb, 0)} GB</div>
          </div>
          <div className="kpi">
            <div className="k">Ingest cost</div>
            <div className="v">{formatCurrency2(result.ingestCostUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">Stored volume (steady state)</div>
            <div className="v">{formatNumber(result.storedGbSteadyState, 0)} GB</div>
          </div>
          <div className="kpi">
            <div className="k">Storage cost</div>
            <div className="v">{formatCurrency2(result.storageCostUsd)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

