import { clamp } from "../math";

export type LoadBalancerType = "alb" | "nlb";

export type EstimateLoadBalancerCapacityUnitsInput = {
  type: LoadBalancerType;

  newConnectionsPerSecond: number;
  activeConnections: number;
  processedGbPerHour: number;
  ruleEvaluationsPerSecond?: number; // ALB only
};

export type EstimateLoadBalancerCapacityUnitsResult = {
  type: LoadBalancerType;
  capacityUnitsPerHour: number;
  drivers: {
    newConnectionsUnits: number;
    activeConnectionsUnits: number;
    processedBytesUnits: number;
    ruleEvaluationsUnits?: number;
  };
};

const ALB_THRESHOLDS = {
  newConnectionsPerSecond: 25,
  activeConnections: 3000,
  processedGbPerHour: 1,
  ruleEvaluationsPerSecond: 1000,
} as const;

const NLB_THRESHOLDS = {
  newConnectionsPerSecond: 800,
  activeConnections: 100000,
  processedGbPerHour: 1,
} as const;

export function estimateLoadBalancerCapacityUnits(
  input: EstimateLoadBalancerCapacityUnitsInput,
): EstimateLoadBalancerCapacityUnitsResult {
  const type = input.type;
  const newConnectionsPerSecond = clamp(input.newConnectionsPerSecond, 0, 1e12);
  const activeConnections = clamp(input.activeConnections, 0, 1e12);
  const processedGbPerHour = clamp(input.processedGbPerHour, 0, 1e12);
  const ruleEvaluationsPerSecond = clamp(input.ruleEvaluationsPerSecond ?? 0, 0, 1e12);

  if (type === "alb") {
    const newConnectionsUnits = newConnectionsPerSecond / ALB_THRESHOLDS.newConnectionsPerSecond;
    const activeConnectionsUnits = activeConnections / ALB_THRESHOLDS.activeConnections;
    const processedBytesUnits = processedGbPerHour / ALB_THRESHOLDS.processedGbPerHour;
    const ruleEvaluationsUnits = ruleEvaluationsPerSecond / ALB_THRESHOLDS.ruleEvaluationsPerSecond;

    const capacityUnitsPerHour = Math.max(
      0,
      newConnectionsUnits,
      activeConnectionsUnits,
      processedBytesUnits,
      ruleEvaluationsUnits,
    );

    return {
      type,
      capacityUnitsPerHour,
      drivers: { newConnectionsUnits, activeConnectionsUnits, processedBytesUnits, ruleEvaluationsUnits },
    };
  }

  const newConnectionsUnits = newConnectionsPerSecond / NLB_THRESHOLDS.newConnectionsPerSecond;
  const activeConnectionsUnits = activeConnections / NLB_THRESHOLDS.activeConnections;
  const processedBytesUnits = processedGbPerHour / NLB_THRESHOLDS.processedGbPerHour;

  const capacityUnitsPerHour = Math.max(0, newConnectionsUnits, activeConnectionsUnits, processedBytesUnits);

  return {
    type,
    capacityUnitsPerHour,
    drivers: { newConnectionsUnits, activeConnectionsUnits, processedBytesUnits },
  };
}

