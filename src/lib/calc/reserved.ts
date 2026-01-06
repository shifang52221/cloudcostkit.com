import { clamp } from "../math";

export function estimateReservedBreakEven(opts: {
  onDemandHourlyUsd: number;
  reservedHourlyUsd: number;
  upfrontUsd: number;
  hoursPerMonth?: number;
}) {
  const onDemandHourlyUsd = clamp(opts.onDemandHourlyUsd, 0, 1e6);
  const reservedHourlyUsd = clamp(opts.reservedHourlyUsd, 0, 1e6);
  const upfrontUsd = clamp(opts.upfrontUsd, 0, 1e12);
  const hoursPerMonth = clamp(opts.hoursPerMonth ?? 730, 1, 10000);

  const hourlySavings = onDemandHourlyUsd - reservedHourlyUsd;
  const breakEvenHours = hourlySavings > 0 ? upfrontUsd / hourlySavings : null;

  const monthlyOnDemandUsd = onDemandHourlyUsd * hoursPerMonth;
  const monthlyReservedUsd = reservedHourlyUsd * hoursPerMonth;
  const monthlySavingsUsd = monthlyOnDemandUsd - monthlyReservedUsd;

  return {
    onDemandHourlyUsd,
    reservedHourlyUsd,
    upfrontUsd,
    hoursPerMonth,
    hourlySavings,
    breakEvenHours,
    monthlyOnDemandUsd,
    monthlyReservedUsd,
    monthlySavingsUsd,
  };
}

