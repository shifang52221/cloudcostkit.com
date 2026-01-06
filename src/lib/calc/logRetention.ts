import { clamp } from "../math";

export function estimateLogRetentionStorage(opts: {
  gbPerDay: number;
  retentionDays: number;
  storagePricePerGbMonthUsd: number;
}) {
  const gbPerDay = clamp(opts.gbPerDay, 0, 1e12);
  const retentionDays = clamp(opts.retentionDays, 0, 3650);
  const storagePricePerGbMonthUsd = clamp(opts.storagePricePerGbMonthUsd, 0, 1e6);

  const storedGbSteadyState = gbPerDay * retentionDays;
  const monthlyStorageCostUsd = storedGbSteadyState * storagePricePerGbMonthUsd;

  return {
    gbPerDay,
    retentionDays,
    storagePricePerGbMonthUsd,
    storedGbSteadyState,
    monthlyStorageCostUsd,
  };
}

