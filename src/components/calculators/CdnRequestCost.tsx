import React, { useMemo, useState } from "react";
import { estimateRequestCostPer10k } from "../../lib/calc/requests";
import { formatCurrency2, formatNumber } from "../../lib/format";
import { clamp } from "../../lib/math";

export function CdnRequestCostCalculator() {
  const [requestsPerMonth, setRequestsPerMonth] = useState(300_000_000);
  const [pricePer10kUsd, setPricePer10kUsd] = useState(0.0075);

  const result = useMemo(() => {
    return estimateRequestCostPer10k({
      requestsPerMonth: clamp(requestsPerMonth, 0, 1e18),
      pricePer10kUsd: clamp(pricePer10kUsd, 0, 1e9),
    });
  }, [requestsPerMonth, pricePer10kUsd]);

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
            <div className="label">Price ($ / 10k requests)</div>
            <input
              type="number"
              inputMode="decimal"
              value={pricePer10kUsd}
              min={0}
              step={0.0001}
              onChange={(e) => setPricePer10kUsd(+e.target.value)}
            />
          </div>

          <div className="field field-6">
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setRequestsPerMonth(300_000_000);
                  setPricePer10kUsd(0.0075);
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

