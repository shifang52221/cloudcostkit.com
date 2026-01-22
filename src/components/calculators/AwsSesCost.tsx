import React, { useMemo } from "react";
import { useNumberParamState } from "./useNumberParamState";
import { estimateSesCost } from "../../lib/calc/ses";
import { formatCurrency2, formatNumber } from "../../lib/format";
import { clamp } from "../../lib/math";

export function AwsSesCostCalculator() {
  const [emailsPerMonth, setEmailsPerMonth] = useNumberParamState("AwsSesCost.emailsPerMonth", 5_000_000);
  const [pricePer1000EmailsUsd, setPricePer1000EmailsUsd] = useNumberParamState("AwsSesCost.pricePer1000EmailsUsd", 0.1);
  const [avgEmailKb, setAvgEmailKb] = useNumberParamState("AwsSesCost.avgEmailKb", 10);
  const [egressPricePerGbUsd, setEgressPricePerGbUsd] = useNumberParamState("AwsSesCost.egressPricePerGbUsd", 0.09);

  const result = useMemo(() => {
    return estimateSesCost({
      emailsPerMonth: clamp(emailsPerMonth, 0, 1e18),
      pricePer1000EmailsUsd: clamp(pricePer1000EmailsUsd, 0, 1e9),
      avgEmailKb: clamp(avgEmailKb, 0, 1e9),
      egressPricePerGbUsd: clamp(egressPricePerGbUsd, 0, 1e9),
    });
  }, [emailsPerMonth, pricePer1000EmailsUsd, avgEmailKb, egressPricePerGbUsd]);

  return (
    <div className="calc-grid">
      <div className="panel">
        <h3>Inputs</h3>
        <div className="form">
          <div className="field field-3">
            <div className="label">Emails sent (per month)</div>
            <input
              type="number"
              inputMode="numeric"
              value={emailsPerMonth}
              min={0}
              step={1000}
              onChange={(e) => setEmailsPerMonth(+e.target.value)}
            />
          </div>
          <div className="field field-3">
            <div className="label">Send price ($ / 1000 emails)</div>
            <input
              type="number"
              inputMode="decimal"
              value={pricePer1000EmailsUsd}
              min={0}
              step={0.001}
              onChange={(e) => setPricePer1000EmailsUsd(+e.target.value)}
            />
            <div className="hint">Use your effective region pricing.</div>
          </div>
          <div className="field field-3">
            <div className="label">Avg email size (KB)</div>
            <input
              type="number"
              inputMode="decimal"
              value={avgEmailKb}
              min={0}
              step={0.1}
              onChange={(e) => setAvgEmailKb(+e.target.value)}
            />
            <div className="hint">Use the approximate on-the-wire payload size.</div>
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
            <div className="hint">Set to 0 for a send-only estimate.</div>
          </div>

          <div className="field field-6">
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setEmailsPerMonth(5_000_000);
                  setPricePer1000EmailsUsd(0.1);
                  setAvgEmailKb(10);
                  setEgressPricePerGbUsd(0.09);
                }}
              >
                Reset example
              </button>
            </div>
            <div className="muted" style={{ marginTop: 8, fontSize: 12 }}>
              This estimates send charges plus optional transfer. Dedicated IPs, inbound email, add-ons, and downstream
              systems can add cost.
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
            <div className="k">Send charges</div>
            <div className="v">{formatCurrency2(result.messageCostUsd)}</div>
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

