import React, { useMemo, useState } from "react";
import { estimateWafCost } from "../../lib/calc/waf";
import { formatCurrency2, formatNumber } from "../../lib/format";
import { clamp } from "../../lib/math";

export function AwsWafCostCalculator() {
  const [webAcls, setWebAcls] = useState(2);
  const [rules, setRules] = useState(20);
  const [requestsPerMonth, setRequestsPerMonth] = useState(200_000_000);

  const [pricePerWebAclUsdPerMonth, setPricePerWebAclUsdPerMonth] = useState(5);
  const [pricePerRuleUsdPerMonth, setPricePerRuleUsdPerMonth] = useState(1);
  const [pricePerMillionRequestsUsd, setPricePerMillionRequestsUsd] = useState(0.6);

  const result = useMemo(() => {
    return estimateWafCost({
      webAcls: clamp(webAcls, 0, 1e9),
      rules: clamp(rules, 0, 1e9),
      requestsPerMonth: clamp(requestsPerMonth, 0, 1e18),
      pricePerWebAclUsdPerMonth: clamp(pricePerWebAclUsdPerMonth, 0, 1e9),
      pricePerRuleUsdPerMonth: clamp(pricePerRuleUsdPerMonth, 0, 1e9),
      pricePerMillionRequestsUsd: clamp(pricePerMillionRequestsUsd, 0, 1e9),
    });
  }, [
    webAcls,
    rules,
    requestsPerMonth,
    pricePerWebAclUsdPerMonth,
    pricePerRuleUsdPerMonth,
    pricePerMillionRequestsUsd,
  ]);

  return (
    <div className="calc-grid">
      <div className="panel">
        <h3>Inputs</h3>
        <div className="form">
          <div className="field field-3">
            <div className="label">Web ACLs</div>
            <input
              type="number"
              inputMode="numeric"
              value={webAcls}
              min={0}
              step={1}
              onChange={(e) => setWebAcls(+e.target.value)}
            />
          </div>
          <div className="field field-3">
            <div className="label">Rules (total)</div>
            <input
              type="number"
              inputMode="numeric"
              value={rules}
              min={0}
              step={1}
              onChange={(e) => setRules(+e.target.value)}
            />
            <div className="hint">Count managed rule groups and custom rules you evaluate.</div>
          </div>
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
            <div className="label">Price ($ / Web ACL / month)</div>
            <input
              type="number"
              inputMode="decimal"
              value={pricePerWebAclUsdPerMonth}
              min={0}
              step={0.01}
              onChange={(e) => setPricePerWebAclUsdPerMonth(+e.target.value)}
            />
          </div>
          <div className="field field-3">
            <div className="label">Price ($ / rule / month)</div>
            <input
              type="number"
              inputMode="decimal"
              value={pricePerRuleUsdPerMonth}
              min={0}
              step={0.01}
              onChange={(e) => setPricePerRuleUsdPerMonth(+e.target.value)}
            />
          </div>
          <div className="field field-3">
            <div className="label">Price ($ / 1M requests)</div>
            <input
              type="number"
              inputMode="decimal"
              value={pricePerMillionRequestsUsd}
              min={0}
              step={0.001}
              onChange={(e) => setPricePerMillionRequestsUsd(+e.target.value)}
            />
            <div className="hint">Use your effective region/product pricing.</div>
          </div>

          <div className="field field-6">
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setWebAcls(2);
                  setRules(20);
                  setRequestsPerMonth(200_000_000);
                  setPricePerWebAclUsdPerMonth(5);
                  setPricePerRuleUsdPerMonth(1);
                  setPricePerMillionRequestsUsd(0.6);
                }}
              >
                Reset example
              </button>
            </div>
            <div className="muted" style={{ marginTop: 8, fontSize: 12 }}>
              This model excludes add-ons like bot control, CAPTCHA/challenges, logging, and downstream analytics.
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
            <div className="k">Web ACLs</div>
            <div className="v">{formatCurrency2(result.aclCostUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">Rules</div>
            <div className="v">{formatCurrency2(result.rulesCostUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">Requests</div>
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

