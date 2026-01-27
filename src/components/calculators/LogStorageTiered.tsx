import React, { useMemo } from "react";
import { useBooleanParamState, useNumberParamState } from "./useNumberParamState";
import { formatCurrency2, formatNumber } from "../../lib/format";
import { clamp } from "../../lib/math";

export function LogStorageTieredCostCalculator() {
  const [gbPerDay, setGbPerDay] = useNumberParamState("LogStorageTiered.gbPerDay", 50);

  const [hotRetentionDays, setHotRetentionDays] = useNumberParamState("LogStorageTiered.hotRetentionDays", 14);
  const [hotPricePerGbMonthUsd, setHotPricePerGbMonthUsd] = useNumberParamState("LogStorageTiered.hotPricePerGbMonthUsd", 0.03);

  const [enableColdTier, setEnableColdTier] = useBooleanParamState("LogStorageTiered.enableColdTier", true);
  const [coldAdditionalDays, setColdAdditionalDays] = useNumberParamState("LogStorageTiered.coldAdditionalDays", 90);
  const [coldPricePerGbMonthUsd, setColdPricePerGbMonthUsd] = useNumberParamState("LogStorageTiered.coldPricePerGbMonthUsd", 0.01);
  const [archiveFraction, setArchiveFraction] = useNumberParamState("LogStorageTiered.archiveFraction", 1);
  const [coldCompressionRatio, setColdCompressionRatio] = useNumberParamState("LogStorageTiered.coldCompressionRatio", 1);
  const [showPeakScenario, setShowPeakScenario] = useBooleanParamState("LogStorageTiered.showPeakScenario", false);
  const [peakMultiplierPct, setPeakMultiplierPct] = useNumberParamState("LogStorageTiered.peakMultiplierPct", 150);

  const result = useMemo(() => {
    const safeGbPerDay = clamp(gbPerDay, 0, 1e12);
    const safeHotDays = clamp(hotRetentionDays, 0, 3650);
    const safeHotPrice = clamp(hotPricePerGbMonthUsd, 0, 1e6);

    const safeColdEnabled = Boolean(enableColdTier);
    const safeColdDays = safeColdEnabled ? clamp(coldAdditionalDays, 0, 3650) : 0;
    const safeColdPrice = safeColdEnabled ? clamp(coldPricePerGbMonthUsd, 0, 1e6) : 0;
    const safeArchiveFraction = safeColdEnabled ? clamp(archiveFraction, 0, 1) : 0;
    const safeCompressionRatio = safeColdEnabled ? clamp(coldCompressionRatio, 0, 1) : 0;

    const hotStoredGb = safeGbPerDay * safeHotDays;
    const hotCostUsd = hotStoredGb * safeHotPrice;

    const coldStoredGb = safeGbPerDay * safeArchiveFraction * safeCompressionRatio * safeColdDays;
    const coldCostUsd = coldStoredGb * safeColdPrice;

    const totalStoredGb = hotStoredGb + coldStoredGb;
    const totalMonthlyStorageCostUsd = hotCostUsd + coldCostUsd;
    const totalRetentionDays = safeHotDays + safeColdDays;

    return {
      gbPerDay: safeGbPerDay,
      hotRetentionDays: safeHotDays,
      hotPricePerGbMonthUsd: safeHotPrice,
      enableColdTier: safeColdEnabled,
      coldAdditionalDays: safeColdDays,
      coldPricePerGbMonthUsd: safeColdPrice,
      archiveFraction: safeArchiveFraction,
      coldCompressionRatio: safeCompressionRatio,
      hotStoredGb,
      hotCostUsd,
      coldStoredGb,
      coldCostUsd,
      totalStoredGb,
      totalMonthlyStorageCostUsd,
      totalRetentionDays,
    };
  }, [
    archiveFraction,
    coldAdditionalDays,
    coldCompressionRatio,
    coldPricePerGbMonthUsd,
    enableColdTier,
    gbPerDay,
    hotPricePerGbMonthUsd,
    hotRetentionDays,
  ]);

  const peakResult = useMemo(() => {
    if (!showPeakScenario) return null;
    const safeMultiplier = clamp(peakMultiplierPct, 100, 1000) / 100;
    const safeGbPerDay = clamp(gbPerDay, 0, 1e12) * safeMultiplier;
    const safeHotDays = clamp(hotRetentionDays, 0, 3650);
    const safeHotPrice = clamp(hotPricePerGbMonthUsd, 0, 1e6);

    const safeColdEnabled = Boolean(enableColdTier);
    const safeColdDays = safeColdEnabled ? clamp(coldAdditionalDays, 0, 3650) : 0;
    const safeColdPrice = safeColdEnabled ? clamp(coldPricePerGbMonthUsd, 0, 1e6) : 0;
    const safeArchiveFraction = safeColdEnabled ? clamp(archiveFraction, 0, 1) : 0;
    const safeCompressionRatio = safeColdEnabled ? clamp(coldCompressionRatio, 0, 1) : 0;

    const hotStoredGb = safeGbPerDay * safeHotDays;
    const hotCostUsd = hotStoredGb * safeHotPrice;

    const coldStoredGb = safeGbPerDay * safeArchiveFraction * safeCompressionRatio * safeColdDays;
    const coldCostUsd = coldStoredGb * safeColdPrice;

    const totalStoredGb = hotStoredGb + coldStoredGb;
    const totalMonthlyStorageCostUsd = hotCostUsd + coldCostUsd;
    const totalRetentionDays = safeHotDays + safeColdDays;

    return {
      gbPerDay: safeGbPerDay,
      hotRetentionDays: safeHotDays,
      hotPricePerGbMonthUsd: safeHotPrice,
      enableColdTier: safeColdEnabled,
      coldAdditionalDays: safeColdDays,
      coldPricePerGbMonthUsd: safeColdPrice,
      archiveFraction: safeArchiveFraction,
      coldCompressionRatio: safeCompressionRatio,
      hotStoredGb,
      hotCostUsd,
      coldStoredGb,
      coldCostUsd,
      totalStoredGb,
      totalMonthlyStorageCostUsd,
      totalRetentionDays,
    };
  }, [
    archiveFraction,
    coldAdditionalDays,
    coldCompressionRatio,
    coldPricePerGbMonthUsd,
    enableColdTier,
    gbPerDay,
    hotPricePerGbMonthUsd,
    hotRetentionDays,
    peakMultiplierPct,
    showPeakScenario,
  ]);

  return (
    <div className="calc-grid">
      <div className="panel">
        <h3>Inputs</h3>
        <div className="form">
          <div className="field field-3">
            <div className="label">Logs produced (GB / day)</div>
            <input
              type="number"
              inputMode="decimal"
              value={gbPerDay}
              min={0}
              onChange={(e) => setGbPerDay(+e.target.value)}
            />
          </div>

          <div className="field field-3">
            <div className="label">Hot retention (days)</div>
            <input
              type="number"
              inputMode="numeric"
              value={hotRetentionDays}
              min={0}
              step={1}
              onChange={(e) => setHotRetentionDays(+e.target.value)}
            />
          </div>

          <div className="field field-3">
            <div className="label">Hot price ($ / GB-month)</div>
            <input
              type="number"
              inputMode="decimal"
              value={hotPricePerGbMonthUsd}
              min={0}
              step={0.001}
              onChange={(e) => setHotPricePerGbMonthUsd(+e.target.value)}
            />
          </div>

          <div className="field field-3" style={{ alignSelf: "end" }}>
            <label className="muted" style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <input
                type="checkbox"
                checked={enableColdTier}
                onChange={(e) => setEnableColdTier(e.target.checked)}
              />
              Add cold/archive tier
            </label>
          </div>

          <div className="field field-3">
            <div className="label">Cold retention (additional days)</div>
            <input
              type="number"
              inputMode="numeric"
              value={coldAdditionalDays}
              min={0}
              step={1}
              onChange={(e) => setColdAdditionalDays(+e.target.value)}
              disabled={!enableColdTier}
            />
            <div className="hint">Cold retention is in addition to hot retention.</div>
          </div>

          <div className="field field-3">
            <div className="label">Cold price ($ / GB-month)</div>
            <input
              type="number"
              inputMode="decimal"
              value={coldPricePerGbMonthUsd}
              min={0}
              step={0.001}
              onChange={(e) => setColdPricePerGbMonthUsd(+e.target.value)}
              disabled={!enableColdTier}
            />
          </div>

          <div className="field field-3">
            <div className="label">Archive fraction (0-1)</div>
            <input
              type="number"
              inputMode="decimal"
              value={archiveFraction}
              min={0}
              max={1}
              step={0.05}
              onChange={(e) => setArchiveFraction(+e.target.value)}
              disabled={!enableColdTier}
            />
            <div className="hint">If you only archive a subset (e.g., audit logs), set a fraction.</div>
          </div>

          <div className="field field-3">
            <div className="label">Cold compression ratio (0-1)</div>
            <input
              type="number"
              inputMode="decimal"
              value={coldCompressionRatio}
              min={0}
              max={1}
              step={0.05}
              onChange={(e) => setColdCompressionRatio(+e.target.value)}
              disabled={!enableColdTier}
            />
            <div className="hint">Use 1 if the vendor bills on the same GB for cold storage.</div>
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
              <div className="hint">Use a peak month or incident spike.</div>
            </div>
          ) : null}

          <div className="field field-6">
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setGbPerDay(50);
                  setHotRetentionDays(14);
                  setHotPricePerGbMonthUsd(0.03);
                  setEnableColdTier(true);
                  setColdAdditionalDays(90);
                  setColdPricePerGbMonthUsd(0.01);
                  setArchiveFraction(1);
                  setColdCompressionRatio(1);
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
            <div className="k">Estimated monthly storage cost</div>
            <div className="v">{formatCurrency2(result.totalMonthlyStorageCostUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">Total retained days (hot + cold)</div>
            <div className="v">{formatNumber(result.totalRetentionDays, 0)} days</div>
          </div>
          <div className="kpi">
            <div className="k">Hot stored volume (steady state)</div>
            <div className="v">{formatNumber(result.hotStoredGb, 0)} GB</div>
          </div>
          <div className="kpi">
            <div className="k">Hot storage cost</div>
            <div className="v">{formatCurrency2(result.hotCostUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">Cold stored volume (steady state)</div>
            <div className="v">{formatNumber(result.coldStoredGb, 0)} GB</div>
          </div>
          <div className="kpi">
            <div className="k">Cold storage cost</div>
            <div className="v">{formatCurrency2(result.coldCostUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">Total stored volume (steady state)</div>
            <div className="v">{formatNumber(result.totalStoredGb, 0)} GB</div>
          </div>
        </div>

        {peakResult ? (
          <div style={{ marginTop: 12 }}>
            <div className="muted" style={{ fontSize: 13, marginBottom: 6 }}>Baseline vs peak</div>
            <table className="table">
              <thead>
                <tr>
                  <th>Scenario</th>
                  <th className="num">GB/day</th>
                  <th className="num">Stored GB</th>
                  <th className="num">Monthly cost</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Baseline</td>
                  <td className="num">{formatNumber(result.gbPerDay, 2)}</td>
                  <td className="num">{formatNumber(result.totalStoredGb, 0)}</td>
                  <td className="num">{formatCurrency2(result.totalMonthlyStorageCostUsd)}</td>
                </tr>
                <tr>
                  <td>Peak</td>
                  <td className="num">{formatNumber(peakResult.gbPerDay, 2)}</td>
                  <td className="num">{formatNumber(peakResult.totalStoredGb, 0)}</td>
                  <td className="num">{formatCurrency2(peakResult.totalMonthlyStorageCostUsd)}</td>
                </tr>
                <tr>
                  <td>Delta</td>
                  <td className="num">{formatNumber(peakResult.gbPerDay - result.gbPerDay, 2)}</td>
                  <td className="num">{formatNumber(peakResult.totalStoredGb - result.totalStoredGb, 0)}</td>
                  <td className="num">{formatCurrency2(peakResult.totalMonthlyStorageCostUsd - result.totalMonthlyStorageCostUsd)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </div>
  );
}
