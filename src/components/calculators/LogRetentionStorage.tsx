import React, { useMemo, useState } from "react";
import { estimateLogRetentionStorage } from "../../lib/calc/logRetention";
import { formatCurrency2, formatNumber } from "../../lib/format";
import { clamp } from "../../lib/math";

export function LogRetentionStorageCostCalculator() {
  const [gbPerDay, setGbPerDay] = useState(50);
  const [retentionDays, setRetentionDays] = useState(30);
  const [storagePricePerGbMonthUsd, setStoragePricePerGbMonthUsd] = useState(0.03);

  const result = useMemo(() => {
    return estimateLogRetentionStorage({
      gbPerDay: clamp(gbPerDay, 0, 1e12),
      retentionDays: clamp(retentionDays, 0, 3650),
      storagePricePerGbMonthUsd: clamp(storagePricePerGbMonthUsd, 0, 1e6),
    });
  }, [gbPerDay, retentionDays, storagePricePerGbMonthUsd]);

  return (
    <div className="calc-grid">
      <div className="panel">
        <h3>Inputs</h3>
        <div className="form">
          <div className="field field-3">
            <div className="label">Logs produced (GB / day)</div>
            <input
              type="number"
              inputMode="decimal"
              value={gbPerDay}
              min={0}
              onChange={(e) => setGbPerDay(+e.target.value)}
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

          <div className="field field-6">
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setGbPerDay(50);
                  setRetentionDays(30);
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
            <div className="k">Retained volume (steady state)</div>
            <div className="v">{formatNumber(result.storedGbSteadyState, 0)} GB</div>
          </div>
          <div className="kpi">
            <div className="k">Estimated monthly storage cost</div>
            <div className="v">{formatCurrency2(result.monthlyStorageCostUsd)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

