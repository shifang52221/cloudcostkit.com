import { clamp } from "../math";

export function estimateEbsCost(opts: {
  storageGb: number;
  pricePerGbMonthUsd: number;
  provisionedIops: number;
  pricePerIopsMonthUsd: number;
  provisionedThroughputMbps: number;
  pricePerMbpsMonthUsd: number;
}) {
  const storageGb = clamp(opts.storageGb, 0, 1e12);
  const pricePerGbMonthUsd = clamp(opts.pricePerGbMonthUsd, 0, 1e3);

  const provisionedIops = clamp(opts.provisionedIops, 0, 1e9);
  const pricePerIopsMonthUsd = clamp(opts.pricePerIopsMonthUsd, 0, 1e3);

  const provisionedThroughputMbps = clamp(opts.provisionedThroughputMbps, 0, 1e9);
  const pricePerMbpsMonthUsd = clamp(opts.pricePerMbpsMonthUsd, 0, 1e3);

  const storageCostUsd = storageGb * pricePerGbMonthUsd;
  const iopsCostUsd = provisionedIops * pricePerIopsMonthUsd;
  const throughputCostUsd = provisionedThroughputMbps * pricePerMbpsMonthUsd;
  const totalCostUsd = storageCostUsd + iopsCostUsd + throughputCostUsd;

  return {
    storageGb,
    pricePerGbMonthUsd,
    provisionedIops,
    pricePerIopsMonthUsd,
    provisionedThroughputMbps,
    pricePerMbpsMonthUsd,
    storageCostUsd,
    iopsCostUsd,
    throughputCostUsd,
    totalCostUsd,
  };
}

