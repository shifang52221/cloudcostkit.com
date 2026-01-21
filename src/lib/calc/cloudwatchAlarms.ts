import { clamp } from "../math";

export function estimateCloudwatchAlarmsCost(opts: {
  standardAlarms: number;
  highResAlarms: number;
  compositeAlarms: number;
  pricePerStandardAlarmUsdPerMonth: number;
  pricePerHighResAlarmUsdPerMonth: number;
  pricePerCompositeAlarmUsdPerMonth: number;
}) {
  const standardAlarms = clamp(opts.standardAlarms, 0, 1e9);
  const highResAlarms = clamp(opts.highResAlarms, 0, 1e9);
  const compositeAlarms = clamp(opts.compositeAlarms, 0, 1e9);

  const pricePerStandardAlarmUsdPerMonth = clamp(opts.pricePerStandardAlarmUsdPerMonth, 0, 1e9);
  const pricePerHighResAlarmUsdPerMonth = clamp(opts.pricePerHighResAlarmUsdPerMonth, 0, 1e9);
  const pricePerCompositeAlarmUsdPerMonth = clamp(opts.pricePerCompositeAlarmUsdPerMonth, 0, 1e9);

  const standardCostUsd = standardAlarms * pricePerStandardAlarmUsdPerMonth;
  const highResCostUsd = highResAlarms * pricePerHighResAlarmUsdPerMonth;
  const compositeCostUsd = compositeAlarms * pricePerCompositeAlarmUsdPerMonth;
  const totalCostUsd = standardCostUsd + highResCostUsd + compositeCostUsd;

  return {
    standardAlarms,
    highResAlarms,
    compositeAlarms,
    pricePerStandardAlarmUsdPerMonth,
    pricePerHighResAlarmUsdPerMonth,
    pricePerCompositeAlarmUsdPerMonth,
    standardCostUsd,
    highResCostUsd,
    compositeCostUsd,
    totalCostUsd,
  };
}

