import React, { useMemo, useState } from "react";
import { useBooleanParamState, useNumberParamState } from "./useNumberParamState";
import { estimateApiGatewayCost } from "../../lib/calc/apiGateway";
import { formatCurrency2, formatNumber } from "../../lib/format";
import { clamp } from "../../lib/math";

export function AwsApiGatewayCostCalculator() {
  const [requestsPerMonth, setRequestsPerMonth] = useNumberParamState("AwsApiGatewayCost.requestsPerMonth", 300_000_000);
  const [pricePerMillionRequestsUsd, setPricePerMillionRequestsUsd] = useNumberParamState("AwsApiGatewayCost.pricePerMillionRequestsUsd", 3.5);
  const [avgResponseKb, setAvgResponseKb] = useNumberParamState("AwsApiGatewayCost.avgResponseKb", 15);
  const [egressPricePerGbUsd, setEgressPricePerGbUsd] = useNumberParamState("AwsApiGatewayCost.egressPricePerGbUsd", 0.09);
  const [showPeakScenario, setShowPeakScenario] = useBooleanParamState("AwsApiGatewayCost.showPeakScenario", false);
  const [peakMultiplierPct, setPeakMultiplierPct] = useNumberParamState("AwsApiGatewayCost.peakMultiplierPct", 180);
  const secondsPerMonth = 30.4 * 24 * 3600;
  const requestsPerSecond = requestsPerMonth / secondsPerMonth;
  const [avgRps, setAvgRps] = useState(120);
  const estimatedRequestsPerMonth = clamp(avgRps, 0, 1e12) * secondsPerMonth;

  const result = useMemo(() => {
    return estimateApiGatewayCost({
      requestsPerMonth: clamp(requestsPerMonth, 0, 1e18),
      pricePerMillionRequestsUsd: clamp(pricePerMillionRequestsUsd, 0, 1e9),
      avgResponseKb: clamp(avgResponseKb, 0, 1e9),
      egressPricePerGbUsd: clamp(egressPricePerGbUsd, 0, 1e6),
    });
  }, [requestsPerMonth, pricePerMillionRequestsUsd, avgResponseKb, egressPricePerGbUsd]);

  const peakResult = useMemo(() => {
    if (!showPeakScenario) return null;
    const multiplier = clamp(peakMultiplierPct, 100, 1000) / 100;
    return estimateApiGatewayCost({
      requestsPerMonth: clamp(requestsPerMonth, 0, 1e18) * multiplier,
      pricePerMillionRequestsUsd: clamp(pricePerMillionRequestsUsd, 0, 1e9),
      avgResponseKb: clamp(avgResponseKb, 0, 1e9),
      egressPricePerGbUsd: clamp(egressPricePerGbUsd, 0, 1e6),
    });
  }, [avgResponseKb, egressPricePerGbUsd, peakMultiplierPct, pricePerMillionRequestsUsd, requestsPerMonth, showPeakScenario]);
  const costPerMillionRequests = result.requestsPerMonth > 0 ? (result.totalCostUsd / result.requestsPerMonth) * 1_000_000 : 0;
  const transferPerRequestKb = result.requestsPerMonth > 0 ? (result.transferGb * 1024 * 1024) / result.requestsPerMonth : 0;

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
            <div className="hint">Avg {formatNumber(requestsPerSecond, 2)} req/sec.</div>
          </div>
          <div className="field field-3">
            <div className="label">Avg RPS</div>
            <input
              type="number"
              inputMode="decimal"
              value={avgRps}
              min={0}
              step={0.1}
              onChange={(e) => setAvgRps(+e.target.value)}
            />
            <div className="hint">Use a realistic baseline RPS.</div>
          </div>
          <div className="field field-3" style={{ alignSelf: "end" }}>
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => setRequestsPerMonth(Math.round(estimatedRequestsPerMonth))}
              >
                Use estimate
              </button>
            </div>
            <div className="hint">Est {formatNumber(estimatedRequestsPerMonth, 0)} requests/month.</div>
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
              <div className="hint">Apply to request volume for seasonal spikes.</div>
            </div>
          ) : null}

          <div className="field field-6">
            <div className="label">Scenario presets</div>
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setRequestsPerMonth(120_000_000);
                  setPricePerMillionRequestsUsd(3.5);
                  setAvgResponseKb(12);
                  setEgressPricePerGbUsd(0.09);
                  setShowPeakScenario(true);
                  setPeakMultiplierPct(160);
                }}
              >
                SaaS baseline
              </button>
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setRequestsPerMonth(600_000_000);
                  setPricePerMillionRequestsUsd(3.5);
                  setAvgResponseKb(24);
                  setEgressPricePerGbUsd(0.09);
                  setShowPeakScenario(true);
                  setPeakMultiplierPct(220);
                }}
              >
                Partner API
              </button>
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setRequestsPerMonth(1_800_000_000);
                  setPricePerMillionRequestsUsd(3.0);
                  setAvgResponseKb(30);
                  setEgressPricePerGbUsd(0.08);
                  setShowPeakScenario(true);
                  setPeakMultiplierPct(180);
                }}
              >
                Public API
              </button>
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
                  setShowPeakScenario(false);
                  setPeakMultiplierPct(180);
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
          <div className="kpi">
            <div className="k">Cost per 1M requests</div>
            <div className="v">{formatCurrency2(costPerMillionRequests)}</div>
          </div>
          <div className="kpi">
            <div className="k">Transfer per request</div>
            <div className="v">{formatNumber(transferPerRequestKb, 2)} KB</div>
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
                  <th className="num">Transfer (GB)</th>
                  <th className="num">Total cost</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Baseline</td>
                  <td className="num">{formatNumber(result.requestsPerMonth, 0)}</td>
                  <td className="num">{formatNumber(result.transferGb, 0)}</td>
                  <td className="num">{formatCurrency2(result.totalCostUsd)}</td>
                </tr>
                <tr>
                  <td>Peak</td>
                  <td className="num">{formatNumber(peakResult.requestsPerMonth, 0)}</td>
                  <td className="num">{formatNumber(peakResult.transferGb, 0)}</td>
                  <td className="num">{formatCurrency2(peakResult.totalCostUsd)}</td>
                </tr>
                <tr>
                  <td>Delta</td>
                  <td className="num">{formatNumber(peakResult.requestsPerMonth - result.requestsPerMonth, 0)}</td>
                  <td className="num">{formatNumber(peakResult.transferGb - result.transferGb, 0)}</td>
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
