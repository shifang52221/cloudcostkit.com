import { clamp } from "../math";

export function estimateLoadBalancerCost(opts: {
  loadBalancers: number;
  hoursPerMonth: number;
  pricePerLbHourUsd: number;
  capacityUnitsPerHour: number;
  pricePerCapacityUnitHourUsd: number;
}) {
  const loadBalancers = clamp(opts.loadBalancers, 0, 1e6);
  const hoursPerMonth = clamp(opts.hoursPerMonth, 0, 744);
  const pricePerLbHourUsd = clamp(opts.pricePerLbHourUsd, 0, 1e6);

  const capacityUnitsPerHour = clamp(opts.capacityUnitsPerHour, 0, 1e12);
  const pricePerCapacityUnitHourUsd = clamp(opts.pricePerCapacityUnitHourUsd, 0, 1e6);

  const hourlyCostUsd = loadBalancers * hoursPerMonth * pricePerLbHourUsd;
  const capacityUnitHours = capacityUnitsPerHour * hoursPerMonth;
  const capacityCostUsd = capacityUnitHours * pricePerCapacityUnitHourUsd;
  const totalCostUsd = hourlyCostUsd + capacityCostUsd;

  return {
    loadBalancers,
    hoursPerMonth,
    pricePerLbHourUsd,
    capacityUnitsPerHour,
    pricePerCapacityUnitHourUsd,
    hourlyCostUsd,
    capacityUnitHours,
    capacityCostUsd,
    totalCostUsd,
  };
}

