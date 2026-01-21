import { clamp } from "../math";

export function estimateNatGatewayCost(opts: {
  natGateways: number;
  hoursPerMonth: number;
  pricePerNatGatewayHourUsd: number;
  dataProcessedGbPerMonth: number;
  pricePerGbProcessedUsd: number;
}) {
  const natGateways = clamp(opts.natGateways, 0, 1e6);
  const hoursPerMonth = clamp(opts.hoursPerMonth, 0, 744);
  const pricePerNatGatewayHourUsd = clamp(opts.pricePerNatGatewayHourUsd, 0, 1e6);

  const dataProcessedGbPerMonth = clamp(opts.dataProcessedGbPerMonth, 0, 1e12);
  const pricePerGbProcessedUsd = clamp(opts.pricePerGbProcessedUsd, 0, 1e3);

  const hourlyCostUsd = natGateways * hoursPerMonth * pricePerNatGatewayHourUsd;
  const dataProcessingCostUsd = dataProcessedGbPerMonth * pricePerGbProcessedUsd;
  const totalCostUsd = hourlyCostUsd + dataProcessingCostUsd;

  return {
    natGateways,
    hoursPerMonth,
    pricePerNatGatewayHourUsd,
    dataProcessedGbPerMonth,
    pricePerGbProcessedUsd,
    hourlyCostUsd,
    dataProcessingCostUsd,
    totalCostUsd,
  };
}

