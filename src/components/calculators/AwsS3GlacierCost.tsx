import React, { useMemo, useState } from "react";
import { estimateS3GlacierCost } from "../../lib/calc/s3Glacier";
import { formatCurrency2, formatNumber } from "../../lib/format";
import { clamp } from "../../lib/math";

export function AwsS3GlacierCostCalculator() {
  const [storedGbMonth, setStoredGbMonth] = useState(10_000);
  const [storagePricePerGbMonthUsd, setStoragePricePerGbMonthUsd] = useState(0.004);

  const [retrievalGbPerMonth, setRetrievalGbPerMonth] = useState(500);
  const [retrievalPricePerGbUsd, setRetrievalPricePerGbUsd] = useState(0.01);

  const [retrievalRequestsPerMonth, setRetrievalRequestsPerMonth] = useState(2_000_000);
  const [retrievalPricePer1000RequestsUsd, setRetrievalPricePer1000RequestsUsd] = useState(0.05);

  const result = useMemo(() => {
    return estimateS3GlacierCost({
      storedGbMonth: clamp(storedGbMonth, 0, 1e18),
      storagePricePerGbMonthUsd: clamp(storagePricePerGbMonthUsd, 0, 1e9),
      retrievalGbPerMonth: clamp(retrievalGbPerMonth, 0, 1e18),
      retrievalPricePerGbUsd: clamp(retrievalPricePerGbUsd, 0, 1e9),
      retrievalRequestsPerMonth: clamp(retrievalRequestsPerMonth, 0, 1e18),
      retrievalPricePer1000RequestsUsd: clamp(retrievalPricePer1000RequestsUsd, 0, 1e9),
    });
  }, [
    storedGbMonth,
    storagePricePerGbMonthUsd,
    retrievalGbPerMonth,
    retrievalPricePerGbUsd,
    retrievalRequestsPerMonth,
    retrievalPricePer1000RequestsUsd,
  ]);

  return (
    <div className="calc-grid">
      <div className="panel">
        <h3>Inputs</h3>
        <div className="form">
          <div className="field field-3">
            <div className="label">Stored data (GB-month)</div>
            <input
              type="number"
              inputMode="decimal"
              value={storedGbMonth}
              min={0}
              step={1}
              onChange={(e) => setStoredGbMonth(+e.target.value)}
            />
            <div className="hint">Average stored GB over the month.</div>
          </div>
          <div className="field field-3">
            <div className="label">Storage price ($ / GB-month)</div>
            <input
              type="number"
              inputMode="decimal"
              value={storagePricePerGbMonthUsd}
              min={0}
              step={0.0001}
              onChange={(e) => setStoragePricePerGbMonthUsd(+e.target.value)}
            />
            <div className="hint">Use your effective Glacier/Deep Archive storage price.</div>
          </div>

          <div className="field field-3">
            <div className="label">Retrieval volume (GB/month)</div>
            <input
              type="number"
              inputMode="decimal"
              value={retrievalGbPerMonth}
              min={0}
              step={1}
              onChange={(e) => setRetrievalGbPerMonth(+e.target.value)}
            />
          </div>
          <div className="field field-3">
            <div className="label">Retrieval price ($ / GB)</div>
            <input
              type="number"
              inputMode="decimal"
              value={retrievalPricePerGbUsd}
              min={0}
              step={0.0001}
              onChange={(e) => setRetrievalPricePerGbUsd(+e.target.value)}
            />
            <div className="hint">Varies by retrieval tier and storage class.</div>
          </div>

          <div className="field field-3">
            <div className="label">Retrieval requests (per month)</div>
            <input
              type="number"
              inputMode="numeric"
              value={retrievalRequestsPerMonth}
              min={0}
              step={1000}
              onChange={(e) => setRetrievalRequestsPerMonth(+e.target.value)}
            />
          </div>
          <div className="field field-3">
            <div className="label">Retrieval requests price ($ / 1000)</div>
            <input
              type="number"
              inputMode="decimal"
              value={retrievalPricePer1000RequestsUsd}
              min={0}
              step={0.0001}
              onChange={(e) => setRetrievalPricePer1000RequestsUsd(+e.target.value)}
            />
          </div>

          <div className="field field-6">
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setStoredGbMonth(10_000);
                  setStoragePricePerGbMonthUsd(0.004);
                  setRetrievalGbPerMonth(500);
                  setRetrievalPricePerGbUsd(0.01);
                  setRetrievalRequestsPerMonth(2_000_000);
                  setRetrievalPricePer1000RequestsUsd(0.05);
                }}
              >
                Reset example
              </button>
            </div>
            <div className="muted" style={{ marginTop: 8, fontSize: 12 }}>
              Excludes minimum storage duration fees, early deletion fees, and data transfer out to the internet.
            </div>
          </div>
        </div>
      </div>

      <div className="panel">
        <h3>Results</h3>
        <div className="kpis">
          <div className="kpi">
            <div className="k">Estimated monthly total</div>
            <div className="v">{formatCurrency2(result.totalCostUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">Storage</div>
            <div className="v">{formatCurrency2(result.storageCostUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">Retrieval (GB)</div>
            <div className="v">{formatCurrency2(result.retrievalCostUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">Retrieval (requests)</div>
            <div className="v">{formatCurrency2(result.retrievalRequestCostUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">Stored (GB-month)</div>
            <div className="v">{formatNumber(result.storedGbMonth, 0)}</div>
          </div>
          <div className="kpi">
            <div className="k">Retrieved (GB/month)</div>
            <div className="v">{formatNumber(result.retrievalGbPerMonth, 0)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

