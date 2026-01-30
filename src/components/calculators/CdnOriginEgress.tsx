import React, { useMemo } from "react";
import { useBooleanParamState, useNumberParamState } from "./useNumberParamState";
import { clamp } from "../../lib/math";
import { formatNumber } from "../../lib/format";

type OriginEstimate = {
  hitRatePct: number;
  missRate: number;
  effectiveMissRate: number;
  originGbPerMonth: number;
  originRequestsPerMonth: number;
  originSharePct: number;
};

function estimateOriginFromCdn({
  edgeGbPerMonth,
  edgeRequestsPerMonth,
  hitRatePct,
  revalidationOverheadPct,
}: {
  edgeGbPerMonth: number;
  edgeRequestsPerMonth: number;
  hitRatePct: number;
  revalidationOverheadPct: number;
}): OriginEstimate {
  const hitRate = clamp(hitRatePct, 0, 100) / 100;
  const missRate = 1 - hitRate;
  const overhead = 1 + clamp(revalidationOverheadPct, 0, 200) / 100;
  const effectiveMissRate = missRate * overhead;
  const originGbPerMonth = clamp(edgeGbPerMonth, 0, 1e12) * effectiveMissRate;
  const originRequestsPerMonth = clamp(edgeRequestsPerMonth, 0, 1e15) * effectiveMissRate;
  const originSharePct = edgeGbPerMonth > 0 ? (originGbPerMonth / edgeGbPerMonth) * 100 : 0;

  return {
    hitRatePct: hitRate * 100,
    missRate,
    effectiveMissRate,
    originGbPerMonth,
    originRequestsPerMonth,
    originSharePct,
  };
}

export function CdnOriginEgressCalculator() {
  const [edgeGbPerMonth, setEdgeGbPerMonth] = useNumberParamState("CdnOriginEgress.edgeGbPerMonth", 4000);
  const [edgeRequestsPerMonth, setEdgeRequestsPerMonth] = useNumberParamState(
    "CdnOriginEgress.edgeRequestsPerMonth",
    300_000_000
  );
  const [cacheHitRatePct, setCacheHitRatePct] = useNumberParamState("CdnOriginEgress.cacheHitRatePct", 85);
  const [revalidationOverheadPct, setRevalidationOverheadPct] = useNumberParamState(
    "CdnOriginEgress.revalidationOverheadPct",
    5
  );
  const [showPeakScenario, setShowPeakScenario] = useBooleanParamState("CdnOriginEgress.showPeakScenario", false);
  const [peakHitRatePct, setPeakHitRatePct] = useNumberParamState("CdnOriginEgress.peakHitRatePct", 70);

  const baseline = useMemo(
    () =>
      estimateOriginFromCdn({
        edgeGbPerMonth,
        edgeRequestsPerMonth,
        hitRatePct: cacheHitRatePct,
        revalidationOverheadPct,
      }),
    [cacheHitRatePct, edgeGbPerMonth, edgeRequestsPerMonth, revalidationOverheadPct]
  );

  const peak = useMemo(() => {
    if (!showPeakScenario) return null;
    return estimateOriginFromCdn({
      edgeGbPerMonth,
      edgeRequestsPerMonth,
      hitRatePct: peakHitRatePct,
      revalidationOverheadPct,
    });
  }, [edgeGbPerMonth, edgeRequestsPerMonth, peakHitRatePct, revalidationOverheadPct, showPeakScenario]);

  return (
    <div className="calc-grid">
      <div className="panel">
        <h3>Inputs</h3>
        <div className="form">
          <div className="field field-3">
            <div className="label">Edge bandwidth (GB / month)</div>
            <input
              type="number"
              inputMode="decimal"
              value={edgeGbPerMonth}
              min={0}
              step={100}
              onChange={(e) => setEdgeGbPerMonth(+e.target.value)}
            />
            <div className="hint">From CDN analytics or billing exports.</div>
          </div>
          <div className="field field-3">
            <div className="label">Edge requests (per month)</div>
            <input
              type="number"
              inputMode="numeric"
              value={edgeRequestsPerMonth}
              min={0}
              step={1000}
              onChange={(e) => setEdgeRequestsPerMonth(+e.target.value)}
            />
            <div className="hint">Include cache hits + misses.</div>
          </div>
          <div className="field field-3">
            <div className="label">Cache hit rate (%)</div>
            <input
              type="number"
              inputMode="decimal"
              value={cacheHitRatePct}
              min={0}
              max={100}
              step={1}
              onChange={(e) => setCacheHitRatePct(+e.target.value)}
            />
            <div className="hint">Miss rate = 100% - hit rate.</div>
          </div>
          <div className="field field-3">
            <div className="label">Revalidation overhead (%)</div>
            <input
              type="number"
              inputMode="decimal"
              value={revalidationOverheadPct}
              min={0}
              max={200}
              step={1}
              onChange={(e) => setRevalidationOverheadPct(+e.target.value)}
            />
            <div className="hint">Extra origin traffic from revalidations or multi-POP fills.</div>
          </div>

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
              <div className="label">Peak hit rate (%)</div>
              <input
                type="number"
                inputMode="decimal"
                value={peakHitRatePct}
                min={0}
                max={100}
                step={1}
                onChange={(e) => setPeakHitRatePct(+e.target.value)}
              />
              <div className="hint">Lower hit rate models cold cache or bot spikes.</div>
            </div>
          ) : null}

          <div className="field field-6">
            <div className="label">Scenario presets</div>
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setEdgeGbPerMonth(2500);
                  setEdgeRequestsPerMonth(120_000_000);
                  setCacheHitRatePct(92);
                  setRevalidationOverheadPct(3);
                  setShowPeakScenario(true);
                  setPeakHitRatePct(80);
                }}
              >
                Static assets
              </button>
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setEdgeGbPerMonth(6000);
                  setEdgeRequestsPerMonth(600_000_000);
                  setCacheHitRatePct(70);
                  setRevalidationOverheadPct(6);
                  setShowPeakScenario(true);
                  setPeakHitRatePct(55);
                }}
              >
                API-heavy
              </button>
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setEdgeGbPerMonth(12000);
                  setEdgeRequestsPerMonth(2_000_000_000);
                  setCacheHitRatePct(85);
                  setRevalidationOverheadPct(8);
                  setShowPeakScenario(true);
                  setPeakHitRatePct(60);
                }}
              >
                Global media
              </button>
            </div>
          </div>

          <div className="field field-6">
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setEdgeGbPerMonth(4000);
                  setEdgeRequestsPerMonth(300_000_000);
                  setCacheHitRatePct(85);
                  setRevalidationOverheadPct(5);
                  setShowPeakScenario(false);
                  setPeakHitRatePct(70);
                }}
              >
                Reset example
              </button>
            </div>
            <div className="muted" style={{ marginTop: 8, fontSize: 12 }}>
              This estimate is a planning model. Validate with CDN cache metrics and origin logs once live.
            </div>
          </div>
        </div>
      </div>

      <div className="panel">
        <h3>Results</h3>
        <div className="kpis">
          <div className="kpi">
            <div className="k">Origin egress (GB / month)</div>
            <div className="v">{formatNumber(baseline.originGbPerMonth, 0)}</div>
          </div>
          <div className="kpi">
            <div className="k">Origin requests (per month)</div>
            <div className="v">{formatNumber(baseline.originRequestsPerMonth, 0)}</div>
          </div>
          <div className="kpi">
            <div className="k">Effective miss rate</div>
            <div className="v">{formatNumber(baseline.effectiveMissRate * 100, 2)}%</div>
          </div>
          <div className="kpi">
            <div className="k">Origin share of edge GB</div>
            <div className="v">{formatNumber(baseline.originSharePct, 2)}%</div>
          </div>
        </div>

        {peak ? (
          <div style={{ marginTop: 12 }}>
            <div className="muted" style={{ fontSize: 13, marginBottom: 6 }}>Baseline vs peak</div>
            <table className="table">
              <thead>
                <tr>
                  <th>Scenario</th>
                  <th className="num">Hit rate</th>
                  <th className="num">Origin GB</th>
                  <th className="num">Origin requests</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Baseline</td>
                  <td className="num">{formatNumber(baseline.hitRatePct, 1)}%</td>
                  <td className="num">{formatNumber(baseline.originGbPerMonth, 0)}</td>
                  <td className="num">{formatNumber(baseline.originRequestsPerMonth, 0)}</td>
                </tr>
                <tr>
                  <td>Peak</td>
                  <td className="num">{formatNumber(peak.hitRatePct, 1)}%</td>
                  <td className="num">{formatNumber(peak.originGbPerMonth, 0)}</td>
                  <td className="num">{formatNumber(peak.originRequestsPerMonth, 0)}</td>
                </tr>
                <tr>
                  <td>Delta</td>
                  <td className="num">-</td>
                  <td className="num">{formatNumber(peak.originGbPerMonth - baseline.originGbPerMonth, 0)}</td>
                  <td className="num">{formatNumber(peak.originRequestsPerMonth - baseline.originRequestsPerMonth, 0)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </div>
  );
}
