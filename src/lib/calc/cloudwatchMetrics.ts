import { clamp } from "../math";

export function estimateCloudwatchMetricsCost(opts: {
  customMetrics: number;
  pricePerMetricMonthUsd: number;
  alarms: number;
  pricePerAlarmMonthUsd: number;
  dashboards: number;
  pricePerDashboardMonthUsd: number;
  apiRequestsPerMonth: number;
  pricePerThousandApiRequestsUsd: number;
}) {
  const customMetrics = clamp(opts.customMetrics, 0, 1e12);
  const pricePerMetricMonthUsd = clamp(opts.pricePerMetricMonthUsd, 0, 1e6);

  const alarms = clamp(opts.alarms, 0, 1e12);
  const pricePerAlarmMonthUsd = clamp(opts.pricePerAlarmMonthUsd, 0, 1e6);

  const dashboards = clamp(opts.dashboards, 0, 1e12);
  const pricePerDashboardMonthUsd = clamp(opts.pricePerDashboardMonthUsd, 0, 1e6);

  const apiRequestsPerMonth = clamp(opts.apiRequestsPerMonth, 0, 1e18);
  const pricePerThousandApiRequestsUsd = clamp(opts.pricePerThousandApiRequestsUsd, 0, 1e6);

  const metricsCostUsd = customMetrics * pricePerMetricMonthUsd;
  const alarmsCostUsd = alarms * pricePerAlarmMonthUsd;
  const dashboardsCostUsd = dashboards * pricePerDashboardMonthUsd;
  const apiCostUsd = (apiRequestsPerMonth / 1000) * pricePerThousandApiRequestsUsd;
  const totalCostUsd = metricsCostUsd + alarmsCostUsd + dashboardsCostUsd + apiCostUsd;

  return {
    customMetrics,
    pricePerMetricMonthUsd,
    alarms,
    pricePerAlarmMonthUsd,
    dashboards,
    pricePerDashboardMonthUsd,
    apiRequestsPerMonth,
    pricePerThousandApiRequestsUsd,
    metricsCostUsd,
    alarmsCostUsd,
    dashboardsCostUsd,
    apiCostUsd,
    totalCostUsd,
  };
}

