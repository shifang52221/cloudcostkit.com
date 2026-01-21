import { clamp } from "../math";

export function estimateSecretsManagerCost(opts: {
  secrets: number;
  pricePerSecretUsdPerMonth: number;
  apiCallsPerMonth: number;
  pricePer10kApiCallsUsd: number;
}) {
  const secrets = clamp(opts.secrets, 0, 1e12);
  const pricePerSecretUsdPerMonth = clamp(opts.pricePerSecretUsdPerMonth, 0, 1e9);
  const apiCallsPerMonth = clamp(opts.apiCallsPerMonth, 0, 1e18);
  const pricePer10kApiCallsUsd = clamp(opts.pricePer10kApiCallsUsd, 0, 1e9);

  const secretCostUsd = secrets * pricePerSecretUsdPerMonth;
  const apiCostUsd = (apiCallsPerMonth / 10_000) * pricePer10kApiCallsUsd;
  const totalCostUsd = secretCostUsd + apiCostUsd;

  return {
    secrets,
    pricePerSecretUsdPerMonth,
    apiCallsPerMonth,
    pricePer10kApiCallsUsd,
    secretCostUsd,
    apiCostUsd,
    totalCostUsd,
  };
}

