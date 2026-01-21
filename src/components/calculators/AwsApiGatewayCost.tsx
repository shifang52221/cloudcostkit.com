import React, { useMemo, useState } from "react";
import { estimateApiGatewayCost } from "../../lib/calc/apiGateway";
import { formatCurrency2, formatNumber } from "../../lib/format";
import { clamp } from "../../lib/math";

export function AwsApiGatewayCostCalculator() {
  const [requestsPerMonth, setRequestsPerMonth] = useState(300_000_000);
  const [pricePerMillionRequestsUsd, setPricePerMillionRequestsUsd] = useState(3.5);
  const [avgResponseKb, setAvgResponseKb] = useState(15);
  const [egressPricePerGbUsd, setEgressPricePerGbUsd] = useState(0.09);

  const result = useMemo(() => {
    return estimateApiGatewayCost({
      requestsPerMonth: clamp(requestsPerMonth, 0, 1e18),
      pricePerMillionRequestsUsd: clamp(pricePerMillionRequestsUsd, 0, 1e9),
      avgResponseKb: clamp(avgResponseKb, 0, 1e9),
      egressPricePerGbUsd: clamp(egressPricePerGbUsd, 0, 1e6),
    });
  }, [requestsPerMonth, pricePerMillionRequestsUsd, avgResponseKb, egressPricePerGbUsd]);

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
            <div className="label">Request price ($ / 1M requests)</div>
            <input
              type="number"
              inputMode="decimal"
              value={pricePerMillionRequestsUsd}
              min={0}
              step={0.01}
              onChange={(e) => setPricePerMillionRequestsUsd(+e.target.value)}
            />
          </div>

          <div className="field field-3">
            <div className="label">Avg response size (KB)</div>
            <input
              type="number"
              inputMode="decimal"
              value={avgResponseKb}
              min={0}
              step={0.1}
              onChange={(e) => setAvgResponseKb(+e.target.value)}
            />
            <div className="hint">Use the typical compressed payload size over the wire.</div>
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
            <div className="muted" style={{ fontSize: 12, marginTop: 6 }}>
              Use your effective price for internet egress or the relevant transfer path.
            </div>
          </div>

          <div className="field field-6">
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setRequestsPerMonth(300_000_000);
                  setPricePerMillionRequestsUsd(3.5);
                  setAvgResponseKb(15);
                  setEgressPricePerGbUsd(0.09);
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
            <div className="k">Request fees</div>
            <div className="v">{formatCurrency2(result.requestCostUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">Transfer</div>
            <div className="v">{formatCurrency2(result.transferCostUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">Estimated transfer (GB/month)</div>
            <div className="v">{formatNumber(result.transferGb, 0)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

