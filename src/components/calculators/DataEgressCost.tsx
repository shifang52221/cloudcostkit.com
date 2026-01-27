import React, { useMemo } from "react";
import { useBooleanParamState, useNumberParamState } from "./useNumberParamState";
import { estimateEgressCost, estimateTieredEgressCost } from "../../lib/calc/egress";
import { formatCurrency2, formatNumber } from "../../lib/format";
import { clamp } from "../../lib/math";

type BandwidthCostProps = {
  transferLabel?: string;
  priceLabel?: string;
  priceHint?: string;
  defaultGbPerMonth?: number;
  defaultPricePerGbUsd?: number;
};

export function DataEgressCostCalculator({
  transferLabel = "Data transfer (GB / month)",
  priceLabel = "Price ($ / GB)",
  priceHint = "Enter your provider's effective $/GB for the region/path/tier.",
  defaultGbPerMonth = 2500,
  defaultPricePerGbUsd = 0.09,
}: BandwidthCostProps) {
  const [gbPerMonth, setGbPerMonth] = useNumberParamState("DataEgressCost.gbPerMonth", defaultGbPerMonth);
  const [pricePerGbUsd, setPricePerGbUsd] = useNumberParamState("DataEgressCost.pricePerGbUsd", defaultPricePerGbUsd);
  const [tieredPricing, setTieredPricing] = useBooleanParamState("DataEgressCost.tieredPricing", false);
  const [tier1UpToGb, setTier1UpToGb] = useNumberParamState("DataEgressCost.tier1UpToGb", 10_000);
  const [tier1PricePerGbUsd, setTier1PricePerGbUsd] = useNumberParamState("DataEgressCost.tier1PricePerGbUsd", defaultPricePerGbUsd);
  const [tier2UpToGb, setTier2UpToGb] = useNumberParamState("DataEgressCost.tier2UpToGb", 50_000);
  const [tier2PricePerGbUsd, setTier2PricePerGbUsd] = useNumberParamState("DataEgressCost.tier2PricePerGbUsd", defaultPricePerGbUsd);
  const [tier3PricePerGbUsd, setTier3PricePerGbUsd] = useNumberParamState("DataEgressCost.tier3PricePerGbUsd", defaultPricePerGbUsd);
  const [showPeakScenario, setShowPeakScenario] = useBooleanParamState("DataEgressCost.showPeakScenario", false);
  const [peakMultiplierPct, setPeakMultiplierPct] = useNumberParamState("DataEgressCost.peakMultiplierPct", 150);

  const buildResult = (gbPerMonthValue: number) => {
    if (tieredPricing) {
      return estimateTieredEgressCost({
        gbPerMonth: clamp(gbPerMonthValue, 0, 1e12),
        tiers: [
          { upToGb: clamp(tier1UpToGb, 0, 1e12), pricePerGbUsd: clamp(tier1PricePerGbUsd, 0, 1e6) },
          { upToGb: clamp(tier2UpToGb, 0, 1e12), pricePerGbUsd: clamp(tier2PricePerGbUsd, 0, 1e6) },
          { upToGb: null, pricePerGbUsd: clamp(tier3PricePerGbUsd, 0, 1e6) },
        ],
      });
    }

    return estimateEgressCost({
      gbPerMonth: clamp(gbPerMonthValue, 0, 1e12),
      pricePerGbUsd: clamp(pricePerGbUsd, 0, 1e6),
    });
  };

  const result = useMemo(
    () => buildResult(gbPerMonth),
    [gbPerMonth, pricePerGbUsd, tieredPricing, tier1PricePerGbUsd, tier1UpToGb, tier2PricePerGbUsd, tier2UpToGb, tier3PricePerGbUsd],
  );

  const peakResult = useMemo(() => {
    if (!showPeakScenario) return null;
    const safeMultiplier = clamp(peakMultiplierPct, 100, 1000) / 100;
    const peakGbPerMonth = Math.ceil(clamp(gbPerMonth, 0, 1e12) * safeMultiplier);
    return buildResult(peakGbPerMonth);
  }, [
    gbPerMonth,
    peakMultiplierPct,
    pricePerGbUsd,
    showPeakScenario,
    tier1PricePerGbUsd,
    tier1UpToGb,
    tier2PricePerGbUsd,
    tier2UpToGb,
    tier3PricePerGbUsd,
    tieredPricing,
  ]);

  return (
    <div className="calc-grid">
      <div className="panel">
        <h3>Inputs</h3>
        <div className="form">
          <div className="field field-3">
            <div className="label">{transferLabel}</div>
            <input
              type="number"
              inputMode="decimal"
              value={gbPerMonth}
              min={0}
              onChange={(e) => setGbPerMonth(+e.target.value)}
            />
          </div>

          <div className="field field-3">
            <div className="label">Pricing mode</div>
            <select value={tieredPricing ? "tiered" : "flat"} onChange={(e) => setTieredPricing(String(e.target.value) === "tiered")}>
              <option value="flat">Flat</option>
              <option value="tiered">Tiered</option>
            </select>
            <div className="hint">Use tiered mode when pricing changes by volume.</div>
          </div>

          {!tieredPricing ? (
            <div className="field field-3">
              <div className="label">{priceLabel}</div>
              <input
                type="number"
                inputMode="decimal"
                value={pricePerGbUsd}
                min={0}
                step={0.001}
                onChange={(e) => setPricePerGbUsd(+e.target.value)}
              />
              <div className="hint">{priceHint}</div>
            </div>
          ) : (
            <div className="field field-6">
              <div className="label">Tiered pricing</div>
              <div className="muted" style={{ fontSize: 13, marginTop: 6 }}>
                Tiers are applied sequentially: first up to tier 1, then up to tier 2, then over tier 2.
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginTop: 10 }}>
                <div>
                  <div className="label" style={{ fontSize: 13 }}>Tier 1 up to (GB)</div>
                  <input type="number" inputMode="numeric" value={tier1UpToGb} min={0} step={100} onChange={(e) => setTier1UpToGb(+e.target.value)} />
                </div>
                <div>
                  <div className="label" style={{ fontSize: 13 }}>Tier 1 price ($/GB)</div>
                  <input
                    type="number"
                    inputMode="decimal"
                    value={tier1PricePerGbUsd}
                    min={0}
                    step={0.001}
                    onChange={(e) => setTier1PricePerGbUsd(+e.target.value)}
                  />
                </div>
                <div />

                <div>
                  <div className="label" style={{ fontSize: 13 }}>Tier 2 up to (GB)</div>
                  <input type="number" inputMode="numeric" value={tier2UpToGb} min={0} step={100} onChange={(e) => setTier2UpToGb(+e.target.value)} />
                </div>
                <div>
                  <div className="label" style={{ fontSize: 13 }}>Tier 2 price ($/GB)</div>
                  <input
                    type="number"
                    inputMode="decimal"
                    value={tier2PricePerGbUsd}
                    min={0}
                    step={0.001}
                    onChange={(e) => setTier2PricePerGbUsd(+e.target.value)}
                  />
                </div>
                <div />

                <div>
                  <div className="label" style={{ fontSize: 13 }}>Over tier 2 (GB)</div>
                  <div className="muted" style={{ fontSize: 13, marginTop: 10 }}>Remaining</div>
                </div>
                <div>
                  <div className="label" style={{ fontSize: 13 }}>Over tier 2 price ($/GB)</div>
                  <input
                    type="number"
                    inputMode="decimal"
                    value={tier3PricePerGbUsd}
                    min={0}
                    step={0.001}
                    onChange={(e) => setTier3PricePerGbUsd(+e.target.value)}
                  />
                </div>
                <div />
              </div>
            </div>
          )}

          <div className="field field-3" style={{ alignSelf: "end" }}>
            <label className="muted" style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <input
                type="checkbox"
                checked={showPeakScenario}
                onChange={(e) => setShowPeakScenario(e.target.checked)}
              />
              Include peak scenario
            </label>
          </div>

          {showPeakScenario ? (
            <div className="field field-3">
              <div className="label">Peak multiplier (%)</div>
              <input
                type="number"
                inputMode="numeric"
                value={peakMultiplierPct}
                min={100}
                max={1000}
                step={5}
                onChange={(e) => setPeakMultiplierPct(+e.target.value)}
              />
              <div className="hint">Model seasonal spikes or incident traffic.</div>
            </div>
          ) : null}

          <div className="field field-6">
            <div className="label">Scenario presets</div>
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setGbPerMonth(1200);
                  setShowPeakScenario(true);
                  setPeakMultiplierPct(140);
                }}
              >
                SaaS baseline
              </button>
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setGbPerMonth(8000);
                  setShowPeakScenario(true);
                  setPeakMultiplierPct(180);
                }}
              >
                Traffic spike
              </button>
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setGbPerMonth(50000);
                  setShowPeakScenario(true);
                  setPeakMultiplierPct(200);
                }}
              >
                Media heavy
              </button>
            </div>
          </div>

          <div className="field field-6">
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setGbPerMonth(defaultGbPerMonth);
                  setPricePerGbUsd(defaultPricePerGbUsd);
                  setTieredPricing(false);
                  setTier1UpToGb(10_000);
                  setTier1PricePerGbUsd(defaultPricePerGbUsd);
                  setTier2UpToGb(50_000);
                  setTier2PricePerGbUsd(defaultPricePerGbUsd);
                  setTier3PricePerGbUsd(defaultPricePerGbUsd);
                  setShowPeakScenario(false);
                  setPeakMultiplierPct(150);
                }}
              >
                Reset example
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="panel">
        <h3>Results</h3>
        <div className="kpis">
          <div className="kpi">
            <div className="k">Estimated monthly cost</div>
            <div className="v">{formatCurrency2(result.monthlyCostUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">Egress</div>
            <div className="v">{formatNumber(result.gbPerMonth)} GB</div>
          </div>
          {"pricePerGbUsd" in result ? (
            <div className="kpi">
              <div className="k">Price</div>
              <div className="v">{formatCurrency2(result.pricePerGbUsd)} / GB</div>
            </div>
          ) : null}
        </div>

        {peakResult ? (
          <div style={{ marginTop: 12 }}>
            <div className="muted" style={{ fontSize: 13, marginBottom: 6 }}>Baseline vs peak</div>
            <table className="table">
              <thead>
                <tr>
                  <th>Scenario</th>
                  <th className="num">GB/month</th>
                  <th className="num">Monthly cost</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Baseline</td>
                  <td className="num">{formatNumber(result.gbPerMonth, 0)}</td>
                  <td className="num">{formatCurrency2(result.monthlyCostUsd)}</td>
                </tr>
                <tr>
                  <td>Peak</td>
                  <td className="num">{formatNumber(peakResult.gbPerMonth, 0)}</td>
                  <td className="num">{formatCurrency2(peakResult.monthlyCostUsd)}</td>
                </tr>
                <tr>
                  <td>Delta</td>
                  <td className="num">{formatNumber(peakResult.gbPerMonth - result.gbPerMonth, 0)}</td>
                  <td className="num">{formatCurrency2(peakResult.monthlyCostUsd - result.monthlyCostUsd)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : null}

        {!("pricePerGbUsd" in result) && Array.isArray((result as any).breakdown) ? (
          <div style={{ marginTop: 14 }}>
            <div className="muted" style={{ fontSize: 13, marginBottom: 8 }}>Tier breakdown</div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", padding: "6px 0" }}>Tier</th>
                  <th style={{ textAlign: "right", padding: "6px 0" }}>GB</th>
                  <th style={{ textAlign: "right", padding: "6px 0" }}>Rate</th>
                  <th style={{ textAlign: "right", padding: "6px 0" }}>Cost</th>
                </tr>
              </thead>
              <tbody>
                {(result as any).breakdown.map((t: any, idx: number) => (
                  <tr>
                    <td style={{ padding: "6px 0" }} className="muted">
                      {t.upToGb == null
                        ? `Over ${formatNumber(((result as any).breakdown[idx - 1] || {}).upToGb || 0, 0)} GB`
                        : `Up to ${formatNumber(t.upToGb, 0)} GB`}
                    </td>
                    <td style={{ padding: "6px 0", textAlign: "right" }} className="muted">
                      {formatNumber(t.gb, 0)}
                    </td>
                    <td style={{ padding: "6px 0", textAlign: "right" }} className="muted">
                      {formatCurrency2(t.pricePerGbUsd)} / GB
                    </td>
                    <td style={{ padding: "6px 0", textAlign: "right" }} className="muted">
                      {formatCurrency2(t.costUsd)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </div>
  );
}
