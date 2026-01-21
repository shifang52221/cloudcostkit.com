import { clamp } from "../math";

export type EstimateEcsTasksInput = {
  totalVcpuNeeded: number;
  totalMemoryGbNeeded: number;
  vcpuPerTask: number;
  memoryGbPerTask: number;
  targetUtilizationPct: number;
};

export type EstimateEcsTasksResult = {
  tasksByCpu: number;
  tasksByMemory: number;
  recommendedTasks: number;
  cpuUtilizationPctAtRecommended: number;
  memoryUtilizationPctAtRecommended: number;
};

export function estimateEcsTasks(input: EstimateEcsTasksInput): EstimateEcsTasksResult {
  const totalVcpuNeeded = clamp(input.totalVcpuNeeded, 0, 1e9);
  const totalMemoryGbNeeded = clamp(input.totalMemoryGbNeeded, 0, 1e9);
  const vcpuPerTask = clamp(input.vcpuPerTask, 0.001, 1e6);
  const memoryGbPerTask = clamp(input.memoryGbPerTask, 0.001, 1e9);
  const targetUtilizationPct = clamp(input.targetUtilizationPct, 1, 100) / 100;

  const effectiveCpuPerTask = vcpuPerTask * targetUtilizationPct;
  const effectiveMemoryPerTask = memoryGbPerTask * targetUtilizationPct;

  const tasksByCpu = totalVcpuNeeded === 0 ? 0 : Math.ceil(totalVcpuNeeded / effectiveCpuPerTask);
  const tasksByMemory = totalMemoryGbNeeded === 0 ? 0 : Math.ceil(totalMemoryGbNeeded / effectiveMemoryPerTask);

  const recommendedTasks = Math.max(tasksByCpu, tasksByMemory);
  const cpuUtilizationPctAtRecommended =
    recommendedTasks > 0 ? (totalVcpuNeeded / (recommendedTasks * vcpuPerTask)) * 100 : 0;
  const memoryUtilizationPctAtRecommended =
    recommendedTasks > 0 ? (totalMemoryGbNeeded / (recommendedTasks * memoryGbPerTask)) * 100 : 0;

  return {
    tasksByCpu,
    tasksByMemory,
    recommendedTasks,
    cpuUtilizationPctAtRecommended: clamp(cpuUtilizationPctAtRecommended, 0, 100),
    memoryUtilizationPctAtRecommended: clamp(memoryUtilizationPctAtRecommended, 0, 100),
  };
}

