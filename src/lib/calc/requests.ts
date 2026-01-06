import { clamp } from "../math";

export function estimateRequestCost(opts: {
  requestsPerMonth: number;
  pricePerMillionUsd: number;
}) {
  const requestsPerMonth = clamp(opts.requestsPerMonth, 0, 1e18);
  const pricePerMillionUsd = clamp(opts.pricePerMillionUsd, 0, 1e9);
  const costUsd = (requestsPerMonth / 1_000_000) * pricePerMillionUsd;
  return { requestsPerMonth, pricePerMillionUsd, costUsd };
}

export function estimateRequestCostPer10k(opts: {
  requestsPerMonth: number;
  pricePer10kUsd: number;
}) {
  const requestsPerMonth = clamp(opts.requestsPerMonth, 0, 1e18);
  const pricePer10kUsd = clamp(opts.pricePer10kUsd, 0, 1e9);
  const costUsd = (requestsPerMonth / 10_000) * pricePer10kUsd;
  return { requestsPerMonth, pricePer10kUsd, costUsd };
}

