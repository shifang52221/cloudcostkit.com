import React, { useMemo } from "react";
import { useNumberParamState } from "./useNumberParamState";
import { useStringParamState } from "./useNumberParamState";
import { estimateRequestCostPer10k } from "../../lib/calc/requests";
import { formatCurrency2, formatNumber } from "../../lib/format";
import { clamp } from "../../lib/math";

export function CdnRequestCostCalculator() {
  const [requestsPerMonth, setRequestsPerMonth] = useNumberParamState("CdnRequestCost.requestsPerMonth", 300_000_000);
  const [pricePer10kUsd, setPricePer10kUsd] = useNumberParamState("CdnRequestCost.pricePer10kUsd", 0.0075);
  const [pricingUnit, setPricingUnit] = useStringParamState("CdnRequestCost.pricingUnit", "per10k", ["per10k", "per1m"] as const);

  const result = useMemo(() => {
    return estimateRequestCostPer10k({
      requestsPerMonth: clamp(requestsPerMonth, 0, 1e18),
      pricePer10kUsd: clamp(pricePer10kUsd, 0, 1e9),
    });
  }, [requestsPerMonth, pricePer10kUsd]);

  const priceInputLabel = pricingUnit === "per1m" ? "Price ($ / 1M requests)" : "Price ($ / 10k requests)";
  const priceInputValue = pricingUnit === "per1m" ? pricePer10kUsd * 100 : pricePer10kUsd;
  const effectivePer1m = pricePer10kUsd * 100;

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
            <div className="label">Pricing unit</div>
            <select value={pricingUnit} onChange={(e) => setPricingUnit(String(e.target.value))}>
              <option value="per10k">$ per 10k</option>
              <option value="per1m">$ per 1M</option>
            </select>
            <div className="hint">Per 1M is 100× per 10k.</div>
          </div>
          <div className="field field-3">
            <div className="label">{priceInputLabel}</div>
            <input
              type="number"
              inputMode="decimal"
              value={priceInputValue}
              min={0}
              step={0.0001}
              onChange={(e) => {
                const next = +e.target.value;
                if (pricingUnit === "per1m") setPricePer10kUsd(next / 100);
                else setPricePer10kUsd(next);
              }}
            />
            <div className="hint">
              Effective rate: {formatCurrency2(effectivePer1m)} / 1M requests
            </div>
          </div>

          <div className="field field-6">
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setRequestsPerMonth(300_000_000);
                  setPricePer10kUsd(0.0075);
                  setPricingUnit("per10k");
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
