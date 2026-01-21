import { clamp } from "../math";

export function estimateKmsCost(opts: {
  keys: number;
  requestsPerMonth: number;
  pricePerKeyUsdPerMonth: number;
  pricePer10kRequestsUsd: number;
}) {
  const keys = clamp(opts.keys, 0, 1e9);
  const requestsPerMonth = clamp(opts.requestsPerMonth, 0, 1e18);
  const pricePerKeyUsdPerMonth = clamp(opts.pricePerKeyUsdPerMonth, 0, 1e9);
  const pricePer10kRequestsUsd = clamp(opts.pricePer10kRequestsUsd, 0, 1e9);

  const keyCostUsd = keys * pricePerKeyUsdPerMonth;
  const requestCostUsd = (requestsPerMonth / 10_000) * pricePer10kRequestsUsd;
  const totalCostUsd = keyCostUsd + requestCostUsd;

  return {
    keys,
    requestsPerMonth,
    pricePerKeyUsdPerMonth,
    pricePer10kRequestsUsd,
    keyCostUsd,
    requestCostUsd,
    totalCostUsd,
  };
}

