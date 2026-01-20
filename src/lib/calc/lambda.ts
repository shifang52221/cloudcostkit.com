import { clamp } from "../math";

export function estimateLambdaCost(opts: {
  invocationsPerMonth: number;
  avgDurationMs: number;
  memoryMb: number;
  pricePerMillionRequestsUsd: number;
  pricePerGbSecondUsd: number;
  freeInvocationsPerMonth?: number;
  freeGbSecondsPerMonth?: number;
}) {
  const invocationsPerMonth = clamp(opts.invocationsPerMonth, 0, 1e18);
  const avgDurationMs = clamp(opts.avgDurationMs, 0, 1e9);
  const memoryMb = clamp(opts.memoryMb, 0, 10_240);
  const pricePerMillionRequestsUsd = clamp(opts.pricePerMillionRequestsUsd, 0, 1e9);
  const pricePerGbSecondUsd = clamp(opts.pricePerGbSecondUsd, 0, 1e3);
  const freeInvocationsPerMonth = clamp(opts.freeInvocationsPerMonth || 0, 0, 1e18);
  const freeGbSecondsPerMonth = clamp(opts.freeGbSecondsPerMonth || 0, 0, 1e18);

  const durationSeconds = avgDurationMs / 1000;
  const memoryGb = memoryMb / 1024;
  const gbSeconds = invocationsPerMonth * durationSeconds * memoryGb;

  const billableInvocations = clamp(invocationsPerMonth - freeInvocationsPerMonth, 0, 1e18);
  const billableGbSeconds = clamp(gbSeconds - freeGbSecondsPerMonth, 0, 1e18);

  const requestCostUsd = (billableInvocations / 1_000_000) * pricePerMillionRequestsUsd;
  const computeCostUsd = billableGbSeconds * pricePerGbSecondUsd;
  const totalCostUsd = requestCostUsd + computeCostUsd;

  return {
    invocationsPerMonth,
    avgDurationMs,
    memoryMb,
    durationSeconds,
    memoryGb,
    gbSeconds,
    freeInvocationsPerMonth,
    freeGbSecondsPerMonth,
    billableInvocations,
    billableGbSeconds,
    pricePerMillionRequestsUsd,
    pricePerGbSecondUsd,
    requestCostUsd,
    computeCostUsd,
    totalCostUsd,
  };
}

