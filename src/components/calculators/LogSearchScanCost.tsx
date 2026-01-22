import React, { useMemo } from "react";
import { useNumberParamState } from "./useNumberParamState";
import { estimateLogScanCost } from "../../lib/calc/logScan";
import { formatCurrency2, formatNumber } from "../../lib/format";
import { clamp } from "../../lib/math";

export function LogSearchScanCostCalculator() {
  const [gbScannedPerDay, setGbScannedPerDay] = useNumberParamState("LogSearchScanCost.gbScannedPerDay", 800);
  const [pricePerGbUsd, setPricePerGbUsd] = useNumberParamState("LogSearchScanCost.pricePerGbUsd", 0.005);

  const result = useMemo(() => {
    return estimateLogScanCost({
      gbScannedPerDay: clamp(gbScannedPerDay, 0, 1e12),
      pricePerGbUsd: clamp(pricePerGbUsd, 0, 1e6),
    });
  }, [gbScannedPerDay, pricePerGbUsd]);

  return (
    <div className="calc-grid">
      <div className="panel">
        <h3>Inputs</h3>
        <div className="form">
          <div className="field field-3">
            <div className="label">GB scanned (per day)</div>
            <input
              type="number"
              inputMode="decimal"
              value={gbScannedPerDay}
              min={0}
              onChange={(e) => setGbScannedPerDay(+e.target.value)}
            />
          </div>
          <div className="field field-3">
            <div className="label">Scan price ($ / GB)</div>
            <input
              type="number"
              inputMode="decimal"
              value={pricePerGbUsd}
              min={0}
              step={0.0001}
              onChange={(e) => setPricePerGbUsd(+e.target.value)}
            />
          </div>

          <div className="field field-6">
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setGbScannedPerDay(800);
                  setPricePerGbUsd(0.005);
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
            <div className="k">Monthly scan volume (est.)</div>
            <div className="v">{formatNumber(result.monthlyGbScanned, 0)} GB</div>
          </div>
          <div className="kpi">
            <div className="k">Estimated monthly scan cost</div>
            <div className="v">{formatCurrency2(result.monthlyCostUsd)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

