import { clamp } from "../math";

export function estimateEgressCost(opts: {
  gbPerMonth: number;
  pricePerGbUsd: number;
}) {
  const gbPerMonth = clamp(opts.gbPerMonth, 0, 1e12);
  const pricePerGbUsd = clamp(opts.pricePerGbUsd, 0, 1e6);
  const monthlyCostUsd = gbPerMonth * pricePerGbUsd;
  return { gbPerMonth, pricePerGbUsd, monthlyCostUsd };
}

