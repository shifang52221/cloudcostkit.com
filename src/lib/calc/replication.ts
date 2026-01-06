import { clamp } from "../math";

export function estimateReplicationCost(opts: {
  replicatedGbPerMonth: number;
  pricePerGbUsd: number;
}) {
  const replicatedGbPerMonth = clamp(opts.replicatedGbPerMonth, 0, 1e12);
  const pricePerGbUsd = clamp(opts.pricePerGbUsd, 0, 1e6);
  const monthlyCostUsd = replicatedGbPerMonth * pricePerGbUsd;
  return { replicatedGbPerMonth, pricePerGbUsd, monthlyCostUsd };
}

