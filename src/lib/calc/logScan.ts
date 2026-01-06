import { clamp } from "../math";

export function estimateLogScanCost(opts: {
  gbScannedPerDay: number;
  pricePerGbUsd: number;
  daysPerMonth?: number;
}) {
  const daysPerMonth = clamp(opts.daysPerMonth ?? 30.4, 1, 31);
  const gbScannedPerDay = clamp(opts.gbScannedPerDay, 0, 1e12);
  const pricePerGbUsd = clamp(opts.pricePerGbUsd, 0, 1e6);
  const monthlyGbScanned = gbScannedPerDay * daysPerMonth;
  const monthlyCostUsd = monthlyGbScanned * pricePerGbUsd;
  return { daysPerMonth, gbScannedPerDay, pricePerGbUsd, monthlyGbScanned, monthlyCostUsd };
}

