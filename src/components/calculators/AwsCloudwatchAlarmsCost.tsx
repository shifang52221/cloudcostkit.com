import React, { useMemo } from "react";
import { useBooleanParamState, useNumberParamState } from "./useNumberParamState";
import { estimateCloudwatchAlarmsCost } from "../../lib/calc/cloudwatchAlarms";
import { formatCurrency2, formatNumber } from "../../lib/format";
import { clamp } from "../../lib/math";

export function AwsCloudwatchAlarmsCostCalculator() {
  const [standardAlarms, setStandardAlarms] = useNumberParamState("AwsCloudwatchAlarmsCost.standardAlarms", 500);
  const [highResAlarms, setHighResAlarms] = useNumberParamState("AwsCloudwatchAlarmsCost.highResAlarms", 50);
  const [compositeAlarms, setCompositeAlarms] = useNumberParamState("AwsCloudwatchAlarmsCost.compositeAlarms", 20);

  const [pricePerStandardAlarmUsdPerMonth, setPricePerStandardAlarmUsdPerMonth] = useNumberParamState("AwsCloudwatchAlarmsCost.pricePerStandardAlarmUsdPerMonth", 0.1);
  const [pricePerHighResAlarmUsdPerMonth, setPricePerHighResAlarmUsdPerMonth] = useNumberParamState("AwsCloudwatchAlarmsCost.pricePerHighResAlarmUsdPerMonth", 0.3);
  const [pricePerCompositeAlarmUsdPerMonth, setPricePerCompositeAlarmUsdPerMonth] = useNumberParamState("AwsCloudwatchAlarmsCost.pricePerCompositeAlarmUsdPerMonth", 0.5);
  const [showPeakScenario, setShowPeakScenario] = useBooleanParamState("AwsCloudwatchAlarmsCost.showPeakScenario", false);
  const [peakMultiplierPct, setPeakMultiplierPct] = useNumberParamState("AwsCloudwatchAlarmsCost.peakMultiplierPct", 180);

  const result = useMemo(() => {
    return estimateCloudwatchAlarmsCost({
      standardAlarms: clamp(standardAlarms, 0, 1e9),
      highResAlarms: clamp(highResAlarms, 0, 1e9),
      compositeAlarms: clamp(compositeAlarms, 0, 1e9),
      pricePerStandardAlarmUsdPerMonth: clamp(pricePerStandardAlarmUsdPerMonth, 0, 1e9),
      pricePerHighResAlarmUsdPerMonth: clamp(pricePerHighResAlarmUsdPerMonth, 0, 1e9),
      pricePerCompositeAlarmUsdPerMonth: clamp(pricePerCompositeAlarmUsdPerMonth, 0, 1e9),
    });
  }, [
    standardAlarms,
    highResAlarms,
    compositeAlarms,
    pricePerStandardAlarmUsdPerMonth,
    pricePerHighResAlarmUsdPerMonth,
    pricePerCompositeAlarmUsdPerMonth,
  ]);

  const peakResult = useMemo(() => {
    if (!showPeakScenario) return null;
    const multiplier = clamp(peakMultiplierPct, 100, 1000) / 100;
    return estimateCloudwatchAlarmsCost({
      standardAlarms: clamp(standardAlarms, 0, 1e9) * multiplier,
      highResAlarms: clamp(highResAlarms, 0, 1e9) * multiplier,
      compositeAlarms: clamp(compositeAlarms, 0, 1e9) * multiplier,
      pricePerStandardAlarmUsdPerMonth: clamp(pricePerStandardAlarmUsdPerMonth, 0, 1e9),
      pricePerHighResAlarmUsdPerMonth: clamp(pricePerHighResAlarmUsdPerMonth, 0, 1e9),
      pricePerCompositeAlarmUsdPerMonth: clamp(pricePerCompositeAlarmUsdPerMonth, 0, 1e9),
    });
  }, [
    compositeAlarms,
    highResAlarms,
    peakMultiplierPct,
    pricePerCompositeAlarmUsdPerMonth,
    pricePerHighResAlarmUsdPerMonth,
    pricePerStandardAlarmUsdPerMonth,
    showPeakScenario,
    standardAlarms,
  ]);

  const totalAlarms = result.standardAlarms + result.highResAlarms + result.compositeAlarms;

  return (
    <div className="calc-grid">
      <div className="panel">
        <h3>Inputs</h3>
        <div className="form">
          <div className="field field-3">
            <div className="label">Standard alarms</div>
            <input
              type="number"
              inputMode="numeric"
              value={standardAlarms}
              min={0}
              step={1}
              onChange={(e) => setStandardAlarms(+e.target.value)}
            />
            <div className="hint">Typical 1-minute period alarms.</div>
          </div>
          <div className="field field-3">
            <div className="label">High-resolution alarms</div>
            <input
              type="number"
              inputMode="numeric"
              value={highResAlarms}
              min={0}
              step={1}
              onChange={(e) => setHighResAlarms(+e.target.value)}
            />
            <div className="hint">Alarms that evaluate on shorter periods.</div>
          </div>
          <div className="field field-3">
            <div className="label">Composite alarms</div>
            <input
              type="number"
              inputMode="numeric"
              value={compositeAlarms}
              min={0}
              step={1}
              onChange={(e) => setCompositeAlarms(+e.target.value)}
            />
          </div>

          <div className="field field-3">
            <div className="label">Price ($ / standard alarm-month)</div>
            <input
              type="number"
              inputMode="decimal"
              value={pricePerStandardAlarmUsdPerMonth}
              min={0}
              step={0.001}
              onChange={(e) => setPricePerStandardAlarmUsdPerMonth(+e.target.value)}
            />
          </div>
          <div className="field field-3">
            <div className="label">Price ($ / high-res alarm-month)</div>
            <input
              type="number"
              inputMode="decimal"
              value={pricePerHighResAlarmUsdPerMonth}
              min={0}
              step={0.001}
              onChange={(e) => setPricePerHighResAlarmUsdPerMonth(+e.target.value)}
            />
          </div>
          <div className="field field-3">
            <div className="label">Price ($ / composite alarm-month)</div>
            <input
              type="number"
              inputMode="decimal"
              value={pricePerCompositeAlarmUsdPerMonth}
              min={0}
              step={0.001}
              onChange={(e) => setPricePerCompositeAlarmUsdPerMonth(+e.target.value)}
            />
            <div className="hint">Use your effective region pricing.</div>
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
              <div className="hint">Applies to alarm counts.</div>
            </div>
          ) : null}

          <div className="field field-6">
            <div className="label">Scenario presets</div>
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setStandardAlarms(200);
                  setHighResAlarms(20);
                  setCompositeAlarms(5);
                  setPricePerStandardAlarmUsdPerMonth(0.1);
                  setPricePerHighResAlarmUsdPerMonth(0.3);
                  setPricePerCompositeAlarmUsdPerMonth(0.5);
                  setShowPeakScenario(true);
                  setPeakMultiplierPct(150);
                }}
              >
                Small stack
              </button>
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setStandardAlarms(1200);
                  setHighResAlarms(120);
                  setCompositeAlarms(40);
                  setPricePerStandardAlarmUsdPerMonth(0.1);
                  setPricePerHighResAlarmUsdPerMonth(0.3);
                  setPricePerCompositeAlarmUsdPerMonth(0.5);
                  setShowPeakScenario(true);
                  setPeakMultiplierPct(200);
                }}
              >
                Multi-env
              </button>
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setStandardAlarms(4000);
                  setHighResAlarms(600);
                  setCompositeAlarms(120);
                  setPricePerStandardAlarmUsdPerMonth(0.1);
                  setPricePerHighResAlarmUsdPerMonth(0.3);
                  setPricePerCompositeAlarmUsdPerMonth(0.5);
                  setShowPeakScenario(true);
                  setPeakMultiplierPct(230);
                }}
              >
                Platform scale
              </button>
            </div>
          </div>

          <div className="field field-6">
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setStandardAlarms(500);
                  setHighResAlarms(50);
                  setCompositeAlarms(20);
                  setPricePerStandardAlarmUsdPerMonth(0.1);
                  setPricePerHighResAlarmUsdPerMonth(0.3);
                  setPricePerCompositeAlarmUsdPerMonth(0.5);
                  setShowPeakScenario(false);
                  setPeakMultiplierPct(180);
                }}
              >
                Reset example
              </button>
            </div>
            <div className="muted" style={{ marginTop: 8, fontSize: 12 }}>
              This estimates alarm charges only. Metric ingestion, dashboards, and notifications can be additional line
              items.
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
            <div className="k">Standard alarms</div>
            <div className="v">{formatCurrency2(result.standardCostUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">High-resolution alarms</div>
            <div className="v">{formatCurrency2(result.highResCostUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">Composite alarms</div>
            <div className="v">{formatCurrency2(result.compositeCostUsd)}</div>
          </div>
        </div>

        {peakResult ? (
          <div style={{ marginTop: 12 }}>
            <div className="muted" style={{ fontSize: 13, marginBottom: 6 }}>Baseline vs peak</div>
            <table className="table">
              <thead>
                <tr>
                  <th>Scenario</th>
                  <th className="num">Total alarms</th>
                  <th className="num">Total cost</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Baseline</td>
                  <td className="num">{formatNumber(totalAlarms, 0)}</td>
                  <td className="num">{formatCurrency2(result.totalCostUsd)}</td>
                </tr>
                <tr>
                  <td>Peak</td>
                  <td className="num">
                    {formatNumber(
                      peakResult.standardAlarms + peakResult.highResAlarms + peakResult.compositeAlarms,
                      0
                    )}
                  </td>
                  <td className="num">{formatCurrency2(peakResult.totalCostUsd)}</td>
                </tr>
                <tr>
                  <td>Delta</td>
                  <td className="num">
                    {formatNumber(
                      peakResult.standardAlarms +
                        peakResult.highResAlarms +
                        peakResult.compositeAlarms -
                        totalAlarms,
                      0
                    )}
                  </td>
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
