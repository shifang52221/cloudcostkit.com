import React, { useMemo, useState } from "react";
import { estimateEcrCost } from "../../lib/calc/ecr";
import { formatCurrency2, formatNumber } from "../../lib/format";
import { clamp } from "../../lib/math";

export function AwsEcrCostCalculator() {
  const [storedGbMonth, setStoredGbMonth] = useState(2000);
  const [pricePerGbMonthUsd, setPricePerGbMonthUsd] = useState(0.1);
  const [egressGbPerMonth, setEgressGbPerMonth] = useState(500);
  const [egressPricePerGbUsd, setEgressPricePerGbUsd] = useState(0.09);

  const result = useMemo(() => {
    return estimateEcrCost({
      storedGbMonth: clamp(storedGbMonth, 0, 1e18),
      pricePerGbMonthUsd: clamp(pricePerGbMonthUsd, 0, 1e9),
      egressGbPerMonth: clamp(egressGbPerMonth, 0, 1e18),
      egressPricePerGbUsd: clamp(egressPricePerGbUsd, 0, 1e9),
    });
  }, [storedGbMonth, pricePerGbMonthUsd, egressGbPerMonth, egressPricePerGbUsd]);

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
              value={pricePerGbMonthUsd}
              min={0}
              step={0.001}
              onChange={(e) => setPricePerGbMonthUsd(+e.target.value)}
            />
          </div>
          <div className="field field-3">
            <div className="label">Data transfer out (GB/month)</div>
            <input
              type="number"
              inputMode="decimal"
              value={egressGbPerMonth}
              min={0}
              step={1}
              onChange={(e) => setEgressGbPerMonth(+e.target.value)}
            />
            <div className="hint">If your pulls are inside AWS/VPC, egress may be lower.</div>
          </div>
          <div className="field field-3">
            <div className="label">Egress price ($ / GB)</div>
            <input
              type="number"
              inputMode="decimal"
              value={egressPricePerGbUsd}
              min={0}
              step={0.001}
              onChange={(e) => setEgressPricePerGbUsd(+e.target.value)}
            />
          </div>

          <div className="field field-6">
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setStoredGbMonth(2000);
                  setPricePerGbMonthUsd(0.1);
                  setEgressGbPerMonth(500);
                  setEgressPricePerGbUsd(0.09);
                }}
              >
                Reset example
              </button>
            </div>
            <div className="muted" style={{ marginTop: 8, fontSize: 12 }}>
              This is a simplified storage + transfer model. Scanning, replication, and downstream network paths can add
              cost.
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
            <div className="k">Transfer</div>
            <div className="v">{formatCurrency2(result.transferCostUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">Stored (GB-month)</div>
            <div className="v">{formatNumber(result.storedGbMonth, 0)}</div>
          </div>
          <div className="kpi">
            <div className="k">Egress (GB/month)</div>
            <div className="v">{formatNumber(result.egressGbPerMonth, 0)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

