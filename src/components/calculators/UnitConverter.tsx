import React, { useMemo } from "react";
import { useBooleanParamState, useNumberParamState } from "./useNumberParamState";
import {
  gbToGib,
  gibToGb,
  mbpsToMBps,
  MBpsToMbps,
  throughputToMonthlyTransferGb,
} from "../../lib/calc/units";
import { formatNumber } from "../../lib/format";
import { clamp } from "../../lib/math";

export function UnitConverterCalculator() {
  const [gb, setGb] = useNumberParamState("UnitConverter.gb", 1000);
  const [gib, setGib] = useNumberParamState("UnitConverter.gib", 931.32);
  const [mbps, setMbps] = useNumberParamState("UnitConverter.mbps", 100);
  const [mBps, setMBps] = useNumberParamState("UnitConverter.mBps", 12.5);
  const [utilizationPct, setUtilizationPct] = useNumberParamState("UnitConverter.utilizationPct", 30);
  const [hoursPerDay, setHoursPerDay] = useNumberParamState("UnitConverter.hoursPerDay", 24);
  const [showPeakScenario, setShowPeakScenario] = useBooleanParamState("UnitConverter.showPeakScenario", false);
  const [peakMultiplierPct, setPeakMultiplierPct] = useNumberParamState("UnitConverter.peakMultiplierPct", 200);

  const conv = useMemo(() => {
    const gbVal = clamp(gb, 0, 1e18);
    const gibVal = clamp(gib, 0, 1e18);
    const mbpsVal = clamp(mbps, 0, 1e12);
    const mBpsVal = clamp(mBps, 0, 1e12);
    const utilization = clamp(utilizationPct, 0, 100);
    const hours = clamp(hoursPerDay, 0, 24);
    const monthly = throughputToMonthlyTransferGb({
      mbps: mbpsVal,
      utilizationPct: utilization,
      hoursPerDay: hours,
    });
    return {
      gbVal,
      gibFromGb: gbToGib(gbVal),
      gibVal,
      gbFromGib: gibToGb(gibVal),
      mbpsVal,
      mBpsFromMbps: mbpsToMBps(mbpsVal),
      mBpsVal,
      mbpsFromMBps: MBpsToMbps(mBpsVal),
      monthlyGb: monthly.gbTransferred,
    };
  }, [gb, gib, mbps, mBps, utilizationPct, hoursPerDay]);

  const peakResult = useMemo(() => {
    if (!showPeakScenario) return null;
    const multiplier = clamp(peakMultiplierPct, 100, 1000) / 100;
    const peakMbps = clamp(mbps, 0, 1e12) * multiplier;
    const monthly = throughputToMonthlyTransferGb({
      mbps: peakMbps,
      utilizationPct: clamp(utilizationPct, 0, 100),
      hoursPerDay: clamp(hoursPerDay, 0, 24),
    });
    return {
      mbps: peakMbps,
      monthlyGb: monthly.gbTransferred,
    };
  }, [hoursPerDay, mbps, peakMultiplierPct, showPeakScenario, utilizationPct]);

  return (
    <div className="calc-grid">
      <div className="panel">
        <h3>Inputs</h3>
        <div className="form">
          <div className="field field-3">
            <div className="label">GB</div>
            <input
              type="number"
              inputMode="decimal"
              value={gb}
              min={0}
              onChange={(e) => setGb(+e.target.value)}
            />
          </div>
          <div className="field field-3">
            <div className="label">GiB</div>
            <input
              type="number"
              inputMode="decimal"
              value={gib}
              min={0}
              onChange={(e) => setGib(+e.target.value)}
            />
          </div>

          <div className="field field-3">
            <div className="label">Mbps (megabits/sec)</div>
            <input
              type="number"
              inputMode="decimal"
              value={mbps}
              min={0}
              onChange={(e) => setMbps(+e.target.value)}
            />
          </div>
          <div className="field field-3">
            <div className="label">MB/s (megabytes/sec)</div>
            <input
              type="number"
              inputMode="decimal"
              value={mBps}
              min={0}
              onChange={(e) => setMBps(+e.target.value)}
            />
          </div>

          <div className="field field-3">
            <div className="label">Utilization (%)</div>
            <input
              type="number"
              inputMode="numeric"
              value={utilizationPct}
              min={0}
              max={100}
              step={1}
              onChange={(e) => setUtilizationPct(+e.target.value)}
            />
          </div>
          <div className="field field-3">
            <div className="label">Hours/day</div>
            <input
              type="number"
              inputMode="numeric"
              value={hoursPerDay}
              min={0}
              max={24}
              step={1}
              onChange={(e) => setHoursPerDay(+e.target.value)}
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
              <div className="hint">Applies to throughput (Mbps).</div>
            </div>
          ) : null}

          <div className="field field-6">
            <div className="label">Scenario presets</div>
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setGb(500);
                  setGib(465.66);
                  setMbps(50);
                  setMBps(6.25);
                  setUtilizationPct(20);
                  setHoursPerDay(24);
                  setShowPeakScenario(true);
                  setPeakMultiplierPct(180);
                }}
              >
                Light traffic
              </button>
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setGb(2000);
                  setGib(1862.65);
                  setMbps(200);
                  setMBps(25);
                  setUtilizationPct(35);
                  setHoursPerDay(24);
                  setShowPeakScenario(true);
                  setPeakMultiplierPct(230);
                }}
              >
                SaaS baseline
              </button>
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setGb(5000);
                  setGib(4656.61);
                  setMbps(600);
                  setMBps(75);
                  setUtilizationPct(45);
                  setHoursPerDay(24);
                  setShowPeakScenario(true);
                  setPeakMultiplierPct(200);
                }}
              >
                Streaming burst
              </button>
            </div>
          </div>

          <div className="field field-6">
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setGb(1000);
                  setGib(931.32);
                  setMbps(100);
                  setMBps(12.5);
                  setUtilizationPct(30);
                  setHoursPerDay(24);
                  setShowPeakScenario(false);
                  setPeakMultiplierPct(200);
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
            <div className="k">GB to GiB</div>
            <div className="v">{formatNumber(conv.gibFromGb, 2)} GiB</div>
          </div>
          <div className="kpi">
            <div className="k">GiB to GB</div>
            <div className="v">{formatNumber(conv.gbFromGib, 2)} GB</div>
          </div>
          <div className="kpi">
            <div className="k">Mbps to MB/s</div>
            <div className="v">{formatNumber(conv.mBpsFromMbps, 2)} MB/s</div>
          </div>
          <div className="kpi">
            <div className="k">MB/s to Mbps</div>
            <div className="v">{formatNumber(conv.mbpsFromMBps, 2)} Mbps</div>
          </div>
          <div className="kpi">
            <div className="k">Monthly transfer (estimate)</div>
            <div className="v">{formatNumber(conv.monthlyGb, 0)} GB / month</div>
          </div>
        </div>

        {peakResult ? (
          <div style={{ marginTop: 12 }}>
            <div className="muted" style={{ fontSize: 13, marginBottom: 6 }}>Baseline vs peak</div>
            <table className="table">
              <thead>
                <tr>
                  <th>Scenario</th>
                  <th className="num">Throughput (Mbps)</th>
                  <th className="num">Monthly transfer</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Baseline</td>
                  <td className="num">{formatNumber(conv.mbpsVal, 0)}</td>
                  <td className="num">{formatNumber(conv.monthlyGb, 0)} GB</td>
                </tr>
                <tr>
                  <td>Peak</td>
                  <td className="num">{formatNumber(peakResult.mbps, 0)}</td>
                  <td className="num">{formatNumber(peakResult.monthlyGb, 0)} GB</td>
                </tr>
                <tr>
                  <td>Delta</td>
                  <td className="num">{formatNumber(peakResult.mbps - conv.mbpsVal, 0)}</td>
                  <td className="num">{formatNumber(peakResult.monthlyGb - conv.monthlyGb, 0)} GB</td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </div>
  );
}


