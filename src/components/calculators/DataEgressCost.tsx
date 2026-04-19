import React, { useEffect, useMemo } from "react";
import { useBooleanParamState, useNumberParamState, useStringParamState } from "./useNumberParamState";
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

type CalculatorModelState = {
  activeScenarioId: string;
  gbPerMonth: number;
  pricePerGbUsd: number;
  tieredPricing: boolean;
  tier1UpToGb: number;
  tier1PricePerGbUsd: number;
  tier2UpToGb: number;
  tier2PricePerGbUsd: number;
  tier3PricePerGbUsd: number;
  showPeakScenario: boolean;
  peakMultiplierPct: number;
  avgMbpsInput: number;
  peakMbpsInput: number;
};

type ScenarioPreset = {
  id: string;
  label: string;
  boundary: string;
  summary: string;
  gbPerMonth: number;
  pricePerGbUsd: number;
  tieredPricing: boolean;
  tier1UpToGb: number;
  tier1PricePerGbUsd: number;
  tier2UpToGb: number;
  tier2PricePerGbUsd: number;
  tier3PricePerGbUsd: number;
  showPeakScenario: boolean;
  peakMultiplierPct: number;
  avgMbpsInput: number;
  peakMbpsInput: number;
  optimizationLevers: [string, string];
};

const DEFAULT_AVG_MBPS_INPUT = 75;
const DEFAULT_PEAK_MBPS_INPUT = 180;

const SCENARIO_PRESETS: ScenarioPreset[] = [
  {
    id: "public-api",
    label: "Public API / SaaS internet egress",
    boundary: "Public internet egress transfer",
    summary: "For product API and dashboard traffic delivered directly to users.",
    gbPerMonth: 3200,
    pricePerGbUsd: 0.085,
    tieredPricing: false,
    tier1UpToGb: 10_000,
    tier1PricePerGbUsd: 0.085,
    tier2UpToGb: 50_000,
    tier2PricePerGbUsd: 0.07,
    tier3PricePerGbUsd: 0.06,
    showPeakScenario: true,
    peakMultiplierPct: 145,
    avgMbpsInput: 95,
    peakMbpsInput: 145,
    optimizationLevers: [
      "Reduce payload size (compression, pagination, selective fields) to lower internet egress GB.",
      "Shift static and repeat traffic to CDN cache so API origin transfer stays flat.",
    ],
  },
  {
    id: "cdn-origin-fill",
    label: "CDN origin fill / cache miss transfer",
    boundary: "CDN origin fill transfer",
    summary: "For traffic from origin to edge when cache misses or TTL churn increase.",
    gbPerMonth: 14_000,
    pricePerGbUsd: 0.065,
    tieredPricing: true,
    tier1UpToGb: 5_000,
    tier1PricePerGbUsd: 0.08,
    tier2UpToGb: 30_000,
    tier2PricePerGbUsd: 0.06,
    tier3PricePerGbUsd: 0.048,
    showPeakScenario: true,
    peakMultiplierPct: 185,
    avgMbpsInput: 420,
    peakMbpsInput: 775,
    optimizationLevers: [
      "Improve cache hit rate and cache-key stability to suppress origin fill transfer.",
      "Pre-warm hot paths before campaigns to avoid launch-day miss storms.",
    ],
  },
  {
    id: "cross-region-dr",
    label: "Cross-region replication / DR traffic",
    boundary: "Cross-region replication transfer",
    summary: "For replication, backup copy, and failover synchronization between regions.",
    gbPerMonth: 18_500,
    pricePerGbUsd: 0.02,
    tieredPricing: false,
    tier1UpToGb: 10_000,
    tier1PricePerGbUsd: 0.02,
    tier2UpToGb: 50_000,
    tier2PricePerGbUsd: 0.018,
    tier3PricePerGbUsd: 0.016,
    showPeakScenario: true,
    peakMultiplierPct: 160,
    avgMbpsInput: 565,
    peakMbpsInput: 910,
    optimizationLevers: [
      "Replicate only required datasets and tune replication windows instead of continuous full copy.",
      "Review failover drills to cap burst transfer during DR tests.",
    ],
  },
  {
    id: "burst-launch",
    label: "Burst month / launch month traffic",
    boundary: "Public outbound transfer with launch spikes",
    summary: "For launches, events, or seasonal windows where peak traffic dominates spend.",
    gbPerMonth: 6_200,
    pricePerGbUsd: 0.09,
    tieredPricing: true,
    tier1UpToGb: 10_000,
    tier1PricePerGbUsd: 0.09,
    tier2UpToGb: 40_000,
    tier2PricePerGbUsd: 0.072,
    tier3PricePerGbUsd: 0.058,
    showPeakScenario: true,
    peakMultiplierPct: 240,
    avgMbpsInput: 185,
    peakMbpsInput: 470,
    optimizationLevers: [
      "Split launch traffic assumptions into baseline and burst instead of one blended month.",
      "Load-test high-response endpoints early to avoid emergency retries that inflate egress.",
    ],
  },
];

const SCENARIO_ID_OPTIONS = ["", ...SCENARIO_PRESETS.map((preset) => preset.id)];

const responsivePairGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: 10,
  marginTop: 8,
  alignItems: "end",
};

const responsivePresetGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 8,
  marginTop: 8,
};

const tierGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: 10,
  marginTop: 10,
};

const compactLabelStyle: React.CSSProperties = { fontSize: 13 };
const fullWidthButtonStyle: React.CSSProperties = { width: "100%" };

function modelStateFromPreset(preset: ScenarioPreset): Omit<CalculatorModelState, "activeScenarioId"> {
  return {
    gbPerMonth: preset.gbPerMonth,
    pricePerGbUsd: preset.pricePerGbUsd,
    tieredPricing: preset.tieredPricing,
    tier1UpToGb: preset.tier1UpToGb,
    tier1PricePerGbUsd: preset.tier1PricePerGbUsd,
    tier2UpToGb: preset.tier2UpToGb,
    tier2PricePerGbUsd: preset.tier2PricePerGbUsd,
    tier3PricePerGbUsd: preset.tier3PricePerGbUsd,
    showPeakScenario: preset.showPeakScenario,
    peakMultiplierPct: preset.peakMultiplierPct,
    avgMbpsInput: preset.avgMbpsInput,
    peakMbpsInput: preset.peakMbpsInput,
  };
}

function nearlyEqual(a: number, b: number): boolean {
  return Math.abs(a - b) < 1e-6;
}

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
  const [avgMbpsInput, setAvgMbpsInput] = useNumberParamState("DataEgressCost.avgMbpsInput", DEFAULT_AVG_MBPS_INPUT);
  const [peakMbpsInput, setPeakMbpsInput] = useNumberParamState("DataEgressCost.peakMbpsInput", DEFAULT_PEAK_MBPS_INPUT);
  const [activeScenarioId, setActiveScenarioId] = useStringParamState("DataEgressCost.activeScenarioId", "", SCENARIO_ID_OPTIONS);
  const defaultModelState = useMemo<CalculatorModelState>(() => ({
    activeScenarioId: "",
    gbPerMonth: defaultGbPerMonth,
    pricePerGbUsd: defaultPricePerGbUsd,
    tieredPricing: false,
    tier1UpToGb: 10_000,
    tier1PricePerGbUsd: defaultPricePerGbUsd,
    tier2UpToGb: 50_000,
    tier2PricePerGbUsd: defaultPricePerGbUsd,
    tier3PricePerGbUsd: defaultPricePerGbUsd,
    showPeakScenario: false,
    peakMultiplierPct: 150,
    avgMbpsInput: DEFAULT_AVG_MBPS_INPUT,
    peakMbpsInput: DEFAULT_PEAK_MBPS_INPUT,
  }), [defaultGbPerMonth, defaultPricePerGbUsd]);

  const applyModelState = (next: CalculatorModelState) => {
    setActiveScenarioId(next.activeScenarioId);
    setGbPerMonth(next.gbPerMonth);
    setPricePerGbUsd(next.pricePerGbUsd);
    setTieredPricing(next.tieredPricing);
    setTier1UpToGb(next.tier1UpToGb);
    setTier1PricePerGbUsd(next.tier1PricePerGbUsd);
    setTier2UpToGb(next.tier2UpToGb);
    setTier2PricePerGbUsd(next.tier2PricePerGbUsd);
    setTier3PricePerGbUsd(next.tier3PricePerGbUsd);
    setShowPeakScenario(next.showPeakScenario);
    setPeakMultiplierPct(next.peakMultiplierPct);
    setAvgMbpsInput(next.avgMbpsInput);
    setPeakMbpsInput(next.peakMbpsInput);
  };

  const secondsPerMonth = 30.4 * 24 * 3600;
  const avgMbps = (gbPerMonth * 8000) / secondsPerMonth;
  const clampedAvgMbpsInput = clamp(avgMbpsInput, 0, 1e9);
  const clampedPeakMbpsInput = clamp(peakMbpsInput, 0, 1e9);
  const estimatedGbPerMonth = (clampedAvgMbpsInput * secondsPerMonth) / 8000;
  const peakMultiplierFromHelperMbps = clampedAvgMbpsInput > 0
    ? (clampedPeakMbpsInput / clampedAvgMbpsInput) * 100
    : 0;
  const tierOrderOk = tier2UpToGb >= tier1UpToGb;
  const inferredScenario = useMemo(
    () =>
      SCENARIO_PRESETS.find((preset) => {
        const state = modelStateFromPreset(preset);
        return (
          nearlyEqual(state.gbPerMonth, gbPerMonth)
          && nearlyEqual(state.pricePerGbUsd, pricePerGbUsd)
          && state.tieredPricing === tieredPricing
          && nearlyEqual(state.tier1UpToGb, tier1UpToGb)
          && nearlyEqual(state.tier1PricePerGbUsd, tier1PricePerGbUsd)
          && nearlyEqual(state.tier2UpToGb, tier2UpToGb)
          && nearlyEqual(state.tier2PricePerGbUsd, tier2PricePerGbUsd)
          && nearlyEqual(state.tier3PricePerGbUsd, tier3PricePerGbUsd)
          && state.showPeakScenario === showPeakScenario
          && nearlyEqual(state.peakMultiplierPct, peakMultiplierPct)
          && nearlyEqual(state.avgMbpsInput, avgMbpsInput)
          && nearlyEqual(state.peakMbpsInput, peakMbpsInput)
        );
      }) ?? null,
    [
      avgMbpsInput,
      gbPerMonth,
      peakMbpsInput,
      peakMultiplierPct,
      pricePerGbUsd,
      showPeakScenario,
      tier1PricePerGbUsd,
      tier1UpToGb,
      tier2PricePerGbUsd,
      tier2UpToGb,
      tier3PricePerGbUsd,
      tieredPricing,
    ],
  );
  useEffect(() => {
    const inferredId = inferredScenario?.id ?? "";
    if (activeScenarioId !== inferredId) setActiveScenarioId(inferredId);
  }, [activeScenarioId, inferredScenario, setActiveScenarioId]);

  const activeScenario = inferredScenario;
  const resolvedActiveScenarioId = inferredScenario?.id ?? "";

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
  const peakDeltaUsd = peakResult ? peakResult.monthlyCostUsd - result.monthlyCostUsd : 0;
  const activeOptimizationLevers = activeScenario?.optimizationLevers ?? [
    "Validate the transfer boundary and effective rate before changing architecture assumptions.",
    "Capture one baseline and one peak month to avoid hidden spike surprises.",
  ];

  const applyPreset = (preset: ScenarioPreset) => {
    applyModelState({
      activeScenarioId: preset.id,
      ...modelStateFromPreset(preset),
    });
  };

  return (
    <div className="calc-grid">
      <div className="panel">
        <h3>Inputs</h3>
        <div className="form">
          <div className="field field-6">
            <div className="label">{transferLabel}</div>
            <input
              type="number"
              inputMode="decimal"
              value={gbPerMonth}
              min={0}
              onChange={(e) => setGbPerMonth(+e.target.value)}
            />
            <div className="hint">Avg throughput: {formatNumber(avgMbps, 2)} Mbps.</div>
            <div style={responsivePairGrid}>
              <div>
                <div className="label" style={compactLabelStyle}>Avg throughput (Mbps)</div>
                <input
                  type="number"
                  inputMode="decimal"
                  value={avgMbpsInput}
                  min={0}
                  step={0.1}
                  onChange={(e) => setAvgMbpsInput(+e.target.value)}
                />
              </div>
              <div>
                <div className="label" style={compactLabelStyle}>Estimate helper</div>
                <button
                  className="btn"
                  type="button"
                  style={fullWidthButtonStyle}
                  onClick={() => setGbPerMonth(Math.round(estimatedGbPerMonth))}
                >
                  Use estimate as monthly GB
                </button>
                <div className="hint">Est {formatNumber(estimatedGbPerMonth, 0)} GB/month.</div>
              </div>
            </div>
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
              {!tierOrderOk ? (
                <div className="hint" style={{ marginTop: 6 }}>
                  Tier 2 should be greater than tier 1.
                </div>
              ) : null}
              <div style={tierGrid}>
                <div>
                  <div className="label" style={compactLabelStyle}>Tier 1 up to (GB)</div>
                  <input type="number" inputMode="numeric" value={tier1UpToGb} min={0} step={100} onChange={(e) => setTier1UpToGb(+e.target.value)} />
                </div>
                <div>
                  <div className="label" style={compactLabelStyle}>Tier 1 price ($/GB)</div>
                  <input
                    type="number"
                    inputMode="decimal"
                    value={tier1PricePerGbUsd}
                    min={0}
                    step={0.001}
                    onChange={(e) => setTier1PricePerGbUsd(+e.target.value)}
                  />
                </div>

                <div>
                  <div className="label" style={compactLabelStyle}>Tier 2 up to (GB)</div>
                  <input type="number" inputMode="numeric" value={tier2UpToGb} min={0} step={100} onChange={(e) => setTier2UpToGb(+e.target.value)} />
                </div>
                <div>
                  <div className="label" style={compactLabelStyle}>Tier 2 price ($/GB)</div>
                  <input
                    type="number"
                    inputMode="decimal"
                    value={tier2PricePerGbUsd}
                    min={0}
                    step={0.001}
                    onChange={(e) => setTier2PricePerGbUsd(+e.target.value)}
                  />
                </div>

                <div>
                  <div className="label" style={compactLabelStyle}>Over tier 2 (GB)</div>
                  <div className="muted" style={{ fontSize: 13, marginTop: 10 }}>Remaining</div>
                </div>
                <div>
                  <div className="label" style={compactLabelStyle}>Over tier 2 price ($/GB)</div>
                  <input
                    type="number"
                    inputMode="decimal"
                    value={tier3PricePerGbUsd}
                    min={0}
                    step={0.001}
                    onChange={(e) => setTier3PricePerGbUsd(+e.target.value)}
                  />
                </div>
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
            <div className="field field-6">
              <div className="label">Peak month settings</div>
              <div style={responsivePairGrid}>
                <div>
                  <div className="label" style={compactLabelStyle}>Peak multiplier (%)</div>
                  <input
                    type="number"
                    inputMode="numeric"
                    value={peakMultiplierPct}
                    min={100}
                    max={1000}
                    step={5}
                    onChange={(e) => setPeakMultiplierPct(+e.target.value)}
                  />
                  <div className="hint">Model seasonal spikes or launch traffic.</div>
                </div>
                <div>
                  <div className="label" style={compactLabelStyle}>Peak Mbps</div>
                  <input
                    type="number"
                    inputMode="decimal"
                    value={peakMbpsInput}
                    min={0}
                    step={0.1}
                    onChange={(e) => setPeakMbpsInput(+e.target.value)}
                  />
                  <button
                    className="btn"
                    type="button"
                    style={{ ...fullWidthButtonStyle, marginTop: 8 }}
                    onClick={() => {
                      if (peakMultiplierFromHelperMbps > 0) {
                        setPeakMultiplierPct(Math.min(1000, Math.max(100, Math.round(peakMultiplierFromHelperMbps))));
                      }
                    }}
                  >
                    Use peak Mbps as multiplier
                  </button>
                  <div className="hint">
                    Est {formatNumber(peakMultiplierFromHelperMbps, 0)}% multiplier from helper throughput values.
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          <div className="field field-6">
            <div className="label">Scenario presets</div>
            <div className="muted" style={{ fontSize: 13, marginTop: 6 }}>
              Pick a boundary-first starter so the estimate reflects the right transfer path.
            </div>
            <div style={responsivePresetGrid}>
              {SCENARIO_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  className="btn"
                  type="button"
                  aria-pressed={resolvedActiveScenarioId === preset.id}
                  onClick={() => applyPreset(preset)}
                  style={{
                    textAlign: "left",
                    whiteSpace: "normal",
                    minHeight: 74,
                    borderColor: resolvedActiveScenarioId === preset.id ? "rgba(122,227,255,0.8)" : undefined,
                  }}
                >
                  <strong>{preset.label}</strong>
                  <span className="muted" style={{ display: "block", marginTop: 4, fontSize: 12 }}>
                    {preset.summary}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="field field-6">
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => applyModelState(defaultModelState)}
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

        <div className="card2" style={{ padding: 12, marginTop: 12 }}>
          <div className="label">Decision-support snapshot</div>
          <div className="muted" style={{ fontSize: 13, marginTop: 6 }}>
            Scenario boundary: {activeScenario?.boundary ?? "Custom transfer boundary"}
          </div>
          <div className="muted" style={{ fontSize: 13, marginTop: 4 }}>
            Baseline monthly spend: {formatCurrency2(result.monthlyCostUsd)}
          </div>
          <div className="muted" style={{ fontSize: 13, marginTop: 4 }}>
            Peak monthly spend: {peakResult ? formatCurrency2(peakResult.monthlyCostUsd) : "Peak scenario disabled"}
          </div>
          <div className="muted" style={{ fontSize: 13, marginTop: 4 }}>
            Marginal peak impact: {peakResult ? formatCurrency2(peakDeltaUsd) : "Enable peak scenario to estimate delta"}
          </div>
          <div className="muted" style={{ fontSize: 13, marginTop: 8 }}>
            Next action:
          </div>
          <ul className="muted" style={{ margin: "6px 0 0", paddingLeft: 18 }}>
            <li>{activeOptimizationLevers[0]}</li>
            <li>{activeOptimizationLevers[1]}</li>
          </ul>
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
