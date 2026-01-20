import { clamp } from "../math";

export function estimateDynamoDbCost(opts: {
  readRequestsPerMonth: number;
  writeRequestsPerMonth: number;
  pricePerMillionReadRequestsUsd: number;
  pricePerMillionWriteRequestsUsd: number;
  storageGb: number;
  pricePerGbMonthUsd: number;
}) {
  const readRequestsPerMonth = clamp(opts.readRequestsPerMonth, 0, 1e18);
  const writeRequestsPerMonth = clamp(opts.writeRequestsPerMonth, 0, 1e18);
  const pricePerMillionReadRequestsUsd = clamp(opts.pricePerMillionReadRequestsUsd, 0, 1e9);
  const pricePerMillionWriteRequestsUsd = clamp(opts.pricePerMillionWriteRequestsUsd, 0, 1e9);
  const storageGb = clamp(opts.storageGb, 0, 1e12);
  const pricePerGbMonthUsd = clamp(opts.pricePerGbMonthUsd, 0, 1e3);

  const readCostUsd = (readRequestsPerMonth / 1_000_000) * pricePerMillionReadRequestsUsd;
  const writeCostUsd = (writeRequestsPerMonth / 1_000_000) * pricePerMillionWriteRequestsUsd;
  const storageCostUsd = storageGb * pricePerGbMonthUsd;
  const totalCostUsd = readCostUsd + writeCostUsd + storageCostUsd;

  return {
    readRequestsPerMonth,
    writeRequestsPerMonth,
    pricePerMillionReadRequestsUsd,
    pricePerMillionWriteRequestsUsd,
    storageGb,
    pricePerGbMonthUsd,
    readCostUsd,
    writeCostUsd,
    storageCostUsd,
    totalCostUsd,
  };
}

