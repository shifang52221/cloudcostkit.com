import React, { useMemo } from "react";
import { useBooleanParamState, useNumberParamState } from "./useNumberParamState";
import { estimateSnsCost } from "../../lib/calc/sns";
import { formatCurrency2, formatNumber } from "../../lib/format";
import { clamp } from "../../lib/math";

export function AwsSnsCostCalculator() {
  const [publishesPerMonth, setPublishesPerMonth] = useNumberParamState("AwsSnsCost.publishesPerMonth", 200_000_000);
  const [deliveriesPerMonth, setDeliveriesPerMonth] = useNumberParamState("AwsSnsCost.deliveriesPerMonth", 800_000_000);
  const [pricePerMillionPublishesUsd, setPricePerMillionPublishesUsd] = useNumberParamState("AwsSnsCost.pricePerMillionPublishesUsd", 0.5);
  const [pricePerMillionDeliveriesUsd, setPricePerMillionDeliveriesUsd] = useNumberParamState("AwsSnsCost.pricePerMillionDeliveriesUsd", 0.6);
  const [avgPayloadKb, setAvgPayloadKb] = useNumberParamState("AwsSnsCost.avgPayloadKb", 2);
  const [egressPricePerGbUsd, setEgressPricePerGbUsd] = useNumberParamState("AwsSnsCost.egressPricePerGbUsd", 0.09);
  const [showPeakScenario, setShowPeakScenario] = useBooleanParamState("AwsSnsCost.showPeakScenario", false);
  const [peakMultiplierPct, setPeakMultiplierPct] = useNumberParamState("AwsSnsCost.peakMultiplierPct", 180);

  const result = useMemo(() => {
    return estimateSnsCost({
      publishesPerMonth: clamp(publishesPerMonth, 0, 1e18),
      deliveriesPerMonth: clamp(deliveriesPerMonth, 0, 1e18),
      pricePerMillionPublishesUsd: clamp(pricePerMillionPublishesUsd, 0, 1e9),
      pricePerMillionDeliveriesUsd: clamp(pricePerMillionDeliveriesUsd, 0, 1e9),
      avgPayloadKb: clamp(avgPayloadKb, 0, 1e9),
      egressPricePerGbUsd: clamp(egressPricePerGbUsd, 0, 1e9),
    });
  }, [
    publishesPerMonth,
    deliveriesPerMonth,
    pricePerMillionPublishesUsd,
    pricePerMillionDeliveriesUsd,
    avgPayloadKb,
    egressPricePerGbUsd,
  ]);

  const peakResult = useMemo(() => {
    if (!showPeakScenario) return null;
    const multiplier = clamp(peakMultiplierPct, 100, 1000) / 100;
    return estimateSnsCost({
      publishesPerMonth: clamp(publishesPerMonth, 0, 1e18) * multiplier,
      deliveriesPerMonth: clamp(deliveriesPerMonth, 0, 1e18) * multiplier,
      pricePerMillionPublishesUsd: clamp(pricePerMillionPublishesUsd, 0, 1e9),
      pricePerMillionDeliveriesUsd: clamp(pricePerMillionDeliveriesUsd, 0, 1e9),
      avgPayloadKb: clamp(avgPayloadKb, 0, 1e9),
      egressPricePerGbUsd: clamp(egressPricePerGbUsd, 0, 1e9),
    });
  }, [
    avgPayloadKb,
    deliveriesPerMonth,
    egressPricePerGbUsd,
    peakMultiplierPct,
    pricePerMillionDeliveriesUsd,
    pricePerMillionPublishesUsd,
    publishesPerMonth,
    showPeakScenario,
  ]);

  return (
    <div className="calc-grid">
      <div className="panel">
        <h3>Inputs</h3>
        <div className="form">
          <div className="field field-3">
            <div className="label">Publishes (per month)</div>
            <input
              type="number"
              inputMode="numeric"
              value={publishesPerMonth}
              min={0}
              step={1000}
              onChange={(e) => setPublishesPerMonth(+e.target.value)}
            />
            <div className="hint">Number of Publish API calls (or equivalent).</div>
          </div>
          <div className="field field-3">
            <div className="label">Deliveries (per month)</div>
            <input
              type="number"
              inputMode="numeric"
              value={deliveriesPerMonth}
              min={0}
              step={1000}
              onChange={(e) => setDeliveriesPerMonth(+e.target.value)}
            />
            <div className="hint">Roughly messages x subscribers (after filtering).</div>
          </div>
          <div className="field field-3">
            <div className="label">Publish price ($ / 1M)</div>
            <input
              type="number"
              inputMode="decimal"
              value={pricePerMillionPublishesUsd}
              min={0}
              step={0.001}
              onChange={(e) => setPricePerMillionPublishesUsd(+e.target.value)}
            />
          </div>
          <div className="field field-3">
            <div className="label">Delivery price ($ / 1M)</div>
            <input
              type="number"
              inputMode="decimal"
              value={pricePerMillionDeliveriesUsd}
              min={0}
              step={0.001}
              onChange={(e) => setPricePerMillionDeliveriesUsd(+e.target.value)}
            />
            <div className="hint">Use your effective price for your protocols.</div>
          </div>

          <div className="field field-3">
            <div className="label">Avg payload (KB)</div>
            <input
              type="number"
              inputMode="decimal"
              value={avgPayloadKb}
              min={0}
              step={0.1}
              onChange={(e) => setAvgPayloadKb(+e.target.value)}
            />
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
            <div className="hint">Set to 0 if you want request-only estimate.</div>
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
              <div className="hint">Applies to publish and delivery volume.</div>
            </div>
          ) : null}

          <div className="field field-6">
            <div className="label">Scenario presets</div>
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setPublishesPerMonth(40_000_000);
                  setDeliveriesPerMonth(120_000_000);
                  setPricePerMillionPublishesUsd(0.5);
                  setPricePerMillionDeliveriesUsd(0.6);
                  setAvgPayloadKb(2);
                  setEgressPricePerGbUsd(0.09);
                  setShowPeakScenario(true);
                  setPeakMultiplierPct(160);
                }}
              >
                App alerts
              </button>
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setPublishesPerMonth(300_000_000);
                  setDeliveriesPerMonth(1_200_000_000);
                  setPricePerMillionPublishesUsd(0.5);
                  setPricePerMillionDeliveriesUsd(0.6);
                  setAvgPayloadKb(4);
                  setEgressPricePerGbUsd(0.09);
                  setShowPeakScenario(true);
                  setPeakMultiplierPct(220);
                }}
              >
                SaaS events
              </button>
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setPublishesPerMonth(900_000_000);
                  setDeliveriesPerMonth(3_000_000_000);
                  setPricePerMillionPublishesUsd(0.5);
                  setPricePerMillionDeliveriesUsd(0.6);
                  setAvgPayloadKb(2);
                  setEgressPricePerGbUsd(0.09);
                  setShowPeakScenario(true);
                  setPeakMultiplierPct(180);
                }}
              >
                Fanout scale
              </button>
            </div>
          </div>

          <div className="field field-6">
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setPublishesPerMonth(200_000_000);
                  setDeliveriesPerMonth(800_000_000);
                  setPricePerMillionPublishesUsd(0.5);
                  setPricePerMillionDeliveriesUsd(0.6);
                  setAvgPayloadKb(2);
                  setEgressPricePerGbUsd(0.09);
                  setShowPeakScenario(false);
                  setPeakMultiplierPct(180);
                }}
              >
                Reset example
              </button>
            </div>
            <div className="muted" style={{ marginTop: 8, fontSize: 12 }}>
              This is a simplified model (publishes + deliveries + optional transfer). Topic/subscription features and
              downstream services can add costs.
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
            <div className="k">Publish requests</div>
            <div className="v">{formatCurrency2(result.publishCostUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">Delivery requests</div>
            <div className="v">{formatCurrency2(result.deliveryCostUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">Transfer</div>
            <div className="v">{formatCurrency2(result.transferCostUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">Estimated transfer (GB/month)</div>
            <div className="v">{formatNumber(result.transferGb, 0)}</div>
          </div>
        </div>

        {peakResult ? (
          <div style={{ marginTop: 12 }}>
            <div className="muted" style={{ fontSize: 13, marginBottom: 6 }}>Baseline vs peak</div>
            <table className="table">
              <thead>
                <tr>
                  <th>Scenario</th>
                  <th className="num">Deliveries</th>
                  <th className="num">Transfer GB</th>
                  <th className="num">Total cost</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Baseline</td>
                  <td className="num">{formatNumber(result.deliveriesPerMonth, 0)}</td>
                  <td className="num">{formatNumber(result.transferGb, 0)}</td>
                  <td className="num">{formatCurrency2(result.totalCostUsd)}</td>
                </tr>
                <tr>
                  <td>Peak</td>
                  <td className="num">{formatNumber(peakResult.deliveriesPerMonth, 0)}</td>
                  <td className="num">{formatNumber(peakResult.transferGb, 0)}</td>
                  <td className="num">{formatCurrency2(peakResult.totalCostUsd)}</td>
                </tr>
                <tr>
                  <td>Delta</td>
                  <td className="num">{formatNumber(peakResult.deliveriesPerMonth - result.deliveriesPerMonth, 0)}</td>
                  <td className="num">{formatNumber(peakResult.transferGb - result.transferGb, 0)}</td>
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
