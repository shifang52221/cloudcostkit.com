import { clamp } from "../math";

export function estimateWafCost(opts: {
  webAcls: number;
  rules: number;
  requestsPerMonth: number;
  pricePerWebAclUsdPerMonth: number;
  pricePerRuleUsdPerMonth: number;
  pricePerMillionRequestsUsd: number;
}) {
  const webAcls = clamp(opts.webAcls, 0, 1e9);
  const rules = clamp(opts.rules, 0, 1e9);
  const requestsPerMonth = clamp(opts.requestsPerMonth, 0, 1e18);

  const pricePerWebAclUsdPerMonth = clamp(opts.pricePerWebAclUsdPerMonth, 0, 1e9);
  const pricePerRuleUsdPerMonth = clamp(opts.pricePerRuleUsdPerMonth, 0, 1e9);
  const pricePerMillionRequestsUsd = clamp(opts.pricePerMillionRequestsUsd, 0, 1e9);

  const aclCostUsd = webAcls * pricePerWebAclUsdPerMonth;
  const rulesCostUsd = rules * pricePerRuleUsdPerMonth;
  const requestCostUsd = (requestsPerMonth / 1_000_000) * pricePerMillionRequestsUsd;
  const totalCostUsd = aclCostUsd + rulesCostUsd + requestCostUsd;

  return {
    webAcls,
    rules,
    requestsPerMonth,
    pricePerWebAclUsdPerMonth,
    pricePerRuleUsdPerMonth,
    pricePerMillionRequestsUsd,
    aclCostUsd,
    rulesCostUsd,
    requestCostUsd,
    totalCostUsd,
  };
}

