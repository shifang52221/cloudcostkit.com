import React, { useMemo, useState } from "react";
import { estimateObjectStorageCost } from "../../lib/calc/storage";
import { formatCurrency2, formatNumber } from "../../lib/format";
import { clamp } from "../../lib/math";

export function ObjectStorageCostCalculator() {
  const [averageStoredGb, setAverageStoredGb] = useState(5000);
  const [storagePricePerGbMonthUsd, setStoragePricePerGbMonthUsd] = useState(0.023);
  const [getRequestsPerMonth, setGetRequestsPerMonth] = useState(5_000_000);
  const [putRequestsPerMonth, setPutRequestsPerMonth] = useState(500_000);
  const [getPricePer1kUsd, setGetPricePer1kUsd] = useState(0.0004);
  const [putPricePer1kUsd, setPutPricePer1kUsd] = useState(0.005);

  const result = useMemo(() => {
    return estimateObjectStorageCost({
      averageStoredGb: clamp(averageStoredGb, 0, 1e12),
      storagePricePerGbMonthUsd: clamp(storagePricePerGbMonthUsd, 0, 1e6),
      getRequestsPerMonth: clamp(getRequestsPerMonth, 0, 1e15),
      putRequestsPerMonth: clamp(putRequestsPerMonth, 0, 1e15),
      getPricePer1kUsd: clamp(getPricePer1kUsd, 0, 1e3),
      putPricePer1kUsd: clamp(putPricePer1kUsd, 0, 1e3),
    });
  }, [
    averageStoredGb,
    storagePricePerGbMonthUsd,
    getRequestsPerMonth,
    putRequestsPerMonth,
    getPricePer1kUsd,
    putPricePer1kUsd,
  ]);

  return (
    <div className="calc-grid">
      <div className="panel">
        <h3>Inputs</h3>
        <div className="form">
          <div className="field field-3">
            <div className="label">Average stored (GB)</div>
            <input
              type="number"
              inputMode="decimal"
              value={averageStoredGb}
              min={0}
              onChange={(e) => setAverageStoredGb(+e.target.value)}
            />
          </div>
          <div className="field field-3">
            <div className="label">Storage price ($ / GB-month)</div>
            <input
              type="number"
              inputMode="decimal"
              value={storagePricePerGbMonthUsd}
              min={0}
              step={0.001}
              onChange={(e) => setStoragePricePerGbMonthUsd(+e.target.value)}
            />
          </div>

          <div className="field field-3">
            <div className="label">GET requests (per month)</div>
            <input
              type="number"
              inputMode="numeric"
              value={getRequestsPerMonth}
              min={0}
              step={1000}
              onChange={(e) => setGetRequestsPerMonth(+e.target.value)}
            />
          </div>
          <div className="field field-3">
            <div className="label">PUT requests (per month)</div>
            <input
              type="number"
              inputMode="numeric"
              value={putRequestsPerMonth}
              min={0}
              step={1000}
              onChange={(e) => setPutRequestsPerMonth(+e.target.value)}
            />
          </div>

          <div className="field field-3">
            <div className="label">GET price ($ / 1k)</div>
            <input
              type="number"
              inputMode="decimal"
              value={getPricePer1kUsd}
              min={0}
              step={0.0001}
              onChange={(e) => setGetPricePer1kUsd(+e.target.value)}
            />
          </div>
          <div className="field field-3">
            <div className="label">PUT price ($ / 1k)</div>
            <input
              type="number"
              inputMode="decimal"
              value={putPricePer1kUsd}
              min={0}
              step={0.0001}
              onChange={(e) => setPutPricePer1kUsd(+e.target.value)}
            />
          </div>

          <div className="field field-6">
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setAverageStoredGb(5000);
                  setStoragePricePerGbMonthUsd(0.023);
                  setGetRequestsPerMonth(5_000_000);
                  setPutRequestsPerMonth(500_000);
                  setGetPricePer1kUsd(0.0004);
                  setPutPricePer1kUsd(0.005);
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
            <div className="k">Storage cost</div>
            <div className="v">{formatCurrency2(result.storageCostUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">GET request cost</div>
            <div className="v">{formatCurrency2(result.getCostUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">PUT request cost</div>
            <div className="v">{formatCurrency2(result.putCostUsd)}</div>
          </div>
        </div>

        <details style={{ marginTop: 12 }}>
          <summary style={{ cursor: "pointer", fontWeight: 800 }}>Inputs summary</summary>
          <div style={{ overflowX: "auto", marginTop: 10 }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th className="num">Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Average stored</td>
                  <td className="num">{formatNumber(result.averageStoredGb)} GB</td>
                </tr>
                <tr>
                  <td>GET requests</td>
                  <td className="num">{formatNumber(result.getRequestsPerMonth, 0)}</td>
                </tr>
                <tr>
                  <td>PUT requests</td>
                  <td className="num">{formatNumber(result.putRequestsPerMonth, 0)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </details>
      </div>
    </div>
  );
}

