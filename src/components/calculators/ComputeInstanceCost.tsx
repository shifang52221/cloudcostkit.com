import React, { useMemo, useState } from "react";
import { estimateComputeCost } from "../../lib/calc/compute";
import { formatCurrency2, formatNumber, formatPercent } from "../../lib/format";
import { clamp } from "../../lib/math";

export function ComputeInstanceCostCalculator() {
  const [instances, setInstances] = useState(6);
  const [pricePerHourUsd, setPricePerHourUsd] = useState(0.18);
  const [utilizationPct, setUtilizationPct] = useState(100);
  const [hoursPerDay, setHoursPerDay] = useState(24);

  const result = useMemo(() => {
    return estimateComputeCost({
      instances: clamp(instances, 0, 1e9),
      pricePerHourUsd: clamp(pricePerHourUsd, 0, 1e6),
      utilizationPct: clamp(utilizationPct, 0, 100),
      hoursPerDay: clamp(hoursPerDay, 0, 24),
    });
  }, [instances, pricePerHourUsd, utilizationPct, hoursPerDay]);

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
            <div className="label">Price ($ / hour)</div>
            <input
              type="number"
              inputMode="decimal"
              value={pricePerHourUsd}
              min={0}
              step={0.001}
              onChange={(e) => setPricePerHourUsd(+e.target.value)}
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

          <div className="field field-6">
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setInstances(6);
                  setPricePerHourUsd(0.18);
                  setUtilizationPct(100);
                  setHoursPerDay(24);
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
            <div className="k">Estimated monthly compute cost</div>
            <div className="v">{formatCurrency2(result.monthlyCostUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">Billable hours (per instance)</div>
            <div className="v">
              {formatNumber(result.billableHoursPerInstance, 0)} hr ({formatPercent(result.utilizationPct, 0)})
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

