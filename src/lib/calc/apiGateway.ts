import { clamp } from "../math";

export function estimateApiGatewayCost(opts: {
  requestsPerMonth: number;
  pricePerMillionRequestsUsd: number;
  avgResponseKb: number;
  egressPricePerGbUsd: number;
}) {
  const requestsPerMonth = clamp(opts.requestsPerMonth, 0, 1e18);
  const pricePerMillionRequestsUsd = clamp(opts.pricePerMillionRequestsUsd, 0, 1e9);
  const avgResponseKb = clamp(opts.avgResponseKb, 0, 1e9);
  const egressPricePerGbUsd = clamp(opts.egressPricePerGbUsd, 0, 1e6);

  const requestCostUsd = (requestsPerMonth / 1_000_000) * pricePerMillionRequestsUsd;
  const transferGb = (requestsPerMonth * avgResponseKb) / 1024 / 1024;
  const transferCostUsd = transferGb * egressPricePerGbUsd;
  const totalCostUsd = requestCostUsd + transferCostUsd;

  return {
    requestsPerMonth,
    pricePerMillionRequestsUsd,
    avgResponseKb,
    egressPricePerGbUsd,
    requestCostUsd,
    transferGb,
    transferCostUsd,
    totalCostUsd,
  };
}

