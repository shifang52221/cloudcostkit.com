import React, { useMemo, useState } from "react";
import { estimateDbStorageGrowth } from "../../lib/calc/dbGrowth";
import { formatCurrency2, formatNumber } from "../../lib/format";
import { clamp } from "../../lib/math";

export function DatabaseStorageGrowthCostCalculator() {
  const [startingGb, setStartingGb] = useState(500);
  const [growthGbPerDay, setGrowthGbPerDay] = useState(5);
  const [months, setMonths] = useState(6);
  const [storagePricePerGbMonthUsd, setStoragePricePerGbMonthUsd] = useState(0.12);

  const result = useMemo(() => {
    return estimateDbStorageGrowth({
      startingGb: clamp(startingGb, 0, 1e15),
      growthGbPerDay: clamp(growthGbPerDay, 0, 1e12),
      months: clamp(months, 0, 120),
      storagePricePerGbMonthUsd: clamp(storagePricePerGbMonthUsd, 0, 1e6),
    });
  }, [startingGb, growthGbPerDay, months, storagePricePerGbMonthUsd]);

  return (
    <div className="calc-grid">
      <div className="panel">
        <h3>Inputs</h3>
        <div className="form">
          <div className="field field-3">
            <div className="label">Starting size (GB)</div>
            <input
              type="number"
              inputMode="decimal"
              value={startingGb}
              min={0}
              onChange={(e) => setStartingGb(+e.target.value)}
            />
          </div>
          <div className="field field-3">
            <div className="label">Growth (GB / day)</div>
            <input
              type="number"
              inputMode="decimal"
              value={growthGbPerDay}
              min={0}
              step={0.1}
              onChange={(e) => setGrowthGbPerDay(+e.target.value)}
            />
          </div>
          <div className="field field-3">
            <div className="label">Horizon (months)</div>
            <input
              type="number"
              inputMode="numeric"
              value={months}
              min={0}
              max={120}
              step={1}
              onChange={(e) => setMonths(+e.target.value)}
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
                  setStartingGb(500);
                  setGrowthGbPerDay(5);
                  setMonths(6);
                  setStoragePricePerGbMonthUsd(0.12);
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
            <div className="k">Ending size (est.)</div>
            <div className="v">{formatNumber(result.endingGb, 0)} GB</div>
          </div>
          <div className="kpi">
            <div className="k">Average size (est.)</div>
            <div className="v">{formatNumber(result.averageGb, 0)} GB</div>
          </div>
          <div className="kpi">
            <div className="k">Estimated monthly cost (average)</div>
            <div className="v">{formatCurrency2(result.estimatedMonthlyCostUsd)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

