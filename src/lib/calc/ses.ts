import { clamp } from "../math";

export function estimateSesCost(opts: {
  emailsPerMonth: number;
  pricePer1000EmailsUsd: number;
  avgEmailKb: number;
  egressPricePerGbUsd: number;
}) {
  const emailsPerMonth = clamp(opts.emailsPerMonth, 0, 1e18);
  const pricePer1000EmailsUsd = clamp(opts.pricePer1000EmailsUsd, 0, 1e9);
  const avgEmailKb = clamp(opts.avgEmailKb, 0, 1e9);
  const egressPricePerGbUsd = clamp(opts.egressPricePerGbUsd, 0, 1e9);

  const messageCostUsd = (emailsPerMonth / 1000) * pricePer1000EmailsUsd;
  const transferGb = (emailsPerMonth * avgEmailKb) / 1024 / 1024;
  const transferCostUsd = transferGb * egressPricePerGbUsd;
  const totalCostUsd = messageCostUsd + transferCostUsd;

  return {
    emailsPerMonth,
    pricePer1000EmailsUsd,
    avgEmailKb,
    egressPricePerGbUsd,
    messageCostUsd,
    transferGb,
    transferCostUsd,
    totalCostUsd,
  };
}

