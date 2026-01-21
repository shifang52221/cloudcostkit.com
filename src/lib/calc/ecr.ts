import { clamp } from "../math";

export function estimateEcrCost(opts: {
  storedGbMonth: number;
  pricePerGbMonthUsd: number;
  egressGbPerMonth: number;
  egressPricePerGbUsd: number;
}) {
  const storedGbMonth = clamp(opts.storedGbMonth, 0, 1e18);
  const pricePerGbMonthUsd = clamp(opts.pricePerGbMonthUsd, 0, 1e9);
  const egressGbPerMonth = clamp(opts.egressGbPerMonth, 0, 1e18);
  const egressPricePerGbUsd = clamp(opts.egressPricePerGbUsd, 0, 1e9);

  const storageCostUsd = storedGbMonth * pricePerGbMonthUsd;
  const transferCostUsd = egressGbPerMonth * egressPricePerGbUsd;
  const totalCostUsd = storageCostUsd + transferCostUsd;

  return {
    storedGbMonth,
    pricePerGbMonthUsd,
    egressGbPerMonth,
    egressPricePerGbUsd,
    storageCostUsd,
    transferCostUsd,
    totalCostUsd,
  };
}

