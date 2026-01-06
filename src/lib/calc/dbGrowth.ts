import { clamp } from "../math";

export function estimateDbStorageGrowth(opts: {
  startingGb: number;
  growthGbPerDay: number;
  months: number;
  storagePricePerGbMonthUsd: number;
  daysPerMonth?: number;
}) {
  const daysPerMonth = clamp(opts.daysPerMonth ?? 30.4, 1, 31);
  const startingGb = clamp(opts.startingGb, 0, 1e15);
  const growthGbPerDay = clamp(opts.growthGbPerDay, 0, 1e12);
  const months = clamp(opts.months, 0, 120);
  const storagePricePerGbMonthUsd = clamp(opts.storagePricePerGbMonthUsd, 0, 1e6);

  const totalDays = months * daysPerMonth;
  const endingGb = startingGb + growthGbPerDay * totalDays;
  const averageGb = (startingGb + endingGb) / 2;
  const estimatedMonthlyCostUsd = averageGb * storagePricePerGbMonthUsd;

  return {
    daysPerMonth,
    months,
    totalDays,
    startingGb,
    growthGbPerDay,
    endingGb,
    averageGb,
    storagePricePerGbMonthUsd,
    estimatedMonthlyCostUsd,
  };
}

