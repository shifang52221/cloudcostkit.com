import { clamp } from "../math";

export function estimateApiTransfer(opts: {
  requestsPerDay: number;
  avgResponseKb: number;
  daysPerMonth?: number;
}) {
  const daysPerMonth = clamp(opts.daysPerMonth ?? 30.4, 1, 31);
  const requestsPerDay = clamp(opts.requestsPerDay, 0, 1e15);
  const avgResponseKb = clamp(opts.avgResponseKb, 0, 1e9);

  const requestsPerMonth = requestsPerDay * daysPerMonth;
  const totalKb = requestsPerMonth * avgResponseKb;
  const totalGb = totalKb / 1024 / 1024;

  return {
    daysPerMonth,
    requestsPerDay,
    avgResponseKb,
    requestsPerMonth,
    totalGb,
  };
}

