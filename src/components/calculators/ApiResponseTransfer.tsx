import React, { useMemo, useState } from "react";
import { estimateApiTransfer } from "../../lib/calc/apiTransfer";
import { formatNumber } from "../../lib/format";
import { clamp } from "../../lib/math";

export function ApiResponseTransferCalculator() {
  const [requestsPerDay, setRequestsPerDay] = useState(2_000_000);
  const [avgResponseKb, setAvgResponseKb] = useState(15);

  const result = useMemo(() => {
    return estimateApiTransfer({
      requestsPerDay: clamp(requestsPerDay, 0, 1e15),
      avgResponseKb: clamp(avgResponseKb, 0, 1e9),
    });
  }, [requestsPerDay, avgResponseKb]);

  return (
    <div className="calc-grid">
      <div className="panel">
        <h3>Inputs</h3>
        <div className="form">
          <div className="field field-3">
            <div className="label">Requests (per day)</div>
            <input
              type="number"
              inputMode="numeric"
              value={requestsPerDay}
              min={0}
              step={1000}
              onChange={(e) => setRequestsPerDay(+e.target.value)}
            />
          </div>
          <div className="field field-3">
            <div className="label">Average response size (KB)</div>
            <input
              type="number"
              inputMode="decimal"
              value={avgResponseKb}
              min={0}
              step={0.1}
              onChange={(e) => setAvgResponseKb(+e.target.value)}
            />
            <div className="hint">Use your typical compressed payload size over the wire.</div>
          </div>

          <div className="field field-6">
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setRequestsPerDay(2_000_000);
                  setAvgResponseKb(15);
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
            <div className="k">Requests per month (est.)</div>
            <div className="v">{formatNumber(result.requestsPerMonth, 0)}</div>
          </div>
          <div className="kpi">
            <div className="k">Monthly transfer (est.)</div>
            <div className="v">{formatNumber(result.totalGb, 0)} GB</div>
          </div>
        </div>
      </div>
    </div>
  );
}

