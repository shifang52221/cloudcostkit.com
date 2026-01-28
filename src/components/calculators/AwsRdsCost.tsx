import React, { useMemo } from "react";
import { useBooleanParamState, useNumberParamState } from "./useNumberParamState";
import { estimateRdsCost } from "../../lib/calc/rds";
import { formatCurrency2, formatNumber } from "../../lib/format";
import { clamp } from "../../lib/math";

export function AwsRdsCostCalculator() {
  const [instances, setInstances] = useNumberParamState("AwsRdsCost.instances", 1);
  const [pricePerHourUsd, setPricePerHourUsd] = useNumberParamState("AwsRdsCost.pricePerHourUsd", 0.2);
  const [hoursPerMonth, setHoursPerMonth] = useNumberParamState("AwsRdsCost.hoursPerMonth", 730);

  const [storageGb, setStorageGb] = useNumberParamState("AwsRdsCost.storageGb", 200);
  const [pricePerGbMonthUsd, setPricePerGbMonthUsd] = useNumberParamState("AwsRdsCost.pricePerGbMonthUsd", 0.115);

  const [backupGb, setBackupGb] = useNumberParamState("AwsRdsCost.backupGb", 200);
  const [pricePerBackupGbMonthUsd, setPricePerBackupGbMonthUsd] = useNumberParamState("AwsRdsCost.pricePerBackupGbMonthUsd", 0.095);

  const [ioRequestsPerMonth, setIoRequestsPerMonth] = useNumberParamState("AwsRdsCost.ioRequestsPerMonth", 5_000_000_000);
  const [pricePerMillionIoRequestsUsd, setPricePerMillionIoRequestsUsd] = useNumberParamState("AwsRdsCost.pricePerMillionIoRequestsUsd", 0.2);
  const [showPeakScenario, setShowPeakScenario] = useBooleanParamState("AwsRdsCost.showPeakScenario", false);
  const [peakMultiplierPct, setPeakMultiplierPct] = useNumberParamState("AwsRdsCost.peakMultiplierPct", 180);

  const result = useMemo(() => {
    return estimateRdsCost({
      instances: clamp(instances, 0, 1e6),
      pricePerHourUsd: clamp(pricePerHourUsd, 0, 1e6),
      hoursPerMonth: clamp(hoursPerMonth, 0, 744),
      storageGb: clamp(storageGb, 0, 1e12),
      pricePerGbMonthUsd: clamp(pricePerGbMonthUsd, 0, 1e3),
      backupGb: clamp(backupGb, 0, 1e12),
      pricePerBackupGbMonthUsd: clamp(pricePerBackupGbMonthUsd, 0, 1e3),
      ioRequestsPerMonth: clamp(ioRequestsPerMonth, 0, 1e18),
      pricePerMillionIoRequestsUsd: clamp(pricePerMillionIoRequestsUsd, 0, 1e6),
    });
  }, [
    instances,
    pricePerHourUsd,
    hoursPerMonth,
    storageGb,
    pricePerGbMonthUsd,
    backupGb,
    pricePerBackupGbMonthUsd,
    ioRequestsPerMonth,
    pricePerMillionIoRequestsUsd,
  ]);

  const peakResult = useMemo(() => {
    if (!showPeakScenario) return null;
    const multiplier = clamp(peakMultiplierPct, 100, 1000) / 100;
    return estimateRdsCost({
      instances: clamp(instances, 0, 1e6),
      pricePerHourUsd: clamp(pricePerHourUsd, 0, 1e6),
      hoursPerMonth: clamp(hoursPerMonth, 0, 744),
      storageGb: clamp(storageGb, 0, 1e12),
      pricePerGbMonthUsd: clamp(pricePerGbMonthUsd, 0, 1e3),
      backupGb: clamp(backupGb, 0, 1e12),
      pricePerBackupGbMonthUsd: clamp(pricePerBackupGbMonthUsd, 0, 1e3),
      ioRequestsPerMonth: clamp(ioRequestsPerMonth, 0, 1e18) * multiplier,
      pricePerMillionIoRequestsUsd: clamp(pricePerMillionIoRequestsUsd, 0, 1e6),
    });
  }, [
    backupGb,
    hoursPerMonth,
    instances,
    ioRequestsPerMonth,
    peakMultiplierPct,
    pricePerBackupGbMonthUsd,
    pricePerGbMonthUsd,
    pricePerHourUsd,
    pricePerMillionIoRequestsUsd,
    showPeakScenario,
    storageGb,
  ]);

  return (
    <div className="calc-grid">
      <div className="panel">
        <h3>Inputs</h3>
        <div className="form">
          <div className="field field-3">
            <div className="label">Instances</div>
            <input
              type="number"
              inputMode="numeric"
              value={instances}
              min={0}
              step={1}
              onChange={(e) => setInstances(+e.target.value)}
            />
          </div>
          <div className="field field-3">
            <div className="label">Price ($ / hour / instance)</div>
            <input
              type="number"
              inputMode="decimal"
              value={pricePerHourUsd}
              min={0}
              step={0.01}
              onChange={(e) => setPricePerHourUsd(+e.target.value)}
            />
          </div>
          <div className="field field-3">
            <div className="label">Billable hours (per month)</div>
            <input
              type="number"
              inputMode="numeric"
              value={hoursPerMonth}
              min={0}
              step={1}
              onChange={(e) => setHoursPerMonth(+e.target.value)}
            />
          </div>

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
            <div className="label">Backup storage (GB-month)</div>
            <input
              type="number"
              inputMode="numeric"
              value={backupGb}
              min={0}
              step={1}
              onChange={(e) => setBackupGb(+e.target.value)}
            />
          </div>
          <div className="field field-3">
            <div className="label">Backup price ($ / GB-month)</div>
            <input
              type="number"
              inputMode="decimal"
              value={pricePerBackupGbMonthUsd}
              min={0}
              step={0.001}
              onChange={(e) => setPricePerBackupGbMonthUsd(+e.target.value)}
            />
          </div>

          <div className="field field-3">
            <div className="label">I/O requests (per month)</div>
            <input
              type="number"
              inputMode="numeric"
              value={ioRequestsPerMonth}
              min={0}
              step={1000}
              onChange={(e) => setIoRequestsPerMonth(+e.target.value)}
            />
          </div>
          <div className="field field-3">
            <div className="label">I/O price ($ / 1M requests)</div>
            <input
              type="number"
              inputMode="decimal"
              value={pricePerMillionIoRequestsUsd}
              min={0}
              step={0.01}
              onChange={(e) => setPricePerMillionIoRequestsUsd(+e.target.value)}
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
              <div className="hint">Applies to I/O requests only.</div>
            </div>
          ) : null}

          <div className="field field-6">
            <div className="label">Scenario presets</div>
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setInstances(1);
                  setPricePerHourUsd(0.2);
                  setHoursPerMonth(730);
                  setStorageGb(100);
                  setPricePerGbMonthUsd(0.115);
                  setBackupGb(80);
                  setPricePerBackupGbMonthUsd(0.095);
                  setIoRequestsPerMonth(1_000_000_000);
                  setPricePerMillionIoRequestsUsd(0.2);
                  setShowPeakScenario(true);
                  setPeakMultiplierPct(160);
                }}
              >
                Small prod
              </button>
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setInstances(2);
                  setPricePerHourUsd(0.35);
                  setHoursPerMonth(730);
                  setStorageGb(400);
                  setPricePerGbMonthUsd(0.115);
                  setBackupGb(300);
                  setPricePerBackupGbMonthUsd(0.095);
                  setIoRequestsPerMonth(8_000_000_000);
                  setPricePerMillionIoRequestsUsd(0.2);
                  setShowPeakScenario(true);
                  setPeakMultiplierPct(220);
                }}
              >
                SaaS core
              </button>
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setInstances(4);
                  setPricePerHourUsd(0.7);
                  setHoursPerMonth(730);
                  setStorageGb(1500);
                  setPricePerGbMonthUsd(0.1);
                  setBackupGb(1200);
                  setPricePerBackupGbMonthUsd(0.09);
                  setIoRequestsPerMonth(25_000_000_000);
                  setPricePerMillionIoRequestsUsd(0.2);
                  setShowPeakScenario(true);
                  setPeakMultiplierPct(180);
                }}
              >
                High I/O
              </button>
            </div>
          </div>

          <div className="field field-6">
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setInstances(1);
                  setPricePerHourUsd(0.2);
                  setHoursPerMonth(730);
                  setStorageGb(200);
                  setPricePerGbMonthUsd(0.115);
                  setBackupGb(200);
                  setPricePerBackupGbMonthUsd(0.095);
                  setIoRequestsPerMonth(5_000_000_000);
                  setPricePerMillionIoRequestsUsd(0.2);
                  setShowPeakScenario(false);
                  setPeakMultiplierPct(180);
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
            <div className="k">Compute</div>
            <div className="v">{formatCurrency2(result.computeCostUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">DB storage</div>
            <div className="v">{formatCurrency2(result.storageCostUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">Backups</div>
            <div className="v">{formatCurrency2(result.backupCostUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">I/O requests</div>
            <div className="v">{formatCurrency2(result.ioCostUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">I/O requests (per month)</div>
            <div className="v">{formatNumber(result.ioRequestsPerMonth, 0)}</div>
          </div>
        </div>

        {peakResult ? (
          <div style={{ marginTop: 12 }}>
            <div className="muted" style={{ fontSize: 13, marginBottom: 6 }}>Baseline vs peak</div>
            <table className="table">
              <thead>
                <tr>
                  <th>Scenario</th>
                  <th className="num">I/O requests</th>
                  <th className="num">Total cost</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Baseline</td>
                  <td className="num">{formatNumber(result.ioRequestsPerMonth, 0)}</td>
                  <td className="num">{formatCurrency2(result.totalCostUsd)}</td>
                </tr>
                <tr>
                  <td>Peak</td>
                  <td className="num">{formatNumber(peakResult.ioRequestsPerMonth, 0)}</td>
                  <td className="num">{formatCurrency2(peakResult.totalCostUsd)}</td>
                </tr>
                <tr>
                  <td>Delta</td>
                  <td className="num">{formatNumber(peakResult.ioRequestsPerMonth - result.ioRequestsPerMonth, 0)}</td>
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
