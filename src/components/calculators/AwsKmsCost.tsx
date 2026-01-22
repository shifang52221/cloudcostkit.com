import React, { useMemo } from "react";
import { useNumberParamState } from "./useNumberParamState";
import { estimateKmsCost } from "../../lib/calc/kms";
import { formatCurrency2, formatNumber } from "../../lib/format";
import { clamp } from "../../lib/math";

export function AwsKmsCostCalculator() {
  const [keys, setKeys] = useNumberParamState("AwsKmsCost.keys", 50);
  const [requestsPerMonth, setRequestsPerMonth] = useNumberParamState("AwsKmsCost.requestsPerMonth", 300_000_000);
  const [pricePerKeyUsdPerMonth, setPricePerKeyUsdPerMonth] = useNumberParamState("AwsKmsCost.pricePerKeyUsdPerMonth", 1);
  const [pricePer10kRequestsUsd, setPricePer10kRequestsUsd] = useNumberParamState("AwsKmsCost.pricePer10kRequestsUsd", 0.03);

  const result = useMemo(() => {
    return estimateKmsCost({
      keys: clamp(keys, 0, 1e9),
      requestsPerMonth: clamp(requestsPerMonth, 0, 1e18),
      pricePerKeyUsdPerMonth: clamp(pricePerKeyUsdPerMonth, 0, 1e9),
      pricePer10kRequestsUsd: clamp(pricePer10kRequestsUsd, 0, 1e9),
    });
  }, [keys, requestsPerMonth, pricePerKeyUsdPerMonth, pricePer10kRequestsUsd]);

  return (
    <div className="calc-grid">
      <div className="panel">
        <h3>Inputs</h3>
        <div className="form">
          <div className="field field-3">
            <div className="label">Customer managed keys (count)</div>
            <input
              type="number"
              inputMode="numeric"
              value={keys}
              min={0}
              step={1}
              onChange={(e) => setKeys(+e.target.value)}
            />
          </div>
          <div className="field field-3">
            <div className="label">KMS requests (per month)</div>
            <input
              type="number"
              inputMode="numeric"
              value={requestsPerMonth}
              min={0}
              step={1000}
              onChange={(e) => setRequestsPerMonth(+e.target.value)}
            />
            <div className="hint">Total Encrypt/Decrypt/GenerateDataKey/etc. across services.</div>
          </div>
          <div className="field field-3">
            <div className="label">Price ($ / key-month)</div>
            <input
              type="number"
              inputMode="decimal"
              value={pricePerKeyUsdPerMonth}
              min={0}
              step={0.01}
              onChange={(e) => setPricePerKeyUsdPerMonth(+e.target.value)}
            />
          </div>
          <div className="field field-3">
            <div className="label">Price ($ / 10k requests)</div>
            <input
              type="number"
              inputMode="decimal"
              value={pricePer10kRequestsUsd}
              min={0}
              step={0.001}
              onChange={(e) => setPricePer10kRequestsUsd(+e.target.value)}
            />
            <div className="hint">Use your effective region pricing and request type mix.</div>
          </div>

          <div className="field field-6">
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setKeys(50);
                  setRequestsPerMonth(300_000_000);
                  setPricePerKeyUsdPerMonth(1);
                  setPricePer10kRequestsUsd(0.03);
                }}
              >
                Reset example
              </button>
            </div>
            <div className="muted" style={{ marginTop: 8, fontSize: 12 }}>
              Simplified estimate: key-months + request charges. Multi-region keys, custom key stores, and downstream
              service charges are excluded.
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
            <div className="k">Key-month charges</div>
            <div className="v">{formatCurrency2(result.keyCostUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">Request charges</div>
            <div className="v">{formatCurrency2(result.requestCostUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">Requests/month</div>
            <div className="v">{formatNumber(result.requestsPerMonth, 0)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

