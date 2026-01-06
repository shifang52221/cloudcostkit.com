import { clamp } from "../math";

export function estimateObjectStorageCost(opts: {
  averageStoredGb: number;
  storagePricePerGbMonthUsd: number;
  getRequestsPerMonth: number;
  putRequestsPerMonth: number;
  getPricePer1kUsd: number;
  putPricePer1kUsd: number;
}) {
  const averageStoredGb = clamp(opts.averageStoredGb, 0, 1e12);
  const storagePricePerGbMonthUsd = clamp(opts.storagePricePerGbMonthUsd, 0, 1e6);

  const getRequestsPerMonth = clamp(opts.getRequestsPerMonth, 0, 1e15);
  const putRequestsPerMonth = clamp(opts.putRequestsPerMonth, 0, 1e15);
  const getPricePer1kUsd = clamp(opts.getPricePer1kUsd, 0, 1e3);
  const putPricePer1kUsd = clamp(opts.putPricePer1kUsd, 0, 1e3);

  const storageCostUsd = averageStoredGb * storagePricePerGbMonthUsd;
  const getCostUsd = (getRequestsPerMonth / 1000) * getPricePer1kUsd;
  const putCostUsd = (putRequestsPerMonth / 1000) * putPricePer1kUsd;

  const totalMonthlyUsd = storageCostUsd + getCostUsd + putCostUsd;

  return {
    averageStoredGb,
    storagePricePerGbMonthUsd,
    getRequestsPerMonth,
    putRequestsPerMonth,
    getPricePer1kUsd,
    putPricePer1kUsd,
    storageCostUsd,
    getCostUsd,
    putCostUsd,
    totalMonthlyUsd,
  };
}

