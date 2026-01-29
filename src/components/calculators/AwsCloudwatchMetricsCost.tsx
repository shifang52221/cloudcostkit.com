import React, { useMemo } from "react";
import { useBooleanParamState, useNumberParamState } from "./useNumberParamState";
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
  const [showPeakScenario, setShowPeakScenario] = useBooleanParamState("AwsCloudwatchMetricsCost.showPeakScenario", false);
  const [peakMultiplierPct, setPeakMultiplierPct] = useNumberParamState("AwsCloudwatchMetricsCost.peakMultiplierPct", 160);
  const secondsPerMonth = 30.4 * 24 * 3600;
  const apiRequestsPerSecond = apiRequestsPerMonth / secondsPerMonth;

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

  const peakResult = useMemo(() => {
    if (!showPeakScenario) return null;
    const safeMultiplier = clamp(peakMultiplierPct, 100, 1000) / 100;
    return estimateCloudwatchMetricsCost({
      customMetrics: clamp(customMetrics, 0, 1e12) * safeMultiplier,
      pricePerMetricMonthUsd: clamp(pricePerMetricMonthUsd, 0, 1e6),
      alarms: clamp(alarms, 0, 1e12) * safeMultiplier,
      pricePerAlarmMonthUsd: clamp(pricePerAlarmMonthUsd, 0, 1e6),
      dashboards: clamp(dashboards, 0, 1e12) * safeMultiplier,
      pricePerDashboardMonthUsd: clamp(pricePerDashboardMonthUsd, 0, 1e6),
      apiRequestsPerMonth: clamp(apiRequestsPerMonth, 0, 1e18) * safeMultiplier,
      pricePerThousandApiRequestsUsd: clamp(pricePerThousandApiRequestsUsd, 0, 1e6),
    });
  }, [
    alarms,
    apiRequestsPerMonth,
    customMetrics,
    dashboards,
    peakMultiplierPct,
    pricePerAlarmMonthUsd,
    pricePerDashboardMonthUsd,
    pricePerMetricMonthUsd,
    pricePerThousandApiRequestsUsd,
    showPeakScenario,
  ]);
  const metricsSharePct = result.totalCostUsd > 0 ? (result.metricsCostUsd / result.totalCostUsd) * 100 : 0;

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
            <div className="hint">Avg {formatNumber(apiRequestsPerSecond, 2)} req/sec.</div>
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
              <div className="hint">Use a peak month for dashboards and automation bursts.</div>
            </div>
          ) : null}

          <div className="field field-6">
            <div className="label">Scenario presets</div>
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setCustomMetrics(500);
                  setPricePerMetricMonthUsd(0.3);
                  setAlarms(40);
                  setPricePerAlarmMonthUsd(0.1);
                  setDashboards(2);
                  setPricePerDashboardMonthUsd(3);
                  setApiRequestsPerMonth(2_000_000);
                  setPricePerThousandApiRequestsUsd(0.01);
                  setShowPeakScenario(true);
                  setPeakMultiplierPct(150);
                }}
              >
                Small team
              </button>
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
                  setShowPeakScenario(true);
                  setPeakMultiplierPct(180);
                }}
              >
                Prod baseline
              </button>
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setCustomMetrics(8000);
                  setPricePerMetricMonthUsd(0.3);
                  setAlarms(500);
                  setPricePerAlarmMonthUsd(0.1);
                  setDashboards(20);
                  setPricePerDashboardMonthUsd(3);
                  setApiRequestsPerMonth(80_000_000);
                  setPricePerThousandApiRequestsUsd(0.01);
                  setShowPeakScenario(true);
                  setPeakMultiplierPct(220);
                }}
              >
                High usage
              </button>
            </div>
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
                  setShowPeakScenario(false);
                  setPeakMultiplierPct(160);
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
          <div className="kpi">
            <div className="k">Metrics share</div>
            <div className="v">{formatNumber(metricsSharePct, 1)}%</div>
          </div>
        </div>

        {peakResult ? (
          <div style={{ marginTop: 12 }}>
            <div className="muted" style={{ fontSize: 13, marginBottom: 6 }}>Baseline vs peak</div>
            <table className="table">
              <thead>
                <tr>
                  <th>Scenario</th>
                  <th className="num">Total cost</th>
                  <th className="num">Custom metrics</th>
                  <th className="num">Alarms</th>
                  <th className="num">Dashboards</th>
                  <th className="num">API requests</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Baseline</td>
                  <td className="num">{formatCurrency2(result.totalCostUsd)}</td>
                  <td className="num">{formatCurrency2(result.metricsCostUsd)}</td>
                  <td className="num">{formatCurrency2(result.alarmsCostUsd)}</td>
                  <td className="num">{formatCurrency2(result.dashboardsCostUsd)}</td>
                  <td className="num">{formatNumber(result.apiRequestsPerMonth, 0)}</td>
                </tr>
                <tr>
                  <td>Peak</td>
                  <td className="num">{formatCurrency2(peakResult.totalCostUsd)}</td>
                  <td className="num">{formatCurrency2(peakResult.metricsCostUsd)}</td>
                  <td className="num">{formatCurrency2(peakResult.alarmsCostUsd)}</td>
                  <td className="num">{formatCurrency2(peakResult.dashboardsCostUsd)}</td>
                  <td className="num">{formatNumber(peakResult.apiRequestsPerMonth, 0)}</td>
                </tr>
                <tr>
                  <td>Delta</td>
                  <td className="num">{formatCurrency2(peakResult.totalCostUsd - result.totalCostUsd)}</td>
                  <td className="num">{formatCurrency2(peakResult.metricsCostUsd - result.metricsCostUsd)}</td>
                  <td className="num">{formatCurrency2(peakResult.alarmsCostUsd - result.alarmsCostUsd)}</td>
                  <td className="num">{formatCurrency2(peakResult.dashboardsCostUsd - result.dashboardsCostUsd)}</td>
                  <td className="num">{formatNumber(peakResult.apiRequestsPerMonth - result.apiRequestsPerMonth, 0)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </div>
  );
}
