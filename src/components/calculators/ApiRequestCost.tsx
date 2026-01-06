import React, { useMemo, useState } from "react";
import { estimateRequestCost } from "../../lib/calc/requests";
import { formatCurrency2, formatNumber } from "../../lib/format";
import { clamp } from "../../lib/math";

export function ApiRequestCostCalculator() {
  const [requestsPerMonth, setRequestsPerMonth] = useState(500_000_000);
  const [pricePerMillionUsd, setPricePerMillionUsd] = useState(1.0);

  const result = useMemo(() => {
    return estimateRequestCost({
      requestsPerMonth: clamp(requestsPerMonth, 0, 1e18),
      pricePerMillionUsd: clamp(pricePerMillionUsd, 0, 1e9),
    });
  }, [requestsPerMonth, pricePerMillionUsd]);

  return (
    <div className="calc-grid">
      <div className="panel">
        <h3>Inputs</h3>
        <div className="form">
          <div className="field field-3">
            <div className="label">Requests (per month)</div>
            <input
              type="number"
              inputMode="numeric"
              value={requestsPerMonth}
              min={0}
              step={1000}
              onChange={(e) => setRequestsPerMonth(+e.target.value)}
            />
          </div>
          <div className="field field-3">
            <div className="label">Price ($ / 1M requests)</div>
            <input
              type="number"
              inputMode="decimal"
              value={pricePerMillionUsd}
              min={0}
              step={0.01}
              onChange={(e) => setPricePerMillionUsd(+e.target.value)}
            />
          </div>

          <div className="field field-6">
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setRequestsPerMonth(500_000_000);
                  setPricePerMillionUsd(1.0);
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
            <div className="k">Estimated monthly request cost</div>
            <div className="v">{formatCurrency2(result.costUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">Requests</div>
            <div className="v">{formatNumber(result.requestsPerMonth, 0)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

