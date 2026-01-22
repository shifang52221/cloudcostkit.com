import React, { useMemo } from "react";
import { useNumberParamState } from "./useNumberParamState";
import { estimateLogCost } from "../../lib/calc/logs";
import { formatCurrency2, formatNumber } from "../../lib/format";
import { clamp } from "../../lib/math";

function estimateGbPerDayFromRequests(opts: { requestsPerMonth: number; bytesPerRequest: number; daysPerMonth?: number }) {
  const daysPerMonth = clamp(opts.daysPerMonth ?? 30.4, 1, 31);
  const requestsPerMonth = clamp(opts.requestsPerMonth, 0, 1e18);
  const bytesPerRequest = clamp(opts.bytesPerRequest, 0, 1e7);
  const bytesPerDay = requestsPerMonth / daysPerMonth * bytesPerRequest;
  return bytesPerDay / 1e9;
}

export function AwsApiGatewayAccessLogCostCalculator() {
  const [requestsPerMonth, setRequestsPerMonth] = useNumberParamState("AwsApiGatewayAccessLogCost.requestsPerMonth", 50_000_000);
  const [avgLogBytesPerRequest, setAvgLogBytesPerRequest] = useNumberParamState("AwsApiGatewayAccessLogCost.avgLogBytesPerRequest", 1500);
  const [retentionDays, setRetentionDays] = useNumberParamState("AwsApiGatewayAccessLogCost.retentionDays", 30);
  const [ingestPricePerGbUsd, setIngestPricePerGbUsd] = useNumberParamState("AwsApiGatewayAccessLogCost.ingestPricePerGbUsd", 0.5);
  const [storagePricePerGbMonthUsd, setStoragePricePerGbMonthUsd] = useNumberParamState("AwsApiGatewayAccessLogCost.storagePricePerGbMonthUsd", 0.03);

  const gbPerDay = useMemo(() => {
    return estimateGbPerDayFromRequests({
      requestsPerMonth,
      bytesPerRequest: avgLogBytesPerRequest,
      daysPerMonth: 30.4,
    });
  }, [requestsPerMonth, avgLogBytesPerRequest]);

  const cost = useMemo(() => {
    return estimateLogCost({
      gbPerDayIngest: clamp(gbPerDay, 0, 1e12),
      retentionDays: clamp(retentionDays, 0, 3650),
      ingestPricePerGbUsd: clamp(ingestPricePerGbUsd, 0, 1e6),
      storagePricePerGbMonthUsd: clamp(storagePricePerGbMonthUsd, 0, 1e6),
    });
  }, [gbPerDay, retentionDays, ingestPricePerGbUsd, storagePricePerGbMonthUsd]);

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
            <div className="label">Avg log bytes per request</div>
            <input
              type="number"
              inputMode="numeric"
              value={avgLogBytesPerRequest}
              min={0}
              step={50}
              onChange={(e) => setAvgLogBytesPerRequest(+e.target.value)}
            />
          </div>
          <div className="field field-3">
            <div className="label">Retention (days)</div>
            <input
              type="number"
              inputMode="numeric"
              value={retentionDays}
              min={0}
              step={1}
              onChange={(e) => setRetentionDays(+e.target.value)}
            />
          </div>
          <div className="field field-3">
            <div className="label">Ingest price ($ / GB)</div>
            <input
              type="number"
              inputMode="decimal"
              value={ingestPricePerGbUsd}
              min={0}
              step={0.01}
              onChange={(e) => setIngestPricePerGbUsd(+e.target.value)}
            />
          </div>
          <div className="field field-3">
            <div className="label">Storage price ($ / GB-month)</div>
            <input
              type="number"
              inputMode="decimal"
              value={storagePricePerGbMonthUsd}
              min={0}
              step={0.001}
              onChange={(e) => setStoragePricePerGbMonthUsd(+e.target.value)}
            />
          </div>
          <div className="field field-9 muted" style={{ alignSelf: "end" }}>
            Use your actual log format size. If unsure, sample 100–1000 log lines and compute average bytes.
          </div>

          <div className="field field-6">
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setRequestsPerMonth(50_000_000);
                  setAvgLogBytesPerRequest(1500);
                  setRetentionDays(30);
                  setIngestPricePerGbUsd(0.5);
                  setStoragePricePerGbMonthUsd(0.03);
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
            <div className="k">Estimated ingestion volume</div>
            <div className="v">{formatNumber(gbPerDay, 2)} GB/day</div>
          </div>
          <div className="kpi">
            <div className="k">Estimated monthly total</div>
            <div className="v">{formatCurrency2(cost.totalMonthlyUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">Ingest cost</div>
            <div className="v">{formatCurrency2(cost.ingestCostUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">Storage cost</div>
            <div className="v">{formatCurrency2(cost.storageCostUsd)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

