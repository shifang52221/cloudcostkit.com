import { clamp } from "../math";

export function estimateTimeseriesCost(opts: {
  activeSeries: number;
  pricePerSeriesMonthUsd: number;
}) {
  const activeSeries = Math.floor(clamp(opts.activeSeries, 0, 1e12));
  const pricePerSeriesMonthUsd = clamp(opts.pricePerSeriesMonthUsd, 0, 1e6);
  const monthlyCostUsd = activeSeries * pricePerSeriesMonthUsd;
  return { activeSeries, pricePerSeriesMonthUsd, monthlyCostUsd };
}

