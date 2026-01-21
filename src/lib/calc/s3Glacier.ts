import { clamp } from "../math";

export function estimateS3GlacierCost(opts: {
  storedGbMonth: number;
  storagePricePerGbMonthUsd: number;
  retrievalGbPerMonth: number;
  retrievalPricePerGbUsd: number;
  retrievalRequestsPerMonth: number;
  retrievalPricePer1000RequestsUsd: number;
}) {
  const storedGbMonth = clamp(opts.storedGbMonth, 0, 1e18);
  const storagePricePerGbMonthUsd = clamp(opts.storagePricePerGbMonthUsd, 0, 1e9);
  const retrievalGbPerMonth = clamp(opts.retrievalGbPerMonth, 0, 1e18);
  const retrievalPricePerGbUsd = clamp(opts.retrievalPricePerGbUsd, 0, 1e9);
  const retrievalRequestsPerMonth = clamp(opts.retrievalRequestsPerMonth, 0, 1e18);
  const retrievalPricePer1000RequestsUsd = clamp(opts.retrievalPricePer1000RequestsUsd, 0, 1e9);

  const storageCostUsd = storedGbMonth * storagePricePerGbMonthUsd;
  const retrievalCostUsd = retrievalGbPerMonth * retrievalPricePerGbUsd;
  const retrievalRequestCostUsd = (retrievalRequestsPerMonth / 1000) * retrievalPricePer1000RequestsUsd;
  const totalCostUsd = storageCostUsd + retrievalCostUsd + retrievalRequestCostUsd;

  return {
    storedGbMonth,
    storagePricePerGbMonthUsd,
    retrievalGbPerMonth,
    retrievalPricePerGbUsd,
    retrievalRequestsPerMonth,
    retrievalPricePer1000RequestsUsd,
    storageCostUsd,
    retrievalCostUsd,
    retrievalRequestCostUsd,
    totalCostUsd,
  };
}

