import { clamp } from "../math";

export function estimateSnsCost(opts: {
  publishesPerMonth: number;
  deliveriesPerMonth: number;
  pricePerMillionPublishesUsd: number;
  pricePerMillionDeliveriesUsd: number;
  avgPayloadKb: number;
  egressPricePerGbUsd: number;
}) {
  const publishesPerMonth = clamp(opts.publishesPerMonth, 0, 1e18);
  const deliveriesPerMonth = clamp(opts.deliveriesPerMonth, 0, 1e18);
  const pricePerMillionPublishesUsd = clamp(opts.pricePerMillionPublishesUsd, 0, 1e9);
  const pricePerMillionDeliveriesUsd = clamp(opts.pricePerMillionDeliveriesUsd, 0, 1e9);
  const avgPayloadKb = clamp(opts.avgPayloadKb, 0, 1e9);
  const egressPricePerGbUsd = clamp(opts.egressPricePerGbUsd, 0, 1e9);

  const publishCostUsd = (publishesPerMonth / 1_000_000) * pricePerMillionPublishesUsd;
  const deliveryCostUsd = (deliveriesPerMonth / 1_000_000) * pricePerMillionDeliveriesUsd;

  const transferGb = (deliveriesPerMonth * avgPayloadKb) / 1024 / 1024;
  const transferCostUsd = transferGb * egressPricePerGbUsd;

  const totalCostUsd = publishCostUsd + deliveryCostUsd + transferCostUsd;

  return {
    publishesPerMonth,
    deliveriesPerMonth,
    pricePerMillionPublishesUsd,
    pricePerMillionDeliveriesUsd,
    avgPayloadKb,
    egressPricePerGbUsd,
    publishCostUsd,
    deliveryCostUsd,
    transferGb,
    transferCostUsd,
    totalCostUsd,
  };
}

