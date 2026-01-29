import React, { useMemo } from "react";
import { useBooleanParamState, useNumberParamState } from "./useNumberParamState";
import { estimateWafCost } from "../../lib/calc/waf";
import { formatCurrency2, formatNumber } from "../../lib/format";
import { clamp } from "../../lib/math";

export function AwsWafCostCalculator() {
  const [webAcls, setWebAcls] = useNumberParamState("AwsWafCost.webAcls", 2);
  const [rules, setRules] = useNumberParamState("AwsWafCost.rules", 20);
  const [requestsPerMonth, setRequestsPerMonth] = useNumberParamState("AwsWafCost.requestsPerMonth", 200_000_000);
  const [showPeakScenario, setShowPeakScenario] = useBooleanParamState("AwsWafCost.showPeakScenario", false);
  const [peakMultiplierPct, setPeakMultiplierPct] = useNumberParamState("AwsWafCost.peakMultiplierPct", 180);

  const [pricePerWebAclUsdPerMonth, setPricePerWebAclUsdPerMonth] = useNumberParamState("AwsWafCost.pricePerWebAclUsdPerMonth", 5);
  const [pricePerRuleUsdPerMonth, setPricePerRuleUsdPerMonth] = useNumberParamState("AwsWafCost.pricePerRuleUsdPerMonth", 1);
  const [pricePerMillionRequestsUsd, setPricePerMillionRequestsUsd] = useNumberParamState("AwsWafCost.pricePerMillionRequestsUsd", 0.6);
  const requestsPerSecond = requestsPerMonth / (30.4 * 24 * 3600);
  const pricePerBillionRequestsUsd = pricePerMillionRequestsUsd * 1000;

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

  const peakResult = useMemo(() => {
    if (!showPeakScenario) return null;
    const multiplier = clamp(peakMultiplierPct, 100, 1000) / 100;
    return estimateWafCost({
      webAcls: clamp(webAcls, 0, 1e9),
      rules: clamp(rules, 0, 1e9),
      requestsPerMonth: clamp(requestsPerMonth, 0, 1e18) * multiplier,
      pricePerWebAclUsdPerMonth: clamp(pricePerWebAclUsdPerMonth, 0, 1e9),
      pricePerRuleUsdPerMonth: clamp(pricePerRuleUsdPerMonth, 0, 1e9),
      pricePerMillionRequestsUsd: clamp(pricePerMillionRequestsUsd, 0, 1e9),
    });
  }, [
    peakMultiplierPct,
    pricePerMillionRequestsUsd,
    pricePerRuleUsdPerMonth,
    pricePerWebAclUsdPerMonth,
    requestsPerMonth,
    rules,
    showPeakScenario,
    webAcls,
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
            <div className="hint">Avg {formatNumber(requestsPerSecond, 2)} req/sec.</div>
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
            <div className="hint">~{formatCurrency2(pricePerBillionRequestsUsd)} per 1B requests.</div>
          </div>

          <div className="field field-3" style={{ alignSelf: "end" }}>
            <label className="muted" style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <input
                type="checkbox"
                checked={showPeakScenario}
                onChange={(e) => setShowPeakScenario(e.target.checked)}
              />
              Include peak scenario
            </label>
          </div>

          {showPeakScenario ? (
            <div className="field field-3">
              <div className="label">Peak multiplier (%)</div>
              <input
                type="number"
                inputMode="numeric"
                value={peakMultiplierPct}
                min={100}
                max={1000}
                step={5}
                onChange={(e) => setPeakMultiplierPct(+e.target.value)}
              />
              <div className="hint">Applies to requests only.</div>
            </div>
          ) : null}

          <div className="field field-6">
            <div className="label">Scenario presets</div>
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setWebAcls(1);
                  setRules(10);
                  setRequestsPerMonth(60_000_000);
                  setPricePerWebAclUsdPerMonth(5);
                  setPricePerRuleUsdPerMonth(1);
                  setPricePerMillionRequestsUsd(0.6);
                  setShowPeakScenario(true);
                  setPeakMultiplierPct(160);
                }}
              >
                Startup app
              </button>
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setWebAcls(3);
                  setRules(35);
                  setRequestsPerMonth(600_000_000);
                  setPricePerWebAclUsdPerMonth(5);
                  setPricePerRuleUsdPerMonth(1);
                  setPricePerMillionRequestsUsd(0.6);
                  setShowPeakScenario(true);
                  setPeakMultiplierPct(220);
                }}
              >
                SaaS traffic
              </button>
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setWebAcls(6);
                  setRules(80);
                  setRequestsPerMonth(2_000_000_000);
                  setPricePerWebAclUsdPerMonth(5);
                  setPricePerRuleUsdPerMonth(1);
                  setPricePerMillionRequestsUsd(0.6);
                  setShowPeakScenario(true);
                  setPeakMultiplierPct(180);
                }}
              >
                Global site
              </button>
            </div>
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
                  setShowPeakScenario(false);
                  setPeakMultiplierPct(180);
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

        {peakResult ? (
          <div style={{ marginTop: 12 }}>
            <div className="muted" style={{ fontSize: 13, marginBottom: 6 }}>Baseline vs peak</div>
            <table className="table">
              <thead>
                <tr>
                  <th>Scenario</th>
                  <th className="num">Requests</th>
                  <th className="num">Total cost</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Baseline</td>
                  <td className="num">{formatNumber(result.requestsPerMonth, 0)}</td>
                  <td className="num">{formatCurrency2(result.totalCostUsd)}</td>
                </tr>
                <tr>
                  <td>Peak</td>
                  <td className="num">{formatNumber(peakResult.requestsPerMonth, 0)}</td>
                  <td className="num">{formatCurrency2(peakResult.totalCostUsd)}</td>
                </tr>
                <tr>
                  <td>Delta</td>
                  <td className="num">{formatNumber(peakResult.requestsPerMonth - result.requestsPerMonth, 0)}</td>
                  <td className="num">{formatCurrency2(peakResult.totalCostUsd - result.totalCostUsd)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </div>
  );
}
