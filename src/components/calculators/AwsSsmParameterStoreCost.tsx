import React, { useMemo } from "react";
import { useNumberParamState } from "./useNumberParamState";
import { estimateSsmParameterStoreCost } from "../../lib/calc/ssmParameterStore";
import { formatCurrency2, formatNumber } from "../../lib/format";
import { clamp } from "../../lib/math";

export function AwsSsmParameterStoreCostCalculator() {
  const [standardParameters, setStandardParameters] = useNumberParamState("AwsSsmParameterStoreCost.standardParameters", 1000);
  const [advancedParameters, setAdvancedParameters] = useNumberParamState("AwsSsmParameterStoreCost.advancedParameters", 200);
  const [pricePerAdvancedParameterUsdPerMonth, setPricePerAdvancedParameterUsdPerMonth] = useNumberParamState("AwsSsmParameterStoreCost.pricePerAdvancedParameterUsdPerMonth", 0.05);

  const [apiCallsPerMonth, setApiCallsPerMonth] = useNumberParamState("AwsSsmParameterStoreCost.apiCallsPerMonth", 200_000_000);
  const [pricePer10kApiCallsUsd, setPricePer10kApiCallsUsd] = useNumberParamState("AwsSsmParameterStoreCost.pricePer10kApiCallsUsd", 0.05);

  const result = useMemo(() => {
    return estimateSsmParameterStoreCost({
      standardParameters: clamp(standardParameters, 0, 1e12),
      advancedParameters: clamp(advancedParameters, 0, 1e12),
      pricePerAdvancedParameterUsdPerMonth: clamp(pricePerAdvancedParameterUsdPerMonth, 0, 1e9),
      apiCallsPerMonth: clamp(apiCallsPerMonth, 0, 1e18),
      pricePer10kApiCallsUsd: clamp(pricePer10kApiCallsUsd, 0, 1e9),
    });
  }, [
    standardParameters,
    advancedParameters,
    pricePerAdvancedParameterUsdPerMonth,
    apiCallsPerMonth,
    pricePer10kApiCallsUsd,
  ]);

  return (
    <div className="calc-grid">
      <div className="panel">
        <h3>Inputs</h3>
        <div className="form">
          <div className="field field-3">
            <div className="label">Standard parameters (count)</div>
            <input
              type="number"
              inputMode="numeric"
              value={standardParameters}
              min={0}
              step={1}
              onChange={(e) => setStandardParameters(+e.target.value)}
            />
            <div className="hint">Often free or low-cost; include for inventory sanity.</div>
          </div>
          <div className="field field-3">
            <div className="label">Advanced parameters (count)</div>
            <input
              type="number"
              inputMode="numeric"
              value={advancedParameters}
              min={0}
              step={1}
              onChange={(e) => setAdvancedParameters(+e.target.value)}
            />
            <div className="hint">Charged per parameter-month in many pricing models.</div>
          </div>
          <div className="field field-3">
            <div className="label">Price ($ / advanced parameter-month)</div>
            <input
              type="number"
              inputMode="decimal"
              value={pricePerAdvancedParameterUsdPerMonth}
              min={0}
              step={0.001}
              onChange={(e) => setPricePerAdvancedParameterUsdPerMonth(+e.target.value)}
            />
          </div>

          <div className="field field-3">
            <div className="label">API calls (per month)</div>
            <input
              type="number"
              inputMode="numeric"
              value={apiCallsPerMonth}
              min={0}
              step={1000}
              onChange={(e) => setApiCallsPerMonth(+e.target.value)}
            />
            <div className="hint">GetParameter(s), PutParameter, List*, etc. Use a measured baseline.</div>
          </div>
          <div className="field field-3">
            <div className="label">Price ($ / 10k API calls)</div>
            <input
              type="number"
              inputMode="decimal"
              value={pricePer10kApiCallsUsd}
              min={0}
              step={0.001}
              onChange={(e) => setPricePer10kApiCallsUsd(+e.target.value)}
            />
            <div className="hint">Use your effective region pricing and free-tier assumptions.</div>
          </div>

          <div className="field field-6">
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setStandardParameters(1000);
                  setAdvancedParameters(200);
                  setPricePerAdvancedParameterUsdPerMonth(0.05);
                  setApiCallsPerMonth(200_000_000);
                  setPricePer10kApiCallsUsd(0.05);
                }}
              >
                Reset example
              </button>
            </div>
            <div className="muted" style={{ marginTop: 8, fontSize: 12 }}>
              Simplified estimate: advanced parameter-month charges + API call charges. Additional features and downstream
              systems are excluded.
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
            <div className="k">Advanced parameters</div>
            <div className="v">{formatCurrency2(result.advancedParameterCostUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">API calls</div>
            <div className="v">{formatCurrency2(result.apiCostUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">API calls/month</div>
            <div className="v">{formatNumber(result.apiCallsPerMonth, 0)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

