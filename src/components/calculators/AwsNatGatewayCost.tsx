import React, { useMemo, useState } from "react";
import { estimateNatGatewayCost } from "../../lib/calc/natGateway";
import { formatCurrency2, formatNumber } from "../../lib/format";
import { clamp } from "../../lib/math";

export function AwsNatGatewayCostCalculator() {
  const [natGateways, setNatGateways] = useState(1);
  const [hoursPerMonth, setHoursPerMonth] = useState(730);
  const [pricePerNatGatewayHourUsd, setPricePerNatGatewayHourUsd] = useState(0.045);
  const [dataProcessedGbPerMonth, setDataProcessedGbPerMonth] = useState(2000);
  const [pricePerGbProcessedUsd, setPricePerGbProcessedUsd] = useState(0.045);

  const result = useMemo(() => {
    return estimateNatGatewayCost({
      natGateways: clamp(natGateways, 0, 1e6),
      hoursPerMonth: clamp(hoursPerMonth, 0, 744),
      pricePerNatGatewayHourUsd: clamp(pricePerNatGatewayHourUsd, 0, 1e6),
      dataProcessedGbPerMonth: clamp(dataProcessedGbPerMonth, 0, 1e12),
      pricePerGbProcessedUsd: clamp(pricePerGbProcessedUsd, 0, 1e3),
    });
  }, [natGateways, hoursPerMonth, pricePerNatGatewayHourUsd, dataProcessedGbPerMonth, pricePerGbProcessedUsd]);

  return (
    <div className="calc-grid">
      <div className="panel">
        <h3>Inputs</h3>
        <div className="form">
          <div className="field field-3">
            <div className="label">NAT gateways</div>
            <input
              type="number"
              inputMode="numeric"
              value={natGateways}
              min={0}
              step={1}
              onChange={(e) => setNatGateways(+e.target.value)}
            />
          </div>
          <div className="field field-3">
            <div className="label">Hours (per month)</div>
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
            <div className="label">Price ($ / NAT gateway-hour)</div>
            <input
              type="number"
              inputMode="decimal"
              value={pricePerNatGatewayHourUsd}
              min={0}
              step={0.001}
              onChange={(e) => setPricePerNatGatewayHourUsd(+e.target.value)}
            />
          </div>

          <div className="field field-3">
            <div className="label">Data processed (GB / month)</div>
            <input
              type="number"
              inputMode="numeric"
              value={dataProcessedGbPerMonth}
              min={0}
              step={1}
              onChange={(e) => setDataProcessedGbPerMonth(+e.target.value)}
            />
          </div>
          <div className="field field-3">
            <div className="label">Price ($ / GB processed)</div>
            <input
              type="number"
              inputMode="decimal"
              value={pricePerGbProcessedUsd}
              min={0}
              step={0.001}
              onChange={(e) => setPricePerGbProcessedUsd(+e.target.value)}
            />
          </div>

          <div className="field field-6">
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setNatGateways(1);
                  setHoursPerMonth(730);
                  setPricePerNatGatewayHourUsd(0.045);
                  setDataProcessedGbPerMonth(2000);
                  setPricePerGbProcessedUsd(0.045);
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
            <div className="k">Hourly component</div>
            <div className="v">{formatCurrency2(result.hourlyCostUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">Traffic component</div>
            <div className="v">{formatCurrency2(result.dataProcessingCostUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">GB processed</div>
            <div className="v">{formatNumber(result.dataProcessedGbPerMonth, 0)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

