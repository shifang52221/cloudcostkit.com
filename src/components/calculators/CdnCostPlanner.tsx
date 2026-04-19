import React, { useMemo } from "react";
import { useBooleanParamState, useNumberParamState, useStringParamState } from "./useNumberParamState";
import { estimateEgressCost } from "../../lib/calc/egress";
import { estimateRequestCostPer10k } from "../../lib/calc/requests";
import { formatCurrency2, formatNumber } from "../../lib/format";
import { clamp } from "../../lib/math";

type PlannerPreset = {
  id: string;
  label: string;
  summary: string;
  edgeGbPerMonth: number;
  edgePricePerGbUsd: number;
  requestsPerMonth: number;
  requestPricePer10kUsd: number;
  cacheHitRatePct: number;
  originPricePerGbUsd: number;
  originOverheadPct: number;
  showPeakScenario: boolean;
  peakTrafficMultiplierPct: number;
  peakHitRatePct: number;
  optimizationLevers: [string, string];
};

type PlannerEstimate = {
  edgeBandwidthCostUsd: number;
  requestCostUsd: number;
  originGbPerMonth: number;
  originCostUsd: number;
  totalCostUsd: number;
  bandwidthSharePct: number;
  requestSharePct: number;
  originSharePct: number;
  dominantSurface: string;
};

const PRESETS: PlannerPreset[] = [
  {
    id: "image-heavy-storefront",
    label: "Image-heavy storefront",
    summary: "High asset weight, strong cache hit rate, and campaign peaks that can move bandwidth sharply.",
    edgeGbPerMonth: 9_500,
    edgePricePerGbUsd: 0.055,
    requestsPerMonth: 420_000_000,
    requestPricePer10kUsd: 0.007,
    cacheHitRatePct: 92,
    originPricePerGbUsd: 0.085,
    originOverheadPct: 3,
    showPeakScenario: true,
    peakTrafficMultiplierPct: 160,
    peakHitRatePct: 86,
    optimizationLevers: [
      "Shrink image bytes and variant sprawl before tuning request counts.",
      "Treat campaign weeks as a separate scenario because the peak month is what typically surprises finance.",
    ],
  },
  {
    id: "video-download",
    label: "Video / download distribution",
    summary: "Very high delivered GB with lower request sensitivity and moderate origin exposure.",
    edgeGbPerMonth: 48_000,
    edgePricePerGbUsd: 0.045,
    requestsPerMonth: 180_000_000,
    requestPricePer10kUsd: 0.006,
    cacheHitRatePct: 95,
    originPricePerGbUsd: 0.07,
    originOverheadPct: 4,
    showPeakScenario: true,
    peakTrafficMultiplierPct: 170,
    peakHitRatePct: 90,
    optimizationLevers: [
      "Optimize media size and regional delivery mix before focusing on request-side pricing.",
      "Keep release-week demand separate from normal viewing patterns so the planner stays honest.",
    ],
  },
  {
    id: "dynamic-api-edge",
    label: "Dynamic API at the edge",
    summary: "Request-heavy delivery where miss behavior and origin leakage can become more expensive than edge GB.",
    edgeGbPerMonth: 2_200,
    edgePricePerGbUsd: 0.065,
    requestsPerMonth: 1_400_000_000,
    requestPricePer10kUsd: 0.01,
    cacheHitRatePct: 72,
    originPricePerGbUsd: 0.09,
    originOverheadPct: 8,
    showPeakScenario: true,
    peakTrafficMultiplierPct: 185,
    peakHitRatePct: 58,
    optimizationLevers: [
      "Reduce duplicate calls, cache-key fragmentation, and low-value misses before negotiating bandwidth.",
      "Validate whether request-unit math or miss-driven origin traffic is the real reason the bill feels wrong.",
    ],
  },
  {
    id: "launch-cache-miss",
    label: "Launch month with lower cache hit rate",
    summary: "Traffic surges and colder cache behavior amplify edge, request, and origin costs together.",
    edgeGbPerMonth: 12_000,
    edgePricePerGbUsd: 0.06,
    requestsPerMonth: 900_000_000,
    requestPricePer10kUsd: 0.009,
    cacheHitRatePct: 68,
    originPricePerGbUsd: 0.09,
    originOverheadPct: 12,
    showPeakScenario: true,
    peakTrafficMultiplierPct: 220,
    peakHitRatePct: 48,
    optimizationLevers: [
      "Model the launch window explicitly instead of hiding it inside a calm-month average.",
      "Pre-warm hot assets and stabilize cache keys so origin leakage does not erase the CDN win.",
    ],
  },
];

const PRESET_IDS = ["", ...PRESETS.map((preset) => preset.id)];

const presetGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 8,
  marginTop: 8,
};

const helperGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: 10,
  marginTop: 8,
  alignItems: "end",
};

function estimatePlanner({
  edgeGbPerMonth,
  edgePricePerGbUsd,
  requestsPerMonth,
  requestPricePer10kUsd,
  cacheHitRatePct,
  originPricePerGbUsd,
  originOverheadPct,
}: {
  edgeGbPerMonth: number;
  edgePricePerGbUsd: number;
  requestsPerMonth: number;
  requestPricePer10kUsd: number;
  cacheHitRatePct: number;
  originPricePerGbUsd: number;
  originOverheadPct: number;
}): PlannerEstimate {
  const bandwidthCost = estimateEgressCost({
    gbPerMonth: clamp(edgeGbPerMonth, 0, 1e12),
    pricePerGbUsd: clamp(edgePricePerGbUsd, 0, 1e6),
  }).monthlyCostUsd;
  const requestCost = estimateRequestCostPer10k({
    requestsPerMonth: clamp(requestsPerMonth, 0, 1e18),
    pricePer10kUsd: clamp(requestPricePer10kUsd, 0, 1e9),
  }).costUsd;
  const missRate = 1 - clamp(cacheHitRatePct, 0, 100) / 100;
  const effectiveOriginFactor = missRate * (1 + clamp(originOverheadPct, 0, 200) / 100);
  const originGbPerMonth = clamp(edgeGbPerMonth, 0, 1e12) * effectiveOriginFactor;
  const originCostUsd = originGbPerMonth * clamp(originPricePerGbUsd, 0, 1e6);
  const totalCostUsd = bandwidthCost + requestCost + originCostUsd;
  const bandwidthSharePct = totalCostUsd > 0 ? (bandwidthCost / totalCostUsd) * 100 : 0;
  const requestSharePct = totalCostUsd > 0 ? (requestCost / totalCostUsd) * 100 : 0;
  const originSharePct = totalCostUsd > 0 ? (originCostUsd / totalCostUsd) * 100 : 0;
  const dominantSurface = [
    { label: "Bandwidth", value: bandwidthCost },
    { label: "Request fees", value: requestCost },
    { label: "Origin egress", value: originCostUsd },
  ].sort((a, b) => b.value - a.value)[0]?.label ?? "Bandwidth";

  return {
    edgeBandwidthCostUsd: bandwidthCost,
    requestCostUsd: requestCost,
    originGbPerMonth,
    originCostUsd,
    totalCostUsd,
    bandwidthSharePct,
    requestSharePct,
    originSharePct,
    dominantSurface,
  };
}

function findPreset(id: string): PlannerPreset | null {
  return PRESETS.find((preset) => preset.id === id) ?? null;
}

export function CdnCostPlanner() {
  const [activeScenarioId, setActiveScenarioId] = useStringParamState("CdnCostPlanner.activeScenarioId", "", PRESET_IDS);
  const [edgeGbPerMonth, setEdgeGbPerMonth] = useNumberParamState("CdnCostPlanner.edgeGbPerMonth", 4_000);
  const [edgePricePerGbUsd, setEdgePricePerGbUsd] = useNumberParamState("CdnCostPlanner.edgePricePerGbUsd", 0.06);
  const [requestsPerMonth, setRequestsPerMonth] = useNumberParamState("CdnCostPlanner.requestsPerMonth", 300_000_000);
  const [requestPricePer10kUsd, setRequestPricePer10kUsd] = useNumberParamState("CdnCostPlanner.requestPricePer10kUsd", 0.0075);
  const [cacheHitRatePct, setCacheHitRatePct] = useNumberParamState("CdnCostPlanner.cacheHitRatePct", 85);
  const [originPricePerGbUsd, setOriginPricePerGbUsd] = useNumberParamState("CdnCostPlanner.originPricePerGbUsd", 0.09);
  const [originOverheadPct, setOriginOverheadPct] = useNumberParamState("CdnCostPlanner.originOverheadPct", 5);
  const [showPeakScenario, setShowPeakScenario] = useBooleanParamState("CdnCostPlanner.showPeakScenario", true);
  const [peakTrafficMultiplierPct, setPeakTrafficMultiplierPct] = useNumberParamState("CdnCostPlanner.peakTrafficMultiplierPct", 160);
  const [peakHitRatePct, setPeakHitRatePct] = useNumberParamState("CdnCostPlanner.peakHitRatePct", 70);

  const baseline = useMemo(
    () =>
      estimatePlanner({
        edgeGbPerMonth,
        edgePricePerGbUsd,
        requestsPerMonth,
        requestPricePer10kUsd,
        cacheHitRatePct,
        originPricePerGbUsd,
        originOverheadPct,
      }),
    [
      cacheHitRatePct,
      edgeGbPerMonth,
      edgePricePerGbUsd,
      originOverheadPct,
      originPricePerGbUsd,
      requestPricePer10kUsd,
      requestsPerMonth,
    ],
  );

  const peak = useMemo(() => {
    if (!showPeakScenario) return null;
    const multiplier = clamp(peakTrafficMultiplierPct, 100, 1000) / 100;
    return estimatePlanner({
      edgeGbPerMonth: edgeGbPerMonth * multiplier,
      edgePricePerGbUsd,
      requestsPerMonth: requestsPerMonth * multiplier,
      requestPricePer10kUsd,
      cacheHitRatePct: peakHitRatePct,
      originPricePerGbUsd,
      originOverheadPct,
    });
  }, [
    edgeGbPerMonth,
    edgePricePerGbUsd,
    originOverheadPct,
    originPricePerGbUsd,
    peakHitRatePct,
    peakTrafficMultiplierPct,
    requestPricePer10kUsd,
    requestsPerMonth,
    showPeakScenario,
  ]);

  const activeScenario = findPreset(activeScenarioId);
  const nextActions = activeScenario?.optimizationLevers ?? [
    "Check which cost surface actually dominates before you optimize the wrong number.",
    "Validate edge, request, and origin inputs back to billing or analytics before procurement review.",
  ];

  const applyPreset = (preset: PlannerPreset) => {
    setActiveScenarioId(preset.id);
    setEdgeGbPerMonth(preset.edgeGbPerMonth);
    setEdgePricePerGbUsd(preset.edgePricePerGbUsd);
    setRequestsPerMonth(preset.requestsPerMonth);
    setRequestPricePer10kUsd(preset.requestPricePer10kUsd);
    setCacheHitRatePct(preset.cacheHitRatePct);
    setOriginPricePerGbUsd(preset.originPricePerGbUsd);
    setOriginOverheadPct(preset.originOverheadPct);
    setShowPeakScenario(preset.showPeakScenario);
    setPeakTrafficMultiplierPct(preset.peakTrafficMultiplierPct);
    setPeakHitRatePct(preset.peakHitRatePct);
  };

  const resetExample = () => {
    setActiveScenarioId("");
    setEdgeGbPerMonth(4_000);
    setEdgePricePerGbUsd(0.06);
    setRequestsPerMonth(300_000_000);
    setRequestPricePer10kUsd(0.0075);
    setCacheHitRatePct(85);
    setOriginPricePerGbUsd(0.09);
    setOriginOverheadPct(5);
    setShowPeakScenario(true);
    setPeakTrafficMultiplierPct(160);
    setPeakHitRatePct(70);
  };

  return (
    <div className="calc-grid">
      <div className="panel">
        <h3>Inputs</h3>
        <div className="form">
          <div className="field field-6">
            <div className="label">CDN planning scenarios</div>
            <div style={presetGrid}>
              {PRESETS.map((preset) => (
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
            <div className="label">Edge bandwidth (GB / month)</div>
            <input type="number" inputMode="decimal" value={edgeGbPerMonth} min={0} step={100} onChange={(e) => {
              setActiveScenarioId("");
              setEdgeGbPerMonth(+e.target.value);
            }} />
          </div>
          <div className="field field-3">
            <div className="label">Edge rate ($ / GB)</div>
            <input type="number" inputMode="decimal" value={edgePricePerGbUsd} min={0} step={0.0001} onChange={(e) => {
              setActiveScenarioId("");
              setEdgePricePerGbUsd(+e.target.value);
            }} />
          </div>
          <div className="field field-3">
            <div className="label">Requests (per month)</div>
            <input type="number" inputMode="numeric" value={requestsPerMonth} min={0} step={1000} onChange={(e) => {
              setActiveScenarioId("");
              setRequestsPerMonth(+e.target.value);
            }} />
          </div>
          <div className="field field-3">
            <div className="label">Request fee ($ / 10k)</div>
            <input type="number" inputMode="decimal" value={requestPricePer10kUsd} min={0} step={0.0001} onChange={(e) => {
              setActiveScenarioId("");
              setRequestPricePer10kUsd(+e.target.value);
            }} />
          </div>
          <div className="field field-3">
            <div className="label">Cache hit rate (%)</div>
            <input type="number" inputMode="decimal" value={cacheHitRatePct} min={0} max={100} step={1} onChange={(e) => {
              setActiveScenarioId("");
              setCacheHitRatePct(+e.target.value);
            }} />
            <div className="hint">Lower hit rate raises origin egress exposure.</div>
          </div>
          <div className="field field-3">
            <div className="label">Origin rate ($ / GB)</div>
            <input type="number" inputMode="decimal" value={originPricePerGbUsd} min={0} step={0.0001} onChange={(e) => {
              setActiveScenarioId("");
              setOriginPricePerGbUsd(+e.target.value);
            }} />
            <div className="hint">Use the billed origin egress rate, not the CDN edge rate.</div>
          </div>
          <div className="field field-3">
            <div className="label">Origin overhead (%)</div>
            <input type="number" inputMode="decimal" value={originOverheadPct} min={0} max={200} step={1} onChange={(e) => {
              setActiveScenarioId("");
              setOriginOverheadPct(+e.target.value);
            }} />
            <div className="hint">Captures revalidation or multi-POP refill overhead.</div>
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
            <div className="field field-6">
              <div className="label">Peak month assumptions</div>
              <div style={helperGrid}>
                <div>
                  <div className="label" style={{ fontSize: 13 }}>Traffic multiplier (%)</div>
                  <input type="number" inputMode="numeric" value={peakTrafficMultiplierPct} min={100} max={1000} step={5} onChange={(e) => {
                    setActiveScenarioId("");
                    setPeakTrafficMultiplierPct(+e.target.value);
                  }} />
                </div>
                <div>
                  <div className="label" style={{ fontSize: 13 }}>Peak hit rate (%)</div>
                  <input type="number" inputMode="decimal" value={peakHitRatePct} min={0} max={100} step={1} onChange={(e) => {
                    setActiveScenarioId("");
                    setPeakHitRatePct(+e.target.value);
                  }} />
                </div>
              </div>
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
            <div className="k">Modeled monthly total</div>
            <div className="v">{formatCurrency2(baseline.totalCostUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">Bandwidth share</div>
            <div className="v">{formatNumber(baseline.bandwidthSharePct, 1)}%</div>
          </div>
          <div className="kpi">
            <div className="k">Request share</div>
            <div className="v">{formatNumber(baseline.requestSharePct, 1)}%</div>
          </div>
          <div className="kpi">
            <div className="k">Origin egress share</div>
            <div className="v">{formatNumber(baseline.originSharePct, 1)}%</div>
          </div>
          <div className="kpi">
            <div className="k">Estimated origin egress</div>
            <div className="v">{formatNumber(baseline.originGbPerMonth, 0)} GB</div>
          </div>
          <div className="kpi">
            <div className="k">Dominant cost surface</div>
            <div className="v">{baseline.dominantSurface}</div>
          </div>
        </div>
        <div style={{ marginTop: 12 }}>
          <table className="table">
            <thead>
              <tr>
                <th>Surface</th>
                <th className="num">Baseline</th>
                <th className="num">Share</th>
                {peak ? <th className="num">Peak</th> : null}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Edge bandwidth</td>
                <td className="num">{formatCurrency2(baseline.edgeBandwidthCostUsd)}</td>
                <td className="num">{formatNumber(baseline.bandwidthSharePct, 1)}%</td>
                {peak ? <td className="num">{formatCurrency2(peak.edgeBandwidthCostUsd)}</td> : null}
              </tr>
              <tr>
                <td>Request fees</td>
                <td className="num">{formatCurrency2(baseline.requestCostUsd)}</td>
                <td className="num">{formatNumber(baseline.requestSharePct, 1)}%</td>
                {peak ? <td className="num">{formatCurrency2(peak.requestCostUsd)}</td> : null}
              </tr>
              <tr>
                <td>Origin egress</td>
                <td className="num">{formatCurrency2(baseline.originCostUsd)}</td>
                <td className="num">{formatNumber(baseline.originSharePct, 1)}%</td>
                {peak ? <td className="num">{formatCurrency2(peak.originCostUsd)}</td> : null}
              </tr>
              <tr>
                <td>Total</td>
                <td className="num">{formatCurrency2(baseline.totalCostUsd)}</td>
                <td className="num">100%</td>
                {peak ? <td className="num">{formatCurrency2(peak.totalCostUsd)}</td> : null}
              </tr>
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: 16, border: "1px solid var(--border)", borderRadius: 12, padding: 14 }}>
          <div className="muted" style={{ fontSize: 13, marginBottom: 6 }}>Planner interpretation</div>
          <div style={{ fontWeight: 700 }}>{activeScenario?.label ?? "Custom CDN delivery model"}</div>
          <p className="muted" style={{ marginTop: 8, marginBottom: 8 }}>
            {activeScenario?.summary ?? "Use this planner when bandwidth, request, and origin surfaces all need to stay visible in one model."}
          </p>
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            <li><strong>Dominant cost surface</strong>: {baseline.dominantSurface}</li>
            <li><strong>Bandwidth share vs request share</strong>: {formatNumber(baseline.bandwidthSharePct, 1)}% vs {formatNumber(baseline.requestSharePct, 1)}%</li>
            <li><strong>Origin egress exposure</strong>: {formatNumber(baseline.originGbPerMonth, 0)} GB/month, or {formatNumber(baseline.originSharePct, 1)}% of the modeled cost.</li>
            <li><strong>Peak month total</strong>: {peak ? formatCurrency2(peak.totalCostUsd) : "Peak month is disabled."}</li>
          </ul>
          <div className="muted" style={{ fontSize: 13, marginTop: 10 }}>Next action</div>
          <ul style={{ margin: "6px 0 0", paddingLeft: 18 }}>
            {nextActions.map((action) => (
              <li key={action}>{action}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
