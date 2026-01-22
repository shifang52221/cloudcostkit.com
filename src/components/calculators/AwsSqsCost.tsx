import React, { useMemo } from "react";
import { useNumberParamState } from "./useNumberParamState";
import { estimateSqsCost } from "../../lib/calc/sqs";
import { formatCurrency2, formatNumber } from "../../lib/format";
import { clamp } from "../../lib/math";

export function AwsSqsCostCalculator() {
  const [messagesPerMonth, setMessagesPerMonth] = useNumberParamState("AwsSqsCost.messagesPerMonth", 200_000_000);
  const [requestsPerMessage, setRequestsPerMessage] = useNumberParamState("AwsSqsCost.requestsPerMessage", 3);
  const [pricePerMillionRequestsUsd, setPricePerMillionRequestsUsd] = useNumberParamState("AwsSqsCost.pricePerMillionRequestsUsd", 0.4);
  const [freeRequestsPerMonth, setFreeRequestsPerMonth] = useNumberParamState("AwsSqsCost.freeRequestsPerMonth", 0);

  const result = useMemo(() => {
    return estimateSqsCost({
      messagesPerMonth: clamp(messagesPerMonth, 0, 1e18),
      requestsPerMessage: clamp(requestsPerMessage, 0, 1e6),
      pricePerMillionRequestsUsd: clamp(pricePerMillionRequestsUsd, 0, 1e9),
      freeRequestsPerMonth: clamp(freeRequestsPerMonth, 0, 1e18),
    });
  }, [messagesPerMonth, requestsPerMessage, pricePerMillionRequestsUsd, freeRequestsPerMonth]);

  return (
    <div className="calc-grid">
      <div className="panel">
        <h3>Inputs</h3>
        <div className="form">
          <div className="field field-3">
            <div className="label">Messages (per month)</div>
            <input
              type="number"
              inputMode="numeric"
              value={messagesPerMonth}
              min={0}
              step={1000}
              onChange={(e) => setMessagesPerMonth(+e.target.value)}
            />
          </div>

          <div className="field field-3">
            <div className="label">Requests per message</div>
            <input
              type="number"
              inputMode="numeric"
              value={requestsPerMessage}
              min={0}
              step={1}
              onChange={(e) => setRequestsPerMessage(+e.target.value)}
            />
            <div className="muted" style={{ fontSize: 12, marginTop: 6 }}>
              Common baseline: 3 (Send + Receive + Delete). Add more for retries, visibility timeouts, or extra API calls.
            </div>
          </div>

          <div className="field field-3">
            <div className="label">Price ($ / 1M requests)</div>
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
            <div className="label">Free requests (per month)</div>
            <input
              type="number"
              inputMode="numeric"
              value={freeRequestsPerMonth}
              min={0}
              step={1000}
              onChange={(e) => setFreeRequestsPerMonth(+e.target.value)}
            />
            <div className="muted" style={{ fontSize: 12, marginTop: 6 }}>
              Optional. Set to 0 if you don’t have a free allowance.
            </div>
          </div>

          <div className="field field-6">
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setMessagesPerMonth(200_000_000);
                  setRequestsPerMessage(3);
                  setPricePerMillionRequestsUsd(0.4);
                  setFreeRequestsPerMonth(0);
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
            <div className="v">{formatCurrency2(result.requestCostUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">Total requests (per month)</div>
            <div className="v">{formatNumber(result.totalRequests, 0)}</div>
          </div>
          <div className="kpi">
            <div className="k">Billable requests</div>
            <div className="v">{formatNumber(result.billableRequests, 0)}</div>
          </div>
          <div className="kpi">
            <div className="k">Cost per 1M messages</div>
            <div className="v">{formatCurrency2(result.costPerMillionMessagesUsd)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

