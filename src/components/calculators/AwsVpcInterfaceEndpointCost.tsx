import React, { useMemo } from "react";
import { useNumberParamState } from "./useNumberParamState";
import { estimateVpcInterfaceEndpointCost } from "../../lib/calc/vpcInterfaceEndpoint";
import { formatCurrency2, formatNumber } from "../../lib/format";
import { clamp } from "../../lib/math";

export function AwsVpcInterfaceEndpointCostCalculator() {
  const [endpoints, setEndpoints] = useNumberParamState("AwsVpcInterfaceEndpointCost.endpoints", 3);
  const [azsPerEndpoint, setAzsPerEndpoint] = useNumberParamState("AwsVpcInterfaceEndpointCost.azsPerEndpoint", 2);
  const [hoursPerMonth, setHoursPerMonth] = useNumberParamState("AwsVpcInterfaceEndpointCost.hoursPerMonth", 730);
  const [pricePerEndpointHourUsd, setPricePerEndpointHourUsd] = useNumberParamState("AwsVpcInterfaceEndpointCost.pricePerEndpointHourUsd", 0.01);
  const [dataProcessedGbPerMonth, setDataProcessedGbPerMonth] = useNumberParamState("AwsVpcInterfaceEndpointCost.dataProcessedGbPerMonth", 2000);
  const [pricePerGbProcessedUsd, setPricePerGbProcessedUsd] = useNumberParamState("AwsVpcInterfaceEndpointCost.pricePerGbProcessedUsd", 0.01);

  const result = useMemo(() => {
    return estimateVpcInterfaceEndpointCost({
      endpoints: clamp(endpoints, 0, 1e6),
      azsPerEndpoint: clamp(azsPerEndpoint, 1, 100),
      hoursPerMonth: clamp(hoursPerMonth, 0, 744),
      pricePerEndpointHourUsd: clamp(pricePerEndpointHourUsd, 0, 1e6),
      dataProcessedGbPerMonth: clamp(dataProcessedGbPerMonth, 0, 1e12),
      pricePerGbProcessedUsd: clamp(pricePerGbProcessedUsd, 0, 1e3),
    });
  }, [endpoints, azsPerEndpoint, hoursPerMonth, pricePerEndpointHourUsd, dataProcessedGbPerMonth, pricePerGbProcessedUsd]);

  return (
    <div className="calc-grid">
      <div className="panel">
        <h3>Inputs</h3>
        <div className="form">
          <div className="field field-3">
            <div className="label">Interface endpoints</div>
            <input
              type="number"
              inputMode="numeric"
              value={endpoints}
              min={0}
              step={1}
              onChange={(e) => setEndpoints(+e.target.value)}
            />
          </div>
          <div className="field field-3">
            <div className="label">AZs per endpoint</div>
            <input
              type="number"
              inputMode="numeric"
              value={azsPerEndpoint}
              min={1}
              step={1}
              onChange={(e) => setAzsPerEndpoint(+e.target.value)}
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
            <div className="label">Price ($ / endpoint-hour)</div>
            <input
              type="number"
              inputMode="decimal"
              value={pricePerEndpointHourUsd}
              min={0}
              step={0.001}
              onChange={(e) => setPricePerEndpointHourUsd(+e.target.value)}
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
                  setEndpoints(3);
                  setAzsPerEndpoint(2);
                  setHoursPerMonth(730);
                  setPricePerEndpointHourUsd(0.01);
                  setDataProcessedGbPerMonth(2000);
                  setPricePerGbProcessedUsd(0.01);
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
            <div className="k">Data processing component</div>
            <div className="v">{formatCurrency2(result.dataProcessingCostUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">Endpoint-hours</div>
            <div className="v">{formatNumber(result.endpointHours, 0)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

