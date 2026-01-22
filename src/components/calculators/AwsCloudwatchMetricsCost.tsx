import React, { useMemo } from "react";
import { useNumberParamState } from "./useNumberParamState";
import { estimateCloudwatchMetricsCost } from "../../lib/calc/cloudwatchMetrics";
import { formatCurrency2, formatNumber } from "../../lib/format";
import { clamp } from "../../lib/math";

export function AwsCloudwatchMetricsCostCalculator() {
  const [customMetrics, setCustomMetrics] = useNumberParamState("AwsCloudwatchMetricsCost.customMetrics", 2000);
  const [pricePerMetricMonthUsd, setPricePerMetricMonthUsd] = useNumberParamState("AwsCloudwatchMetricsCost.pricePerMetricMonthUsd", 0.3);
  const [alarms, setAlarms] = useNumberParamState("AwsCloudwatchMetricsCost.alarms", 150);
  const [pricePerAlarmMonthUsd, setPricePerAlarmMonthUsd] = useNumberParamState("AwsCloudwatchMetricsCost.pricePerAlarmMonthUsd", 0.1);
  const [dashboards, setDashboards] = useNumberParamState("AwsCloudwatchMetricsCost.dashboards", 5);
  const [pricePerDashboardMonthUsd, setPricePerDashboardMonthUsd] = useNumberParamState("AwsCloudwatchMetricsCost.pricePerDashboardMonthUsd", 3);
  const [apiRequestsPerMonth, setApiRequestsPerMonth] = useNumberParamState("AwsCloudwatchMetricsCost.apiRequestsPerMonth", 10_000_000);
  const [pricePerThousandApiRequestsUsd, setPricePerThousandApiRequestsUsd] = useNumberParamState("AwsCloudwatchMetricsCost.pricePerThousandApiRequestsUsd", 0.01);

  const result = useMemo(() => {
    return estimateCloudwatchMetricsCost({
      customMetrics: clamp(customMetrics, 0, 1e12),
      pricePerMetricMonthUsd: clamp(pricePerMetricMonthUsd, 0, 1e6),
      alarms: clamp(alarms, 0, 1e12),
      pricePerAlarmMonthUsd: clamp(pricePerAlarmMonthUsd, 0, 1e6),
      dashboards: clamp(dashboards, 0, 1e12),
      pricePerDashboardMonthUsd: clamp(pricePerDashboardMonthUsd, 0, 1e6),
      apiRequestsPerMonth: clamp(apiRequestsPerMonth, 0, 1e18),
      pricePerThousandApiRequestsUsd: clamp(pricePerThousandApiRequestsUsd, 0, 1e6),
    });
  }, [
    customMetrics,
    pricePerMetricMonthUsd,
    alarms,
    pricePerAlarmMonthUsd,
    dashboards,
    pricePerDashboardMonthUsd,
    apiRequestsPerMonth,
    pricePerThousandApiRequestsUsd,
  ]);

  return (
    <div className="calc-grid">
      <div className="panel">
        <h3>Inputs</h3>
        <div className="form">
          <div className="field field-3">
            <div className="label">Custom metrics (metric-month)</div>
            <input
              type="number"
              inputMode="numeric"
              value={customMetrics}
              min={0}
              step={1}
              onChange={(e) => setCustomMetrics(+e.target.value)}
            />
          </div>
          <div className="field field-3">
            <div className="label">Price ($ / metric-month)</div>
            <input
              type="number"
              inputMode="decimal"
              value={pricePerMetricMonthUsd}
              min={0}
              step={0.01}
              onChange={(e) => setPricePerMetricMonthUsd(+e.target.value)}
            />
          </div>

          <div className="field field-3">
            <div className="label">Alarms (alarm-month)</div>
            <input
              type="number"
              inputMode="numeric"
              value={alarms}
              min={0}
              step={1}
              onChange={(e) => setAlarms(+e.target.value)}
            />
          </div>
          <div className="field field-3">
            <div className="label">Price ($ / alarm-month)</div>
            <input
              type="number"
              inputMode="decimal"
              value={pricePerAlarmMonthUsd}
              min={0}
              step={0.01}
              onChange={(e) => setPricePerAlarmMonthUsd(+e.target.value)}
            />
          </div>

          <div className="field field-3">
            <div className="label">Dashboards (dashboard-month)</div>
            <input
              type="number"
              inputMode="numeric"
              value={dashboards}
              min={0}
              step={1}
              onChange={(e) => setDashboards(+e.target.value)}
            />
          </div>
          <div className="field field-3">
            <div className="label">Price ($ / dashboard-month)</div>
            <input
              type="number"
              inputMode="decimal"
              value={pricePerDashboardMonthUsd}
              min={0}
              step={0.01}
              onChange={(e) => setPricePerDashboardMonthUsd(+e.target.value)}
            />
          </div>

          <div className="field field-3">
            <div className="label">API requests (per month)</div>
            <input
              type="number"
              inputMode="numeric"
              value={apiRequestsPerMonth}
              min={0}
              step={1000}
              onChange={(e) => setApiRequestsPerMonth(+e.target.value)}
            />
          </div>
          <div className="field field-3">
            <div className="label">API price ($ / 1k requests)</div>
            <input
              type="number"
              inputMode="decimal"
              value={pricePerThousandApiRequestsUsd}
              min={0}
              step={0.001}
              onChange={(e) => setPricePerThousandApiRequestsUsd(+e.target.value)}
            />
          </div>

          <div className="field field-6">
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setCustomMetrics(2000);
                  setPricePerMetricMonthUsd(0.3);
                  setAlarms(150);
                  setPricePerAlarmMonthUsd(0.1);
                  setDashboards(5);
                  setPricePerDashboardMonthUsd(3);
                  setApiRequestsPerMonth(10_000_000);
                  setPricePerThousandApiRequestsUsd(0.01);
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
            <div className="k">Custom metrics</div>
            <div className="v">{formatCurrency2(result.metricsCostUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">Alarms</div>
            <div className="v">{formatCurrency2(result.alarmsCostUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">Dashboards</div>
            <div className="v">{formatCurrency2(result.dashboardsCostUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">API requests</div>
            <div className="v">{formatCurrency2(result.apiCostUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">API requests (per month)</div>
            <div className="v">{formatNumber(result.apiRequestsPerMonth, 0)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

