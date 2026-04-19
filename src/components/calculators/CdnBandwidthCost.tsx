import React, { useMemo } from "react";
import { useBooleanParamState, useNumberParamState, useStringParamState } from "./useNumberParamState";
import { estimateEgressCost } from "../../lib/calc/egress";
import { formatCurrency2, formatNumber } from "../../lib/format";
import { clamp } from "../../lib/math";

type ScenarioPreset = {
  id: string;
  label: string;
  summary: string;
  dominantRisk: string;
  edgeGbPerMonth: number;
  pricePerGbUsd: number;
  showPeakScenario: boolean;
  peakMultiplierPct: number;
  avgMbpsInput: number;
  peakMbpsInput: number;
  optimizationLevers: [string, string];
};

const SECONDS_PER_MONTH = 30.4 * 24 * 3600;

const SCENARIO_PRESETS: ScenarioPreset[] = [
  {
    id: "video-library",
    label: "Video library / streaming delivery",
    summary: "High edge bandwidth with stable request volume and strong cacheability.",
    dominantRisk: "Delivered GB and geographic mix dominate this bill before request tuning does.",
    edgeGbPerMonth: 48_000,
    pricePerGbUsd: 0.045,
    showPeakScenario: true,
    peakMultiplierPct: 170,
    avgMbpsInput: 1450,
    peakMbpsInput: 2460,
    optimizationLevers: [
      "Reduce bitrate ladders and improve compression before chasing small request-side wins.",
      "Review top geographies separately if one region mix is inflating the blended $/GB.",
    ],
  },
  {
    id: "image-heavy-storefront",
    label: "Image-heavy storefront delivery",
    summary: "Large product image catalogs where asset weight and campaigns drive the edge bill.",
    dominantRisk: "Asset weight and burst merchandising traffic matter more than normal-day averages.",
    edgeGbPerMonth: 9_500,
    pricePerGbUsd: 0.055,
    showPeakScenario: true,
    peakMultiplierPct: 160,
    avgMbpsInput: 285,
    peakMbpsInput: 455,
    optimizationLevers: [
      "Cut image bytes first with format negotiation and responsive variants.",
      "Model campaign weeks separately so launch merchandising does not hide inside one average month.",
    ],
  },
  {
    id: "software-downloads",
    label: "Software downloads / release traffic",
    summary: "Large binary delivery where one release window can add a second month of traffic in days.",
    dominantRisk: "Release bursts and regional download concentration create the biggest miss risk.",
    edgeGbPerMonth: 22_000,
    pricePerGbUsd: 0.05,
    showPeakScenario: true,
    peakMultiplierPct: 220,
    avgMbpsInput: 670,
    peakMbpsInput: 1475,
    optimizationLevers: [
      "Separate release-week traffic from steady-state download traffic before budgeting.",
      "Pre-stage mirrors or release channels if one geography repeatedly drives the peak month.",
    ],
  },
  {
    id: "launch-campaign",
    label: "Launch / campaign burst traffic",
    summary: "Short intense peaks where delivered GB jumps because demand and cache churn spike together.",
    dominantRisk: "Peak-week delivery, not the average month, is the number most likely to break the budget.",
    edgeGbPerMonth: 12_000,
    pricePerGbUsd: 0.06,
    showPeakScenario: true,
    peakMultiplierPct: 230,
    avgMbpsInput: 365,
    peakMbpsInput: 840,
    optimizationLevers: [
      "Plan a separate launch scenario instead of trusting a calm-week blended month.",
      "Coordinate cache pre-warming and campaign geography so the first hours do not set the cost baseline.",
    ],
  },
];

const SCENARIO_IDS = ["", ...SCENARIO_PRESETS.map((preset) => preset.id)];

const responsiveGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: 10,
  marginTop: 8,
  alignItems: "end",
};

const presetGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 8,
  marginTop: 8,
};

function findPreset(id: string): ScenarioPreset | null {
  return SCENARIO_PRESETS.find((preset) => preset.id === id) ?? null;
}

function inferRiskLabel({ peakDeltaUsd, pricePerGbUsd }: { peakDeltaUsd: number; pricePerGbUsd: number }): string {
  if (peakDeltaUsd > 750) return "Launch-week or media-event bandwidth risk is material.";
  if (pricePerGbUsd >= 0.06) return "Regional mix and premium delivery pricing likely matter as much as raw GB.";
  return "Delivered edge GB is the main planning surface for this scenario.";
}

export function CdnBandwidthCostCalculator() {
  const [activeScenarioId, setActiveScenarioId] = useStringParamState("CdnBandwidthCost.activeScenarioId", "", SCENARIO_IDS);
  const [edgeGbPerMonth, setEdgeGbPerMonth] = useNumberParamState("CdnBandwidthCost.edgeGbPerMonth", 4_000);
  const [pricePerGbUsd, setPricePerGbUsd] = useNumberParamState("CdnBandwidthCost.pricePerGbUsd", 0.06);
  const [showPeakScenario, setShowPeakScenario] = useBooleanParamState("CdnBandwidthCost.showPeakScenario", true);
  const [peakMultiplierPct, setPeakMultiplierPct] = useNumberParamState("CdnBandwidthCost.peakMultiplierPct", 160);
  const [avgMbpsInput, setAvgMbpsInput] = useNumberParamState("CdnBandwidthCost.avgMbpsInput", 120);
  const [peakMbpsInput, setPeakMbpsInput] = useNumberParamState("CdnBandwidthCost.peakMbpsInput", 220);

  const activeScenario = findPreset(activeScenarioId);
  const baseline = useMemo(
    () => estimateEgressCost({ gbPerMonth: clamp(edgeGbPerMonth, 0, 1e12), pricePerGbUsd: clamp(pricePerGbUsd, 0, 1e6) }),
    [edgeGbPerMonth, pricePerGbUsd],
  );
  const peakGbPerMonth = showPeakScenario ? baseline.gbPerMonth * (clamp(peakMultiplierPct, 100, 1000) / 100) : 0;
  const peak = useMemo(
    () => (showPeakScenario ? estimateEgressCost({ gbPerMonth: peakGbPerMonth, pricePerGbUsd: clamp(pricePerGbUsd, 0, 1e6) }) : null),
    [peakGbPerMonth, pricePerGbUsd, showPeakScenario],
  );
  const avgMbps = (baseline.gbPerMonth * 8000) / SECONDS_PER_MONTH;
  const helperGbPerMonth = (clamp(avgMbpsInput, 0, 1e9) * SECONDS_PER_MONTH) / 8000;
  const helperPeakMultiplier = avgMbpsInput > 0 ? (clamp(peakMbpsInput, 0, 1e9) / clamp(avgMbpsInput, 0.000001, 1e9)) * 100 : 0;
  const peakDeltaUsd = peak ? peak.monthlyCostUsd - baseline.monthlyCostUsd : 0;
  const riskLabel = inferRiskLabel({ peakDeltaUsd, pricePerGbUsd: baseline.pricePerGbUsd });
  const optimizationLevers = activeScenario?.optimizationLevers ?? [
    "Validate delivered edge GB against CDN analytics before changing the rate assumption.",
    "Split peak delivery windows from the steady month so launch traffic does not distort the baseline.",
  ];

  const applyPreset = (preset: ScenarioPreset) => {
    setActiveScenarioId(preset.id);
    setEdgeGbPerMonth(preset.edgeGbPerMonth);
    setPricePerGbUsd(preset.pricePerGbUsd);
    setShowPeakScenario(preset.showPeakScenario);
    setPeakMultiplierPct(preset.peakMultiplierPct);
    setAvgMbpsInput(preset.avgMbpsInput);
    setPeakMbpsInput(preset.peakMbpsInput);
  };

  const resetExample = () => {
    setActiveScenarioId("");
    setEdgeGbPerMonth(4_000);
    setPricePerGbUsd(0.06);
    setShowPeakScenario(true);
    setPeakMultiplierPct(160);
    setAvgMbpsInput(120);
    setPeakMbpsInput(220);
  };

  return (
    <div className="calc-grid">
      <div className="panel">
        <h3>Inputs</h3>
        <div className="form">
          <div className="field field-6">
            <div className="label">CDN bandwidth scenarios</div>
            <div style={presetGrid}>
              {SCENARIO_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  className="btn"
                  type="button"
                  style={{
                    width: "100%",
                    textAlign: "left",
                    borderColor: activeScenarioId === preset.id ? "var(--accent)" : undefined,
                  }}
                  onClick={() => applyPreset(preset)}
                >
                  <strong>{preset.label}</strong>
                  <div className="hint" style={{ marginTop: 6 }}>{preset.summary}</div>
                </button>
              ))}
            </div>
          </div>
          <div className="field field-3">
            <div className="label">Delivered edge bandwidth (GB / month)</div>
            <input type="number" inputMode="decimal" value={edgeGbPerMonth} min={0} step={100} onChange={(e) => {
              setActiveScenarioId("");
              setEdgeGbPerMonth(+e.target.value);
            }} />
            <div className="hint">Current baseline throughput: {formatNumber(avgMbps, 2)} Mbps.</div>
          </div>
          <div className="field field-3">
            <div className="label">Effective edge rate ($ / GB)</div>
            <input type="number" inputMode="decimal" value={pricePerGbUsd} min={0} step={0.0001} onChange={(e) => {
              setActiveScenarioId("");
              setPricePerGbUsd(+e.target.value);
            }} />
            <div className="hint">Use the blended rate that matches your regional mix.</div>
          </div>
          <div className="field field-6">
            <div className="label">Throughput helper</div>
            <div style={responsiveGrid}>
              <div>
                <div className="label" style={{ fontSize: 13 }}>Avg Mbps</div>
                <input type="number" inputMode="decimal" value={avgMbpsInput} min={0} step={0.1} onChange={(e) => {
                  setActiveScenarioId("");
                  setAvgMbpsInput(+e.target.value);
                }} />
              </div>
              <div>
                <div className="label" style={{ fontSize: 13 }}>Peak Mbps</div>
                <input type="number" inputMode="decimal" value={peakMbpsInput} min={0} step={0.1} onChange={(e) => {
                  setActiveScenarioId("");
                  setPeakMbpsInput(+e.target.value);
                }} />
              </div>
              <div>
                <div className="label" style={{ fontSize: 13 }}>Estimate helper</div>
                <button className="btn" type="button" style={{ width: "100%" }} onClick={() => {
                  setActiveScenarioId("");
                  setEdgeGbPerMonth(Math.round(helperGbPerMonth));
                }}>
                  Use avg Mbps as monthly GB
                </button>
                <div className="hint">Est {formatNumber(helperGbPerMonth, 0)} GB/month.</div>
              </div>
            </div>
          </div>
          <div className="field field-3" style={{ alignSelf: "end" }}>
            <label className="muted" style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <input type="checkbox" checked={showPeakScenario} onChange={(e) => {
                setActiveScenarioId("");
                setShowPeakScenario(e.target.checked);
              }} />
              Include peak month
            </label>
          </div>
          {showPeakScenario ? (
            <div className="field field-3">
              <div className="label">Peak month multiplier (%)</div>
              <input type="number" inputMode="numeric" value={peakMultiplierPct} min={100} max={1000} step={5} onChange={(e) => {
                setActiveScenarioId("");
                setPeakMultiplierPct(+e.target.value);
              }} />
              <div className="btn-row" style={{ marginTop: 8 }}>
                <button className="btn" type="button" onClick={() => {
                  if (helperPeakMultiplier > 0) {
                    setActiveScenarioId("");
                    setPeakMultiplierPct(Math.min(1000, Math.max(100, Math.round(helperPeakMultiplier))));
                  }
                }}>
                  Use peak Mbps helper
                </button>
              </div>
              <div className="hint">Helper suggests {formatNumber(helperPeakMultiplier, 0)}%.</div>
            </div>
          ) : null}
          <div className="field field-6">
            <div className="btn-row">
              <button className="btn" type="button" onClick={resetExample}>Reset example</button>
            </div>
          </div>
        </div>
      </div>
      <div className="panel">
        <h3>Results</h3>
        <div className="kpis">
          <div className="kpi">
            <div className="k">Baseline bandwidth cost</div>
            <div className="v">{formatCurrency2(baseline.monthlyCostUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">Delivered edge GB</div>
            <div className="v">{formatNumber(baseline.gbPerMonth, 0)}</div>
          </div>
          <div className="kpi">
            <div className="k">Effective rate</div>
            <div className="v">{formatCurrency2(baseline.pricePerGbUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">Peak month cost</div>
            <div className="v">{peak ? formatCurrency2(peak.monthlyCostUsd) : "Off"}</div>
          </div>
        </div>
        {peak ? (
          <div style={{ marginTop: 12 }}>
            <div className="muted" style={{ fontSize: 13, marginBottom: 6 }}>Baseline vs peak bandwidth month</div>
            <table className="table">
              <thead>
                <tr>
                  <th>Scenario</th>
                  <th className="num">GB / month</th>
                  <th className="num">Monthly cost</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Baseline</td>
                  <td className="num">{formatNumber(baseline.gbPerMonth, 0)}</td>
                  <td className="num">{formatCurrency2(baseline.monthlyCostUsd)}</td>
                </tr>
                <tr>
                  <td>Peak</td>
                  <td className="num">{formatNumber(peak.gbPerMonth, 0)}</td>
                  <td className="num">{formatCurrency2(peak.monthlyCostUsd)}</td>
                </tr>
                <tr>
                  <td>Delta</td>
                  <td className="num">{formatNumber(peak.gbPerMonth - baseline.gbPerMonth, 0)}</td>
                  <td className="num">{formatCurrency2(peakDeltaUsd)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : null}
        <div style={{ marginTop: 16, border: "1px solid var(--border)", borderRadius: 12, padding: 14 }}>
          <div className="muted" style={{ fontSize: 13, marginBottom: 6 }}>Bandwidth interpretation</div>
          <div style={{ fontWeight: 700 }}>{activeScenario?.label ?? "Custom edge-delivery scenario"}</div>
          <p className="muted" style={{ marginTop: 8, marginBottom: 8 }}>
            {activeScenario?.dominantRisk ?? "This model is about delivered edge GB first, then rate quality and peak timing."}
          </p>
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            <li><strong>Modeled surface</strong>: edge delivery to viewers, not origin cache-fill traffic.</li>
            <li><strong>Dominant bandwidth risk</strong>: {riskLabel}</li>
            <li><strong>Baseline vs peak gap</strong>: {peak ? `${formatCurrency2(peakDeltaUsd)} additional spend in the peak month.` : "Peak month is disabled in this model."}</li>
          </ul>
          <div className="muted" style={{ fontSize: 13, marginTop: 10 }}>Next action</div>
          <ul style={{ margin: "6px 0 0", paddingLeft: 18 }}>
            {optimizationLevers.map((lever) => (
              <li key={lever}>{lever}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
