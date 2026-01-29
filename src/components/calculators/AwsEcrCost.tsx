import React, { useMemo } from "react";
import { useBooleanParamState, useNumberParamState } from "./useNumberParamState";
import { estimateEcrCost } from "../../lib/calc/ecr";
import { formatCurrency2, formatNumber } from "../../lib/format";
import { clamp } from "../../lib/math";

export function AwsEcrCostCalculator() {
  const [storedGbMonth, setStoredGbMonth] = useNumberParamState("AwsEcrCost.storedGbMonth", 2000);
  const [pricePerGbMonthUsd, setPricePerGbMonthUsd] = useNumberParamState("AwsEcrCost.pricePerGbMonthUsd", 0.1);
  const [egressGbPerMonth, setEgressGbPerMonth] = useNumberParamState("AwsEcrCost.egressGbPerMonth", 500);
  const [egressPricePerGbUsd, setEgressPricePerGbUsd] = useNumberParamState("AwsEcrCost.egressPricePerGbUsd", 0.09);
  const [showPeakScenario, setShowPeakScenario] = useBooleanParamState("AwsEcrCost.showPeakScenario", false);
  const [peakMultiplierPct, setPeakMultiplierPct] = useNumberParamState("AwsEcrCost.peakMultiplierPct", 180);
  const storedTbMonth = storedGbMonth / 1024;
  const avgEgressMbps = (egressGbPerMonth * 8000) / (30.4 * 24 * 3600);

  const result = useMemo(() => {
    return estimateEcrCost({
      storedGbMonth: clamp(storedGbMonth, 0, 1e18),
      pricePerGbMonthUsd: clamp(pricePerGbMonthUsd, 0, 1e9),
      egressGbPerMonth: clamp(egressGbPerMonth, 0, 1e18),
      egressPricePerGbUsd: clamp(egressPricePerGbUsd, 0, 1e9),
    });
  }, [storedGbMonth, pricePerGbMonthUsd, egressGbPerMonth, egressPricePerGbUsd]);

  const peakResult = useMemo(() => {
    if (!showPeakScenario) return null;
    const multiplier = clamp(peakMultiplierPct, 100, 1000) / 100;
    return estimateEcrCost({
      storedGbMonth: clamp(storedGbMonth, 0, 1e18) * multiplier,
      pricePerGbMonthUsd: clamp(pricePerGbMonthUsd, 0, 1e9),
      egressGbPerMonth: clamp(egressGbPerMonth, 0, 1e18) * multiplier,
      egressPricePerGbUsd: clamp(egressPricePerGbUsd, 0, 1e9),
    });
  }, [
    egressGbPerMonth,
    egressPricePerGbUsd,
    peakMultiplierPct,
    pricePerGbMonthUsd,
    showPeakScenario,
    storedGbMonth,
  ]);

  return (
    <div className="calc-grid">
      <div className="panel">
        <h3>Inputs</h3>
        <div className="form">
          <div className="field field-3">
            <div className="label">Stored data (GB-month)</div>
            <input
              type="number"
              inputMode="decimal"
              value={storedGbMonth}
              min={0}
              step={1}
              onChange={(e) => setStoredGbMonth(+e.target.value)}
            />
            <div className="hint">Average stored GB over the month (~{formatNumber(storedTbMonth, 2)} TB-month).</div>
          </div>
          <div className="field field-3">
            <div className="label">Storage price ($ / GB-month)</div>
            <input
              type="number"
              inputMode="decimal"
              value={pricePerGbMonthUsd}
              min={0}
              step={0.001}
              onChange={(e) => setPricePerGbMonthUsd(+e.target.value)}
            />
          </div>
          <div className="field field-3">
            <div className="label">Data transfer out (GB/month)</div>
            <input
              type="number"
              inputMode="decimal"
              value={egressGbPerMonth}
              min={0}
              step={1}
              onChange={(e) => setEgressGbPerMonth(+e.target.value)}
            />
            <div className="hint">Avg {formatNumber(avgEgressMbps, 2)} Mbps. If pulls are inside AWS/VPC, egress may be lower.</div>
          </div>
          <div className="field field-3">
            <div className="label">Egress price ($ / GB)</div>
            <input
              type="number"
              inputMode="decimal"
              value={egressPricePerGbUsd}
              min={0}
              step={0.001}
              onChange={(e) => setEgressPricePerGbUsd(+e.target.value)}
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
              <div className="hint">Applies to storage and egress.</div>
            </div>
          ) : null}

          <div className="field field-6">
            <div className="label">Scenario presets</div>
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setStoredGbMonth(400);
                  setPricePerGbMonthUsd(0.1);
                  setEgressGbPerMonth(120);
                  setEgressPricePerGbUsd(0.09);
                  setShowPeakScenario(true);
                  setPeakMultiplierPct(150);
                }}
              >
                Startup
              </button>
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setStoredGbMonth(3000);
                  setPricePerGbMonthUsd(0.1);
                  setEgressGbPerMonth(1200);
                  setEgressPricePerGbUsd(0.09);
                  setShowPeakScenario(true);
                  setPeakMultiplierPct(200);
                }}
              >
                CI heavy
              </button>
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setStoredGbMonth(9000);
                  setPricePerGbMonthUsd(0.1);
                  setEgressGbPerMonth(4500);
                  setEgressPricePerGbUsd(0.09);
                  setShowPeakScenario(true);
                  setPeakMultiplierPct(170);
                }}
              >
                Multi-region
              </button>
            </div>
          </div>

          <div className="field field-6">
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setStoredGbMonth(2000);
                  setPricePerGbMonthUsd(0.1);
                  setEgressGbPerMonth(500);
                  setEgressPricePerGbUsd(0.09);
                  setShowPeakScenario(false);
                  setPeakMultiplierPct(180);
                }}
              >
                Reset example
              </button>
            </div>
            <div className="muted" style={{ marginTop: 8, fontSize: 12 }}>
              This is a simplified storage + transfer model. Scanning, replication, and downstream network paths can add
              cost.
            </div>
          </div>
        </div>
      </div>

      <div className="panel">
        <h3>Results</h3>
        <div className="kpis">
          <div className="kpi">
            <div className="k">Estimated monthly total</div>
            <div className="v">{formatCurrency2(result.totalCostUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">Storage</div>
            <div className="v">{formatCurrency2(result.storageCostUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">Transfer</div>
            <div className="v">{formatCurrency2(result.transferCostUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">Stored (GB-month)</div>
            <div className="v">{formatNumber(result.storedGbMonth, 0)}</div>
          </div>
          <div className="kpi">
            <div className="k">Egress (GB/month)</div>
            <div className="v">{formatNumber(result.egressGbPerMonth, 0)}</div>
          </div>
        </div>

        {peakResult ? (
          <div style={{ marginTop: 12 }}>
            <div className="muted" style={{ fontSize: 13, marginBottom: 6 }}>Baseline vs peak</div>
            <table className="table">
              <thead>
                <tr>
                  <th>Scenario</th>
                  <th className="num">Stored GB-month</th>
                  <th className="num">Egress GB</th>
                  <th className="num">Total cost</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Baseline</td>
                  <td className="num">{formatNumber(result.storedGbMonth, 0)}</td>
                  <td className="num">{formatNumber(result.egressGbPerMonth, 0)}</td>
                  <td className="num">{formatCurrency2(result.totalCostUsd)}</td>
                </tr>
                <tr>
                  <td>Peak</td>
                  <td className="num">{formatNumber(peakResult.storedGbMonth, 0)}</td>
                  <td className="num">{formatNumber(peakResult.egressGbPerMonth, 0)}</td>
                  <td className="num">{formatCurrency2(peakResult.totalCostUsd)}</td>
                </tr>
                <tr>
                  <td>Delta</td>
                  <td className="num">{formatNumber(peakResult.storedGbMonth - result.storedGbMonth, 0)}</td>
                  <td className="num">{formatNumber(peakResult.egressGbPerMonth - result.egressGbPerMonth, 0)}</td>
                  <td className="num">{formatCurrency2(peakResult.totalCostUsd - result.totalCostUsd)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </div>
  );
}
