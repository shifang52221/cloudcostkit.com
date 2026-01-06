import { clamp } from "../math";

export function estimateLogCost(opts: {
  gbPerDayIngest: number;
  retentionDays: number;
  ingestPricePerGbUsd: number;
  storagePricePerGbMonthUsd: number;
  daysPerMonth?: number;
}) {
  const daysPerMonth = clamp(opts.daysPerMonth ?? 30.4, 1, 31);
  const gbPerDayIngest = clamp(opts.gbPerDayIngest, 0, 1e12);
  const retentionDays = clamp(opts.retentionDays, 0, 3650);
  const ingestPricePerGbUsd = clamp(opts.ingestPricePerGbUsd, 0, 1e6);
  const storagePricePerGbMonthUsd = clamp(opts.storagePricePerGbMonthUsd, 0, 1e6);

  const monthlyIngestGb = gbPerDayIngest * daysPerMonth;
  const ingestCostUsd = monthlyIngestGb * ingestPricePerGbUsd;

  const storedGbSteadyState = gbPerDayIngest * retentionDays;
  const storageCostUsd = storedGbSteadyState * storagePricePerGbMonthUsd;

  const totalMonthlyUsd = ingestCostUsd + storageCostUsd;

  return {
    daysPerMonth,
    gbPerDayIngest,
    retentionDays,
    ingestPricePerGbUsd,
    storagePricePerGbMonthUsd,
    monthlyIngestGb,
    ingestCostUsd,
    storedGbSteadyState,
    storageCostUsd,
    totalMonthlyUsd,
  };
}

