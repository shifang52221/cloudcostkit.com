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

export type TieredEgressTier = {
  upToGb: number | null; // null = infinity
  pricePerGbUsd: number;
};

export function estimateTieredEgressCost(opts: {
  gbPerMonth: number;
  tiers: TieredEgressTier[];
}) {
  const gbPerMonth = clamp(opts.gbPerMonth, 0, 1e12);
  const tiers = (opts.tiers || [])
    .map((t) => ({
      upToGb: t.upToGb == null ? null : clamp(t.upToGb, 0, 1e12),
      pricePerGbUsd: clamp(t.pricePerGbUsd, 0, 1e6),
    }))
    .filter((t) => (t.upToGb == null ? true : Number.isFinite(t.upToGb)) && Number.isFinite(t.pricePerGbUsd));

  const finite = tiers.filter((t) => t.upToGb != null) as { upToGb: number; pricePerGbUsd: number }[];
  const infinite = tiers.filter((t) => t.upToGb == null);
  finite.sort((a, b) => a.upToGb - b.upToGb);

  const ordered: TieredEgressTier[] = [
    ...finite,
    ...(infinite.length ? [infinite[0]] : [{ upToGb: null, pricePerGbUsd: finite.length ? finite[finite.length - 1].pricePerGbUsd : 0 }]),
  ];

  let remaining = gbPerMonth;
  let prevLimit = 0;
  const breakdown = [];
  let monthlyCostUsd = 0;

  for (const tier of ordered) {
    if (remaining <= 0) break;
    const limit = tier.upToGb == null ? null : Math.max(prevLimit, tier.upToGb);
    const tierGb = limit == null ? remaining : Math.max(0, Math.min(remaining, limit - prevLimit));
    const tierCostUsd = tierGb * tier.pricePerGbUsd;
    breakdown.push({ upToGb: tier.upToGb, pricePerGbUsd: tier.pricePerGbUsd, gb: tierGb, costUsd: tierCostUsd });
    monthlyCostUsd += tierCostUsd;
    remaining -= tierGb;
    if (limit != null) prevLimit = limit;
  }

  return { gbPerMonth, tiers: ordered, breakdown, monthlyCostUsd };
}
