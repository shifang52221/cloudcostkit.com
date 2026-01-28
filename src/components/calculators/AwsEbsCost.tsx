import React, { useMemo } from "react";
import { useBooleanParamState, useNumberParamState } from "./useNumberParamState";
import { estimateEbsCost } from "../../lib/calc/ebs";
import { formatCurrency2, formatNumber } from "../../lib/format";
import { clamp } from "../../lib/math";

export function AwsEbsCostCalculator() {
  const [storageGb, setStorageGb] = useNumberParamState("AwsEbsCost.storageGb", 500);
  const [pricePerGbMonthUsd, setPricePerGbMonthUsd] = useNumberParamState("AwsEbsCost.pricePerGbMonthUsd", 0.08);

  const [provisionedIops, setProvisionedIops] = useNumberParamState("AwsEbsCost.provisionedIops", 6000);
  const [pricePerIopsMonthUsd, setPricePerIopsMonthUsd] = useNumberParamState("AwsEbsCost.pricePerIopsMonthUsd", 0.005);

  const [provisionedThroughputMbps, setProvisionedThroughputMbps] = useNumberParamState("AwsEbsCost.provisionedThroughputMbps", 250);
  const [pricePerMbpsMonthUsd, setPricePerMbpsMonthUsd] = useNumberParamState("AwsEbsCost.pricePerMbpsMonthUsd", 0.04);
  const [showPeakScenario, setShowPeakScenario] = useBooleanParamState("AwsEbsCost.showPeakScenario", false);
  const [peakMultiplierPct, setPeakMultiplierPct] = useNumberParamState("AwsEbsCost.peakMultiplierPct", 160);

  const result = useMemo(() => {
    return estimateEbsCost({
      storageGb: clamp(storageGb, 0, 1e12),
      pricePerGbMonthUsd: clamp(pricePerGbMonthUsd, 0, 1e3),
      provisionedIops: clamp(provisionedIops, 0, 1e9),
      pricePerIopsMonthUsd: clamp(pricePerIopsMonthUsd, 0, 1e3),
      provisionedThroughputMbps: clamp(provisionedThroughputMbps, 0, 1e9),
      pricePerMbpsMonthUsd: clamp(pricePerMbpsMonthUsd, 0, 1e3),
    });
  }, [
    storageGb,
    pricePerGbMonthUsd,
    provisionedIops,
    pricePerIopsMonthUsd,
    provisionedThroughputMbps,
    pricePerMbpsMonthUsd,
  ]);

  const peakResult = useMemo(() => {
    if (!showPeakScenario) return null;
    const multiplier = clamp(peakMultiplierPct, 100, 1000) / 100;
    return estimateEbsCost({
      storageGb: clamp(storageGb, 0, 1e12) * multiplier,
      pricePerGbMonthUsd: clamp(pricePerGbMonthUsd, 0, 1e3),
      provisionedIops: clamp(provisionedIops, 0, 1e9) * multiplier,
      pricePerIopsMonthUsd: clamp(pricePerIopsMonthUsd, 0, 1e3),
      provisionedThroughputMbps: clamp(provisionedThroughputMbps, 0, 1e9) * multiplier,
      pricePerMbpsMonthUsd: clamp(pricePerMbpsMonthUsd, 0, 1e3),
    });
  }, [
    peakMultiplierPct,
    pricePerGbMonthUsd,
    pricePerIopsMonthUsd,
    pricePerMbpsMonthUsd,
    provisionedIops,
    provisionedThroughputMbps,
    showPeakScenario,
    storageGb,
  ]);

  return (
    <div className="calc-grid">
      <div className="panel">
        <h3>Inputs</h3>
        <div className="form">
          <div className="field field-3">
            <div className="label">Storage (GB-month)</div>
            <input
              type="number"
              inputMode="numeric"
              value={storageGb}
              min={0}
              step={1}
              onChange={(e) => setStorageGb(+e.target.value)}
            />
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
            <div className="label">Provisioned IOPS (IOPS-month)</div>
            <input
              type="number"
              inputMode="numeric"
              value={provisionedIops}
              min={0}
              step={1}
              onChange={(e) => setProvisionedIops(+e.target.value)}
            />
          </div>
          <div className="field field-3">
            <div className="label">IOPS price ($ / IOPS-month)</div>
            <input
              type="number"
              inputMode="decimal"
              value={pricePerIopsMonthUsd}
              min={0}
              step={0.0001}
              onChange={(e) => setPricePerIopsMonthUsd(+e.target.value)}
            />
          </div>

          <div className="field field-3">
            <div className="label">Provisioned throughput (MB/s-month)</div>
            <input
              type="number"
              inputMode="numeric"
              value={provisionedThroughputMbps}
              min={0}
              step={1}
              onChange={(e) => setProvisionedThroughputMbps(+e.target.value)}
            />
          </div>
          <div className="field field-3">
            <div className="label">Throughput price ($ / MB/s-month)</div>
            <input
              type="number"
              inputMode="decimal"
              value={pricePerMbpsMonthUsd}
              min={0}
              step={0.001}
              onChange={(e) => setPricePerMbpsMonthUsd(+e.target.value)}
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
              <div className="hint">Applies to storage, IOPS, and throughput.</div>
            </div>
          ) : null}

          <div className="field field-6">
            <div className="label">Scenario presets</div>
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setStorageGb(200);
                  setPricePerGbMonthUsd(0.08);
                  setProvisionedIops(3000);
                  setPricePerIopsMonthUsd(0.005);
                  setProvisionedThroughputMbps(125);
                  setPricePerMbpsMonthUsd(0.04);
                  setShowPeakScenario(true);
                  setPeakMultiplierPct(150);
                }}
              >
                App server
              </button>
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setStorageGb(1500);
                  setPricePerGbMonthUsd(0.08);
                  setProvisionedIops(12000);
                  setPricePerIopsMonthUsd(0.005);
                  setProvisionedThroughputMbps(500);
                  setPricePerMbpsMonthUsd(0.04);
                  setShowPeakScenario(true);
                  setPeakMultiplierPct(220);
                }}
              >
                OLTP core
              </button>
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setStorageGb(8000);
                  setPricePerGbMonthUsd(0.08);
                  setProvisionedIops(32000);
                  setPricePerIopsMonthUsd(0.005);
                  setProvisionedThroughputMbps(1000);
                  setPricePerMbpsMonthUsd(0.04);
                  setShowPeakScenario(true);
                  setPeakMultiplierPct(180);
                }}
              >
                Analytics
              </button>
            </div>
          </div>

          <div className="field field-6">
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setStorageGb(500);
                  setPricePerGbMonthUsd(0.08);
                  setProvisionedIops(6000);
                  setPricePerIopsMonthUsd(0.005);
                  setProvisionedThroughputMbps(250);
                  setPricePerMbpsMonthUsd(0.04);
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
            <div className="v">{formatCurrency2(result.totalCostUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">Storage</div>
            <div className="v">{formatCurrency2(result.storageCostUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">Provisioned IOPS</div>
            <div className="v">{formatCurrency2(result.iopsCostUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">Provisioned throughput</div>
            <div className="v">{formatCurrency2(result.throughputCostUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">IOPS-month</div>
            <div className="v">{formatNumber(result.provisionedIops, 0)}</div>
          </div>
          <div className="kpi">
            <div className="k">MB/s-month</div>
            <div className="v">{formatNumber(result.provisionedThroughputMbps, 0)}</div>
          </div>
        </div>

        {peakResult ? (
          <div style={{ marginTop: 12 }}>
            <div className="muted" style={{ fontSize: 13, marginBottom: 6 }}>Baseline vs peak</div>
            <table className="table">
              <thead>
                <tr>
                  <th>Scenario</th>
                  <th className="num">Storage</th>
                  <th className="num">IOPS</th>
                  <th className="num">Total cost</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Baseline</td>
                  <td className="num">{formatNumber(result.storageGb, 0)} GB</td>
                  <td className="num">{formatNumber(result.provisionedIops, 0)}</td>
                  <td className="num">{formatCurrency2(result.totalCostUsd)}</td>
                </tr>
                <tr>
                  <td>Peak</td>
                  <td className="num">{formatNumber(peakResult.storageGb, 0)} GB</td>
                  <td className="num">{formatNumber(peakResult.provisionedIops, 0)}</td>
                  <td className="num">{formatCurrency2(peakResult.totalCostUsd)}</td>
                </tr>
                <tr>
                  <td>Delta</td>
                  <td className="num">{formatNumber(peakResult.storageGb - result.storageGb, 0)} GB</td>
                  <td className="num">{formatNumber(peakResult.provisionedIops - result.provisionedIops, 0)}</td>
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
