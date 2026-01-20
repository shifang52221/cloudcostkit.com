import { clamp } from "../math";

export function estimateRdsCost(opts: {
  instances: number;
  pricePerHourUsd: number;
  hoursPerMonth: number;
  storageGb: number;
  pricePerGbMonthUsd: number;
  backupGb: number;
  pricePerBackupGbMonthUsd: number;
  ioRequestsPerMonth: number;
  pricePerMillionIoRequestsUsd: number;
}) {
  const instances = clamp(opts.instances, 0, 1e6);
  const pricePerHourUsd = clamp(opts.pricePerHourUsd, 0, 1e6);
  const hoursPerMonth = clamp(opts.hoursPerMonth, 0, 744);

  const storageGb = clamp(opts.storageGb, 0, 1e12);
  const pricePerGbMonthUsd = clamp(opts.pricePerGbMonthUsd, 0, 1e3);

  const backupGb = clamp(opts.backupGb, 0, 1e12);
  const pricePerBackupGbMonthUsd = clamp(opts.pricePerBackupGbMonthUsd, 0, 1e3);

  const ioRequestsPerMonth = clamp(opts.ioRequestsPerMonth, 0, 1e18);
  const pricePerMillionIoRequestsUsd = clamp(opts.pricePerMillionIoRequestsUsd, 0, 1e6);

  const computeCostUsd = instances * hoursPerMonth * pricePerHourUsd;
  const storageCostUsd = storageGb * pricePerGbMonthUsd;
  const backupCostUsd = backupGb * pricePerBackupGbMonthUsd;
  const ioCostUsd = (ioRequestsPerMonth / 1_000_000) * pricePerMillionIoRequestsUsd;
  const totalCostUsd = computeCostUsd + storageCostUsd + backupCostUsd + ioCostUsd;

  return {
    instances,
    pricePerHourUsd,
    hoursPerMonth,
    storageGb,
    pricePerGbMonthUsd,
    backupGb,
    pricePerBackupGbMonthUsd,
    ioRequestsPerMonth,
    pricePerMillionIoRequestsUsd,
    computeCostUsd,
    storageCostUsd,
    backupCostUsd,
    ioCostUsd,
    totalCostUsd,
  };
}

