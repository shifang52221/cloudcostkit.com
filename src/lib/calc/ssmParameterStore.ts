import { clamp } from "../math";

export function estimateSsmParameterStoreCost(opts: {
  standardParameters: number;
  advancedParameters: number;
  pricePerAdvancedParameterUsdPerMonth: number;
  apiCallsPerMonth: number;
  pricePer10kApiCallsUsd: number;
}) {
  const standardParameters = clamp(opts.standardParameters, 0, 1e12);
  const advancedParameters = clamp(opts.advancedParameters, 0, 1e12);
  const pricePerAdvancedParameterUsdPerMonth = clamp(opts.pricePerAdvancedParameterUsdPerMonth, 0, 1e9);
  const apiCallsPerMonth = clamp(opts.apiCallsPerMonth, 0, 1e18);
  const pricePer10kApiCallsUsd = clamp(opts.pricePer10kApiCallsUsd, 0, 1e9);

  const advancedParameterCostUsd = advancedParameters * pricePerAdvancedParameterUsdPerMonth;
  const apiCostUsd = (apiCallsPerMonth / 10_000) * pricePer10kApiCallsUsd;
  const totalCostUsd = advancedParameterCostUsd + apiCostUsd;

  return {
    standardParameters,
    advancedParameters,
    pricePerAdvancedParameterUsdPerMonth,
    apiCallsPerMonth,
    pricePer10kApiCallsUsd,
    advancedParameterCostUsd,
    apiCostUsd,
    totalCostUsd,
  };
}

