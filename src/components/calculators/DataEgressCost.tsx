import React, { useMemo, useState } from "react";
import { estimateEgressCost } from "../../lib/calc/egress";
import { formatCurrency2, formatNumber } from "../../lib/format";
import { clamp } from "../../lib/math";

type BandwidthCostProps = {
  transferLabel?: string;
  priceLabel?: string;
  priceHint?: string;
  defaultGbPerMonth?: number;
  defaultPricePerGbUsd?: number;
};

export function DataEgressCostCalculator({
  transferLabel = "Data transfer (GB / month)",
  priceLabel = "Price ($ / GB)",
  priceHint = "Enter your provider’s effective $/GB for the region/path/tier.",
  defaultGbPerMonth = 2500,
  defaultPricePerGbUsd = 0.09,
}: BandwidthCostProps) {
  const [gbPerMonth, setGbPerMonth] = useState(defaultGbPerMonth);
  const [pricePerGbUsd, setPricePerGbUsd] = useState(defaultPricePerGbUsd);

  const result = useMemo(() => {
    return estimateEgressCost({
      gbPerMonth: clamp(gbPerMonth, 0, 1e12),
      pricePerGbUsd: clamp(pricePerGbUsd, 0, 1e6),
    });
  }, [gbPerMonth, pricePerGbUsd]);

  return (
    <div className="calc-grid">
      <div className="panel">
        <h3>Inputs</h3>
        <div className="form">
          <div className="field field-3">
            <div className="label">{transferLabel}</div>
            <input
              type="number"
              inputMode="decimal"
              value={gbPerMonth}
              min={0}
              onChange={(e) => setGbPerMonth(+e.target.value)}
            />
          </div>
          <div className="field field-3">
            <div className="label">{priceLabel}</div>
            <input
              type="number"
              inputMode="decimal"
              value={pricePerGbUsd}
              min={0}
              step={0.001}
              onChange={(e) => setPricePerGbUsd(+e.target.value)}
            />
            <div className="hint">{priceHint}</div>
          </div>

          <div className="field field-6">
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setGbPerMonth(defaultGbPerMonth);
                  setPricePerGbUsd(defaultPricePerGbUsd);
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
            <div className="k">Estimated monthly cost</div>
            <div className="v">{formatCurrency2(result.monthlyCostUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">Egress</div>
            <div className="v">{formatNumber(result.gbPerMonth)} GB</div>
          </div>
          <div className="kpi">
            <div className="k">Price</div>
            <div className="v">{formatCurrency2(result.pricePerGbUsd)} / GB</div>
          </div>
        </div>
      </div>
    </div>
  );
}
