import React, { useMemo, useState } from "react";
import { useBooleanParamState, useNumberParamState } from "./useNumberParamState";
import { estimateDynamoDbCost } from "../../lib/calc/dynamodb";
import { formatCurrency2, formatNumber } from "../../lib/format";
import { clamp } from "../../lib/math";

export function AwsDynamoDbCostCalculator() {
  const [readRequestsPerMonth, setReadRequestsPerMonth] = useNumberParamState("AwsDynamoDbCost.readRequestsPerMonth", 2_000_000_000);
  const [writeRequestsPerMonth, setWriteRequestsPerMonth] = useNumberParamState("AwsDynamoDbCost.writeRequestsPerMonth", 500_000_000);
  const [pricePerMillionReadRequestsUsd, setPricePerMillionReadRequestsUsd] = useNumberParamState("AwsDynamoDbCost.pricePerMillionReadRequestsUsd", 0.25);
  const [pricePerMillionWriteRequestsUsd, setPricePerMillionWriteRequestsUsd] = useNumberParamState("AwsDynamoDbCost.pricePerMillionWriteRequestsUsd", 1.25);
  const [showPeakScenario, setShowPeakScenario] = useBooleanParamState("AwsDynamoDbCost.showPeakScenario", false);
  const [peakMultiplierPct, setPeakMultiplierPct] = useNumberParamState("AwsDynamoDbCost.peakMultiplierPct", 180);

  const [storageGb, setStorageGb] = useNumberParamState("AwsDynamoDbCost.storageGb", 200);
  const [pricePerGbMonthUsd, setPricePerGbMonthUsd] = useNumberParamState("AwsDynamoDbCost.pricePerGbMonthUsd", 0.25);
  const secondsPerMonth = 30.4 * 24 * 3600;
  const readsPerSecond = readRequestsPerMonth / secondsPerMonth;
  const writesPerSecond = writeRequestsPerMonth / secondsPerMonth;
  const [avgReadRps, setAvgReadRps] = useState(800);
  const [avgWriteRps, setAvgWriteRps] = useState(200);
  const estimatedReadRequestsPerMonth = clamp(avgReadRps, 0, 1e12) * secondsPerMonth;
  const estimatedWriteRequestsPerMonth = clamp(avgWriteRps, 0, 1e12) * secondsPerMonth;
  const totalRequestsPerMonth = readRequestsPerMonth + writeRequestsPerMonth;
  const storageTb = storageGb / 1024;

  const result = useMemo(() => {
    return estimateDynamoDbCost({
      readRequestsPerMonth: clamp(readRequestsPerMonth, 0, 1e18),
      writeRequestsPerMonth: clamp(writeRequestsPerMonth, 0, 1e18),
      pricePerMillionReadRequestsUsd: clamp(pricePerMillionReadRequestsUsd, 0, 1e9),
      pricePerMillionWriteRequestsUsd: clamp(pricePerMillionWriteRequestsUsd, 0, 1e9),
      storageGb: clamp(storageGb, 0, 1e12),
      pricePerGbMonthUsd: clamp(pricePerGbMonthUsd, 0, 1e3),
    });
  }, [
    readRequestsPerMonth,
    writeRequestsPerMonth,
    pricePerMillionReadRequestsUsd,
    pricePerMillionWriteRequestsUsd,
    storageGb,
    pricePerGbMonthUsd,
  ]);

  const peakResult = useMemo(() => {
    if (!showPeakScenario) return null;
    const multiplier = clamp(peakMultiplierPct, 100, 1000) / 100;
    return estimateDynamoDbCost({
      readRequestsPerMonth: clamp(readRequestsPerMonth, 0, 1e18) * multiplier,
      writeRequestsPerMonth: clamp(writeRequestsPerMonth, 0, 1e18) * multiplier,
      pricePerMillionReadRequestsUsd: clamp(pricePerMillionReadRequestsUsd, 0, 1e9),
      pricePerMillionWriteRequestsUsd: clamp(pricePerMillionWriteRequestsUsd, 0, 1e9),
      storageGb: clamp(storageGb, 0, 1e12),
      pricePerGbMonthUsd: clamp(pricePerGbMonthUsd, 0, 1e3),
    });
  }, [
    peakMultiplierPct,
    pricePerGbMonthUsd,
    pricePerMillionReadRequestsUsd,
    pricePerMillionWriteRequestsUsd,
    readRequestsPerMonth,
    showPeakScenario,
    storageGb,
    writeRequestsPerMonth,
  ]);
  const costPerMillionRequests = result.totalRequestsPerMonth > 0
    ? (result.totalCostUsd / result.totalRequestsPerMonth) * 1_000_000
    : 0;

  return (
    <div className="calc-grid">
      <div className="panel">
        <h3>Inputs</h3>
        <div className="form">
          <div className="field field-3">
            <div className="label">Read requests (per month)</div>
            <input
              type="number"
              inputMode="numeric"
              value={readRequestsPerMonth}
              min={0}
              step={1000}
              onChange={(e) => setReadRequestsPerMonth(+e.target.value)}
            />
            <div className="hint">Avg {formatNumber(readsPerSecond, 2)} RPS.</div>
          </div>
          <div className="field field-3">
            <div className="label">Write requests (per month)</div>
            <input
              type="number"
              inputMode="numeric"
              value={writeRequestsPerMonth}
              min={0}
              step={1000}
              onChange={(e) => setWriteRequestsPerMonth(+e.target.value)}
            />
            <div className="hint">Avg {formatNumber(writesPerSecond, 2)} RPS.</div>
          </div>
          <div className="field field-3">
            <div className="label">Avg read RPS</div>
            <input
              type="number"
              inputMode="decimal"
              value={avgReadRps}
              min={0}
              step={0.1}
              onChange={(e) => setAvgReadRps(+e.target.value)}
            />
          </div>
          <div className="field field-3">
            <div className="label">Avg write RPS</div>
            <input
              type="number"
              inputMode="decimal"
              value={avgWriteRps}
              min={0}
              step={0.1}
              onChange={(e) => setAvgWriteRps(+e.target.value)}
            />
          </div>
          <div className="field field-3" style={{ alignSelf: "end" }}>
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setReadRequestsPerMonth(Math.round(estimatedReadRequestsPerMonth));
                  setWriteRequestsPerMonth(Math.round(estimatedWriteRequestsPerMonth));
                }}
              >
                Use estimates
              </button>
            </div>
            <div className="hint">
              Est {formatNumber(estimatedReadRequestsPerMonth, 0)} reads and {formatNumber(estimatedWriteRequestsPerMonth, 0)} writes/month.
            </div>
          </div>
          <div className="field field-6">
            <div className="label">Request mix presets</div>
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  const total = Math.max(1, totalRequestsPerMonth);
                  setReadRequestsPerMonth(Math.round(total * 0.95));
                  setWriteRequestsPerMonth(Math.round(total * 0.05));
                }}
              >
                Read heavy 95/5
              </button>
              <button
                className="btn"
                type="button"
                onClick={() => {
                  const total = Math.max(1, totalRequestsPerMonth);
                  setReadRequestsPerMonth(Math.round(total * 0.8));
                  setWriteRequestsPerMonth(Math.round(total * 0.2));
                }}
              >
                Balanced 80/20
              </button>
              <button
                className="btn"
                type="button"
                onClick={() => {
                  const total = Math.max(1, totalRequestsPerMonth);
                  setReadRequestsPerMonth(Math.round(total * 0.6));
                  setWriteRequestsPerMonth(Math.round(total * 0.4));
                }}
              >
                Write heavy 60/40
              </button>
            </div>
          </div>

          <div className="field field-3">
            <div className="label">Read price ($ / 1M requests)</div>
            <input
              type="number"
              inputMode="decimal"
              value={pricePerMillionReadRequestsUsd}
              min={0}
              step={0.01}
              onChange={(e) => setPricePerMillionReadRequestsUsd(+e.target.value)}
            />
          </div>
          <div className="field field-3">
            <div className="label">Write price ($ / 1M requests)</div>
            <input
              type="number"
              inputMode="decimal"
              value={pricePerMillionWriteRequestsUsd}
              min={0}
              step={0.01}
              onChange={(e) => setPricePerMillionWriteRequestsUsd(+e.target.value)}
            />
          </div>

          <div className="field field-3">
            <div className="label">Table storage (GB-month)</div>
            <input
              type="number"
              inputMode="numeric"
              value={storageGb}
              min={0}
              step={1}
              onChange={(e) => setStorageGb(+e.target.value)}
            />
            <div className="hint">Approx {formatNumber(storageTb, 2)} TB-month.</div>
          </div>
          <div className="field field-3">
            <div className="label">Storage price ($ / GB-month)</div>
            <input
              type="number"
              inputMode="decimal"
              value={pricePerGbMonthUsd}
              min={0}
              step={0.01}
              onChange={(e) => setPricePerGbMonthUsd(+e.target.value)}
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
              <div className="hint">Applies to read/write traffic only.</div>
            </div>
          ) : null}

          <div className="field field-6">
            <div className="label">Scenario presets</div>
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setReadRequestsPerMonth(600_000_000);
                  setWriteRequestsPerMonth(120_000_000);
                  setPricePerMillionReadRequestsUsd(0.25);
                  setPricePerMillionWriteRequestsUsd(1.25);
                  setStorageGb(80);
                  setPricePerGbMonthUsd(0.25);
                  setShowPeakScenario(true);
                  setPeakMultiplierPct(160);
                }}
              >
                Dev + QA
              </button>
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setReadRequestsPerMonth(2_800_000_000);
                  setWriteRequestsPerMonth(700_000_000);
                  setPricePerMillionReadRequestsUsd(0.25);
                  setPricePerMillionWriteRequestsUsd(1.25);
                  setStorageGb(250);
                  setPricePerGbMonthUsd(0.25);
                  setShowPeakScenario(true);
                  setPeakMultiplierPct(200);
                }}
              >
                B2B SaaS
              </button>
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setReadRequestsPerMonth(8_000_000_000);
                  setWriteRequestsPerMonth(2_000_000_000);
                  setPricePerMillionReadRequestsUsd(0.25);
                  setPricePerMillionWriteRequestsUsd(1.25);
                  setStorageGb(900);
                  setPricePerGbMonthUsd(0.23);
                  setShowPeakScenario(true);
                  setPeakMultiplierPct(180);
                }}
              >
                Consumer scale
              </button>
            </div>
          </div>

          <div className="field field-6">
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setReadRequestsPerMonth(2_000_000_000);
                  setWriteRequestsPerMonth(500_000_000);
                  setPricePerMillionReadRequestsUsd(0.25);
                  setPricePerMillionWriteRequestsUsd(1.25);
                  setStorageGb(200);
                  setPricePerGbMonthUsd(0.25);
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
            <div className="k">Reads</div>
            <div className="v">{formatCurrency2(result.readCostUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">Writes</div>
            <div className="v">{formatCurrency2(result.writeCostUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">Storage</div>
            <div className="v">{formatCurrency2(result.storageCostUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">Read requests</div>
            <div className="v">{formatNumber(result.readRequestsPerMonth, 0)}</div>
          </div>
          <div className="kpi">
            <div className="k">Write requests</div>
            <div className="v">{formatNumber(result.writeRequestsPerMonth, 0)}</div>
          </div>
          <div className="kpi">
            <div className="k">Cost per 1M requests</div>
            <div className="v">{formatCurrency2(costPerMillionRequests)}</div>
          </div>
        </div>

        {peakResult ? (
          <div style={{ marginTop: 12 }}>
            <div className="muted" style={{ fontSize: 13, marginBottom: 6 }}>Baseline vs peak</div>
            <table className="table">
              <thead>
                <tr>
                  <th>Scenario</th>
                  <th className="num">Requests</th>
                  <th className="num">Storage</th>
                  <th className="num">Total cost</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Baseline</td>
                  <td className="num">{formatNumber(result.readRequestsPerMonth + result.writeRequestsPerMonth, 0)}</td>
                  <td className="num">{formatCurrency2(result.storageCostUsd)}</td>
                  <td className="num">{formatCurrency2(result.totalCostUsd)}</td>
                </tr>
                <tr>
                  <td>Peak</td>
                  <td className="num">{formatNumber(peakResult.readRequestsPerMonth + peakResult.writeRequestsPerMonth, 0)}</td>
                  <td className="num">{formatCurrency2(peakResult.storageCostUsd)}</td>
                  <td className="num">{formatCurrency2(peakResult.totalCostUsd)}</td>
                </tr>
                <tr>
                  <td>Delta</td>
                  <td className="num">{formatNumber((peakResult.readRequestsPerMonth + peakResult.writeRequestsPerMonth) - (result.readRequestsPerMonth + result.writeRequestsPerMonth), 0)}</td>
                  <td className="num">{formatCurrency2(peakResult.storageCostUsd - result.storageCostUsd)}</td>
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
