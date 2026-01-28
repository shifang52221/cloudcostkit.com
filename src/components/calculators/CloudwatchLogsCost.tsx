import React, { useMemo } from "react";
import { useBooleanParamState, useNumberParamState } from "./useNumberParamState";
import { estimateLogCost } from "../../lib/calc/logs";
import { estimateLogScanCost } from "../../lib/calc/logScan";
import { formatCurrency2, formatNumber } from "../../lib/format";
import { clamp } from "../../lib/math";

export function CloudwatchLogsCostCalculator() {
  const [gbPerDayIngest, setGbPerDayIngest] = useNumberParamState("CloudwatchLogsCost.gbPerDayIngest", 50);
  const [retentionDays, setRetentionDays] = useNumberParamState("CloudwatchLogsCost.retentionDays", 30);
  const [daysPerMonth, setDaysPerMonth] = useNumberParamState("CloudwatchLogsCost.daysPerMonth", 30.4);
  const [ingestPricePerGbUsd, setIngestPricePerGbUsd] = useNumberParamState("CloudwatchLogsCost.ingestPricePerGbUsd", 0.5);
  const [storagePricePerGbMonthUsd, setStoragePricePerGbMonthUsd] = useNumberParamState(
    "CloudwatchLogsCost.storagePricePerGbMonthUsd",
    0.03,
  );

  const [includeInsights, setIncludeInsights] = useBooleanParamState("CloudwatchLogsCost.includeInsights", false);
  const [gbScannedPerDay, setGbScannedPerDay] = useNumberParamState("CloudwatchLogsCost.gbScannedPerDay", 800);
  const [insightsPricePerGbUsd, setInsightsPricePerGbUsd] = useNumberParamState("CloudwatchLogsCost.insightsPricePerGbUsd", 0.005);
  const [showPeakScenario, setShowPeakScenario] = useBooleanParamState("CloudwatchLogsCost.showPeakScenario", false);
  const [peakMultiplierPct, setPeakMultiplierPct] = useNumberParamState("CloudwatchLogsCost.peakMultiplierPct", 160);

  const result = useMemo(() => {
    const ingest = estimateLogCost({
      gbPerDayIngest: clamp(gbPerDayIngest, 0, 1e12),
      retentionDays: clamp(retentionDays, 0, 3650),
      ingestPricePerGbUsd: clamp(ingestPricePerGbUsd, 0, 1e6),
      storagePricePerGbMonthUsd: clamp(storagePricePerGbMonthUsd, 0, 1e6),
      daysPerMonth: clamp(daysPerMonth, 1, 31),
    });

    const scan = estimateLogScanCost({
      gbScannedPerDay: clamp(gbScannedPerDay, 0, 1e12),
      pricePerGbUsd: clamp(insightsPricePerGbUsd, 0, 1e6),
      daysPerMonth: ingest.daysPerMonth,
    });

    const insightsCostUsd = includeInsights ? scan.monthlyCostUsd : 0;
    const totalMonthlyUsd = ingest.ingestCostUsd + ingest.storageCostUsd + insightsCostUsd;

    return { ingest, scan, includeInsights, insightsCostUsd, totalMonthlyUsd };
  }, [
    daysPerMonth,
    gbPerDayIngest,
    gbScannedPerDay,
    includeInsights,
    ingestPricePerGbUsd,
    insightsPricePerGbUsd,
    retentionDays,
    storagePricePerGbMonthUsd,
  ]);

  const peakResult = useMemo(() => {
    if (!showPeakScenario) return null;
    const safeMultiplier = clamp(peakMultiplierPct, 100, 1000) / 100;
    const ingest = estimateLogCost({
      gbPerDayIngest: clamp(gbPerDayIngest, 0, 1e12) * safeMultiplier,
      retentionDays: clamp(retentionDays, 0, 3650),
      ingestPricePerGbUsd: clamp(ingestPricePerGbUsd, 0, 1e6),
      storagePricePerGbMonthUsd: clamp(storagePricePerGbMonthUsd, 0, 1e6),
      daysPerMonth: clamp(daysPerMonth, 1, 31),
    });

    const scan = estimateLogScanCost({
      gbScannedPerDay: clamp(gbScannedPerDay, 0, 1e12) * safeMultiplier,
      pricePerGbUsd: clamp(insightsPricePerGbUsd, 0, 1e6),
      daysPerMonth: ingest.daysPerMonth,
    });

    const insightsCostUsd = includeInsights ? scan.monthlyCostUsd : 0;
    const totalMonthlyUsd = ingest.ingestCostUsd + ingest.storageCostUsd + insightsCostUsd;

    return { ingest, scan, includeInsights, insightsCostUsd, totalMonthlyUsd };
  }, [
    daysPerMonth,
    gbPerDayIngest,
    gbScannedPerDay,
    includeInsights,
    ingestPricePerGbUsd,
    insightsPricePerGbUsd,
    peakMultiplierPct,
    retentionDays,
    showPeakScenario,
    storagePricePerGbMonthUsd,
  ]);

  return (
    <div className="calc-grid">
      <div className="panel">
        <h3>Inputs</h3>
        <div className="form">
          <div className="field field-3">
            <div className="label">Ingest volume (GB / day)</div>
            <input
              type="number"
              inputMode="decimal"
              value={gbPerDayIngest}
              min={0}
              onChange={(e) => setGbPerDayIngest(+e.target.value)}
            />
          </div>

          <div className="field field-3">
            <div className="label">Retention (days)</div>
            <input
              type="number"
              inputMode="numeric"
              value={retentionDays}
              min={0}
              step={1}
              onChange={(e) => setRetentionDays(+e.target.value)}
            />
          </div>

          <div className="field field-3">
            <div className="label">Billing days (per month)</div>
            <input
              type="number"
              inputMode="decimal"
              value={daysPerMonth}
              min={1}
              max={31}
              step={0.1}
              onChange={(e) => setDaysPerMonth(+e.target.value)}
            />
          </div>

          <div className="field field-3">
            <div className="label">Ingest price ($ / GB)</div>
            <input
              type="number"
              inputMode="decimal"
              value={ingestPricePerGbUsd}
              min={0}
              step={0.01}
              onChange={(e) => setIngestPricePerGbUsd(+e.target.value)}
            />
          </div>

          <div className="field field-3">
            <div className="label">Storage price ($ / GB-month)</div>
            <input
              type="number"
              inputMode="decimal"
              value={storagePricePerGbMonthUsd}
              min={0}
              step={0.01}
              onChange={(e) => setStoragePricePerGbMonthUsd(+e.target.value)}
            />
          </div>

          <div className="field field-3" style={{ alignSelf: "end" }}>
            <label className="muted" style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <input
                type="checkbox"
                checked={includeInsights}
                onChange={(e) => setIncludeInsights(e.target.checked)}
              />
              Include Logs Insights scans
            </label>
          </div>

          <div className="field field-3">
            <div className="label">Insights scanned (GB / day)</div>
            <input
              type="number"
              inputMode="decimal"
              value={gbScannedPerDay}
              min={0}
              onChange={(e) => setGbScannedPerDay(+e.target.value)}
              disabled={!includeInsights}
            />
          </div>

          <div className="field field-3">
            <div className="label">Insights price ($ / GB scanned)</div>
            <input
              type="number"
              inputMode="decimal"
              value={insightsPricePerGbUsd}
              min={0}
              step={0.0001}
              onChange={(e) => setInsightsPricePerGbUsd(+e.target.value)}
              disabled={!includeInsights}
            />
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
              <div className="hint">Use a peak month or incident logging spike.</div>
            </div>
          ) : null}

          <div className="field field-6">
            <div className="label">Scenario presets</div>
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setGbPerDayIngest(20);
                  setRetentionDays(14);
                  setDaysPerMonth(30.4);
                  setIngestPricePerGbUsd(0.5);
                  setStoragePricePerGbMonthUsd(0.03);
                  setIncludeInsights(false);
                  setGbScannedPerDay(200);
                  setInsightsPricePerGbUsd(0.005);
                  setShowPeakScenario(true);
                  setPeakMultiplierPct(140);
                }}
              >
                Small team
              </button>
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setGbPerDayIngest(80);
                  setRetentionDays(30);
                  setDaysPerMonth(30.4);
                  setIngestPricePerGbUsd(0.5);
                  setStoragePricePerGbMonthUsd(0.03);
                  setIncludeInsights(true);
                  setGbScannedPerDay(1200);
                  setInsightsPricePerGbUsd(0.005);
                  setShowPeakScenario(true);
                  setPeakMultiplierPct(180);
                }}
              >
                Prod baseline
              </button>
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setGbPerDayIngest(200);
                  setRetentionDays(90);
                  setDaysPerMonth(30.4);
                  setIngestPricePerGbUsd(0.5);
                  setStoragePricePerGbMonthUsd(0.03);
                  setIncludeInsights(true);
                  setGbScannedPerDay(3000);
                  setInsightsPricePerGbUsd(0.005);
                  setShowPeakScenario(true);
                  setPeakMultiplierPct(220);
                }}
              >
                High usage
              </button>
            </div>
          </div>

          <div className="field field-6">
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setGbPerDayIngest(50);
                  setRetentionDays(30);
                  setDaysPerMonth(30.4);
                  setIngestPricePerGbUsd(0.5);
                  setStoragePricePerGbMonthUsd(0.03);
                  setIncludeInsights(false);
                  setGbScannedPerDay(800);
                  setInsightsPricePerGbUsd(0.005);
                  setShowPeakScenario(false);
                  setPeakMultiplierPct(160);
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
            <div className="k">Estimated monthly total</div>
            <div className="v">{formatCurrency2(result.totalMonthlyUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">Ingestion cost</div>
            <div className="v">{formatCurrency2(result.ingest.ingestCostUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">Retention storage cost</div>
            <div className="v">{formatCurrency2(result.ingest.storageCostUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">Logs Insights scan cost</div>
            <div className="v">{formatCurrency2(result.insightsCostUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">Monthly ingestion</div>
            <div className="v">{formatNumber(result.ingest.monthlyIngestGb, 0)} GB</div>
          </div>
          <div className="kpi">
            <div className="k">Stored volume (steady state)</div>
            <div className="v">{formatNumber(result.ingest.storedGbSteadyState, 0)} GB</div>
          </div>
          {result.includeInsights ? (
            <div className="kpi">
              <div className="k">Monthly scanned (est.)</div>
              <div className="v">{formatNumber(result.scan.monthlyGbScanned, 0)} GB</div>
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
                  <th className="num">Ingest (GB/day)</th>
                  <th className="num">Stored GB</th>
                  <th className="num">Insights GB/day</th>
                  <th className="num">Monthly total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Baseline</td>
                  <td className="num">{formatNumber(result.ingest.gbPerDayIngest, 2)}</td>
                  <td className="num">{formatNumber(result.ingest.storedGbSteadyState, 0)}</td>
                  <td className="num">{formatNumber(result.scan.gbScannedPerDay, 2)}</td>
                  <td className="num">{formatCurrency2(result.totalMonthlyUsd)}</td>
                </tr>
                <tr>
                  <td>Peak</td>
                  <td className="num">{formatNumber(peakResult.ingest.gbPerDayIngest, 2)}</td>
                  <td className="num">{formatNumber(peakResult.ingest.storedGbSteadyState, 0)}</td>
                  <td className="num">{formatNumber(peakResult.scan.gbScannedPerDay, 2)}</td>
                  <td className="num">{formatCurrency2(peakResult.totalMonthlyUsd)}</td>
                </tr>
                <tr>
                  <td>Delta</td>
                  <td className="num">{formatNumber(peakResult.ingest.gbPerDayIngest - result.ingest.gbPerDayIngest, 2)}</td>
                  <td className="num">{formatNumber(peakResult.ingest.storedGbSteadyState - result.ingest.storedGbSteadyState, 0)}</td>
                  <td className="num">{formatNumber(peakResult.scan.gbScannedPerDay - result.scan.gbScannedPerDay, 2)}</td>
                  <td className="num">{formatCurrency2(peakResult.totalMonthlyUsd - result.totalMonthlyUsd)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </div>
  );
}
