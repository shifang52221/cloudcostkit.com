import { clamp } from "../math";

export function estimateRoute53Cost(opts: {
  hostedZones: number;
  standardQueriesPerMonth: number;
  healthChecks: number;
  pricePerHostedZoneUsdPerMonth: number;
  pricePerMillionQueriesUsd: number;
  pricePerHealthCheckUsdPerMonth: number;
}) {
  const hostedZones = clamp(opts.hostedZones, 0, 1e9);
  const standardQueriesPerMonth = clamp(opts.standardQueriesPerMonth, 0, 1e18);
  const healthChecks = clamp(opts.healthChecks, 0, 1e9);

  const pricePerHostedZoneUsdPerMonth = clamp(opts.pricePerHostedZoneUsdPerMonth, 0, 1e9);
  const pricePerMillionQueriesUsd = clamp(opts.pricePerMillionQueriesUsd, 0, 1e9);
  const pricePerHealthCheckUsdPerMonth = clamp(opts.pricePerHealthCheckUsdPerMonth, 0, 1e9);

  const hostedZoneCostUsd = hostedZones * pricePerHostedZoneUsdPerMonth;
  const queryCostUsd = (standardQueriesPerMonth / 1_000_000) * pricePerMillionQueriesUsd;
  const healthCheckCostUsd = healthChecks * pricePerHealthCheckUsdPerMonth;
  const totalCostUsd = hostedZoneCostUsd + queryCostUsd + healthCheckCostUsd;

  return {
    hostedZones,
    standardQueriesPerMonth,
    healthChecks,
    pricePerHostedZoneUsdPerMonth,
    pricePerMillionQueriesUsd,
    pricePerHealthCheckUsdPerMonth,
    hostedZoneCostUsd,
    queryCostUsd,
    healthCheckCostUsd,
    totalCostUsd,
  };
}

