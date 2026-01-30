import React, { useMemo } from "react";
import { useBooleanParamState, useNumberParamState } from "./useNumberParamState";
import { clamp } from "../../lib/math";
import { formatNumber } from "../../lib/format";

type Estimate = {
  baseRequestsPerMessage: number;
  retryMultiplierPct: number;
  extraRequestsPerMessage: number;
  estimatedRequestsPerMessage: number;
  totalRequests: number;
  messagesPerMonth: number;
};

function estimateSqsRequests({
  messagesPerMonth,
  baseRequestsPerMessage,
  retryMultiplierPct,
  extraRequestsPerMessage,
}: {
  messagesPerMonth: number;
  baseRequestsPerMessage: number;
  retryMultiplierPct: number;
  extraRequestsPerMessage: number;
}): Estimate {
  const baseReq = clamp(baseRequestsPerMessage, 0, 1e6);
  const retryMultiplier = clamp(retryMultiplierPct, 0, 10000) / 100;
  const extraReq = clamp(extraRequestsPerMessage, 0, 1e6);
  const estimatedRequestsPerMessage = baseReq * retryMultiplier + extraReq;
  const totalRequests = clamp(messagesPerMonth, 0, 1e18) * estimatedRequestsPerMessage;

  return {
    baseRequestsPerMessage: baseReq,
    retryMultiplierPct: retryMultiplier * 100,
    extraRequestsPerMessage: extraReq,
    estimatedRequestsPerMessage,
    totalRequests,
    messagesPerMonth: clamp(messagesPerMonth, 0, 1e18),
  };
}

export function AwsSqsRequestEstimator() {
  const [messagesPerMonth, setMessagesPerMonth] = useNumberParamState("AwsSqsReq.messagesPerMonth", 200_000_000);
  const [baseRequestsPerMessage, setBaseRequestsPerMessage] = useNumberParamState("AwsSqsReq.baseRequestsPerMessage", 3);
  const [retryMultiplierPct, setRetryMultiplierPct] = useNumberParamState("AwsSqsReq.retryMultiplierPct", 120);
  const [extraRequestsPerMessage, setExtraRequestsPerMessage] = useNumberParamState("AwsSqsReq.extraRequestsPerMessage", 0);
  const [showPeakScenario, setShowPeakScenario] = useBooleanParamState("AwsSqsReq.showPeakScenario", false);
  const [peakMultiplierPct, setPeakMultiplierPct] = useNumberParamState("AwsSqsReq.peakMultiplierPct", 180);

  const baseline = useMemo(
    () =>
      estimateSqsRequests({
        messagesPerMonth,
        baseRequestsPerMessage,
        retryMultiplierPct,
        extraRequestsPerMessage,
      }),
    [baseRequestsPerMessage, extraRequestsPerMessage, messagesPerMonth, retryMultiplierPct]
  );

  const peak = useMemo(() => {
    if (!showPeakScenario) return null;
    const peakMessages = clamp(messagesPerMonth, 0, 1e18) * (clamp(peakMultiplierPct, 100, 1000) / 100);
    return estimateSqsRequests({
      messagesPerMonth: peakMessages,
      baseRequestsPerMessage,
      retryMultiplierPct,
      extraRequestsPerMessage,
    });
  }, [baseRequestsPerMessage, extraRequestsPerMessage, messagesPerMonth, peakMultiplierPct, retryMultiplierPct, showPeakScenario]);

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
            <div className="label">Base requests per message</div>
            <input
              type="number"
              inputMode="numeric"
              value={baseRequestsPerMessage}
              min={0}
              step={1}
              onChange={(e) => setBaseRequestsPerMessage(+e.target.value)}
            />
            <div className="hint">Typical baseline is 3 (Send + Receive + Delete).</div>
          </div>
          <div className="field field-3">
            <div className="label">Retry multiplier (%)</div>
            <input
              type="number"
              inputMode="decimal"
              value={retryMultiplierPct}
              min={0}
              step={5}
              onChange={(e) => setRetryMultiplierPct(+e.target.value)}
            />
            <div className="hint">100% = no retries.</div>
          </div>
          <div className="field field-3">
            <div className="label">Extra requests per message</div>
            <input
              type="number"
              inputMode="decimal"
              value={extraRequestsPerMessage}
              min={0}
              step={1}
              onChange={(e) => setExtraRequestsPerMessage(+e.target.value)}
            />
            <div className="hint">Visibility extensions or extra API calls.</div>
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
                  setBaseRequestsPerMessage(3);
                  setRetryMultiplierPct(110);
                  setExtraRequestsPerMessage(0);
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
                  setBaseRequestsPerMessage(4);
                  setRetryMultiplierPct(125);
                  setExtraRequestsPerMessage(1);
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
                  setBaseRequestsPerMessage(3);
                  setRetryMultiplierPct(120);
                  setExtraRequestsPerMessage(0);
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
                  setBaseRequestsPerMessage(3);
                  setRetryMultiplierPct(120);
                  setExtraRequestsPerMessage(0);
                  setShowPeakScenario(false);
                  setPeakMultiplierPct(180);
                }}
              >
                Reset example
              </button>
            </div>
            <div className="muted" style={{ marginTop: 8, fontSize: 12 }}>
              Use total requests in the SQS cost calculator.
            </div>
          </div>
        </div>
      </div>

      <div className="panel">
        <h3>Results</h3>
        <div className="kpis">
          <div className="kpi">
            <div className="k">Estimated requests per message</div>
            <div className="v">{formatNumber(baseline.estimatedRequestsPerMessage, 2)}</div>
          </div>
          <div className="kpi">
            <div className="k">Total requests (per month)</div>
            <div className="v">{formatNumber(baseline.totalRequests, 0)}</div>
          </div>
          <div className="kpi">
            <div className="k">Messages (per month)</div>
            <div className="v">{formatNumber(baseline.messagesPerMonth, 0)}</div>
          </div>
          <div className="kpi">
            <div className="k">Retry multiplier</div>
            <div className="v">{formatNumber(baseline.retryMultiplierPct, 0)}%</div>
          </div>
        </div>

        {peak ? (
          <div style={{ marginTop: 12 }}>
            <div className="muted" style={{ fontSize: 13, marginBottom: 6 }}>Baseline vs peak</div>
            <table className="table">
              <thead>
                <tr>
                  <th>Scenario</th>
                  <th className="num">Messages</th>
                  <th className="num">Requests</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Baseline</td>
                  <td className="num">{formatNumber(baseline.messagesPerMonth, 0)}</td>
                  <td className="num">{formatNumber(baseline.totalRequests, 0)}</td>
                </tr>
                <tr>
                  <td>Peak</td>
                  <td className="num">{formatNumber(peak.messagesPerMonth, 0)}</td>
                  <td className="num">{formatNumber(peak.totalRequests, 0)}</td>
                </tr>
                <tr>
                  <td>Delta</td>
                  <td className="num">{formatNumber(peak.messagesPerMonth - baseline.messagesPerMonth, 0)}</td>
                  <td className="num">{formatNumber(peak.totalRequests - baseline.totalRequests, 0)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </div>
  );
}
