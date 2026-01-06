import { clamp } from "../math";

export function gbToGib(gb: number) {
  return clamp(gb, 0, 1e18) / 1.073741824;
}

export function gibToGb(gib: number) {
  return clamp(gib, 0, 1e18) * 1.073741824;
}

export function mbpsToMBps(mbps: number) {
  return clamp(mbps, 0, 1e18) / 8;
}

export function MBpsToMbps(mBps: number) {
  return clamp(mBps, 0, 1e18) * 8;
}

export function throughputToMonthlyTransferGb(opts: {
  mbps: number;
  utilizationPct: number;
  hoursPerDay: number;
  daysPerMonth?: number;
}) {
  const daysPerMonth = clamp(opts.daysPerMonth ?? 30.4, 1, 31);
  const mbps = clamp(opts.mbps, 0, 1e12);
  const utilizationPct = clamp(opts.utilizationPct, 0, 100) / 100;
  const hoursPerDay = clamp(opts.hoursPerDay, 0, 24);
  const seconds = daysPerMonth * hoursPerDay * 3600;
  const mbTransferred = mbps * utilizationPct * seconds;
  const gbTransferred = mbTransferred / 8 / 1024; // Mb -> MB -> GB (decimal-ish estimate)
  return { daysPerMonth, mbps, utilizationPct, hoursPerDay, gbTransferred };
}

