import { clamp } from "../math";

export function estimateComputeCost(opts: {
  instances: number;
  pricePerHourUsd: number;
  utilizationPct: number;
  hoursPerDay: number;
  daysPerMonth?: number;
}) {
  const daysPerMonth = clamp(opts.daysPerMonth ?? 30.4, 1, 31);
  const instances = Math.floor(clamp(opts.instances, 0, 1e9));
  const pricePerHourUsd = clamp(opts.pricePerHourUsd, 0, 1e6);
  const utilizationPct = clamp(opts.utilizationPct, 0, 100) / 100;
  const hoursPerDay = clamp(opts.hoursPerDay, 0, 24);

  const billableHoursPerInstance = daysPerMonth * hoursPerDay * utilizationPct;
  const monthlyCostUsd = instances * billableHoursPerInstance * pricePerHourUsd;

  return {
    daysPerMonth,
    instances,
    pricePerHourUsd,
    utilizationPct,
    hoursPerDay,
    billableHoursPerInstance,
    monthlyCostUsd,
  };
}

