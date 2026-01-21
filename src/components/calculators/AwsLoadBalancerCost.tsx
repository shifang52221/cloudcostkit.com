import React, { useMemo, useState } from "react";
import { estimateLoadBalancerCost } from "../../lib/calc/loadBalancer";
import { formatCurrency2, formatNumber } from "../../lib/format";
import { clamp } from "../../lib/math";

export function AwsLoadBalancerCostCalculator() {
  const [loadBalancers, setLoadBalancers] = useState(2);
  const [hoursPerMonth, setHoursPerMonth] = useState(730);
  const [pricePerLbHourUsd, setPricePerLbHourUsd] = useState(0.0225);
  const [capacityUnitsPerHour, setCapacityUnitsPerHour] = useState(5);
  const [pricePerCapacityUnitHourUsd, setPricePerCapacityUnitHourUsd] = useState(0.008);

  const result = useMemo(() => {
    return estimateLoadBalancerCost({
      loadBalancers: clamp(loadBalancers, 0, 1e6),
      hoursPerMonth: clamp(hoursPerMonth, 0, 744),
      pricePerLbHourUsd: clamp(pricePerLbHourUsd, 0, 1e6),
      capacityUnitsPerHour: clamp(capacityUnitsPerHour, 0, 1e12),
      pricePerCapacityUnitHourUsd: clamp(pricePerCapacityUnitHourUsd, 0, 1e6),
    });
  }, [loadBalancers, hoursPerMonth, pricePerLbHourUsd, capacityUnitsPerHour, pricePerCapacityUnitHourUsd]);

  return (
    <div className="calc-grid">
      <div className="panel">
        <h3>Inputs</h3>
        <div className="form">
          <div className="field field-3">
            <div className="label">Load balancers</div>
            <input
              type="number"
              inputMode="numeric"
              value={loadBalancers}
              min={0}
              step={1}
              onChange={(e) => setLoadBalancers(+e.target.value)}
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
            <div className="label">Price ($ / LB-hour)</div>
            <input
              type="number"
              inputMode="decimal"
              value={pricePerLbHourUsd}
              min={0}
              step={0.0001}
              onChange={(e) => setPricePerLbHourUsd(+e.target.value)}
            />
          </div>

          <div className="field field-3">
            <div className="label">Capacity units (avg per hour)</div>
            <input
              type="number"
              inputMode="decimal"
              value={capacityUnitsPerHour}
              min={0}
              step={0.1}
              onChange={(e) => setCapacityUnitsPerHour(+e.target.value)}
            />
            <div className="muted" style={{ fontSize: 12, marginTop: 6 }}>
              Use LCU-hours (ALB) or NLCU-hours (NLB) as your “capacity unit”. Enter the average units per hour.
            </div>
          </div>
          <div className="field field-3">
            <div className="label">Price ($ / capacity unit-hour)</div>
            <input
              type="number"
              inputMode="decimal"
              value={pricePerCapacityUnitHourUsd}
              min={0}
              step={0.0001}
              onChange={(e) => setPricePerCapacityUnitHourUsd(+e.target.value)}
            />
          </div>

          <div className="field field-6">
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setLoadBalancers(2);
                  setHoursPerMonth(730);
                  setPricePerLbHourUsd(0.0225);
                  setCapacityUnitsPerHour(5);
                  setPricePerCapacityUnitHourUsd(0.008);
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
            <div className="k">Fixed hourly (LB-hours)</div>
            <div className="v">{formatCurrency2(result.hourlyCostUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">Capacity units</div>
            <div className="v">{formatCurrency2(result.capacityCostUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">Capacity unit-hours</div>
            <div className="v">{formatNumber(result.capacityUnitHours, 1)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

