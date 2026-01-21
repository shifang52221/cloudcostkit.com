export type EstimateFargateCostInput = {
  tasks: number;
  vcpuPerTask: number;
  memoryGbPerTask: number;
  hoursPerMonth: number;
  pricePerVcpuHourUsd: number;
  pricePerGbHourUsd: number;
};

export type EstimateFargateCostResult = {
  vcpuHours: number;
  memoryGbHours: number;
  vcpuCostUsd: number;
  memoryCostUsd: number;
  totalCostUsd: number;
};

export function estimateFargateCost(input: EstimateFargateCostInput): EstimateFargateCostResult {
  const vcpuHours = input.tasks * input.vcpuPerTask * input.hoursPerMonth;
  const memoryGbHours = input.tasks * input.memoryGbPerTask * input.hoursPerMonth;
  const vcpuCostUsd = vcpuHours * input.pricePerVcpuHourUsd;
  const memoryCostUsd = memoryGbHours * input.pricePerGbHourUsd;
  const totalCostUsd = vcpuCostUsd + memoryCostUsd;

  return { vcpuHours, memoryGbHours, vcpuCostUsd, memoryCostUsd, totalCostUsd };
}

