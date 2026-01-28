import React, { useMemo } from "react";
import { useBooleanParamState, useNumberParamState } from "./useNumberParamState";
import { estimateSqsCost } from "../../lib/calc/sqs";
import { formatCurrency2, formatNumber } from "../../lib/format";
import { clamp } from "../../lib/math";

export function AwsSqsCostCalculator() {
  const [messagesPerMonth, setMessagesPerMonth] = useNumberParamState("AwsSqsCost.messagesPerMonth", 200_000_000);
  const [requestsPerMessage, setRequestsPerMessage] = useNumberParamState("AwsSqsCost.requestsPerMessage", 3);
  const [pricePerMillionRequestsUsd, setPricePerMillionRequestsUsd] = useNumberParamState("AwsSqsCost.pricePerMillionRequestsUsd", 0.4);
  const [freeRequestsPerMonth, setFreeRequestsPerMonth] = useNumberParamState("AwsSqsCost.freeRequestsPerMonth", 0);
  const [showPeakScenario, setShowPeakScenario] = useBooleanParamState("AwsSqsCost.showPeakScenario", false);
  const [peakMultiplierPct, setPeakMultiplierPct] = useNumberParamState("AwsSqsCost.peakMultiplierPct", 180);

  const result = useMemo(() => {
    return estimateSqsCost({
      messagesPerMonth: clamp(messagesPerMonth, 0, 1e18),
      requestsPerMessage: clamp(requestsPerMessage, 0, 1e6),
      pricePerMillionRequestsUsd: clamp(pricePerMillionRequestsUsd, 0, 1e9),
      freeRequestsPerMonth: clamp(freeRequestsPerMonth, 0, 1e18),
    });
  }, [messagesPerMonth, requestsPerMessage, pricePerMillionRequestsUsd, freeRequestsPerMonth]);

  const peakResult = useMemo(() => {
    if (!showPeakScenario) return null;
    const multiplier = clamp(peakMultiplierPct, 100, 1000) / 100;
    return estimateSqsCost({
      messagesPerMonth: clamp(messagesPerMonth, 0, 1e18) * multiplier,
      requestsPerMessage: clamp(requestsPerMessage, 0, 1e6),
      pricePerMillionRequestsUsd: clamp(pricePerMillionRequestsUsd, 0, 1e9),
      freeRequestsPerMonth: clamp(freeRequestsPerMonth, 0, 1e18),
    });
  }, [freeRequestsPerMonth, messagesPerMonth, peakMultiplierPct, pricePerMillionRequestsUsd, requestsPerMessage, showPeakScenario]);

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
              Optional. Set to 0 if you don't have a free allowance.
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
              <div className="hint">Applies to message volume only.</div>
            </div>
          ) : null}

          <div className="field field-6">
            <div className="label">Scenario presets</div>
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setMessagesPerMonth(40_000_000);
                  setRequestsPerMessage(3);
                  setPricePerMillionRequestsUsd(0.4);
                  setFreeRequestsPerMonth(0);
                  setShowPeakScenario(true);
                  setPeakMultiplierPct(160);
                }}
              >
                Worker queue
              </button>
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setMessagesPerMonth(400_000_000);
                  setRequestsPerMessage(4);
                  setPricePerMillionRequestsUsd(0.4);
                  setFreeRequestsPerMonth(0);
                  setShowPeakScenario(true);
                  setPeakMultiplierPct(220);
                }}
              >
                Event bus
              </button>
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setMessagesPerMonth(1_600_000_000);
                  setRequestsPerMessage(3);
                  setPricePerMillionRequestsUsd(0.4);
                  setFreeRequestsPerMonth(0);
                  setShowPeakScenario(true);
                  setPeakMultiplierPct(180);
                }}
              >
                Streaming ingest
              </button>
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

        {peakResult ? (
          <div style={{ marginTop: 12 }}>
            <div className="muted" style={{ fontSize: 13, marginBottom: 6 }}>Baseline vs peak</div>
            <table className="table">
              <thead>
                <tr>
                  <th>Scenario</th>
                  <th className="num">Messages</th>
                  <th className="num">Requests</th>
                  <th className="num">Monthly cost</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Baseline</td>
                  <td className="num">{formatNumber(messagesPerMonth, 0)}</td>
                  <td className="num">{formatNumber(result.totalRequests, 0)}</td>
                  <td className="num">{formatCurrency2(result.requestCostUsd)}</td>
                </tr>
                <tr>
                  <td>Peak</td>
                  <td className="num">{formatNumber(messagesPerMonth * (clamp(peakMultiplierPct, 100, 1000) / 100), 0)}</td>
                  <td className="num">{formatNumber(peakResult.totalRequests, 0)}</td>
                  <td className="num">{formatCurrency2(peakResult.requestCostUsd)}</td>
                </tr>
                <tr>
                  <td>Delta</td>
                  <td className="num">{formatNumber((messagesPerMonth * (clamp(peakMultiplierPct, 100, 1000) / 100)) - messagesPerMonth, 0)}</td>
                  <td className="num">{formatNumber(peakResult.totalRequests - result.totalRequests, 0)}</td>
                  <td className="num">{formatCurrency2(peakResult.requestCostUsd - result.requestCostUsd)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </div>
  );
}




