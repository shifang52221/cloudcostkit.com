import React, { useMemo } from "react";
import { useNumberParamState } from "./useNumberParamState";
import { estimateReplicationCost } from "../../lib/calc/replication";
import { formatCurrency2, formatNumber } from "../../lib/format";
import { clamp } from "../../lib/math";

export function StorageReplicationCostCalculator() {
  const [replicatedGbPerMonth, setReplicatedGbPerMonth] = useNumberParamState("StorageReplicationCost.replicatedGbPerMonth", 2500);
  const [pricePerGbUsd, setPricePerGbUsd] = useNumberParamState("StorageReplicationCost.pricePerGbUsd", 0.02);

  const result = useMemo(() => {
    return estimateReplicationCost({
      replicatedGbPerMonth: clamp(replicatedGbPerMonth, 0, 1e12),
      pricePerGbUsd: clamp(pricePerGbUsd, 0, 1e6),
    });
  }, [replicatedGbPerMonth, pricePerGbUsd]);

  return (
    <div className="calc-grid">
      <div className="panel">
        <h3>Inputs</h3>
        <div className="form">
          <div className="field field-3">
            <div className="label">Replicated data (GB / month)</div>
            <input
              type="number"
              inputMode="decimal"
              value={replicatedGbPerMonth}
              min={0}
              onChange={(e) => setReplicatedGbPerMonth(+e.target.value)}
            />
          </div>
          <div className="field field-3">
            <div className="label">Price ($ / GB)</div>
            <input
              type="number"
              inputMode="decimal"
              value={pricePerGbUsd}
              min={0}
              step={0.001}
              onChange={(e) => setPricePerGbUsd(+e.target.value)}
            />
            <div className="hint">Replication can be priced as cross-region transfer or as a feature fee.</div>
          </div>

          <div className="field field-6">
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setReplicatedGbPerMonth(2500);
                  setPricePerGbUsd(0.02);
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
            <div className="k">Estimated monthly replication cost</div>
            <div className="v">{formatCurrency2(result.monthlyCostUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">Replicated volume</div>
            <div className="v">{formatNumber(result.replicatedGbPerMonth, 0)} GB</div>
          </div>
        </div>
      </div>
    </div>
  );
}

