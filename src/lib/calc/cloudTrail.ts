import { clamp } from "../math";

export function estimateCloudTrailCost(opts: {
  managementEventsPerMonth: number;
  dataEventsPerMonth: number;
  insightsEventsPerMonth: number;
  pricePer100kManagementEventsUsd: number;
  pricePer100kDataEventsUsd: number;
  pricePer100kInsightsEventsUsd: number;
}) {
  const managementEventsPerMonth = clamp(opts.managementEventsPerMonth, 0, 1e18);
  const dataEventsPerMonth = clamp(opts.dataEventsPerMonth, 0, 1e18);
  const insightsEventsPerMonth = clamp(opts.insightsEventsPerMonth, 0, 1e18);

  const pricePer100kManagementEventsUsd = clamp(opts.pricePer100kManagementEventsUsd, 0, 1e9);
  const pricePer100kDataEventsUsd = clamp(opts.pricePer100kDataEventsUsd, 0, 1e9);
  const pricePer100kInsightsEventsUsd = clamp(opts.pricePer100kInsightsEventsUsd, 0, 1e9);

  const managementCostUsd = (managementEventsPerMonth / 100_000) * pricePer100kManagementEventsUsd;
  const dataCostUsd = (dataEventsPerMonth / 100_000) * pricePer100kDataEventsUsd;
  const insightsCostUsd = (insightsEventsPerMonth / 100_000) * pricePer100kInsightsEventsUsd;
  const totalCostUsd = managementCostUsd + dataCostUsd + insightsCostUsd;

  return {
    managementEventsPerMonth,
    dataEventsPerMonth,
    insightsEventsPerMonth,
    pricePer100kManagementEventsUsd,
    pricePer100kDataEventsUsd,
    pricePer100kInsightsEventsUsd,
    managementCostUsd,
    dataCostUsd,
    insightsCostUsd,
    totalCostUsd,
  };
}

