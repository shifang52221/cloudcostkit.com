import { clamp } from "../math";

export function estimateMonthlyRequestsFromRps(opts: {
  rps: number;
  utilizationPct: number;
  hoursPerDay: number;
  daysPerMonth?: number;
}) {
  const daysPerMonth = clamp(opts.daysPerMonth ?? 30.4, 1, 31);
  const rps = clamp(opts.rps, 0, 1e12);
  const utilizationPct = clamp(opts.utilizationPct, 0, 100) / 100;
  const hoursPerDay = clamp(opts.hoursPerDay, 0, 24);
  const seconds = daysPerMonth * hoursPerDay * 3600;
  const requestsPerMonth = rps * utilizationPct * seconds;
  return { daysPerMonth, rps, utilizationPct, hoursPerDay, requestsPerMonth };
}

