import { clamp } from "../math";

export function estimateVpcInterfaceEndpointCost(opts: {
  endpoints: number;
  azsPerEndpoint: number;
  hoursPerMonth: number;
  pricePerEndpointHourUsd: number;
  dataProcessedGbPerMonth: number;
  pricePerGbProcessedUsd: number;
}) {
  const endpoints = clamp(opts.endpoints, 0, 1e6);
  const azsPerEndpoint = clamp(opts.azsPerEndpoint, 1, 100);
  const hoursPerMonth = clamp(opts.hoursPerMonth, 0, 744);
  const pricePerEndpointHourUsd = clamp(opts.pricePerEndpointHourUsd, 0, 1e6);
  const dataProcessedGbPerMonth = clamp(opts.dataProcessedGbPerMonth, 0, 1e12);
  const pricePerGbProcessedUsd = clamp(opts.pricePerGbProcessedUsd, 0, 1e3);

  const endpointHours = endpoints * azsPerEndpoint * hoursPerMonth;
  const hourlyCostUsd = endpointHours * pricePerEndpointHourUsd;
  const dataProcessingCostUsd = dataProcessedGbPerMonth * pricePerGbProcessedUsd;
  const totalCostUsd = hourlyCostUsd + dataProcessingCostUsd;

  return {
    endpoints,
    azsPerEndpoint,
    hoursPerMonth,
    pricePerEndpointHourUsd,
    dataProcessedGbPerMonth,
    pricePerGbProcessedUsd,
    endpointHours,
    hourlyCostUsd,
    dataProcessingCostUsd,
    totalCostUsd,
  };
}

