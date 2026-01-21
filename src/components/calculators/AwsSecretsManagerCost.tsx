import React, { useMemo, useState } from "react";
import { estimateSecretsManagerCost } from "../../lib/calc/secretsManager";
import { formatCurrency2, formatNumber } from "../../lib/format";
import { clamp } from "../../lib/math";

export function AwsSecretsManagerCostCalculator() {
  const [secrets, setSecrets] = useState(500);
  const [pricePerSecretUsdPerMonth, setPricePerSecretUsdPerMonth] = useState(0.4);

  const [apiCallsPerMonth, setApiCallsPerMonth] = useState(300_000_000);
  const [pricePer10kApiCallsUsd, setPricePer10kApiCallsUsd] = useState(0.05);

  const result = useMemo(() => {
    return estimateSecretsManagerCost({
      secrets: clamp(secrets, 0, 1e12),
      pricePerSecretUsdPerMonth: clamp(pricePerSecretUsdPerMonth, 0, 1e9),
      apiCallsPerMonth: clamp(apiCallsPerMonth, 0, 1e18),
      pricePer10kApiCallsUsd: clamp(pricePer10kApiCallsUsd, 0, 1e9),
    });
  }, [secrets, pricePerSecretUsdPerMonth, apiCallsPerMonth, pricePer10kApiCallsUsd]);

  return (
    <div className="calc-grid">
      <div className="panel">
        <h3>Inputs</h3>
        <div className="form">
          <div className="field field-3">
            <div className="label">Secrets (count)</div>
            <input
              type="number"
              inputMode="numeric"
              value={secrets}
              min={0}
              step={1}
              onChange={(e) => setSecrets(+e.target.value)}
            />
          </div>
          <div className="field field-3">
            <div className="label">Price ($ / secret-month)</div>
            <input
              type="number"
              inputMode="decimal"
              value={pricePerSecretUsdPerMonth}
              min={0}
              step={0.001}
              onChange={(e) => setPricePerSecretUsdPerMonth(+e.target.value)}
            />
            <div className="hint">Use your effective region pricing and secret type assumptions.</div>
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
            <div className="hint">GetSecretValue, PutSecretValue, DescribeSecret, List*, etc.</div>
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
            <div className="hint">Set to 0 if you want a secret-month-only estimate.</div>
          </div>

          <div className="field field-6">
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setSecrets(500);
                  setPricePerSecretUsdPerMonth(0.4);
                  setApiCallsPerMonth(300_000_000);
                  setPricePer10kApiCallsUsd(0.05);
                }}
              >
                Reset example
              </button>
            </div>
            <div className="muted" style={{ marginTop: 8, fontSize: 12 }}>
              Simplified estimate: secret-month charges + API request charges. Rotation workflows and downstream services
              may add costs.
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
            <div className="k">Secrets</div>
            <div className="v">{formatCurrency2(result.secretCostUsd)}</div>
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

