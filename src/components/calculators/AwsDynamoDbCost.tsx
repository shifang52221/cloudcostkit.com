import React, { useMemo, useState } from "react";
import { estimateDynamoDbCost } from "../../lib/calc/dynamodb";
import { formatCurrency2, formatNumber } from "../../lib/format";
import { clamp } from "../../lib/math";

export function AwsDynamoDbCostCalculator() {
  const [readRequestsPerMonth, setReadRequestsPerMonth] = useState(2_000_000_000);
  const [writeRequestsPerMonth, setWriteRequestsPerMonth] = useState(500_000_000);
  const [pricePerMillionReadRequestsUsd, setPricePerMillionReadRequestsUsd] = useState(0.25);
  const [pricePerMillionWriteRequestsUsd, setPricePerMillionWriteRequestsUsd] = useState(1.25);

  const [storageGb, setStorageGb] = useState(200);
  const [pricePerGbMonthUsd, setPricePerGbMonthUsd] = useState(0.25);

  const result = useMemo(() => {
    return estimateDynamoDbCost({
      readRequestsPerMonth: clamp(readRequestsPerMonth, 0, 1e18),
      writeRequestsPerMonth: clamp(writeRequestsPerMonth, 0, 1e18),
      pricePerMillionReadRequestsUsd: clamp(pricePerMillionReadRequestsUsd, 0, 1e9),
      pricePerMillionWriteRequestsUsd: clamp(pricePerMillionWriteRequestsUsd, 0, 1e9),
      storageGb: clamp(storageGb, 0, 1e12),
      pricePerGbMonthUsd: clamp(pricePerGbMonthUsd, 0, 1e3),
    });
  }, [
    readRequestsPerMonth,
    writeRequestsPerMonth,
    pricePerMillionReadRequestsUsd,
    pricePerMillionWriteRequestsUsd,
    storageGb,
    pricePerGbMonthUsd,
  ]);

  return (
    <div className="calc-grid">
      <div className="panel">
        <h3>Inputs</h3>
        <div className="form">
          <div className="field field-3">
            <div className="label">Read requests (per month)</div>
            <input
              type="number"
              inputMode="numeric"
              value={readRequestsPerMonth}
              min={0}
              step={1000}
              onChange={(e) => setReadRequestsPerMonth(+e.target.value)}
            />
          </div>
          <div className="field field-3">
            <div className="label">Write requests (per month)</div>
            <input
              type="number"
              inputMode="numeric"
              value={writeRequestsPerMonth}
              min={0}
              step={1000}
              onChange={(e) => setWriteRequestsPerMonth(+e.target.value)}
            />
          </div>

          <div className="field field-3">
            <div className="label">Read price ($ / 1M requests)</div>
            <input
              type="number"
              inputMode="decimal"
              value={pricePerMillionReadRequestsUsd}
              min={0}
              step={0.01}
              onChange={(e) => setPricePerMillionReadRequestsUsd(+e.target.value)}
            />
          </div>
          <div className="field field-3">
            <div className="label">Write price ($ / 1M requests)</div>
            <input
              type="number"
              inputMode="decimal"
              value={pricePerMillionWriteRequestsUsd}
              min={0}
              step={0.01}
              onChange={(e) => setPricePerMillionWriteRequestsUsd(+e.target.value)}
            />
          </div>

          <div className="field field-3">
            <div className="label">Table storage (GB-month)</div>
            <input
              type="number"
              inputMode="numeric"
              value={storageGb}
              min={0}
              step={1}
              onChange={(e) => setStorageGb(+e.target.value)}
            />
          </div>
          <div className="field field-3">
            <div className="label">Storage price ($ / GB-month)</div>
            <input
              type="number"
              inputMode="decimal"
              value={pricePerGbMonthUsd}
              min={0}
              step={0.01}
              onChange={(e) => setPricePerGbMonthUsd(+e.target.value)}
            />
          </div>

          <div className="field field-6">
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setReadRequestsPerMonth(2_000_000_000);
                  setWriteRequestsPerMonth(500_000_000);
                  setPricePerMillionReadRequestsUsd(0.25);
                  setPricePerMillionWriteRequestsUsd(1.25);
                  setStorageGb(200);
                  setPricePerGbMonthUsd(0.25);
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
            <div className="v">{formatCurrency2(result.totalCostUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">Reads</div>
            <div className="v">{formatCurrency2(result.readCostUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">Writes</div>
            <div className="v">{formatCurrency2(result.writeCostUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">Storage</div>
            <div className="v">{formatCurrency2(result.storageCostUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">Read requests</div>
            <div className="v">{formatNumber(result.readRequestsPerMonth, 0)}</div>
          </div>
          <div className="kpi">
            <div className="k">Write requests</div>
            <div className="v">{formatNumber(result.writeRequestsPerMonth, 0)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

