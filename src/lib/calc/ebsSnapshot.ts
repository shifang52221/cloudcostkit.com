import { clamp } from "../math";

export type EstimateEbsSnapshotCostInput = {
  volumeGb: number;
  dailyChangePct: number;
  retentionDays: number;
  pricePerGbMonthUsd: number;
};

export type EstimateEbsSnapshotCostResult = {
  volumeGb: number;
  dailyChangePct: number;
  retentionDays: number;
  estimatedStoredGb: number;
  estimatedMonthlyCostUsd: number;
};

export function estimateEbsSnapshotCost(input: EstimateEbsSnapshotCostInput): EstimateEbsSnapshotCostResult {
  const volumeGb = clamp(input.volumeGb, 0, 1e12);
  const dailyChangePct = clamp(input.dailyChangePct, 0, 100) / 100;
  const retentionDays = Math.floor(clamp(input.retentionDays, 0, 3650));
  const pricePerGbMonthUsd = clamp(input.pricePerGbMonthUsd, 0, 1e6);

  if (retentionDays === 0 || volumeGb === 0) {
    return {
      volumeGb,
      dailyChangePct: dailyChangePct * 100,
      retentionDays,
      estimatedStoredGb: 0,
      estimatedMonthlyCostUsd: 0,
    };
  }

  const dailyDeltaGb = volumeGb * dailyChangePct;
  const estimatedStoredGb = volumeGb + dailyDeltaGb * Math.max(0, retentionDays - 1);
  const estimatedMonthlyCostUsd = estimatedStoredGb * pricePerGbMonthUsd;

  return {
    volumeGb,
    dailyChangePct: dailyChangePct * 100,
    retentionDays,
    estimatedStoredGb,
    estimatedMonthlyCostUsd,
  };
}

